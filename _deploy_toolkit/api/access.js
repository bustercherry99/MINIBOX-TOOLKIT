/* MiniBox+ Toolkit — FRONT DOOR (who gets in, and proving it's them).

   The old gate let anyone who typed *any* @pulm-one.com address straight in.
   This one is an invite list: your email has to be on it, and — once a mail key
   is set — you have to prove you own that inbox by typing a 6-digit code we
   email you. No password to remember, nothing to share, and taking someone off
   the list locks them out on their next page load.

   POST /api/access { action:'start',   email, name }  -> emails a code (or signs you in if mail is off)
   POST /api/access { action:'verify',  email, code, name } -> sets the cookie
   POST /api/access { action:'request', email, name, note } -> "I'd like access" -> Command Center

   This endpoint is deliberately OUTSIDE the site gate (middleware lets it
   through) — it is the only way in, so it has to answer before you're let in.
   Everything it can do is rate limited and only ever talks about emails that
   are already on the list.

   Storage (Upstash Redis, same KV_REST_API_* vars as the rest of the API):
     mbx:access:allow      HASH  email -> { name, addedBy, ts, lastIn }
     mbx:access:requests   HASH  email -> { name, note, ts }
     mbx:access:code:<em>  JSON  { c, exp, tries }        10-minute life
     mbx:access:rl:<em>    counter, 15-minute window
     mbx:access:log        LIST  last 200 door events (sent / in / denied)

   Email sending: Resend. Set RESEND_API_KEY in Vercel and codes start going out
   on their own. Until then the list is still enforced — you just aren't asked
   for a code. Set MAIL_FROM to the address it sends from (must be on a domain
   verified in Resend). */

const crypto = require('crypto');

const ALLOW_KEY = 'mbx:access:allow';
const REQ_KEY = 'mbx:access:requests';
const LOG_KEY = 'mbx:access:log';
const LOG_KEEP = 200;

const CODE_TTL_SEC = 600;        // a code is good for 10 minutes
const CODE_MAX_TRIES = 6;        // wrong guesses before the code dies
const RL_WINDOW_SEC = 900;       // 15 minutes
const RL_MAX_SENDS = 5;          // codes per email per window

/* Never lock the owner out, whatever is in storage. */
const OWNERS = ['erik.bernard@pulm-one.com'];

const COOKIE = 'mbx_pass';
const ID_COOKIE = 'mbx_id';
const COOKIE_MAX_AGE = 15552000; // 180 days

/* ── shared bits (middleware.js verifies the same signature — keep in step) ── */

function authSecret() {
  return (process.env.AUTH_SECRET || 'mbx-front-door-2026-a7f3').trim();
}

function norm(s) { return String(s == null ? '' : s).trim().toLowerCase(); }

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sign(email) {
  return b64url(crypto.createHmac('sha256', authSecret()).update('mbx1|' + norm(email)).digest()).slice(0, 32);
}

function passCookie(email) {
  return COOKIE + '=v2.' + b64url(norm(email)) + '.' + sign(email) +
    '; Path=/; Max-Age=' + COOKIE_MAX_AGE + '; Secure; HttpOnly; SameSite=Lax';
}

/* Not HttpOnly on purpose — the toolkit's own JS reads this once to fill in the
   Rep Profile so nobody types their name and email a second time. */
function idCookie(name, email) {
  const v = encodeURIComponent(JSON.stringify({ n: name || '', e: email || '' }));
  return ID_COOKIE + '=' + v + '; Path=/; Max-Age=' + COOKIE_MAX_AGE + '; Secure; SameSite=Lax';
}

function looksLikeEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(e));
}

/* ── storage ── */

async function redis(cmd) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('storage-not-configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function getEntry(email) {
  const e = norm(email);
  if (OWNERS.indexOf(e) !== -1) {
    let saved = null;
    try { saved = JSON.parse(await redis(['HGET', ALLOW_KEY, e]) || 'null'); } catch (_) {}
    return saved || { name: 'Erik Bernard', addedBy: 'owner', ts: 0 };
  }
  let raw = null;
  try { raw = await redis(['HGET', ALLOW_KEY, e]); } catch (_) { return null; }
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (_) { return { name: '' }; }
}

