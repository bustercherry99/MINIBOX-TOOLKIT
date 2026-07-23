/* build-pft-suite-inline.mjs
 *
 * Folds the PFT Teaching Suite into the MiniBox toolkit so it opens in-place and
 * works offline. Reads every page in _deploy_pft_suite/, base64s it, and rewrites
 * the PFT-SUITE-INLINE block in the toolkit. Idempotent — safe to re-run.
 *
 *   node _tools/build-pft-suite-inline.mjs
 *
 * Run this WHENEVER a Suite page changes. The toolkit holds a copy, not a live
 * link, so an edit to _deploy_pft_suite/ does not reach the toolkit on its own.
 * Syncs all three canonical toolkit copies at the end.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SUITE_DIR = join(ROOT, '_deploy_pft_suite');
const SOURCE = join(ROOT, 'v3', 'MiniBox Sales Toolkit (LATEST).html');
const COPIES = [join(ROOT, 'v3', 'index.html'), join(ROOT, '_deploy_toolkit', 'index.html')];

const START = '<!-- PFT-SUITE-INLINE:START';
const END = '<!-- PFT-SUITE-INLINE:END -->';

const fail = (m) => { console.error('\n  FAILED: ' + m + '\n'); process.exit(1); };

if (!existsSync(SUITE_DIR)) fail('no _deploy_pft_suite/ at ' + SUITE_DIR);
if (!existsSync(SOURCE)) fail('no toolkit at ' + SOURCE);

// index.html first so the map reads in menu order; .bak files never ship.
const files = readdirSync(SUITE_DIR)
  .filter((f) => f.endsWith('.html') && !f.includes('.bak'))
  .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));

if (!files.includes('index.html')) fail('_deploy_pft_suite/ has no index.html (the Suite menu)');

const entries = [];
let raw = 0;
for (const f of files) {
  const buf = readFileSync(join(SUITE_DIR, f));
  raw += buf.length;
  // A Suite page that reaches out to the network would break offline. Catch it here
  // rather than letting a rep discover it on a plane.
  const text = buf.toString('utf8');
  const ext = text.match(/(?:src|href)\s*=\s*["'](?:https?:)?\/\/[^"']+/i);
  if (ext) console.warn('  ! ' + f + ' references ' + ext[0].slice(0, 60) + ' — will not load offline');
  entries.push('  ' + JSON.stringify(f) + ': ' + JSON.stringify(buf.toString('base64')));
  console.log('  + ' + f.padEnd(52) + (buf.length / 1024).toFixed(0).padStart(5) + ' KB');
}

const block = START + ' — GENERATED, DO NOT EDIT BY HAND.\n'
  + '     Source of truth: _deploy_pft_suite/*.html\n'
  + '     Regenerate:      node _tools/build-pft-suite-inline.mjs -->\n'
  + '<script id="pft-suite-inline">window.PFTSUITE_FILES = {\n'
  + entries.join(',\n') + '\n};</script>\n'
  + END;

let html = readFileSync(SOURCE, 'utf8');
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a === -1 || b === -1) fail('PFT-SUITE-INLINE markers missing from the toolkit — re-add them before </body>');

html = html.slice(0, a) + block + html.slice(b + END.length);
writeFileSync(SOURCE, html);

for (const c of COPIES) {
  if (!existsSync(c)) fail('missing toolkit copy: ' + c);
  writeFileSync(c, html);
}

const sum = (p) => createHash('md5').update(readFileSync(p)).digest('hex');
const hashes = [SOURCE, ...COPIES].map(sum);
if (new Set(hashes).size !== 1) fail('the three toolkit copies did not end up identical');

console.log('\n  ' + files.length + ' Suite pages inlined — '
  + (raw / 1024).toFixed(0) + ' KB source, toolkit now '
  + (Buffer.byteLength(html) / 1024 / 1024).toFixed(2) + ' MB');
console.log('  all 3 copies synced (md5 ' + hashes[0].slice(0, 12) + ')\n');
