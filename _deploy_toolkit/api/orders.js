/* MiniBox+ Toolkit — Trunk Stock Order Log API.
   GET  /api/orders -> { ok:true, orders:[{id,name,item,part,qty,cost,note,ts}] }  (newest first, last 300)
   POST /api/orders { name, item, part, qty, cost, note } -> { ok:true, order:{...} }
   The site-wide password middleware runs before this, so only teammates
   who are logged in to the toolkit can read or post.
   Storage: Upstash Redis via REST (KV_REST_API_URL / KV_REST_API_TOKEN env vars) — same store as Team Chat. */

const KEY = 'mbx:orders:entries';
const MAX_KEEP = 1000;   // newest orders retained on the server
const MAX_RETURN = 300;  // orders returned per fetch

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
      const orders = (raw || [])
        .map(function (s) { try { return JSON.parse(s); } catch (e) { return null; } })
        .filter(Boolean); // stored newest-first; served newest-first (log reads top-down)
      return res.status(200).json({ ok: true, orders: orders });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};

      const name = String(body.name || '').trim().slice(0, 40);
      const item = String(body.item || '').trim().slice(0, 100);
      const part = String(body.part || '').trim().slice(0, 60);
      const note = String(body.note || '').trim().slice(0, 200);
      let qty = parseFloat(body.qty); if (!isFinite(qty) || qty <= 0) qty = 1; if (qty > 999) qty = 999;
      let cost = parseFloat(body.cost); if (!isFinite(cost) || cost < 0) cost = 0; if (cost > 99999) cost = 99999;

      if (!name || !item) {
        return res.status(400).json({ ok: false, error: 'Need a rep name and an item.' });
      }

      const order = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        name: name,
        item: item,
        part: part,
        qty: qty,
        cost: cost,
        note: note,
        ts: (typeof body.ts === 'number' && body.ts > 0 && body.ts <= Date.now()) ? body.ts : Date.now()
      };
      await redis(['LPUSH', KEY, JSON.stringify(order)]);
      await redis(['LTRIM', KEY, '0', String(MAX_KEEP - 1)]);
      return res.status(200).json({ ok: true, order: order });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  } catch (err) {
    const msg = (err && err.message === 'storage-not-configured')
      ? 'Order log storage is not configured yet (KV env vars missing).'
      : 'Order log is unavailable right now.';
    return res.status(503).json({ ok: false, error: msg });
  }
};