async function logDoor(ev, email, extra) {
  try {
    await redis(['LPUSH', LOG_KEY, JSON.stringify(Object.assign({
      ts: Date.now(), ev: ev, email: norm(email)
    }, extra || {}))]);
    await redis(['LTRIM', LOG_KEY, '0', String(LOG_KEEP - 1)]);
  } catch (_) { /* the log is a nicety — never block a sign-in over it */ }
}

/* ── the code itself ── */

function makeCode() {
  // 6 digits, never starting with 0 so it can't be mistaken for a 5-digit code.
  // Draws are thrown away rather than folded with % so every code is equally
  // likely — a guessable pattern here would be the whole ballgame.
  const LIMIT = 4294800000; // 900000 * 4772 — largest multiple of 900000 under 2^32
  let n;
  do { n = crypto.randomBytes(4).readUInt32BE(0); } while (n >= LIMIT);
  return String(100000 + (n % 900000));
}

function sameCode(a, b) {
  const x = String(a || ''), y = String(b || '');
  if (!x || x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

/* ── sending ── */

function mailerOn() { return !!(process.env.RESEND_API_KEY || '').trim(); }

function mailFrom() {
  return (process.env.MAIL_FROM || '').trim() || 'MiniBox+ Toolkit <onboarding@resend.dev>';
}

async function sendCode(email, name, code) {
  const first = String(name || '').trim().split(/\s+/)[0];
  const hi = first ? 'Hi ' + first + ',' : 'Hi,';
  const text = hi + '\n\nYour MiniBox+ Toolkit sign-in code is ' + code +
    '\n\nType it on the sign-in screen. It works for the next 10 minutes, then it expires.\n\n' +
    'If you did not just try to sign in, you can ignore this — nobody can get in without the code.\n\n' +
    'MiniBox+ Toolkit\nPulmOne sales team';
  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f4f6f8;padding:28px 16px">' +
    '<div style="max-width:420px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;text-align:center">' +
    '<div style="font-weight:800;font-size:18px;color:#0a3d6b;margin-bottom:6px">MiniBox+ Toolkit</div>' +
    '<div style="color:#5b6b7c;font-size:14px;margin-bottom:22px">' + esc(hi) + ' here is your sign-in code.</div>' +
    '<div style="font-size:38px;font-weight:800;letter-spacing:10px;color:#0a3d6b;padding:14px 0">' + code + '</div>' +
    '<div style="color:#5b6b7c;font-size:13px;margin-top:18px">Good for 10 minutes. If you did not try to sign in, ignore this email.</div>' +
    '</div></div>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (process.env.RESEND_API_KEY || '').trim(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: mailFrom(),
      to: [norm(email)],
      subject: code + ' is your MiniBox+ Toolkit code',
      text: text,
      html: html
    })
  });
  if (!res.ok) {
    let why = '';
    try { why = (await res.json()).message || ''; } catch (_) {}
    throw new Error('mail-failed: ' + res.status + ' ' + why);
  }
  return true;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Show enough of the address to confirm it's the right inbox, not enough to
   hand a stranger somebody's email. */
function mask(email) {
  const e = norm(email), at = e.indexOf('@');
  if (at < 1) return e;
  const user = e.slice(0, at), dom = e.slice(at);
  if (user.length <= 2) return user.charAt(0) + '•••' + dom;
  return user.slice(0, 2) + '•••' + user.slice(-1) + dom;
}

