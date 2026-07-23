/* Make the Daily Cut card stop depending on the HQ board being healthy.
   Before: it looked for "#mbx-hq .hq-grid" and gave up if that never appeared —
   which is exactly what happened when HQ stopped mounting. After: it prefers
   the HQ grid, and falls back to its own strip at the top of the Daily Hub.
   Usage: node daily-cut-standalone.mjs <file> [<file>...]                    */
import fs from 'node:fs';

const CSS_ANCHOR = '/* ---- the board ---- */';
const CSS_ADD = `/* ---- standalone strip: where the card goes if the HQ board isn't there ---- */
#mbxd-strip{ margin:0 0 22px; }
#mbxd-strip .hq-card{ position:relative; border:1px solid var(--gray-300); border-radius:8px;
  background:var(--gray-100); padding:15px 16px 14px 18px; max-width:430px;
  display:flex; flex-direction:column; }
#mbxd-strip .hq-card::before{ content:""; position:absolute; left:0; top:10px; bottom:10px; width:3px;
  border-radius:0 3px 3px 0; background:var(--gray-300); }
#mbxd-strip .hq-card[data-spine="live"]::before{ background:var(--green); }
#mbxd-strip .hq-card[data-spine="warn"]::before{ background:var(--amber); }
#mbxd-strip .hq-card[data-spine="calm"]::before{ background:var(--blue-brand); }
#mbxd-strip .hq-k{ font-family:'DM Mono',monospace; font-size:9.5px; letter-spacing:.22em;
  text-transform:uppercase; color:var(--gray-600); display:flex; align-items:center; gap:7px; }
#mbxd-strip .hq-num{ font-family:'DM Mono',monospace; font-size:9.5px; color:var(--gray-600);
  border:1px solid var(--gray-300); border-radius:3px; padding:1px 5px; letter-spacing:.06em; }
#mbxd-strip .hq-lead{ font-size:19px; font-weight:600; color:var(--text); line-height:1.25;
  margin:9px 0 2px; font-family:'Oswald',sans-serif; letter-spacing:.01em; }
#mbxd-strip .hq-sub{ font-size:12.5px; color:var(--gray-600); line-height:1.5; }
#mbxd-strip .hq-go{ margin-top:auto; padding-top:11px; }
#mbxd-strip .hq-go button{ font-family:'DM Mono',monospace; font-size:10.5px; letter-spacing:.12em;
  text-transform:uppercase; background:transparent; border:0; border-bottom:1px solid var(--gray-300);
  color:var(--gray-800); padding:3px 0; cursor:pointer; }
#mbxd-strip .hq-go button:hover{ color:var(--blue-brand); border-bottom-color:var(--blue-brand); }

/* ---- the board ---- */`;

const JS_OLD = `  function inject() {
    if ($('mbxd-card')) return true;
    var grid = document.querySelector('#mbx-hq .hq-grid');
    if (!grid) return false;
    var tmp = document.createElement('div');
    tmp.innerHTML = cardHTML();
    grid.appendChild(tmp.firstChild);
    return true;
  }`;

const JS_NEW = `  /* WHERE THE CARD LIVES. First choice is the HQ board, so the game sits with
     everything else waiting on the rep. But HQ is another block, and on
     2026-07-23 it stopped mounting entirely — the card had nowhere to go and
     the game may as well not have shipped. So: if the HQ grid isn't there, we
     put up our own strip at the top of the Daily Hub. The game is never
     hostage to another block again. */
  function stripHost(create) {
    var s = $('mbxd-strip');
    if (s || !create) return s;
    var hub = $('tab-hub'); if (!hub) return null;
    s = document.createElement('div');
    s.id = 'mbxd-strip';
    var hero = hub.querySelector('.hub-hero');
    if (hero && hero.nextSibling) hub.insertBefore(s, hero.nextSibling);
    else hub.insertBefore(s, hub.firstChild);
    return s;
  }
  function place() {
    var grid = document.querySelector('#mbx-hq .hq-grid');
    var card = $('mbxd-card');
    if (grid) {
      if (card && card.parentNode === grid) return true;      // already home
      var strip = $('mbxd-strip');
      if (card) grid.appendChild(card);                        // HQ came back — move in
      else {
        var t = document.createElement('div');
        t.innerHTML = cardHTML();
        grid.appendChild(t.firstChild);
      }
      if (strip) strip.style.display = 'none';
      return true;
    }
    var host = stripHost(true); if (!host) return false;
    if (card && card.parentNode === host) { host.style.display = ''; return true; }
    host.style.display = '';
    host.innerHTML = cardHTML();
    return true;
  }
  function inject() { return place(); }`;

const BOOT_OLD = `    var tries = 0;
    var iv = setInterval(function () {
      if (inject()) {
        clearInterval(iv);
        try {
          var host = document.querySelector('div#mbx-hq');
          var mo = new MutationObserver(function () {
            if (!$('mbxd-card')) inject();
          });
          mo.observe(host, { childList: true, subtree: true });
        } catch (e) {}
        /* quietly warm the team board so the card can show today's count */
        if (S.done) fetchTeam(function () { paintCard(); });
      } else if (++tries > 60) {
        clearInterval(iv);
      }
    }, 400);`;

const BOOT_NEW = `    var warmed = false;
    function tick() {
      try {
        if (!place()) return;
        if (!warmed) {
          warmed = true;
          /* quietly warm the team board so the card can show today's count */
          if (S.done) fetchTeam(function () { paintCard(); });
        }
      } catch (e) {}
    }
    tick();
    /* HQ rewrites its whole grid on every render, other blocks rebuild the hub,
       and any of it can drop the card. One cheap check keeps it on screen. */
    setInterval(tick, 1500);`;

let bad = 0;
for (const file of process.argv.slice(2)) {
  let s = fs.readFileSync(file, 'utf8');
  const log = [];
  const apply = (from, to, name) => {
    if (s.includes(to.split('\n')[0]) && !s.includes(from)) { log.push(name + ':already'); return; }
    const n = s.split(from).length - 1;
    if (n !== 1) { log.push(name + ':MISS(' + n + ')'); bad++; return; }
    s = s.replace(from, () => to);
    log.push(name + ':ok');
  };
  apply(CSS_ANCHOR, CSS_ADD, 'css');
  apply(JS_OLD, JS_NEW, 'place');
  apply(BOOT_OLD, BOOT_NEW, 'boot');
  fs.writeFileSync(file, s, 'utf8');
  console.log(file.split(/[\\/]/).pop(), '->', log.join(' / '));
}
process.exit(bad ? 1 : 0);
