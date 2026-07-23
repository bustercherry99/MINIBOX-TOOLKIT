#!/usr/bin/env node
/* PFT Suite — put the whole Pattern Library on every pattern page.

   Reported 2026-07-20: reading the Asthma sample and wanting to see COPD next
   meant backing out to the Suite menu and picking again. Six patterns, five
   trips back. So each page now carries the other five across the top: you land
   on one and read straight through the set.

   Self-contained block between the PATTERN-SWITCHER markers — re-running this
   replaces it rather than stacking copies, so it is safe to run any time.

   Plain relative <a href> on purpose: standalone that is a normal link, and
   inside the toolkit the RHPS_SHIM click-catcher intercepts it and swaps the
   iframe. One markup, both worlds.

     node _tools/add-pattern-switcher.mjs

   Then re-inline into the toolkit:  node _tools/build-pft-suite-inline.mjs
*/

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '_deploy_pft_suite');

/* Menu order, matching index.html — normal first, then the two obstructive
   patterns, then the restrictive ones, then mixed. Reading them in this order
   is the lesson, so the strip should not reshuffle it. */
const PATTERNS = [
  { file: 'MiniBox_PFT_Training_Normal_v1.0.html', label: 'Normal' },
  { file: 'MiniBox_PFT_Training_Asthma_v1.0.html', label: 'Asthma' },
  { file: 'MiniBox_PFT_Training_COPD_v1.0.html', label: 'COPD' },
  { file: 'MiniBox_PFT_Training_ILD_v1.0.html', label: 'ILD' },
  { file: 'MiniBox_PFT_Training_ChestWall-Neuromuscular_v1.0.html', label: 'Chest-wall' },
  { file: 'MiniBox_PFT_Training_Mixed_v1.0.html', label: 'Mixed' }
];

const OPEN = '<!-- PATTERN-SWITCHER -->';
const CLOSE = '<!-- /PATTERN-SWITCHER -->';

function block(currentFile) {
  const tabs = PATTERNS.map(function (p) {
    const here = p.file === currentFile;
    return here
      ? '<span class="psw-tab on" aria-current="page">' + p.label + '</span>'
      : '<a class="psw-tab" href="' + p.file + '">' + p.label + '</a>';
  }).join('\n      ');

  return OPEN + `
  <style>
    .psw{display:flex;align-items:center;gap:10px;flex-wrap:wrap;
      padding:11px 20px;background:#f7f9fb;border-bottom:1px solid var(--line)}
    .psw .psw-lab{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
      color:var(--mut);margin-right:2px}
    .psw-tabs{display:flex;gap:6px;flex-wrap:wrap}
    .psw-tab{font-size:12.5px;font-weight:700;text-decoration:none;padding:5px 11px;border-radius:999px;
      border:1px solid var(--line);background:#fff;color:var(--mut);white-space:nowrap}
    .psw-tab:hover{border-color:var(--brand);color:var(--brand)}
    /* Where you are now reads as a state, not something else to click. */
    .psw-tab.on{background:var(--brandsoft);border-color:var(--brand);color:var(--brand);cursor:default}
    @media(max-width:640px){
      .psw{padding:10px 14px;gap:7px}
      .psw .psw-lab{width:100%;margin-bottom:1px}
    }
  </style>
  <nav class="psw" aria-label="Pattern library">
    <span class="psw-lab">Compare with</span>
    <span class="psw-tabs">
      ${tabs}
    </span>
  </nav>
  ` + CLOSE;
}

let changed = 0;
PATTERNS.forEach(function (p) {
  const path = join(ROOT, p.file);
  let html = readFileSync(path, 'utf8');
  const strip = block(p.file);

  const existing = new RegExp(OPEN + '[\\s\\S]*?' + CLOSE);
  if (existing.test(html)) {
    html = html.replace(existing, function () { return strip; });
  } else {
    /* Sits under the teaching banner and above the report itself, so the page
       still opens on "here is what this pattern is" before offering the others. */
    const anchor = '  <!-- REPORT HEADER -->';
    if (html.indexOf(anchor) === -1) {
      console.error('SKIPPED ' + p.file + ' — could not find the report header to sit above.');
      return;
    }
    html = html.replace(anchor, function () { return '  ' + strip + '\n\n' + anchor; });
  }

  writeFileSync(path, html);
  changed++;
  console.log('switcher in place: ' + p.label);
});

console.log('\n' + changed + '/' + PATTERNS.length + ' pattern pages updated.');
if (changed !== PATTERNS.length) process.exitCode = 1;
