/* FIX: the HQ board never mounted on the live app.
   `<script id="mbx-hq">` and the board div it creates share the same id, so
   getElementById('mbx-hq') always returned the SCRIPT — and mount()'s
   "already mounted?" guard therefore always bailed. Result: no HQ board on the
   Daily Hub at all, and nothing for the Daily Cut card to attach to.
   Fix = look the board up as a DIV specifically, everywhere.
   Usage: node fix-hq-mount.mjs "<path to html>" [...more paths]              */
import fs from 'node:fs';

const EDITS = [
  { // mount() guard — the actual bug
    from: "var hub = $('tab-hub'); if (!hub || $('mbx-hq')) return;",
    to: "var hub = $('tab-hub');\n    /* the board div and THIS script share the id 'mbx-hq', so getElementById\n       would always hand back the script and this guard would always bail —\n       ask for the DIV, or HQ silently never mounts (that bug, 2026-07-23) */\n    if (!hub || document.querySelector('div#mbx-hq')) return;"
  },
  { // HQ's own render()
    from: "    var host = $('mbx-hq'); if (!host) return;",
    to: "    var host = document.querySelector('div#mbx-hq'); if (!host) return;"
  },
  { // the Daily Cut block's observer host
    from: "          var host = $('mbx-hq');",
    to: "          var host = document.querySelector('div#mbx-hq');"
  }
];

let bad = 0;
for (const file of process.argv.slice(2)) {
  let s = fs.readFileSync(file, 'utf8');
  const done = [];
  for (const e of EDITS) {
    const n = s.split(e.from).length - 1;
    if (n === 0 && s.includes(e.to.trim().split('\n').pop())) { done.push('already'); continue; }
    if (n !== 1) { done.push('MISS(' + n + ')'); bad++; continue; }
    s = s.replace(e.from, () => e.to);
    done.push('ok');
  }
  fs.writeFileSync(file, s, 'utf8');
  console.log(file.split(/[\\/]/).pop(), '->', done.join(' / '));
}
process.exit(bad ? 1 : 0);
