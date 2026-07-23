/* MiniBox+ Toolkit — COMMAND CENTER API (owner only).
   The whole site already sits behind the TEAM password. This endpoint adds a
   SECOND, separate password so only Erik sees the owner view: problem reports,
   what reps are asking Boxy, and how much the team is actually using the app.

   Default admin password: "MiniBoxAdmin2026".
   To change it without touching code: Vercel -> Project -> Settings ->
   Environment Variables -> ADMIN_PASSWORD = your-new-password -> Redeploy.

   POST /api/admin { key, action:'load' }                  -> { ok, issues, questions, pulse }
   POST /api/admin { key, action:'setStatus', issueId, status, note }
   POST /api/admin { key, action:'usage', days }           -> { ok, usage }
   POST /api/admin { key, action:'live' }                  -> { ok, live }   (who's on now)
   POST /api/admin { key, action:'access' }                 -> { ok, access } (who can get in)
   POST /api/admin { key, action:'accessAdd', email, name } -> adds them to the list
   POST /api/admin { key, action:'accessRemove', email }    -> locks them out on next page load
   POST /api/admin { key, action:'accessDeny', email }      -> dismisses a request to join
   POST /api/admin { key, action:'digest' }                 -> { ok, digest } (daily triage notes)
   POST /api/admin { key, action:'digest', text }           -> posts today's summary
   Bad key -> 401 { ok:false, error:'bad-key' }. Nothing leaks without it. */

const KEY = 'mbx:chat:messages';
const LOG_KEY = 'mbx:bot:log';
const ISSUE_KEY = 'mbx:issue:log';
const STATUS_KEY = 'mbx:issue:status';
const ISSUE_KEEP = 500;
const DIGEST_KEY = 'mbx:issue:digest';
const DIGEST_KEEP = 30;
/* The front-door list — same keys api/access.js and middleware.js use. */
const ACCESS_KEY = 'mbx:access:allow';
const ACCESS_REQ_KEY = 'mbx:access:requests';
const ACCESS_LOG_KEY = 'mbx:access:log';

