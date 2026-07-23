/* MiniBox+ Toolkit — private access gate (runs on Vercel before every request).

   THE FRONT DOOR IS AN INVITE LIST.
   You type your work email. If it is on the list, we email you a 6-digit code
   and you type that. No password to remember and nothing anyone can pass around.
   Take someone off the list in the Command Center and they are locked out on
   their next page load, even if they were already signed in.

   The sign-in itself lives in `api/access.js` (this file lets that one URL
   through unauthenticated — it has to answer before anybody is let in).
   The signature below has to stay byte-identical to the one there.

   Env (all optional, all in Vercel -> Settings -> Environment Variables):
     AUTH_SECRET       signs the sign-in cookie. Changing it signs everybody out.
     RESEND_API_KEY    turns the emailed-code step ON. Without it the list is
                       still enforced, you just aren't asked for a code.
     MAIL_FROM         address the code comes from (domain verified in Resend).
     SITE_PASSWORD     still powers one-tap ?k= share links for prospects.
     SITE_EMAIL_DOMAIN work-email domain shown in the sign-in copy. */

export const config = { matcher: '/:path*' };

const COOKIE = 'mbx_pass';
const ALLOW_KEY = 'mbx:access:allow';
const GUEST = '@guest';                    // one-tap share links, not a person
const OWNERS = ['erik.bernard@pulm-one.com'];

function env(k, fallback) {
  try { if (process && process.env && process.env[k]) return process.env[k]; } catch (_) {}
  return fallback;
}

function getDomain() { return env('SITE_EMAIL_DOMAIN', 'pulm-one.com'); }
function getPassword() { return env('SITE_PASSWORD', 'minibox2026'); }
function authSecret() { return String(env('AUTH_SECRET', 'mbx-front-door-2026-a7f3')).trim(); }

function norm(s) { return (s == null ? '' : String(s)).trim().toLowerCase(); }

function b64url(bytes) {
  let s = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlText(text) { return b64url(new TextEncoder().encode(text)); }
function unb64urlText(s) {
  try {
    const pad = String(s).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(pad + '==='.slice((pad.length + 3) % 4));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch (_) { return ''; }
}

/* Same signature api/access.js mints. HMAC-SHA256 over 'mbx1|<email>'. */
async function sign(email) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(authSecret()),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('mbx1|' + norm(email)));
  return b64url(mac).slice(0, 32);
}

function safeEq(a, b) {
  const x = String(a || ''), y = String(b || '');
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

/* Read the cookie and hand back WHO it says you are — or '' if the signature
   doesn't check out. The email rides along in the cookie so the list check
   below knows whose access to look up. */
async function whoIsIt(cookieHeader) {
  const parts = String(cookieHeader || '').split(';');
  for (let i = 0; i < parts.length; i++) {
    const c = parts[i].trim();
    if (c.indexOf(COOKIE + '=') !== 0) continue;
    const val = c.slice(COOKIE.length + 1);
    const bits = val.split('.');
    if (bits.length !== 3 || bits[0] !== 'v2') return '';
    const email = norm(unb64urlText(bits[1]));
    if (!email) return '';
    return safeEq(bits[2], await sign(email)) ? email : '';
  }
  return '';
}

async function passCookieFor(email) {
  return COOKIE + '=v2.' + b64urlText(norm(email)) + '.' + (await sign(email)) +
    '; Path=/; Max-Age=15552000; Secure; HttpOnly; SameSite=Lax';
}

/* Is this address still on the list? One tiny lookup, and only on real page
   loads (not on every image and script). If storage is unreachable we let the
   already-signed-in person through — a Redis hiccup must never lock the team
   out of their own tool. */
async function stillAllowed(email) {
  if (OWNERS.indexOf(norm(email)) !== -1) return true;
  const url = env('KV_REST_API_URL', ''), token = env('KV_REST_API_TOKEN', '');
  if (!url || !token) return true;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(['HEXISTS', ALLOW_KEY, norm(email)])
    });
    const data = await res.json();
    if (data && data.error) return true;
    return Number(data && data.result) === 1;
  } catch (_) { return true; }
}

function isPageLoad(request) {
  const dest = request.headers.get('sec-fetch-dest');
  if (dest) return dest === 'document' || dest === 'iframe';
  return (request.headers.get('accept') || '').indexOf('text/html') !== -1;
}

/* Only ever redirect to a path on THIS site — never to another domain. */
function safeNext(next) {
  const n = (next == null ? '' : String(next));
  if (!n || n.charAt(0) !== '/' || n.charAt(1) === '/' || n.charAt(1) === '\\') return '/';
  return n;
}

