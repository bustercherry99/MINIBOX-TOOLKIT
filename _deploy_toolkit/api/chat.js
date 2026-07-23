/* MiniBox+ Toolkit — Team Chat API.
   GET  /api/chat        -> { ok:true, messages:[{id,name,text,ts}] }  (oldest -> newest, last 200)
   GET  /api/chat?log=1  -> { ok:true, log:[...] }  (Boxy's Q&A/request log, newest first — Erik's review feed)
   POST /api/chat  { name, text } -> { ok:true, message:{...} }
   The site-wide password middleware runs before this, so only teammates
   who are logged in to the toolkit can read or post.
   Storage: Upstash Redis via REST (KV_REST_API_URL / KV_REST_API_TOKEN env vars).

   BOXY THE BOT: any message mentioning @boxy / @bot (or starting with "boxy")
   gets an automatic answer posted into the chat as "Boxy 🤖", powered by the
   Claude API (ANTHROPIC_API_KEY env var). Every Boxy exchange is also logged
   to mbx:bot:log so Erik can review questions & change requests daily.
   No API key set? Boxy still logs the message and posts a friendly
   "saved for Erik" reply — nothing breaks. */

const KNOWLEDGE = require('./bot-knowledge.js');

const KEY = 'mbx:chat:messages';
const LOG_KEY = 'mbx:bot:log';
const ISSUE_KEY = 'mbx:issue:log';   // problem reports — read by api/admin.js (owner only)
const BOT_NAME = 'Boxy 🤖';
const MAX_KEEP = 500;    // newest messages retained on the server
const MAX_RETURN = 200;  // messages returned per fetch
const LOG_KEEP = 300;    // newest bot-log entries retained
const ISSUE_KEEP = 500;  // newest problem reports retained
const BOT_TRIGGER = /(^|\s)@(boxy|bot)\b|^\s*(hey\s+|ok\s+)?boxy\b/i;

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

async function postMessage(name, text) {
  const message = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: name,
    text: text,
    ts: Date.now()
  };
  await redis(['LPUSH', KEY, JSON.stringify(message)]);
  await redis(['LTRIM', KEY, '0', String(MAX_KEEP - 1)]);
  return message;
}

/* Ask Claude for Boxy's answer. Returns a string, or null if the AI
   isn't configured / errored (caller posts the fallback). */
async function askClaude(recent, name, text) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  // Last few messages, oldest first, so Boxy has the thread's context.
  const context = recent
    .slice(0, 12)
    .reverse()
    .map(function (m) { return m.name + ': ' + m.text; })
    .join('\n');

  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 20000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.BOXY_MODEL || 'claude-sonnet-5',
        max_tokens: 600,
        system: KNOWLEDGE,
        messages: [{
          role: 'user',
          content: 'Recent team chat (oldest first):\n' + context +
            '\n\nThe newest message, from ' + name + ', mentions you:\n"' + text + '"\n\nReply to ' + name + ' now, as Boxy.'
        }]
      })
    });
    const data = await res.json();
    if (!res.ok || !data || !data.content || !data.content[0] || !data.content[0].text) return null;
    return String(data.content[0].text).trim().slice(0, 2000);
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* Boxy's answer WITHOUT putting anything in the shared thread. Returns the
   reply text so the caller can hand it straight back to the one person who
   asked. Still logged to Erik's review feed. */
async function boxyReply(name, text) {
  let reply = null, ai = false;
  try {
    const raw = await redis(['LRANGE', KEY, '0', '14']);
    reply = await askClaude(parseList(raw), name, text);
    ai = !!reply;
  } catch (e) { /* fall through to the canned reply */ }

  if (!reply) {
    reply = 'Got it, ' + name.split(' ')[0] + " — this has been sent to administration and you'll have an answer shortly. Thanks for flagging it. \u{1F4E6}";
  }

  // Erik's review feed: every exchange, answered or not.
  try {
    await redis(['LPUSH', LOG_KEY, JSON.stringify({ ts: Date.now(), name: name, text: text, reply: reply, ai: ai })]);
    await redis(['LTRIM', LOG_KEY, '0', String(LOG_KEEP - 1)]);
  } catch (e) {}

  return reply;
}

async function runBoxy(name, text) {
  const reply = await boxyReply(name, text);
  try { await postMessage(BOT_NAME, reply); } catch (e) {}
}

/* Problem reports. The rep taps "🐛 Report a problem" (in Team Chat or on the
   floating Boxy button); the message still lands in chat and still gets a Boxy
   answer, but it ALSO gets filed here so it can't scroll away.
   READING them is owner-only and lives in api/admin.js behind the SECOND
   (admin) password — this file only writes. */

async function fileIssue(id, name, text, screen) {
  const entry = {
    id: id,
    ts: Date.now(),
    name: name,
    screen: String(screen || '').slice(0, 60) || 'Unknown screen',
    // Strip the chat-facing banner ("⚠️ ISSUE REPORT — on the "Financing" screen:")
    // so the inbox shows the rep's own words; the screen has its own column.
    text: String(text || '')
      .replace(/^⚠️\s*ISSUE REPORT\s*[—-]\s*/i, '')
      .replace(/^(from|on the)\b[^:]{0,60}:\s*/i, '')
      .slice(0, 2000)
  };
  await redis(['LPUSH', ISSUE_KEY, JSON.stringify(entry)]);
  await redis(['LTRIM', ISSUE_KEY, '0', String(ISSUE_KEEP - 1)]);
  return entry;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const wantLog = (req.query && req.query.log) || /[?&]log=/.test(req.url || '');
      if (wantLog) {
        const rawLog = await redis(['LRANGE', LOG_KEY, '0', '99']);
        return res.status(200).json({ ok: true, log: parseList(rawLog) });
      }
      const raw = await redis(['LRANGE', KEY, '0', String(MAX_RETURN - 1)]);
      const messages = parseList(raw).reverse(); // stored newest-first; serve oldest-first for reading
      return res.status(200).json({ ok: true, messages: messages });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};

      const name = String(body.name || '').trim().slice(0, 40);
      const text = String(body.text || '').replace(/\r/g, '').trim().slice(0, 2000);
      if (!name || !text) {
        return res.status(400).json({ ok: false, error: 'Need a name and a message.' });
      }

      /* A problem report is PRIVATE. It never touches the shared thread —
         it goes straight to Erik's inbox, and Boxy's answer comes back in
         this response so only the person who reported it ever sees it.
         Team Chat is for the team talking to each other, nothing else. */
      if (body.issue === true) {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const ts = Date.now();
        try { await fileIssue(id, name, text, body.screen); } catch (e) {}
        let reply = '';
        try { reply = await boxyReply(name, text); } catch (e) {}
        if (!reply) {
          reply = 'Got it, ' + name.split(' ')[0] + " — this has been sent to administration and you'll have an answer shortly. Thanks for flagging it. \u{1F4E6}";
        }
        return res.status(200).json({
          ok: true,
          private: true,
          message: { id: id, name: name, text: text, ts: ts },
          reply: reply
        });
      }

      const message = await postMessage(name, text);

      // Summon the bot — answered inline so the sender's next refresh shows it.
      // Fires on an @Boxy tag OR when the app's "Ask Boxy" mode flags toBoxy,
      // so a running conversation with Boxy needs no re-tagging each turn.
      if ((BOT_TRIGGER.test(text) || body.toBoxy === true) && name !== BOT_NAME) {
        await runBoxy(name, text);
      }

      return res.status(200).json({ ok: true, message: message });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'GET or POST only.' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Chat storage hiccup - try again in a moment.' });
  }
};
