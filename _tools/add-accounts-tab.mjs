/* Splice the Account Map block into the toolkit master, then mirror to the deploy folder.
   Append-only and idempotent: re-running replaces the block instead of stacking copies.
   Node only — never round-trip this HTML through PowerShell (it mojibakes em dashes). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || 'C:/Users/erikb/Documents/Claude/Projects/MINIBOXSALES TOOL');
const MASTER = path.join(ROOT, 'v3', 'MiniBox Sales Toolkit (LATEST).html');
const BLOCK = path.join(ROOT, '_tools', 'mbx-accounts-block.html');
const DEPLOY = path.join(ROOT, '_deploy_toolkit', 'index.html');
const V3COPY = path.join(ROOT, 'v3', 'index.html');

const block = fs.readFileSync(BLOCK, 'utf8').trim();
let html = fs.readFileSync(MASTER, 'utf8');

// strip any previous copy of either block
const strip = (s, id, tag) => {
  const re = new RegExp('<' + tag + ' id="' + id + '">[\\s\\S]*?</' + tag + '>\\s*', 'g');
  return s.replace(re, '');
};
const before = html.length;
html = strip(html, 'mbx-accounts-css', 'style');
html = strip(html, 'mbx-accounts', 'script');
if (html.length !== before) console.log('Replaced an earlier copy of the block.');

const at = html.lastIndexOf('</body>');
if (at < 0) { console.error('No </body> found — refusing to write.'); process.exit(1); }

html = html.slice(0, at) + block + '\n\n' + html.slice(at);

// sanity: the block must be present exactly once and the file must still close properly
const once = (needle) => (html.split(needle).length - 1);
if (once('<script id="mbx-accounts">') !== 1 || once('<style id="mbx-accounts-css">') !== 1) {
  console.error('Block count wrong — refusing to write.'); process.exit(1);
}
if (!/<\/body>\s*<\/html>\s*$/.test(html)) {
  console.error('File no longer closes with </body></html> — refusing to write.'); process.exit(1);
}

fs.writeFileSync(MASTER, html, 'utf8');
fs.writeFileSync(DEPLOY, html, 'utf8');
if (fs.existsSync(V3COPY)) fs.writeFileSync(V3COPY, html, 'utf8');

console.log('Master, deploy and v3 copies written. ' + (html.length / 1024 / 1024).toFixed(2) + ' MB');
