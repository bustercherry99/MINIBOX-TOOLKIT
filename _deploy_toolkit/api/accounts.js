/* MiniBox+ Toolkit — Shared Account Book API.
   The single source of truth for every account the team owns: practice, address,
   map coordinates, contact, device status, stage. A rep edits an address in the
   field and it is live for everyone on the next load.

   GET  /api/accounts                              -> { ok:true, accounts:[...] }
   POST /api/accounts { account:{...}, by }        -> { ok:true, account:{...} }   (create or update)
   POST /api/accounts { action:'delete', id, by }  -> { ok:true, removed:true }
   GET  /api/accounts?history=<id>                 -> { ok:true, history:[...] }   (address change trail)

   The site-wide password middleware runs before this, so only teammates logged in
   to the toolkit can read or write.
   Storage: Upstash Redis via REST (KV_REST_API_URL / KV_REST_API_TOKEN) — same store
   as Team Chat, Order Log and Visit Notes. */

const BOOK = 'mbx:accounts:book';     // HASH  id -> JSON account
const LOG  = 'mbx:accounts:log';      // LIST  newest-first change trail
const MAX_LOG = 1500;

async function redis(cmd) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
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

function clean(s, max) {
  return String(s == null ? '' : s).replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}
function multi(s, max) {
  return String(s == null ? '' : s).replace(/\r/g, '').trim().slice(0, max);
}
function num(v) {
  const n = Number(v);
  return (isFinite(n)) ? n : null;
}
function newId() {
  return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* One account record, sanitised. Unknown fields are dropped on purpose so a bad
   client can never bloat the store. */
function shape(raw, prev, by) {
  const now = Date.now();
  const lat = num(raw.lat), lng = num(raw.lng);
  const a = {
    id:        clean(raw.id, 40) || (prev && prev.id) || newId(),
    name:      clean(raw.name, 120),
    specialty: clean(raw.specialty, 60),
    addr:      clean(raw.addr, 160),
    city:      clean(raw.city, 60),
    state:     clean(raw.state, 4).toUpperCase(),
    zip:       clean(raw.zip, 10),
    lat:       (lat !== null && lat >= -90 && lat <= 90) ? lat : (prev ? prev.lat : null),
    lng:       (lng !== null && lng >= -180 && lng <= 180) ? lng : (prev ? prev.lng : null),
    contact:   clean(raw.contact, 80),
    title:     clean(raw.title, 60),
    phone:     clean(raw.phone, 32),
    status:    clean(raw.status, 20) || 'prospect',
    stage:     clean(raw.stage, 40),
    devices:   clean(raw.devices, 80),
    nextStep:  clean(raw.nextStep, 160),
    notes:     multi(raw.notes, 2000),
    npi:       clean(raw.npi, 20),
    owner:     clean(raw.owner || by, 60),
    lastVisit: num(raw.lastVisit) || (prev ? prev.lastVisit : null),
    created:   (prev && prev.created) || now,
    by:        clean(by, 60),
    ts:        now,
    rev:       ((prev && Number(prev.rev)) || 0) + 1
  };
  return a;
}

function addressLine(a) {
  return [a.addr, a.city, a.state, a.zip].filter(Boolean).join(', ');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const histId = req.query && req.query.history;
      if (histId) {
        const raw = await redis(['LRANGE', LOG, '0', String(MAX_LOG - 1)]);
        const all = (raw || []).map(function (s) { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
        return res.status(200).json({ ok: true, history: all.filter(function (h) { return h.id === histId; }) });
      }
      const flat = await redis(['HGETALL', BOOK]);
      const accounts = [];
      for (let i = 1; i < (flat || []).length; i += 2) {
        try { accounts.push(JSON.parse(flat[i])); } catch (e) {}
      }
      accounts.sort(function (x, y) { return String(x.name || '').localeCompare(String(y.name || '')); });
      return res.status(200).json({ ok: true, accounts: accounts, count: accounts.length });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};
      const by = clean(body.by, 60) || 'a teammate';

      if (body.action === 'delete') {
        const id = clean(body.id, 40);
        if (!id) return res.status(400).json({ ok: false, error: 'Need the account id.' });
        const prevRaw = await redis(['HGET', BOOK, id]);
        let prev = null; try { prev = JSON.parse(prevRaw); } catch (e) {}
        await redis(['HDEL', BOOK, id]);
        await redis(['LPUSH', LOG, JSON.stringify({
          id: id, kind: 'removed', by: by, ts: Date.now(),
          name: prev ? prev.name : '', from: prev ? addressLine(prev) : ''
        })]);
        await redis(['LTRIM', LOG, '0', String(MAX_LOG - 1)]);
        return res.status(200).json({ ok: true, removed: true });
      }

      const raw = body.account || body;
      if (!clean(raw.name, 120)) {
        return res.status(400).json({ ok: false, error: 'An account needs a practice name.' });
      }

      let prev = null;
      const wantId = clean(raw.id, 40);
      if (wantId) {
        const prevRaw = await redis(['HGET', BOOK, wantId]);
        try { prev = JSON.parse(prevRaw); } catch (e) {}
      }

      const account = shape(raw, prev, by);
      await redis(['HSET', BOOK, account.id, JSON.stringify(account)]);

      /* Trail: every create, and every address move, is recoverable. */
      const beforeAddr = prev ? addressLine(prev) : '';
      const afterAddr = addressLine(account);
      if (!prev) {
        await redis(['LPUSH', LOG, JSON.stringify({
          id: account.id, kind: 'added', by: by, ts: account.ts, name: account.name, to: afterAddr
        })]);
        await redis(['LTRIM', LOG, '0', String(MAX_LOG - 1)]);
      } else if (beforeAddr !== afterAddr) {
        await redis(['LPUSH', LOG, JSON.stringify({
          id: account.id, kind: 'moved', by: by, ts: account.ts, name: account.name,
          from: beforeAddr, to: afterAddr,
          fromLat: prev.lat, fromLng: prev.lng
        })]);
        await redis(['LTRIM', LOG, '0', String(MAX_LOG - 1)]);
      }

      return res.status(200).json({ ok: true, account: account });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  } catch (err) {
    const msg = String((err && err.message) || err);
    if (msg === 'storage-not-configured') {
      return res.status(200).json({ ok: false, offline: true, accounts: [], error: 'The shared account book is not switched on yet.' });
    }
    return res.status(500).json({ ok: false, error: 'Could not reach the account book. Your change is saved on this phone and will sync when you are back online.' });
  }
};
