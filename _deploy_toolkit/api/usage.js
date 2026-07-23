/* MiniBox+ Toolkit — USAGE (what's actually getting used).
   The toolkit posts small batches of events here: app opened, tab viewed,
   button clicked. Nothing is read back by the app — the ONLY way to see any
   of this is the Command Center, behind the separate admin password.

   POST /api/usage { events:[ {t, k, label, screen, name, dev} ] }  -> { ok, n }
     t      = timestamp (ms)
     k      = kind: 'open' | 'tab' | 'action'
     label  = human label ("Rheumatology", "Copy this email")
     screen = which tab they were on
     name   = self-declared rep name (may be empty)
     dev    = per-device id, so one rep on phone+laptop isn't counted as two people

   WHAT WE DEPUTIZE TO REDIS
     mbx:usage:events              capped list of raw events (recent feed)
     mbx:usage:day:<YYYY-MM-DD>    hash  label -> count      (per-day rollup)
     mbx:usage:ppl:<YYYY-MM-DD>    hash  person -> count     (who was active that day)
     mbx:usage:seen                hash  person -> {ts,screen,dev}   (last seen)
   Rollups mean the Command Center never has to scan the raw list to draw a
   chart, and they expire on their own after 60 days.

   Deliberately NOT recorded: nothing typed. No note text, no email bodies, no
   customer names, no search terms — only which control was pressed. */

const EVENTS_KEY = 'mbx:usage:events';
const SEEN_KEY = 'mbx:usage:seen';
const FIRST_KEY = 'mbx:usage:first';   // person -> first-ever-seen ts (written once, never overwritten)
const EVENTS_KEEP = 4000;
const ROLLUP_TTL = 60 * 86400;      // 60 days, then the day-buckets clean themselves up
const MAX_BATCH = 60;

function redisUrl() { return process.env.KV_REST_API_URL; }
function redisToken() { return process.env.KV_REST_API_TOKEN; }