export default async function middleware(request) {
  const url = new URL(request.url);

  /* The sign-in API is the way in, so it can't sit behind the gate. */
  if (url.pathname === '/api/access') return;

  const who = await whoIsIt(request.headers.get('cookie') || '');

  if (who) {
    if (who === GUEST) return;                       // share-link visitor
    if (!isPageLoad(request)) return;                // assets: signature is enough
    if (await stillAllowed(who)) return;
    // Taken off the list — clear the cookie and show the door.
    return loginPage(url.pathname + url.search, 'removed', who);
  }

  /* One-tap share links: ...?k=<password>&tab=rheum lets a recipient land straight
     on the page with no sign-in. The key is stripped from the URL on arrival
     (303 to the same address minus ?k=) so it never sits in their address bar. */
  const k = url.searchParams.get('k');
  if (k && norm(k) === norm(getPassword())) {
    url.searchParams.delete('k');
    const clean = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
    return new Response(null, {
      status: 303,
      headers: { 'Location': clean, 'Set-Cookie': await passCookieFor(GUEST) }
    });
  }

  return loginPage(url.pathname + url.search, '', '');
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function loginPage(next, state, who) {
  const domain = getDomain();
  const note = state === 'removed'
    ? '<p class="err">Your access to this toolkit has been turned off. Ask Erik if that is a mistake.</p>'
    : '<p class="sub">Sign in with your work email. We send you a code — no password to remember.</p>';

  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
    '<title>MiniBox+ Toolkit</title>' +
    /* The front door is the first thing anyone ever sees of this app, so it
       wears the same katana silver-on-black and the same MTK diamond as the
       toolkit behind it. The mark is inlined, not linked: every asset URL on
       this host is gated by the very middleware serving this page. */
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 ' +
    'viewBox=%270 0 100 100%27%3E%3Cpath d=%27M50 6 L94 50 L50 94 L6 50 Z%27 fill=%27none%27 ' +
    'stroke=%27%23c9d2db%27 stroke-width=%278%27/%3E%3C/svg%3E">' +
    '<style>' +
    'html,body{height:100%;margin:0}' +
    'body{background:#07090b;background:linear-gradient(180deg,#12161b 0%,#07090b 62%);' +
    'color:#e8edf2;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
    'display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}' +
    '.card{width:100%;max-width:360px;text-align:center}' +
    '.logo{width:88px;height:88px;display:block;margin:0 auto 20px}' +
    'h1{font-size:20px;font-weight:600;letter-spacing:.02em;margin:0 0 4px}' +
    '.sub,.err{font-size:14px;margin:0 0 18px;color:#8e9aa7}' +
    '.err{color:#ffb4ab;font-weight:600}' +
    '.lbl{font-size:12px;text-align:left;color:#7b8590;margin:0 0 4px 2px}' +
    'input{width:100%;box-sizing:border-box;padding:14px 16px;border-radius:10px;font-size:18px;' +
    'background:#0c0f13;border:1px solid #2a323b;color:#f2f5f8;' +
    'margin-bottom:12px;text-align:left;font-family:inherit}' +
    'input:focus{outline:none;border-color:#9fd4e8;box-shadow:0 0 0 1px rgba(159,212,232,.35)}' +
    '#code{text-align:center;letter-spacing:10px;font-weight:800;font-size:26px}' +
    'button.go{width:100%;padding:14px;border:0;border-radius:10px;' +
    'background:linear-gradient(180deg,#ffffff,#c9d2db);color:#07090b;' +
    'font-weight:800;font-size:16px;cursor:pointer}' +
    'button.go[disabled]{opacity:.5;cursor:default}' +
    'button.link{background:none;border:0;color:#9fd4e8;font-size:13px;text-decoration:underline;' +
    'cursor:pointer;padding:8px;font-family:inherit}' +
    '.foot{margin-top:16px;font-size:12px;color:#5c6672}' +
    '.hide{display:none}' +
    '</style></head><body><div class="card">' +
    '<svg class="logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs><linearGradient id="mtk" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="96">' +
    '<stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#d6dee6"/>' +
    '<stop offset="1" stop-color="#8e9aa7"/></linearGradient></defs>' +
    '<g stroke="url(#mtk)" fill="none" stroke-linejoin="miter" stroke-linecap="butt">' +
    '<path d="M50 4 L96 50 L50 96 L4 50 Z" stroke-width="3"/><g stroke-width="3.4">' +
    '<path d="M25 63 L25 37 L33.75 53.5 L42.5 37 L42.5 63"/>' +
    '<path d="M47.5 37 L60.5 37"/><path d="M54 37 L54 63"/>' +
    '<path d="M65.5 37 L65.5 63"/><path d="M75 37 L65.5 50"/><path d="M65.5 50 L75 63"/>' +
    '</g></g></svg>' +
    '<h1>MiniBox+ Toolkit</h1>' +
    '<div id="msg">' + note + '</div>' +

    '<div id="step1">' +
    '<div class="lbl">Your name</div>' +
    '<input id="name" type="text" placeholder="First Last" autocomplete="name">' +
    '<div class="lbl">Work email</div>' +
    '<input id="email" type="email" placeholder="you@' + esc(domain) + '" value="' + esc(who || '') + '"' +
    ' autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email">' +
    '<button class="go" id="go1">Sign in</button>' +
    '<div><button class="link hide" id="ask">Not on the list? Ask for access</button></div>' +
    '</div>' +

    '<div id="step2" class="hide">' +
    '<div class="lbl">6-digit code we just emailed you</div>' +
    '<input id="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000">' +
    '<button class="go" id="go2">Open Toolkit</button>' +
    '<div><button class="link" id="again">Send a new code</button>' +
    '<button class="link" id="back">Use a different email</button></div>' +
    '</div>' +

    '<div class="foot">PulmOne sales team &middot; private</div>' +
    '</div><script>' + loginScript(next) + '<\/script></body></html>';

  return new Response(html, {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      // A stale cookie (wrong secret, or access turned off) gets cleared here so
      // the next try starts clean instead of looping on the same dead cookie.
      'Set-Cookie': COOKIE + '=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax'
    }
  });
}