function adminPassword() {
  try { if (process && process.env && process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD; } catch (_) {}
  return 'MiniBoxAdmin2026';
}

/* Forgiving compare (trim + lowercase), constant-time-ish so a wrong guess
   can't be timed character by character. */
function ok(given) {
  const a = String(given == null ? '' : given).trim().toLowerCase();
  const b = String(adminPassword()).trim().toLowerCase();
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

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

function parseList(raw) {
  return (raw || [])
    .map(function (s) { try { return JSON.parse(s); } catch (e) { return null; } })
    .filter(Boolean);
}

const BOT_NAME = 'Boxy 🤖';
const CHAT_KEEP = 500;

/* Find one filed problem report by its id (so we know who to reply to). */
async function findIssue(id) {
  const issues = parseList(await redis(['LRANGE', ISSUE_KEY, '0', String(ISSUE_KEEP - 1)]));
  return issues.filter(function (it) { return String(it.id) === String(id); })[0] || null;
}

/* Post a message into Team Chat as Boxy — used to tell a rep, by name, that the
   thing they reported has been handled. It lands in the same chat they already
   use, so the note reaches them with nothing new to install or check. */
async function postToChat(text) {
  const message = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: BOT_NAME,
    text: String(text || '').slice(0, 2000),
    ts: Date.now()
  };
  await redis(['LPUSH', KEY, JSON.stringify(message)]);
  await redis(['LTRIM', KEY, '0', String(CHAT_KEEP - 1)]);
  return message;
}

async function readIssues() {
  const issues = parseList(await redis(['LRANGE', ISSUE_KEY, '0', String(ISSUE_KEEP - 1)]));
  let statuses = {};
  try {
    const flat = await redis(['HGETALL', STATUS_KEY]) || [];
    if (Array.isArray(flat)) { for (let i = 0; i < flat.length; i += 2) statuses[flat[i]] = flat[i + 1]; }
    else statuses = flat || {};
  } catch (e) {}
  return issues.map(function (it) {
    let s = statuses[it.id];
    if (typeof s === 'string' && s.charAt(0) === '{') { try { s = JSON.parse(s); } catch (e) {} }
    return Object.assign({ status: 'open' }, it, (s && typeof s === 'object') ? s : (s ? { status: s } : {}));
  });
}

/* How much is the team actually using this thing? Counted from the chat log —
   no tracking pixels, no extra storage. */
function pulse(messages) {
  const DAY = 86400000, now = Date.now();
  const people = {};
  let week = 0, today = 0, boxyWeek = 0;
  messages.forEach(function (m) {
    const isBot = String(m.name || '').indexOf('Boxy') === 0;
    if (now - m.ts < 7 * DAY) {
      week++;
      if (isBot) boxyWeek++;
      else people[m.name] = (people[m.name] || 0) + 1;
    }
    if (now - m.ts < DAY && !isBot) today++;
  });
  const active = Object.keys(people)
    .map(function (n) { return { name: n, count: people[n] }; })
    .sort(function (a, b) { return b.count - a.count; })
    .slice(0, 8);
  return { week: week, today: today, boxyWeek: boxyWeek, people: active, lastTs: messages[0] ? messages[0].ts : 0 };
}

/* ── USAGE (written by /api/usage) ─────────────────────────────────────────
   Reads the pre-built day rollups, so drawing a 14-day chart costs a handful
   of hash reads instead of scanning thousands of raw events. */
const USAGE_EVENTS = 'mbx:usage:events';
const USAGE_SEEN = 'mbx:usage:seen';
const USAGE_FIRST = 'mbx:usage:first';

async function pipeline(cmds) {
  if (!cmds.length) return [];
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('storage-not-configured');
  const res = await fetch(url.replace(/\/+$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  const out = await res.json();
  return Array.isArray(out) ? out.map(function (r) { return r && r.result; }) : [];
}

function pairs(flat) {
  const o = {};
  if (Array.isArray(flat)) { for (let i = 0; i < flat.length; i += 2) o[flat[i]] = flat[i + 1]; }
  else if (flat && typeof flat === 'object') return flat;
  return o;
}

function dayKeys(days) {
  const out = [], DAY = 86400000, now = Date.now();
  for (let i = 0; i < days; i++) {
    const d = new Date(now - i * DAY);
    out.push(d.getUTCFullYear() + '-' +
      String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(d.getUTCDate()).padStart(2, '0'));
  }
  return out;                                   // newest first
}

function topOf(counts, prefix, limit) {
  return Object.keys(counts)
    .filter(function (k) { return k.indexOf(prefix + ':') === 0; })
    .map(function (k) { return { label: k.slice(prefix.length + 1), count: counts[k] }; })
    .sort(function (a, b) { return b.count - a.count; })
    .slice(0, limit || 12);
}

/* Tag each top-list row with which way it's moving: this week's count vs the 7
   days before. That's the feature-adoption read — is anyone picking it up, or is
   it quietly dying? Needs a couple of clicks of movement so noise doesn't flip it. */
function withTrend(items, prefix, prev) {
  return items.map(function (it) {
    const p = Number(prev[prefix + ':' + it.label]) || 0;
    let trend = 'flat';
    if (it.count >= p * 1.25 && it.count - p >= 2) trend = 'up';
    else if (p >= it.count * 1.25 && p - it.count >= 2) trend = 'down';
    return { label: it.label, count: it.count, prev: p, trend: trend };
  });
}

/* Longest run of consecutive active days ending today (or yesterday, so a rep
   who hasn't opened it yet TODAY still shows their streak). idx = set of day
   indices, 0 = today. */
function streakOf(idx) {
  let start = idx[0] ? 0 : (idx[1] ? 1 : -1);
  if (start < 0) return 0;
  let s = start, c = 0;
  while (idx[s]) { c++; s++; }
  return c;
}

async function usage(days) {
  const D = Math.max(1, Math.min(60, Number(days) || 14));
  const keys = dayKeys(D);

  const cmds = [];
  keys.forEach(function (d) { cmds.push(['HGETALL', 'mbx:usage:day:' + d]); });
  keys.forEach(function (d) { cmds.push(['HGETALL', 'mbx:usage:ppl:' + d]); });
  cmds.push(['HGETALL', USAGE_SEEN]);
  cmds.push(['LRANGE', USAGE_EVENTS, '0', '59']);
  cmds.push(['HGETALL', USAGE_FIRST]);

  const out = await pipeline(cmds);
  const dayHashes = out.slice(0, D).map(pairs);
  const pplHashes = out.slice(D, D * 2).map(pairs);
  const seen = pairs(out[D * 2]);
  const recent = parseList(out[D * 2 + 1] || []);
  const firstSeen = pairs(out[D * 2 + 2]);

  // Daily totals for the chart + the 7-day / prior-7 / all-window aggregates.
  // dwell-time (ms), and the hour-of-day / day-of-week buckets, are peeled off
  // here so they never land in the click counts.
  const daily = [];
  const total7 = {}, totalPrev7 = {}, totalAll = {};
  const dwellByScreen = {};
  let dwellAll = 0, opensAll = 0;
  const hod = new Array(24).fill(0);
  const dow = new Array(7).fill(0);
  dayHashes.forEach(function (h, i) {
    let opens = 0, clicks = 0;
    Object.keys(h).forEach(function (f) {
      const n = Number(h[f]) || 0;
      if (f.indexOf('dwellms:') === 0) {
        const s = f.slice(8);
        if (s === '__all') dwellAll += n; else dwellByScreen[s] = (dwellByScreen[s] || 0) + n;
        return;
      }
      if (f.indexOf('hod:') === 0) { const hh = +f.slice(4); if (hh >= 0 && hh < 24) hod[hh] += n; return; }
      if (f.indexOf('dow:') === 0) { const dd = +f.slice(4); if (dd >= 0 && dd < 7) dow[dd] += n; return; }
      // Outcomes are tags paired with a click already counted — keep them in the
      // totals so they can be listed, but out of the raw "clicks" tally.
      if (f.indexOf('outcome:') !== 0) clicks += n;
      if (f.indexOf('open:') === 0) { opens += n; opensAll += n; }
      totalAll[f] = (totalAll[f] || 0) + n;
      if (i < 7) total7[f] = (total7[f] || 0) + n;
      else if (i < 14) totalPrev7[f] = (totalPrev7[f] || 0) + n;
    });
    daily.push({ day: keys[i], opens: opens, events: clicks });
  });

  // People: how many days out of the window did each person show up at all?
  const people = {};
  pplHashes.forEach(function (h, i) {
    Object.keys(h).forEach(function (who) {
      const n = Number(h[who]) || 0;
      if (!n) return;
      const p = people[who] || (people[who] = { who: who, events: 0, days: 0, days7: 0, events7: 0, idx: {} });
      p.events += n; p.days += 1; p.idx[i] = true;
      if (i < 7) { p.events7 += n; p.days7 += 1; }
    });
  });
  /* Keys carry how we identified the person: e:<email> / n:<name> / device:<id>.
     Surface that, so a row that looks like a stranger is explained rather than
     just mysterious. */
  const roster = Object.keys(people).map(function (who) {
    let s = seen[who];
    if (typeof s === 'string') { try { s = JSON.parse(s); } catch (e) { s = null; } }
    const byEmail = who.indexOf('e:') === 0;
    // Anything without a prefix predates the email-keyed scheme — it was a bare
    // name, so treat it as one rather than mislabelling it as anonymous.
    const anon = who.indexOf('device:') === 0;
    const byName = !byEmail && !anon;
    let name = (s && s.name) || '';
    if (!name) {
      if (byEmail) name = who.slice(2);
      else if (anon) name = 'Someone (no name yet)';
      else name = who.indexOf('n:') === 0 ? who.slice(2) : who;   // legacy: bare name
    }
    return Object.assign(people[who], {
      name: name,
      email: (s && s.email) || (byEmail ? who.slice(2) : ''),
      id: byEmail ? 'email' : (byName ? 'name' : 'device'),
      anon: anon,
      dev: (s && s.dev) || '',
      plat: (s && s.plat) || '',
      firstTs: Number(firstSeen[who]) || 0,
      lastTs: (s && s.ts) || 0,
      lastScreen: (s && s.screen) || ''
    });
  }).sort(function (a, b) { return b.lastTs - a.lastTs; });

  /* STITCH THE SAME HUMAN BACK TOGETHER.
     A rep clicks around before typing their work email, so their first events
     land under a name (or a bare device) and everything after lands under the
     email. Same device, same person — fold the earlier rows into the email row
     so they aren't counted as two or three people.
     Guard: only merge when the names agree (or the older row has no name), so
     two reps sharing one laptop don't get collapsed into one. */
  const byDevice = {};
  roster.forEach(function (p) { if (p.id === 'email' && p.dev) byDevice[p.dev] = p; });
  const merged = [];
  roster.forEach(function (p) {
    const owner = (p.id !== 'email' && p.dev) ? byDevice[p.dev] : null;
    if (!owner || owner === p) { merged.push(p); return; }
    const a = String(p.name || '').trim().toLowerCase();
    const b = String(owner.name || '').trim().toLowerCase();
    if (a && b && a !== b) { merged.push(p); return; }        // different humans
    owner.events += p.events;
    owner.events7 += p.events7;
    owner.days = Math.max(owner.days, p.days);
    owner.days7 = Math.max(owner.days7, p.days7);
    for (const di in p.idx) owner.idx[di] = true;                          // union the active-day sets
    if (p.firstTs && (!owner.firstTs || p.firstTs < owner.firstTs)) owner.firstTs = p.firstTs;
    if (!owner.plat && p.plat) owner.plat = p.plat;
    if (p.lastTs > owner.lastTs) { owner.lastTs = p.lastTs; owner.lastScreen = p.lastScreen; }
    owner.mergedFrom = (owner.mergedFrom || 0) + 1;
  });
  merged.sort(function (a, b) { return b.lastTs - a.lastTs; });

  // Streak + new-this-week, computed after the merge so a rep split across phone
  // and laptop is judged as one person.
  const WEEK = 7 * 86400000, now = Date.now();
  let newThisWeek = 0;
  merged.forEach(function (p) {
    p.streak = streakOf(p.idx);
    p.isNew = !!(p.firstTs && now - p.firstTs <= WEEK);
    if (p.isNew && p.days7 > 0) newThisWeek++;
    delete p.idx;                                  // internal only — don't ship it
  });

  // Platform mix among everyone active this week — phone vs laptop, app vs browser.
  const platforms = {};
  merged.forEach(function (p) {
    if (p.days7 <= 0) return;
    const label = p.plat || 'Unknown device';
    platforms[label] = (platforms[label] || 0) + 1;
  });
  const platformList = Object.keys(platforms)
    .map(function (k) { return { label: k, count: platforms[k] }; })
    .sort(function (a, b) { return b.count - a.count; });

  // Screen-time, longest first, in ms (the Command Center renders minutes).
  const timeByScreen = Object.keys(dwellByScreen)
    .map(function (k) { return { label: k, ms: dwellByScreen[k] }; })
    .sort(function (a, b) { return b.ms - a.ms; })
    .slice(0, 12);

  return {
    days: D,
    daily: daily.slice().reverse(),               // oldest -> newest, for the chart
    screens7: withTrend(topOf(total7, 'tab', 12), 'tab', totalPrev7),
    actions7: withTrend(topOf(total7, 'action', 15), 'action', totalPrev7),
    outcomes7: topOf(total7, 'outcome', 10),
    outcomesAll: topOf(totalAll, 'outcome', 10),
    screensAll: topOf(totalAll, 'tab', 12),
    actionsAll: topOf(totalAll, 'action', 15),
    opens7: (total7['open:app'] || 0),
    // Time signals: total time in-app across the window, and the average visit,
    // derived as total screen-time / number of opens.
    avgVisitMs: opensAll ? Math.round(dwellAll / opensAll) : 0,
    totalTimeMs: dwellAll,
    timeByScreen: timeByScreen,
    // When they reach for it, and on what.
    hod: hod,
    dow: dow,
    platforms: platformList,
    newThisWeek: newThisWeek,
    people: merged,
    recent: recent
  };
}

/* ── WHO'S ON RIGHT NOW ────────────────────────────────────────────────────
   The Command Center polls this every 20 seconds, so it has to stay cheap:
   ONE hash read, no day rollups, no event scan. The toolkit sends a "still
   here" ping once a minute while it's the visible tab, so last-seen keeps
   moving even when nobody is clicking anything.

   Same device-stitching idea as the usage roster, kept deliberately simple:
   one row per device, newest wins, so a rep with the toolkit open on their
   phone AND their laptop shows up once. */
async function liveNow() {
  const seen = pairs(await redis(['HGETALL', USAGE_SEEN]));
  const now = Date.now();
  const WINDOW = 30 * 60000;                   // half an hour back; the UI splits it further

  const rows = [];
  Object.keys(seen).forEach(function (who) {
    let s = seen[who];
    if (typeof s === 'string') { try { s = JSON.parse(s); } catch (e) { s = null; } }
    if (!s || !s.ts) return;
    if (now - s.ts > WINDOW) return;

    const byEmail = who.indexOf('e:') === 0;
    const anon = who.indexOf('device:') === 0;
    let name = s.name || '';
    if (!name) {
      if (byEmail) name = who.slice(2);
      else if (anon) name = 'Someone (no name yet)';
      else name = who.indexOf('n:') === 0 ? who.slice(2) : who;
    }
    rows.push({
      key: who, name: name, email: s.email || (byEmail ? who.slice(2) : ''),
      dev: s.dev || '', plat: s.plat || '', lastTs: s.ts, lastScreen: s.screen || '', anon: anon
    });
  });

  rows.sort(function (a, b) { return b.lastTs - a.lastTs; });

  // One row per device: keep the freshest, prefer the email-identified one.
  const keptByDevice = {}, out = [];
  rows.forEach(function (r) {
    if (!r.dev) { out.push(r); return; }
    const prev = keptByDevice[r.dev];
    if (!prev) { keptByDevice[r.dev] = r; out.push(r); return; }
    if (r.email && !prev.email) { prev.name = r.name; prev.email = r.email; prev.anon = false; }
  });

  return { now: now, people: out };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'POST only.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  if (!ok(body.key)) {
    return res.status(401).json({ ok: false, error: 'bad-key' });
  }

  try {
    if (body.action === 'setStatus' && body.issueId) {
      const allowed = ['open', 'working', 'fixed'];
      const st = allowed.indexOf(String(body.status)) === -1 ? 'open' : String(body.status);
      const issueId = String(body.issueId).slice(0, 40);
      const note = String(body.note || '').slice(0, 500);

      // Was this one already resolved-and-announced? (so we don't double-post)
      let prev = {};
      try {
        let raw = await redis(['HGET', STATUS_KEY, issueId]);
        if (typeof raw === 'string' && raw.charAt(0) === '{') prev = JSON.parse(raw) || {};
      } catch (e) {}

      /* Auto-reply to the person who reported it. Fires the first time an issue
         is marked "fixed" — Boxy drops a note in Team Chat addressed to them by
         name, with Erik's note if there is one. `notify:false` (or unchecking
         the box in the Command Center) skips it; the `notified` flag makes sure
         a rep never gets pinged twice for the same report. */
      let notified = !!prev.notified;
      if (st === 'fixed' && !prev.notified && body.notify !== false) {
        try {
          const issue = await findIssue(issueId);
          if (issue && issue.name && String(issue.name).indexOf('Boxy') !== 0) {
            const first = String(issue.name).split(' ')[0];
            const what = String(issue.text || '').trim();
            const quoted = what ? ' about "' + what.slice(0, 90) + (what.length > 90 ? '…' : '') + '"' : '';
            const because = note ? ' ' + note : '';
            await postToChat('@' + first + ' — good news: the issue you reported' + quoted + ' has been resolved.' + because + ' Thanks for flagging it. 🐉');
            notified = true;
          }
        } catch (e) { /* notifying is best-effort; never block the status update */ }
      }

      await redis(['HSET', STATUS_KEY, issueId, JSON.stringify({
        status: st, note: note, updated: Date.now(), notified: notified
      })]);
      return res.status(200).json({ ok: true, status: st, notified: notified });
    }

    if (body.action === 'usage') {
      return res.status(200).json({ ok: true, usage: await usage(body.days) });
    }

    /* ---- The front door: who can get into the toolkit at all ----
       The list lives in mbx:access:allow (email -> {name, addedBy, ts, lastIn}).
       api/access.js reads it to decide who may sign in; middleware.js re-checks
       it on every page load, so a Remove here takes hold within seconds. */
    if (body.action === 'access' || String(body.action || '').indexOf('access') === 0) {
      const sub = body.action === 'access' ? 'list' : String(body.action).slice(6).toLowerCase();
      const email = String(body.email || '').trim().toLowerCase();
      const goodEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

      if (sub === 'add') {
        if (!goodEmail) return res.status(200).json({ ok: false, error: 'That does not look like an email address.' });
        let prev = {};
        try { prev = JSON.parse(await redis(['HGET', ACCESS_KEY, email]) || '{}') || {}; } catch (e) {}
        await redis(['HSET', ACCESS_KEY, email, JSON.stringify({
          name: String(body.name || prev.name || '').slice(0, 60),
          addedBy: 'owner',
          ts: prev.ts || Date.now(),
          lastIn: prev.lastIn || 0
        })]);
        await redis(['HDEL', ACCESS_REQ_KEY, email]);           // clears any pending ask
        await redis(['LPUSH', ACCESS_LOG_KEY, JSON.stringify({ ts: Date.now(), ev: 'added', email: email })]);
        await redis(['LTRIM', ACCESS_LOG_KEY, '0', '199']);
      }

      if (sub === 'remove') {
        if (!goodEmail) return res.status(200).json({ ok: false, error: 'Need an email to remove.' });
        await redis(['HDEL', ACCESS_KEY, email]);
        await redis(['DEL', 'mbx:access:code:' + email]);        // kill any code in flight
        await redis(['LPUSH', ACCESS_LOG_KEY, JSON.stringify({ ts: Date.now(), ev: 'removed', email: email })]);
        await redis(['LTRIM', ACCESS_LOG_KEY, '0', '199']);
      }

      if (sub === 'deny') {                                      // dismiss an ask, don't grant it
        if (goodEmail) await redis(['HDEL', ACCESS_REQ_KEY, email]);
      }

      const flatToObjects = function (flat) {
        const out = [];
        if (Array.isArray(flat)) {
          for (let i = 0; i < flat.length; i += 2) {
            let v = {};
            try { v = JSON.parse(flat[i + 1]) || {}; } catch (e) {}
            out.push(Object.assign({ email: flat[i] }, v));
          }
        } else if (flat && typeof flat === 'object') {
          Object.keys(flat).forEach(function (k) {
            let v = {};
            try { v = JSON.parse(flat[k]) || {}; } catch (e) {}
            out.push(Object.assign({ email: k }, v));
          });
        }
        return out;
      };

      const people = flatToObjects(await redis(['HGETALL', ACCESS_KEY]))
        .sort(function (a, b) { return (b.lastIn || 0) - (a.lastIn || 0) || String(a.email).localeCompare(b.email); });
      const asks = flatToObjects(await redis(['HGETALL', ACCESS_REQ_KEY]))
        .sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
      const doorLog = parseList(await redis(['LRANGE', ACCESS_LOG_KEY, '0', '39']));

      return res.status(200).json({
        ok: true,
        access: {
          people: people,
          asks: asks,
          log: doorLog,
          // Is the emailed-code step actually running? (needs a Resend key)
          codesOn: !!(process.env.RESEND_API_KEY || '').trim(),
          owner: 'erik.bernard@pulm-one.com'
        }
      });
    }

    if (body.action === 'live') {
      return res.status(200).json({ ok: true, live: await liveNow() });
    }

    /* Daily triage summary. The once-a-day robot posts what it looked at, what
       it fixed and what needs Erik; with no text it just reads them back. Kept
       apart from the reps' own words in mbx:issue:log — nothing here ever
       rewrites what somebody reported. */
    if (body.action === 'digest') {
      if (body.text) {
        await redis(['LPUSH', DIGEST_KEY, JSON.stringify({
          ts: Date.now(), text: String(body.text).slice(0, 4000)
        })]);
        await redis(['LTRIM', DIGEST_KEY, '0', String(DIGEST_KEEP - 1)]);
        return res.status(200).json({ ok: true, posted: true });
      }
      return res.status(200).json({
        ok: true,
        digest: parseList(await redis(['LRANGE', DIGEST_KEY, '0', '9']))
      });
    }

    // action 'load' (default): everything the owner view shows, in one call.
    const messages = parseList(await redis(['LRANGE', KEY, '0', '199']));   // newest first
    const questions = parseList(await redis(['LRANGE', LOG_KEY, '0', '59'])); // newest first
    const issues = await readIssues();
    const digest = parseList(await redis(['LRANGE', DIGEST_KEY, '0', '4']));

    return res.status(200).json({
      ok: true,
      issues: issues,
      digest: digest,
      questions: questions,
      pulse: pulse(messages),
      recent: messages.slice(0, 25)
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Storage hiccup — try again in a moment.' });
  }
};
