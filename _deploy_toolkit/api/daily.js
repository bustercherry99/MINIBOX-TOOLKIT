/* MiniBox+ Toolkit — DAILY CUT (the team's daily word game).

   One five-letter word a day, the same word for everybody in the toolkit.
   This endpoint is ONLY the shared scoreboard — it never knows the word, and
   it never needs to. The game itself runs entirely in the app.

   GET  /api/daily?day=YYYY-MM-DD
     -> { ok, day, rows:[{name,n,won,ts,streak}], played, solved, dist, best:[...] }

   POST /api/daily  { day, name, email, dev, n, won, streak, anon }
     -> same board, with the sender folded in.
     n = guesses used (1-6), or 0 when they ran out. First result of the day
     wins: HSETNX means nobody can replay their way to a better score.

   NORTH STAR CHECK: this is a game, not a report. It stores a score and a
   name and nothing else, it is never shown in the Command Center, and anyone
   who ticks "play quietly" lands on the board as "A teammate". Day buckets
   delete themselves after 45 days.

   Storage: Upstash Redis via REST (KV_REST_API_URL / KV_REST_API_TOKEN).
     mbx:game:day:<day>   HASH  person -> {name,n,won,ts,streak,anon}
     mbx:game:rec         HASH  person -> {name,streak,best,played,wins,last}
*/

const DAY_TTL = 45 * 86400;
const REC_KEY = 'mbx:game:rec';
const MAX_ROWS = 60;

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

function clean(s, max) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max || 60);
}

/* Same identity ladder the rest of the toolkit uses: work email first, then a
   typed name, then the device. One rep on a phone and a laptop is one player. */
function personKey(email, name, dev) {
  const e = clean(email, 60).toLowerCase().replace(/\s/g, '');
  if (e && e.indexOf('@') > 0) return 'e:' + e;
  const n = clean(name, 40).toLowerCase();
  if (n) return 'n:' + n;
  return 'device:' + (clean(dev, 40) || 'unknown');
}

/* The whole team is in the US, so the day flips at Eastern midnight for
   everybody. Otherwise a rep in one time zone would be on a different word. */
function easternDay(ms) {
  try {
    const s = new Date(ms || Date.now()).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  } catch (e) { /* no ICU — fall through */ }
  const d = new Date((ms || Date.now()) - 4 * 3600000);
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') +
    '-' + String(d.getUTCDate()).padStart(2, '0');
}

/* A client with a wrong clock shouldn't be able to write into next week. */
function safeDay(day) {
  const want = clean(day, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(want)) return easternDay();
  const today = easternDay();
  const drift = Math.abs(Date.parse(want + 'T12:00:00Z') - Date.parse(today + 'T12:00:00Z'));
  return drift <= 2 * 86400000 ? want : today;
}

function parseHash(raw) {
  // Upstash returns HGETALL as a flat [field, value, field, value, ...]
  const out = {};
  if (Array.isArray(raw)) {
    for (let i = 0; i < raw.length; i += 2) {
      try { out[raw[i]] = JSON.parse(raw[i + 1]); } catch (e) { /* skip junk */ }
    }
  } else if (raw && typeof raw === 'object') {
    for (const k of Object.keys(raw)) {
      try { out[k] = typeof raw[k] === 'string' ? JSON.parse(raw[k]) : raw[k]; } catch (e) { /* skip */ }
    }
  }
  return out;
}

async function board(day) {
  const [dayRaw, recRaw] = await Promise.all([
    redis(['HGETALL', 'mbx:game:day:' + day]),
    redis(['HGETALL', REC_KEY])
  ]);
  const today = parseHash(dayRaw);
  const recs = parseHash(recRaw);

  const rows = [];
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, X: 0 };
  for (const who of Object.keys(today)) {
    const r = today[who] || {};
    const n = Number(r.n) || 0;
    const won = !!r.won && n >= 1 && n <= 6;
    rows.push({
      name: r.anon ? 'A teammate' : (clean(r.name, 40) || 'A teammate'),
      n: won ? n : 0,
      won: won,
      ts: Number(r.ts) || 0,
      streak: Number(r.streak) || 0
    });
    dist[won ? n : 'X'] += 1;
  }
  // Solved first, fewest guesses first, and earliest finish breaks the tie.
  rows.sort(function (a, b) {
    if (a.won !== b.won) return a.won ? -1 : 1;
    if (a.won && a.n !== b.n) return a.n - b.n;
    return a.ts - b.ts;
  });

  // Longest live streaks, all-time. Only people currently on a run appear.
  const best = Object.keys(recs).map(function (who) {
    const r = recs[who] || {};
    return {
      name: clean(r.name, 40) || 'A teammate',
      streak: Number(r.streak) || 0,
      bestEver: Number(r.best) || 0,
      last: clean(r.last, 10)
    };
  }).filter(function (r) { return r.streak > 1; })
    .sort(function (a, b) { return b.streak - a.streak; })
    .slice(0, 8);

  return {
    day: day,
    rows: rows.slice(0, MAX_ROWS),
    played: rows.length,
    solved: rows.filter(function (r) { return r.won; }).length,
    dist: dist,
    best: best
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const day = safeDay((req.query && req.query.day) || '');
      return res.status(200).json(Object.assign({ ok: true }, await board(day)));
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};

      const day = safeDay(body.day);
      const who = personKey(body.email, body.name, body.dev);
      const name = clean(body.name, 40);
      const n = Math.max(0, Math.min(6, Math.floor(Number(body.n) || 0)));
      const won = body.won === true && n >= 1;
      const anon = body.anon === true;
      const entry = {
        name: name, n: won ? n : 0, won: won, ts: Date.now(),
        streak: Math.max(0, Math.min(9999, Math.floor(Number(body.streak) || 0))),
        anon: anon
      };

      // First finish of the day is the one that counts.
      const fresh = await redis(['HSETNX', 'mbx:game:day:' + day, who, JSON.stringify(entry)]);
      await redis(['EXPIRE', 'mbx:game:day:' + day, String(DAY_TTL)]);

      if (fresh) {
        let rec = {};
        try {
          const raw = await redis(['HGET', REC_KEY, who]);
          if (raw) rec = JSON.parse(raw) || {};
        } catch (e) { rec = {}; }
        // The client owns the streak (it knows whether yesterday was played);
        // the server just keeps the high-water mark honest.
        const streak = entry.streak;
        rec = {
          name: anon ? (rec.name || '') : (name || rec.name || ''),
          streak: streak,
          best: Math.max(Number(rec.best) || 0, streak),
          played: (Number(rec.played) || 0) + 1,
          wins: (Number(rec.wins) || 0) + (won ? 1 : 0),
          last: day
        };
        await redis(['HSET', REC_KEY, who, JSON.stringify(rec)]);
      }

      return res.status(200).json(Object.assign({ ok: true, counted: !!fresh }, await board(day)));
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'GET or POST only.' });
  } catch (e) {
    // A scoreboard outage must never look like a broken game.
    return res.status(200).json({ ok: false, error: 'board-unavailable', rows: [], played: 0, solved: 0 });
  }
};