async function redis(cmd) {
  const url = redisUrl(), token = redisToken();
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

/* Many small counter bumps per batch — one round trip instead of twenty. */
async function pipeline(cmds) {
  if (!cmds.length) return [];
  const url = redisUrl(), token = redisToken();
  if (!url || !token) throw new Error('storage-not-configured');
  const res = await fetch(url.replace(/\/+$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  return res.json();
}

function clean(s, max) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max || 60);
}

/* WHO IS THIS — in order of how much we trust it.
     e:<email>   work email from the rep profile. Unique, and it self-corrects the
                 moment they fill in the welcome screen for the email tools.
     n:<name>    typed name only. "Erik Bernard" and "erik  bernard" fold together.
     device:<id> skipped the welcome entirely. One row per device, can't be helped.
   Prefixes are explicit so the Command Center can tell you WHY someone is
   showing up unidentified. */
function cleanEmail(email) {
  const e = clean(email, 60).toLowerCase().replace(/\s/g, '');
  if (!e || e.indexOf('@') < 1 || e.indexOf('.', e.indexOf('@')) === -1) return '';
  return e;
}
function personKey(email, name, dev) {
  const e = cleanEmail(email);
  if (e) return 'e:' + e;
  const n = clean(name, 40).toLowerCase();
  if (n) return 'n:' + n;
  return 'device:' + (clean(dev, 40) || 'unknown');
}
function personLabel(name) {
  const n = clean(name, 40);
  if (!n) return '';
  return n.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(' ');
}

function dayOf(ts) {
  const d = new Date(ts);
  return d.getUTCFullYear() + '-' +
    String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
    String(d.getUTCDate()).padStart(2, '0');
}

function clampInt(v, lo, hi) {
  const n = Math.floor(Number(v));
  if (!isFinite(n) || n < lo || n > hi) return -1;
  return n;
}

/* 'ping'  = still-here heartbeat behind the "On right now" panel. Last-seen only.
   'dwell' = how long a screen was up (carries ms). Rolled into time totals,
             kept OUT of the click feed and click counts.
   'outcome' = a click that finished something a rep sells with (quote, ROI,
             PDF, logged order). Counted alongside the plain click.
   Both ping and dwell stay out of the raw feed so they can't drown it. */
const KINDS = { open: 1, tab: 1, action: 1, ping: 1, outcome: 1, dwell: 1 };

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'POST only.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  const raw = Array.isArray(body.events) ? body.events.slice(0, MAX_BATCH) : [];
  if (!raw.length) return res.status(200).json({ ok: true, n: 0 });

  const now = Date.now();
  const events = [];
  for (const e of raw) {
    if (!e || typeof e !== 'object') continue;
    const kind = KINDS[e.k] ? e.k : null;
    if (!kind) continue;
    let ts = Number(e.t) || now;
    // A device with a wrong clock shouldn't land events in 2031 and poison the
    // day-buckets forever. Anything wild gets stamped with server time.
    if (!isFinite(ts) || ts > now + 300000 || ts < now - 30 * 86400000) ts = now;
    events.push({
      t: ts,
      k: kind,
      label: clean(e.label, 60),
      screen: clean(e.screen, 40),
      name: personLabel(e.name),
      email: cleanEmail(e.email),
      key: personKey(e.email, e.name, e.dev),
      dev: clean(e.dev, 40),
      plat: clean(e.plat, 40),
      ms: kind === 'dwell' ? Math.max(0, Math.min(30 * 60000, Number(e.ms) || 0)) : 0,
      hr: kind === 'open' ? clampInt(e.hr, 0, 23) : -1,
      dow: kind === 'open' ? clampInt(e.dow, 0, 6) : -1
    });
  }
  if (!events.length) return res.status(200).json({ ok: true, n: 0 });

  try {
    const cmds = [];

    // 1. Raw feed, newest first, capped. Heartbeats and screen-time never enter
    //    it — they'd drown the recent-activity list within minutes.
    const real = events.filter(e => e.k !== 'ping' && e.k !== 'dwell');
    if (real.length) {
      cmds.push(['LPUSH', EVENTS_KEY].concat(real.map(e => JSON.stringify(e))));
      cmds.push(['LTRIM', EVENTS_KEY, '0', String(EVENTS_KEEP - 1)]);
    }

    // 2. Per-day rollups. Batch the bumps in memory first so ten clicks on the
    //    same button cost one HINCRBY, not ten. Everything lives in one day hash
    //    under namespaced fields so a 14-day report is a handful of hash reads:
    //      tab:*  action:*  outcome:*  open:app   — click counts
    //      dwellms:<screen>  dwellms:__all         — screen-time, in ms
    //      hod:<0-23>  dow:<0-6>                    — when opens happen
    const dayCounts = {};   // day -> { 'tab:Rheumatology': 3, 'dwellms:Daily Hub': 41000, ... }
    const dayPeople = {};   // day -> { 'e:rep@x.com': 5, ... }
    for (const e of real) {
      const day = dayOf(e.t);
      (dayCounts[day] || (dayCounts[day] = {}));
      (dayPeople[day] || (dayPeople[day] = {}));
      const field = e.k + ':' + (e.label || '(unlabelled)');
      dayCounts[day][field] = (dayCounts[day][field] || 0) + 1;
      dayPeople[day][e.key] = (dayPeople[day][e.key] || 0) + 1;
      if (e.k === 'open') {
        if (e.hr >= 0) dayCounts[day]['hod:' + e.hr] = (dayCounts[day]['hod:' + e.hr] || 0) + 1;
        if (e.dow >= 0) dayCounts[day]['dow:' + e.dow] = (dayCounts[day]['dow:' + e.dow] || 0) + 1;
      }
    }
    // Screen-time is its own pass — dwell is out of the feed but IS a time signal.
    for (const e of events) {
      if (e.k !== 'dwell' || !e.ms) continue;
      const day = dayOf(e.t);
      (dayCounts[day] || (dayCounts[day] = {}));
      const screen = e.label || '(unknown)';
      dayCounts[day]['dwellms:' + screen] = (dayCounts[day]['dwellms:' + screen] || 0) + e.ms;
      dayCounts[day]['dwellms:__all'] = (dayCounts[day]['dwellms:__all'] || 0) + e.ms;
    }
    for (const day of Object.keys(dayCounts)) {
      const k = 'mbx:usage:day:' + day;
      for (const f of Object.keys(dayCounts[day])) cmds.push(['HINCRBY', k, f, String(dayCounts[day][f])]);
      cmds.push(['EXPIRE', k, String(ROLLUP_TTL)]);
    }
    for (const day of Object.keys(dayPeople)) {
      const k = 'mbx:usage:ppl:' + day;
      for (const f of Object.keys(dayPeople[day])) cmds.push(['HINCRBY', k, f, String(dayPeople[day][f])]);
      cmds.push(['EXPIRE', k, String(ROLLUP_TTL)]);
    }

    // 3. Last seen, per person (or per anonymous device). Carries the platform
    //    so the Command Center can show phone-vs-laptop without a second store.
    const seen = {};
    const firstTs = {};   // earliest ts we saw for each person in THIS batch
    for (const e of events) {
      if (!seen[e.key] || e.t > seen[e.key].ts) {
        seen[e.key] = { ts: e.t, name: e.name, email: e.email, screen: e.screen, dev: e.dev, plat: e.plat };
      }
      if (!firstTs[e.key] || e.t < firstTs[e.key]) firstTs[e.key] = e.t;
    }
    for (const who of Object.keys(seen)) {
      cmds.push(['HSET', SEEN_KEY, who, JSON.stringify(seen[who])]);
      // HSETNX writes ONLY if absent — so this lands the true first-ever time and
      // never moves, which is what separates a brand-new rep from a regular.
      cmds.push(['HSETNX', FIRST_KEY, who, String(firstTs[who])]);
    }

    await pipeline(cmds);
    return res.status(200).json({ ok: true, n: events.length });
  } catch (e) {
    // Usage tracking must never be the reason the toolkit feels broken.
    // Swallow it, tell the client we're fine, drop the batch.
    return res.status(200).json({ ok: true, n: 0, note: 'not-stored' });
  }
};
