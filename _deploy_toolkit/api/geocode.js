/* MiniBox+ Toolkit — Address to map pin, and GPS back to a street address.
   OpenStreetMap Nominatim: free, no key. Their fair-use policy is one call a second
   and no bulk hammering, so every answer is cached in Redis forever. The second rep
   who looks at the same block gets it instantly and OSM never sees the request.

   GET /api/geocode?addr=30 Hempstead Ave, Rockville Centre, NY 11570
       -> { ok:true, lat, lng, cached }

   GET /api/geocode?lat=40.65&lng=-73.64          (reverse — "where am I standing?")
       -> { ok:true, addr, city, state, zip, label }

   Used when an account is saved, when a rep taps "I'm standing here" to correct an
   address, and when nearby search results are drawn on the map. */

const TTL_HIT  = 60 * 60 * 24 * 365;   // a building does not move
const TTL_MISS = 60 * 60 * 12;         // a miss is often just a busy minute at OSM — retry the same day
const UA = 'MiniBoxToolkit/1.0 (PulmOne field sales; erikbernard@rocketmail.com)';

async function redis(cmd) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd)
    });
    const data = await res.json();
    if (data.error) return null;
    return data.result;
  } catch (e) { return null; }
}

function normAddr(s) {
  return String(s || '').toLowerCase().replace(/[.,#]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
}
function round(n) { return Math.round(Number(n) * 100000) / 100000; }

/* Medical addresses are nearly all "Ste 407" / "Unit 156" / "#3B", and the map does
   not know suite numbers — it knows buildings. So we try the address as typed, then
   the same address with the suite taken off, then just the street and town. The pin
   lands on the building either way, which is what a rep in a parking lot needs. */
/* The suite word has to be a whole word sitting after a comma or a space, and the
   thing it names has to run to the next comma or the end. Without that, "Hempstead"
   loses its "stead" and "Stewart" loses everything after "Ste" — which is exactly
   how five real Long Island addresses failed to place on the first build.
   "Fl" on its own is deliberately not in the list: it would eat the state on a
   Florida address. */
const SUITE_RE = /(?:,|\s)\s*(?:suite|ste|unit|apt|apartment|floor|fl\.|rm|room|bldg|building)\.?\s*#?\s*[A-Za-z0-9][A-Za-z0-9\-]*(?=\s*(?:,|$))/gi;
const HASH_RE  = /(?:,|\s)\s*#\s*[A-Za-z0-9][A-Za-z0-9\-]*(?=\s*(?:,|$))/g;

function variants(addr) {
  const raw = String(addr || '').trim();
  const out = [raw];

  const noSuite = raw
    .replace(SUITE_RE, '')
    .replace(HASH_RE, '')
    .replace(/\s*,\s*,/g, ',').replace(/\s{2,}/g, ' ').replace(/,\s*$/, '').trim();
  if (noSuite && noSuite.toLowerCase() !== raw.toLowerCase()) out.push(noSuite);

  /* Drop the ZIP. When a practice has moved or a building straddles two ZIPs, the
     ZIP is the part that disagrees with the map. Street and town are enough. */
  const parts = noSuite.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length && /^\d{5}(-\d{4})?$/.test(parts[parts.length - 1])) parts.pop();
  if (parts.length >= 2) {
    const short = parts.join(', ');
    if (short.toLowerCase() !== noSuite.toLowerCase()) out.push(short);
  }
  return out;
}

async function askNominatim(q) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'us');
  url.searchParams.set('q', q);
  const r = await fetch(url.toString(), { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (!r.ok) throw new Error('nominatim-' + r.status);
  const rows = await r.json();
  return (rows && rows.length) ? rows[0] : null;
}

async function forward(addr) {
  const key = 'mbx:geo:f3:' + normAddr(addr);
  const hit = await redis(['GET', key]);
  if (hit) { try { const v = JSON.parse(hit); v.cached = true; return v; } catch (e) {} }

  const tries = variants(addr);
  let found = null, usedIdx = -1;
  for (let i = 0; i < tries.length; i++) {
    try {
      found = await askNominatim(tries[i]);
    } catch (e) {
      if (i === 0) throw e;                 // first failure is a real outage
      found = null;
    }
    if (found) { usedIdx = i; break; }
    if (i < tries.length - 1) await new Promise(r => setTimeout(r, 1100));  // OSM fair use
  }

  let out;
  if (found) {
    out = {
      ok: true, lat: round(found.lat), lng: round(found.lon),
      label: found.display_name || '',
      approx: usedIdx > 0                   // pinned to the building, not the suite
    };
    await redis(['SET', key, JSON.stringify(out), 'EX', String(TTL_HIT)]);
  } else {
    out = { ok: false, lat: null, lng: null, error: 'That address did not come back on the map. Check the street and town, or drop the pin with "I am standing here".' };
    await redis(['SET', key, JSON.stringify(out), 'EX', String(TTL_MISS)]);
  }
  out.cached = false;
  return out;
}

async function reverse(lat, lng) {
  const la = round(lat), ln = round(lng);
  const key = 'mbx:geo:r:' + la + ',' + ln;
  const hit = await redis(['GET', key]);
  if (hit) { try { const v = JSON.parse(hit); v.cached = true; return v; } catch (e) {} }

  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(la));
  url.searchParams.set('lon', String(ln));
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');

  const r = await fetch(url.toString(), { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (!r.ok) throw new Error('nominatim-' + r.status);
  const j = await r.json();
  const a = (j && j.address) || {};

  const street = [a.house_number, a.road].filter(Boolean).join(' ');
  const out = {
    ok: true,
    addr: street || (j && j.name) || '',
    city: a.city || a.town || a.village || a.hamlet || a.suburb || '',
    state: (a['ISO3166-2-lvl4'] || '').replace('US-', '') || a.state || '',
    zip: (a.postcode || '').slice(0, 5),
    label: (j && j.display_name) || '',
    lat: la, lng: ln
  };
  await redis(['SET', key, JSON.stringify(out), 'EX', String(TTL_HIT)]);
  out.cached = false;
  return out;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const q = req.query || {};
    if (q.lat != null && q.lng != null && q.lat !== '' && q.lng !== '') {
      const la = Number(q.lat), ln = Number(q.lng);
      if (!isFinite(la) || !isFinite(ln) || la < -90 || la > 90 || ln < -180 || ln > 180) {
        return res.status(400).json({ ok: false, error: 'Those coordinates do not look right.' });
      }
      return res.status(200).json(await reverse(la, ln));
    }
    const addr = String(q.addr || '').trim();
    if (!addr) return res.status(400).json({ ok: false, error: 'Need an address to look up.' });
    return res.status(200).json(await forward(addr));
  } catch (err) {
    return res.status(200).json({ ok: false, lat: null, lng: null, error: 'The map lookup service did not answer. The account still saved.' });
  }
};
