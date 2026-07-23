/* Optimize picked deck images into web-ready assets for MiniBox Academy.
   Usage: node optimize.mjs picks.json
   picks.json = [{ "deck":"Minibox_DLCO", "file":"image19.png", "id":"dlco-gas-exchange" }, ...]
   Writes <scratchpad>/assets/<id>.jpg (or .png when transparency matters) and prints a size report. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SP = 'C:\\Users\\erikb\\AppData\\Local\\Temp\\claude\\C--Users-erikb-Documents-Claude-Projects-DRAGONS-WEBSITE\\3c3ff7c3-6d41-4a04-a3ca-beecb0e654fa\\scratchpad';
const MAGICK = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';
const MEDIA = path.join(SP, 'media');
const OUT = path.join(SP, 'assets');

const picks = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

// Slide diagrams carry small text, so they get more pixels than photos do.
const WIDTH = { diagram: 1400, table: 1500, photo: 1100 };
const QUALITY = { diagram: 84, table: 86, photo: 78 };

let total = 0;
const manifest = [];

for (const p of picks) {
  const src = path.join(MEDIA, p.deck, p.file);
  if (!fs.existsSync(src)) { console.log(`MISSING  ${p.deck}/${p.file}`); continue; }

  const kind = (p.kind || 'diagram').toLowerCase();
  const w = WIDTH[kind] || 1400;
  const q = QUALITY[kind] || 84;
  const dst = path.join(OUT, `${p.id}.jpg`);

  // GIFs may hold several frames; only the first is the slide art.
  const srcArg = /\.gif$/i.test(p.file) ? `${src}[0]` : src;

  execFileSync(MAGICK, [
    srcArg,
    '-background', 'white', '-alpha', 'remove', '-alpha', 'off',
    '-resize', `${w}x${w}>`,          // only shrink, never upscale
    '-strip',
    '-interlace', 'Plane',
    '-sampling-factor', '4:2:0',
    '-quality', String(q),
    dst,
  ]);

  const bytes = fs.statSync(dst).size;
  total += bytes;
  const dim = execFileSync(MAGICK, ['identify', '-format', '%wx%h', dst]).toString();
  manifest.push({ id: p.id, file: `${p.id}.jpg`, bytes, dim, src: `${p.deck}/${p.file}` });
  console.log(`${String(Math.round(bytes / 1024)).padStart(5)}KB  ${dim.padEnd(10)}  ${p.id}`);
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} images, ${(total / 1024 / 1024).toFixed(2)} MB total`);
console.log(`base64 inline would be ~${(total * 1.37 / 1024 / 1024).toFixed(2)} MB`);
