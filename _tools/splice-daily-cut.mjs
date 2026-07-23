/* Splice the DAILY CUT block into a toolkit HTML file.
   Append-only, before </body>, plus one guard line in the usage hook so a game
   doesn't pour letter presses into the Command Center's click feed.
   Waits for the file to sit still first — another bot may be mid-edit.
   Usage: node splice-daily-cut.mjs "<path to html>" [--nowait]           */
import fs from 'node:fs';

const target = process.argv[2];
const nowait = process.argv.includes('--nowait');
const BLOCK = fs.readFileSync(
  'C:/Users/erikb/Documents/Claude/Projects/MINIBOXSALES TOOL/_tools/daily-cut-block.html', 'utf8').trim();

const USAGE_ANCHOR = "if (el.closest('#mbx-cc-frame')) return;";
const USAGE_ADD =
  "if (el.closest('#mbxd-back')) return;                           // Daily Cut is a game, not work\n        ";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function settle(path) {
  if (nowait) return;
  let last = -1, still = 0;
  for (let i = 0; i < 150; i++) {              // up to ~5 minutes
    const m = fs.statSync(path).mtimeMs;
    still = (m === last) ? still + 1 : 0;
    last = m;
    if (still >= 12) return;                    // 25s of no writes = the lane is idle
    await sleep(2000);
  }
  throw new Error('file never settled — another bot is still writing');
}

async function main() {
  await settle(target);

  const before = fs.statSync(target).mtimeMs;
  let html = fs.readFileSync(target, 'utf8');

  if (html.includes('id="mbx-daily"')) { console.log('already spliced:', target); return; }

  const bodyAt = html.lastIndexOf('</body>');
  if (bodyAt < 0) throw new Error('no </body> in ' + target);

  let out = html.slice(0, bodyAt) + BLOCK + '\n\n' + html.slice(bodyAt);

  // usage guard — one occurrence, and only if it hasn't been added already
  if (!out.includes("#mbxd-back')) return;") && out.includes(USAGE_ANCHOR)) {
    out = out.replace(USAGE_ANCHOR, () => USAGE_ADD + USAGE_ANCHOR);
  }

  const after = fs.statSync(target).mtimeMs;
  if (after !== before) throw new Error('file changed underneath us — rerun');

  fs.writeFileSync(target, out, 'utf8');

  const check = fs.readFileSync(target, 'utf8');
  console.log(target.split(/[\\/]/).pop(),
    '| block:', check.includes('id="mbx-daily"'),
    '| css:', check.includes('id="mbx-daily-css"'),
    '| guard:', check.includes("#mbxd-back')) return;"),
    '| grew:', check.length - html.length);
}
main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
