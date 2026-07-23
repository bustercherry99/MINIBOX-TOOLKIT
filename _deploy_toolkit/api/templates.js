/* MiniBox+ Toolkit — Shared Team Template Library API.
   GET  /api/templates                         -> { ok:true, templates:[{id,cat,title,sub,subject,body,note,by,ts}] }  (newest first)
   POST /api/templates { template:{...}, by }   -> { ok:true, template:{...} }   (publish — instantly live for everyone)
   POST /api/templates { action:'delete', id }  -> { ok:true, removed:true }      (remove one)
   The site-wide password middleware runs before this, so only teammates who are
   logged in to the toolkit can read, publish, or remove.
   Storage: Upstash Redis via REST (KV_REST_API_URL / KV_REST_API_TOKEN env vars). */

const KEY = 'mbx:team:templates';
const MAX_KEEP = 200;    // newest templates retained on the server

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

function clean(s, max) {
  return String(s == null ? '' : s).replace(/\r/g, '').slice(0, max);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const raw = await redis(['LRANGE', KEY, '0', String(MAX_KEEP - 1)]);
      return res.status(200).json({ ok: true, templates: parseList(raw) }); // stored newest-first
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};

      /* ---- remove one ---- */
      if (body.action === 'delete') {
        const id = clean(body.id, 60).trim();
        if (!id) return res.status(400).json({ ok: false, error: 'Need the template id to remove.' });
        const raw = await redis(['LRANGE', KEY, '0', String(MAX_KEEP - 1)]);
        const keep = parseList(raw).filter(function (t) { return t.id !== id; });
        await redis(['DEL', KEY]);
        // Re-store in the same newest-first order (RPUSH appends left->right).
        if (keep.length) {
          await redis(['RPUSH', KEY].concat(keep.map(function (t) { return JSON.stringify(t); })));
        }
        return res.status(200).json({ ok: true, removed: true });
      }

      /* ---- publish one ---- */
      const t = (body.template && typeof body.template === 'object') ? body.template : body;
      const title = clean(t.title, 120).trim();
      const subject = clean(t.subject, 240).trim();
      const bodyText = clean(t.body, 8000);
      if (!title || (!subject && !bodyText)) {
        return res.status(400).json({ ok: false, error: 'A template needs a title and some content.' });
      }

      const tmpl = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        cat: clean(t.cat, 40).trim() || '⭐ Team Favorite',
        title: title,
        sub: clean(t.sub, 160).trim(),
        subject: subject,
        body: bodyText,
        note: clean(t.note, 400).trim(),
        by: clean(body.by || t.by, 40).trim(),
        ts: Date.now()
      };

      // De-dupe: if an identical title+subject is already live, replace it (keeps the freshest copy).
      const raw = await redis(['LRANGE', KEY, '0', String(MAX_KEEP - 1)]);
      const existing = parseList(raw);
      const dup = existing.some(function (e) { return e.title === tmpl.title && (e.subject || '') === tmpl.subject; });
      if (dup) {
        const keep = existing.filter(function (e) { return !(e.title === tmpl.title && (e.subject || '') === tmpl.subject); });
        await redis(['DEL', KEY]);
        if (keep.length) await redis(['RPUSH', KEY].concat(keep.map(function (e) { return JSON.stringify(e); })));
      }

      await redis(['LPUSH', KEY, JSON.stringify(tmpl)]);
      await redis(['LTRIM', KEY, '0', String(MAX_KEEP - 1)]);
      return res.status(200).json({ ok: true, template: tmpl });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'GET or POST only.' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Team library storage hiccup - try again in a moment.' });
  }
};
