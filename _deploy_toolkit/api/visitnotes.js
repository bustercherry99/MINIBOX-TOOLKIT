/* MiniBox+ Toolkit — Visit Notes Log API.
   GET  /api/visitnotes -> { ok:true, notes:[{id,rep,account,note,ts}] }  (newest first, last 300)
   POST /api/visitnotes { rep, account, note, ts } -> { ok:true, note:{...} }
   The site-wide password middleware runs before this, so only teammates
   who are logged in to the toolkit can read or post.
   Storage: Upstash Redis via REST (KV_REST_API_URL / KV_REST_API_TOKEN env vars) — same store as Team Chat / Order Log. */

const KEY = 'mbx:visitnotes:entries';
const MAX_KEEP = 2000;   // newest notes retained on the server
const MAX_RETURN = 300;  // notes returned per fetch

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

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const raw = await redis(['LRANGE', KEY, '0', String(MAX_RETURN - 1)]);
      const notes = (raw || [])
        .map(function (s) { try { return JSON.parse(s); } catch (e) { return null; } })
        .filter(Boolean); // stored newest-first; served newest-first (log reads top-down)
      return res.status(200).json({ ok: true, notes: notes });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};

      const rep = String(body.rep || '').trim().slice(0, 40);
      const account = String(body.account || '').trim().slice(0, 120);
      const note = String(body.note || '').trim().slice(0, 1000);

      if (!rep || !account || !note) {
        return res.status(400).json({ ok: false, error: 'Need a rep name, an account, and a note.' });
      }

      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        rep: rep,
        account: account,
        note: note,
        ts: (typeof body.ts === 'number' && body.ts > 0 && body.ts <= Date.now()) ? body.ts : Date.now()
      };
      await redis(['LPUSH', KEY, JSON.stringify(entry)]);
      await redis(['LTRIM', KEY, '0', String(MAX_KEEP - 1)]);
      return res.status(200).json({ ok: true, note: entry });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  } catch (err) {
    const msg = (err && err.message === 'storage-not-configured')
      ? 'Visit notes storage is not configured yet (KV env vars missing).'
      : 'Visit notes log is unavailable right now.';
    return res.status(503).json({ ok: false, error: msg });
  }
};
