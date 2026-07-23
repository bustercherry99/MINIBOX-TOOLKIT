/* Assemble the Academy data files from the v2 quiz data and the study JSON the
   content agents produced. Re-runnable: it always rebuilds both files from source. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';   // the folder name has a space in it, so decode properly

// The study-*.json files next to this script are the content masters. Edit those,
// re-run this, and academy-study.js + academy-quiz.js are rebuilt and revalidated.
const SP   = path.dirname(fileURLToPath(import.meta.url));
const TOOL = path.resolve(SP, '..', '..');
const V2   = path.join(TOOL, 'MiniBox_Academy_v2.0.html');

/* ---- quiz data + config, lifted straight out of v2 ---- */
const v2 = fs.readFileSync(V2, 'utf8');
const quiz = JSON.parse(v2.match(/window\.ACADEMY = (\{[\s\S]*?\});\s*\n/)[1]);
const cfgSrc = v2.match(/window\.ACADEMY_CFG = (\{[\s\S]*?\});\s*\n/)[1];

fs.writeFileSync(path.join(TOOL, 'academy-quiz.js'),
  '/* MiniBox Academy — flashcards, test questions and module config.\n' +
  '   Carried over unchanged from v2.0; every question traces to a PulmOne quiz template. */\n' +
  'window.ACADEMY = ' + JSON.stringify(quiz, null, 1) + ';\n\n' +
  'window.ACADEMY_CFG = ' + cfgSrc + ';\n');

/* ---- study content ---- */
const parts = ['study-clinical.json', 'study-spirometry.json', 'study-dlco.json',
               'study-volumes.json', 'study-testing.json', 'study-hardware.json'];

const study = {};
let missing = [];
for (const f of parts) {
  const p = path.join(SP, f);
  if (!fs.existsSync(p)) { missing.push(f); continue; }
  Object.assign(study, JSON.parse(fs.readFileSync(p, 'utf8')));
}

/* ---- validate: every referenced image must actually exist ---- */
const assets = new Set(fs.readdirSync(path.join(TOOL, 'academy-assets'))
  .filter(f => f.endsWith('.jpg')).map(f => f.slice(0, -4)));
const VISUALS = new Set(['spirogram', 'fvloop', 'gates', 'compartbars', 'dlcotimeline', 'boyle']);

const problems = [];
let nSec = 0, nImg = 0, nTbl = 0, nSvg = 0, nOther = 0;

for (const [key, mod] of Object.entries(study)) {
  if (!mod.sections) { problems.push(`${key}: no sections`); continue; }
  mod.sections.forEach((s, i) => {
    nSec++;
    if (!s.h || !s.p) problems.push(`${key}[${i}]: missing h or p`);
    const v = s.visual;
    if (!v) { nOther++; return; }
    if (v.t === 'img') {
      nImg++;
      if (!assets.has(v.src)) problems.push(`${key}[${i}]: image "${v.src}" not in academy-assets`);
      if (!v.cap) problems.push(`${key}[${i}]: image "${v.src}" has no caption`);
    } else if (v.t === 'svg') {
      nSvg++;
      if (!VISUALS.has(v.id)) problems.push(`${key}[${i}]: unknown interactive "${v.id}"`);
    } else if (v.t === 'table') {
      nTbl++;
      const w = (v.head || []).length;
      (v.rows || []).forEach((r, ri) => {
        if (w && r.length !== w) problems.push(`${key}[${i}]: table row ${ri} has ${r.length} cells, header has ${w}`);
      });
    } else nOther++;
  });
}

fs.writeFileSync(path.join(TOOL, 'academy-study.js'),
  '/* MiniBox Academy — the Study layer.\n' +
  '   Written from PulmOne\'s own 2025 training decks. Every clinical number here traces\n' +
  '   back to a real slide; do not add one that does not. Visuals are either a slide image\n' +
  '   in academy-assets/, a native table, or one of the interactives in academy-visuals.js. */\n' +
  'window.ACADEMY_STUDY = ' + JSON.stringify(study, null, 1) + ';\n');

/* ---- report ---- */
console.log(`modules with study content : ${Object.keys(study).length}`);
console.log(`sections                   : ${nSec}`);
console.log(`  slide images             : ${nImg}`);
console.log(`  native tables            : ${nTbl}`);
console.log(`  interactive graphics     : ${nSvg}`);
console.log(`  steps / vs / none        : ${nOther}`);
console.log(`quiz modules               : ${Object.keys(quiz).length}`);
if (missing.length) console.log(`\nSTILL MISSING: ${missing.join(', ')}`);
if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`);
  problems.forEach(p => console.log('  ! ' + p));
} else console.log('\nvalidation clean');

const unused = [...assets].filter(a => {
  return !Object.values(study).some(m => (m.sections || []).some(s => s.visual && s.visual.t === 'img' && s.visual.src === a));
});
console.log(`\nassets on disk: ${assets.size}, referenced: ${assets.size - unused.length}, unused: ${unused.length}`);