/* ── handler ── */

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'POST only.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  const email = norm(body.email);
  const name = String(body.name || '').trim().slice(0, 60);
  const action = String(body.action || 'start');

  if (!looksLikeEmail(email)) {
    return res.status(200).json({ ok: false, why: 'bad-email', msg: 'That does not look like an email address.' });
  }

  try {
    /* ---------- "I'd like access" ---------- */
    if (action === 'request') {
      const already = await getEntry(email);
      if (already) return res.status(200).json({ ok: true, already: true });
      await redis(['HSET', REQ_KEY, email, JSON.stringify({
        name: name, note: String(body.note || '').slice(0, 200), ts: Date.now()
      })]);
      await logDoor('asked', email, { name: name });
      return res.status(200).json({ ok: true, asked: true });
    }

    /* ---------- step 1: is this person invited? ---------- */
    if (action === 'start') {
      const entry = await getEntry(email);
      if (!entry) {
        await logDoor('denied', email, { name: name });
        return res.status(200).json({
          ok: false, why: 'not-invited',
          msg: 'That email is not on the access list yet.'
        });
      }

      // Straight in when there is no mail key set — the list is still the gate.
      if (!mailerOn()) {
        await redis(['HSET', ALLOW_KEY, email, JSON.stringify(
          Object.assign({}, entry, { name: entry.name || name, lastIn: Date.now() })
        )]);
        await logDoor('in', email, { name: name || entry.name, nocode: 1 });
        res.setHeader('Set-Cookie', [passCookie(email), idCookie(name || entry.name || '', email)]);
        return res.status(200).json({ ok: true, signedIn: true, sent: false });
      }

      // Too many codes in a row? Slow it down (protects the inbox, not the list).
      let sends = 0;
      try {
        sends = Number(await redis(['INCR', 'mbx:access:rl:' + email])) || 0;
        if (sends === 1) await redis(['EXPIRE', 'mbx:access:rl:' + email, String(RL_WINDOW_SEC)]);
      } catch (_) {}
      if (sends > RL_MAX_SENDS) {
        return res.status(200).json({
          ok: false, why: 'too-many',
          msg: 'That is a lot of codes in a short time. Give it 15 minutes, then try again.'
        });
      }

      const code = makeCode();
      await redis(['SET', 'mbx:access:code:' + email,
        JSON.stringify({ c: code, exp: Date.now() + CODE_TTL_SEC * 1000, tries: 0 }),
        'EX', String(CODE_TTL_SEC)]);

      try {
        await sendCode(email, name || entry.name, code);
      } catch (e) {
        await logDoor('mailfail', email, { msg: String(e.message || '').slice(0, 120) });
        return res.status(200).json({
          ok: false, why: 'mail-failed',
          msg: 'The code would not send. Tell Erik — the mail key needs a look.'
        });
      }

      await logDoor('sent', email, { name: name || entry.name });
      return res.status(200).json({ ok: true, sent: true, to: mask(email) });
    }

    /* ---------- step 2: prove it's your inbox ---------- */
    if (action === 'verify') {
      const entry = await getEntry(email);
      if (!entry) return res.status(200).json({ ok: false, why: 'not-invited', msg: 'That email is not on the access list.' });

      let rec = null;
      try { rec = JSON.parse(await redis(['GET', 'mbx:access:code:' + email]) || 'null'); } catch (_) {}
      if (!rec || !rec.c || Date.now() > rec.exp) {
        return res.status(200).json({ ok: false, why: 'expired', msg: 'That code has expired. Send yourself a new one.' });
      }

      const given = String(body.code || '').replace(/\D/g, '');
      if (!sameCode(given, rec.c)) {
        const tries = (rec.tries || 0) + 1;
        if (tries >= CODE_MAX_TRIES) {
          await redis(['DEL', 'mbx:access:code:' + email]);
          await logDoor('badcode', email, { burned: 1 });
          return res.status(200).json({ ok: false, why: 'burned', msg: 'Too many wrong tries. Send yourself a new code.' });
        }
        await redis(['SET', 'mbx:access:code:' + email,
          JSON.stringify(Object.assign({}, rec, { tries: tries })), 'EX', String(CODE_TTL_SEC)]);
        return res.status(200).json({
          ok: false, why: 'bad-code',
          msg: 'That code is not right. ' + (CODE_MAX_TRIES - tries) + ' tries left.'
        });
      }

      await redis(['DEL', 'mbx:access:code:' + email]);
      await redis(['DEL', 'mbx:access:rl:' + email]);
      await redis(['HSET', ALLOW_KEY, email, JSON.stringify(
        Object.assign({}, entry, { name: entry.name || name, lastIn: Date.now() })
      )]);
      await logDoor('in', email, { name: name || entry.name });

      res.setHeader('Set-Cookie', [passCookie(email), idCookie(name || entry.name || '', email)]);
      return res.status(200).json({ ok: true, signedIn: true });
    }

    return res.status(400).json({ ok: false, error: 'Unknown action.' });
  } catch (e) {
    return res.status(500).json({ ok: false, why: 'server', msg: 'Something went wrong at the door. Try again in a moment.' });
  }
};

/* Exported for the seed script and for tests. */
module.exports.passCookie = passCookie;
module.exports.sign = sign;