/* The sign-in screen's own script. Plain DOM, no build step, no dependencies. */
function loginScript(next) {
  return `
var NEXT = ${JSON.stringify(safeNext(next))};
var $ = function(id){ return document.getElementById(id); };
var busy = false;

function say(html, bad){
  $('msg').innerHTML = '<p class="' + (bad ? 'err' : 'sub') + '">' + html + '</p>';
}
function post(payload){
  return fetch('/api/access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); });
}
function lock(btn, on, label){
  busy = on; btn.disabled = on; btn.textContent = on ? 'One second…' : label;
}
function emailVal(){ return ($('email').value || '').trim().toLowerCase(); }

function start(){
  if (busy) return;
  var email = emailVal();
  if (!email){ $('email').focus(); return; }
  lock($('go1'), true, 'Sign in');
  post({ action:'start', email: email, name: ($('name').value || '').trim() })
    .then(function(d){
      lock($('go1'), false, 'Sign in');
      if (d && d.signedIn){ location.replace(NEXT); return; }
      if (d && d.ok && d.sent){
        $('step1').className = 'hide';
        $('step2').className = '';
        say('We emailed a code to <b>' + (d.to || email) + '</b>. It works for 10 minutes.');
        setTimeout(function(){ $('code').focus(); }, 60);
        return;
      }
      say((d && d.msg) || 'That did not work. Try again.', true);
      if (d && d.why === 'not-invited') $('ask').className = 'link';
    })
    .catch(function(){ lock($('go1'), false, 'Sign in'); say('Could not reach the server. Check your signal and try again.', true); });
}

function verify(){
  if (busy) return;
  var code = ($('code').value || '').replace(/\\D/g, '');
  if (code.length < 6){ $('code').focus(); return; }
  lock($('go2'), true, 'Open Toolkit');
  post({ action:'verify', email: emailVal(), code: code, name: ($('name').value || '').trim() })
    .then(function(d){
      lock($('go2'), false, 'Open Toolkit');
      if (d && d.signedIn){ location.replace(NEXT); return; }
      say((d && d.msg) || 'That code did not work.', true);
      $('code').value = ''; $('code').focus();
    })
    .catch(function(){ lock($('go2'), false, 'Open Toolkit'); say('Could not reach the server. Try again.', true); });
}

$('go1').onclick = start;
$('go2').onclick = verify;
$('again').onclick = function(){ $('step2').className = 'hide'; $('step1').className = ''; start(); };
$('back').onclick = function(){ $('step2').className = 'hide'; $('step1').className = ''; $('email').focus(); };
$('ask').onclick = function(){
  post({ action:'request', email: emailVal(), name: ($('name').value || '').trim() })
    .then(function(){ say('Asked. You will hear back once you are added.'); $('ask').className = 'link hide'; })
    .catch(function(){ say('Could not send that ask. Try again in a moment.', true); });
};
$('email').addEventListener('keydown', function(e){ if (e.key === 'Enter') start(); });
$('name').addEventListener('keydown', function(e){ if (e.key === 'Enter') $('email').focus(); });
$('code').addEventListener('keydown', function(e){ if (e.key === 'Enter') verify(); });
// Typing the last digit is the answer — don't make anyone reach for the button.
$('code').addEventListener('input', function(){
  var v = ($('code').value || '').replace(/\\D/g, '').slice(0, 6);
  if ($('code').value !== v) $('code').value = v;
  if (v.length === 6) verify();
});
($('email').value ? $('email') : $('name')).focus();
`;
}
