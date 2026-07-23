#!/usr/bin/env node
/* MiniBox+ Toolkit — problem-report triage helper.

   Reads the "Report a problem" inbox that reps fill from Boxy and Team Chat,
   the same list the Command Center shows, and writes answers back to it.
   Built for the once-a-day automatic triage run, but fine to run by hand.

   The toolkit sits behind TWO doors: the front-door invite list (a signed
   middleware cookie on every request) and the owner password (checked inside
   /api/admin). This script opens both, so nothing here should ever be pasted
   somewhere public.

     node mbx-issues.mjs list                      open + working reports, plain English
     node mbx-issues.mjs list --all                include the ones already fixed
     node mbx-issues.mjs list --json               same data, machine readable
     node mbx-issues.mjs note <id> <status> "..."  status: open | working | fixed
     node mbx-issues.mjs digest "..."              post today's summary to the Command Center
     node mbx-issues.mjs digest --list             what the last few daily summaries said

   Settings come from the environment when set, otherwise the shipped defaults:
     MBX_AUTH_SECRET     signs the front-door cookie             (Vercel: AUTH_SECRET)
     MBX_ADMIN_PASSWORD  owner password                       (Vercel: ADMIN_PASSWORD)
*/

import { createHmac } from 'node:crypto';

const BASE = process.env.MBX_BASE || 'https://deploytoolkit.vercel.app';
const ADMIN_PW = process.env.MBX_ADMIN_PASSWORD || 'MiniBoxAdmin2026';

/* The front door is an invite list now: a signed cookie says WHO you are, and
   the middleware re-checks that person against the list on every page load.
   This script signs in as the same "share link" identity the one-tap ?k= links
   use, so it never depends on any one person staying on the list. The signature
   has to match _deploy_toolkit/middleware.js and api/access.js exactly. */
function teamCookie() {
  const secret = (process.env.MBX_AUTH_SECRET || 'mbx-front-door-2026-a7f3').trim();
  const b64url = (b) => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const sig = b64url(createHmac('sha256', secret).update('mbx1|@guest').digest()).slice(0, 32);
  return 'mbx_pass=v2.' + b64url(Buffer.from('@guest', 'utf8')) + '.' + sig;
}

async function api(action, extra) {
  const res = await fetch(BASE + '/api/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': teamCookie()
    },
    body: JSON.stringify(Object.assign({ key: ADMIN_PW, action }, extra || {}))
  });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (_) {}

  if (res.status === 401 && !data) {
    throw new Error('The front door refused us — the sign-in page came back instead of the API. The gate is an invite list now; check that teamCookie() here still signs the same way as _deploy_toolkit/middleware.js (MBX_AUTH_SECRET must match AUTH_SECRET in Vercel).');
  }
  if (data && data.error === 'bad-key') {
    throw new Error('The owner password was refused. Check MBX_ADMIN_PASSWORD (Vercel: ADMIN_PASSWORD).');
  }
  if (!res.ok || !data || !data.ok) {
    throw new Error('Command Center said no (' + res.status + '): ' + text.slice(0, 200));
  }
  return data;
}

function ago(ts) {
  if (!ts) return 'unknown time';
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 60) return mins + ' min ago';
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return hrs + ' hr ago';
  return Math.round(hrs / 24) + ' days ago';
}

async function list(args) {
  const wantAll = args.includes('--all');
  const data = await api('load');
  const issues = (data.issues || []).filter(function (it) {
    return wantAll || it.status !== 'fixed';
  });

  if (args.includes('--json')) {
    console.log(JSON.stringify({ count: issues.length, issues }, null, 2));
    return;
  }

  if (!issues.length) {
    console.log('No open problem reports. Nothing to fix today.');
    return;
  }

  console.log(issues.length + ' report' + (issues.length === 1 ? '' : 's') + ' needing attention:\n');
  issues.forEach(function (it, i) {
    console.log((i + 1) + '. [' + (it.status || 'open') + '] ' + (it.id || '(no id)'));
    console.log('   from: ' + (it.name || it.who || 'someone') + '  ' + ago(it.ts));
    if (it.screen) console.log('   screen: ' + it.screen);
    if (it.dev) console.log('   device: ' + it.dev);
    console.log('   said: ' + String(it.text || it.message || '').replace(/\s+/g, ' ').trim());
    if (it.note) console.log('   last note: ' + it.note);
    console.log('');
  });
}

async function note(args) {
  const [id, status, ...rest] = args;
  const allowed = ['open', 'working', 'fixed'];
  if (!id || allowed.indexOf(status) === -1) {
    console.error('Usage: node mbx-issues.mjs note <id> <open|working|fixed> "what happened"');
    process.exit(1);
  }
  await api('setStatus', { issueId: id, status, note: rest.join(' ') });
  console.log('Updated ' + id + ' -> ' + status);
}

async function digest(args) {
  if (args.includes('--list')) {
    const data = await api('digest');
    const rows = data.digest || [];
    if (!rows.length) { console.log('No daily summaries posted yet.'); return; }
    rows.forEach(function (d) {
      console.log('--- ' + new Date(d.ts).toLocaleString() + ' ---');
      console.log(d.text);
      console.log('');
    });
    return;
  }
  const text = args.join(' ').trim();
  if (!text) {
    console.error('Usage: node mbx-issues.mjs digest "today\'s summary"');
    process.exit(1);
  }
  await api('digest', { text });
  console.log('Posted to the Command Center.');
}

const [cmd, ...args] = process.argv.slice(2);
const run = { list, note, digest }[cmd];
if (!run) {
  console.error('Commands: list | note | digest   (see the notes at the top of this file)');
  process.exit(1);
}
run(args).catch(function (e) {
  console.error('Problem: ' + e.message);
  process.exit(1);
});
