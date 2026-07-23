/* build-mtk-icons.mjs — the MTK app icon set.
 *
 * The mark is the SAME geometry as the <script id="mbx-mtk-js"> block in the
 * toolkit: a diamond with MTK inside, drawn as paths so no font has to exist
 * on the machine doing the rendering. Change a coordinate in the toolkit,
 * change it here, re-run.
 *
 *   node _tools\build-mtk-icons.mjs
 *
 * Writes straight into _deploy_toolkit\. Rendered with ImageMagick's librsvg
 * delegate (verified present: RSVG 2.40.20).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MAGICK = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';
const OUT    = 'C:\\Users\\erikb\\Documents\\Claude\\Projects\\MINIBOXSALES TOOL\\_deploy_toolkit';
const TMP    = fs.mkdtempSync(path.join(process.env.TEMP || '.', 'mtk-'));

/* ---- the mark, identical to the toolkit ---- */
const DIA = 'M50 4 L96 50 L50 96 L4 50 Z';
const LTR = [
  'M25 63 L25 37 L33.75 53.5 L42.5 37 L42.5 63',
  'M47.5 37 L60.5 37',
  'M54 37 L54 63',
  'M65.5 37 L65.5 63',
  'M75 37 L65.5 50',
  'M65.5 50 L75 63',
];

/* opts: size, pad (mark inset as % of tile), radius (corner %), wDia, wLtr */
function svg(o) {
  const S = o.size;
  const r = o.radius * S;
  // The 100-unit mark is placed into a square of side `span`, centred.
  const span = S * (1 - 2 * o.pad);
  const off  = S * o.pad;
  const k    = span / 100;

  const P = d => `<path d="${d}"/>`;
  const mark = `
    <g transform="translate(${off} ${off}) scale(${k})" fill="none"
       stroke-linejoin="miter" stroke-linecap="butt" vector-effect="none">
      <g stroke="url(#g)" stroke-width="${o.wDia}">${P(DIA)}</g>
      ${o.wLtr ? `<g stroke="url(#g)" stroke-width="${o.wLtr}">${LTR.map(P).join('')}</g>` : ''}
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <!-- userSpaceOnUse: an objectBoundingBox gradient is not drawn at all on a
         perfectly horizontal or vertical line (zero-area box), which silently
         drops the T and the K stem. Coordinates are in mark space, so they are
         scaled by the same transform as the paths. -->
    <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="96">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".55" stop-color="#d6dee6"/>
      <stop offset="1" stop-color="#8e9aa7"/>
    </linearGradient>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#161b21"/>
      <stop offset="1" stop-color="#06080a"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${S}" height="${S}" rx="${r}" ry="${r}" fill="url(#tile)"/>
  ${o.edge ? `<rect x=".5" y=".5" width="${S - 1}" height="${S - 1}" rx="${Math.max(0, r - .5)}" ry="${Math.max(0, r - .5)}"
        fill="none" stroke="#2a323b" stroke-width="1"/>` : ''}
  ${mark}
</svg>`;
}

/* The favicon drops the letters altogether. Three strokes-wide characters
   inside a diamond inside 32 physical pixels is grey soup — the diamond alone
   is instantly the same mark, and it stays crisp in a browser tab. */
/* PAD is deliberately tiny: the diamond's four points run out to the edges of
   the tile so the black square reads as background, not as a box the mark is
   sitting in. A home-screen icon is always cropped to the OS's own square —
   filling it is the closest we get to the icon simply BEING the diamond.
   The mid-edges are where every mask (iOS squircle included) is widest, so
   the points survive; only the corners get cut, and those are empty. */
const JOBS = [
  { file: 'icon-512.png',          o: { size: 512, pad: .03,  radius: .22, wDia: 3,   wLtr: 3.4, edge: 1 } },
  /* Maskable is the one exception — a launcher may crop to a circle of 80% the
     tile, so the points stay inside that circle (point lands at 12.3% in, i.e.
     37.7% from centre, under the 40% safe radius). Still far bigger than the
     old .26 inset. */
  { file: 'icon-512-maskable.png', o: { size: 512, pad: .09,  radius: 0,   wDia: 3,   wLtr: 3.4, edge: 0 } },
  { file: 'icon-192.png',          o: { size: 192, pad: .03,  radius: .22, wDia: 3.2, wLtr: 3.6, edge: 1 } },
  { file: 'icon-180.png',          o: { size: 180, pad: .03,  radius: .22, wDia: 3.2, wLtr: 3.6, edge: 1 } },
  { file: 'favicon-32.png',        o: { size: 128, pad: .04,  radius: .20, wDia: 5,   wLtr: 0,   edge: 0 }, resize: 32 },
];

for (const j of JOBS) {
  const src = path.join(TMP, j.file.replace('.png', '.svg'));
  fs.writeFileSync(src, svg(j.o), 'utf8');
  const dst = path.join(OUT, j.file);
  const args = ['-background', 'none', src];
  if (j.resize) args.push('-resize', `${j.resize}x${j.resize}`);
  args.push('-strip', dst);
  execFileSync(MAGICK, args, { stdio: 'inherit' });
  console.log('wrote ' + j.file + '  (' + fs.statSync(dst).size + ' bytes)');
}

/* Keep a copy of the master vector next to the app — handy for slides/print. */
fs.writeFileSync(path.join(OUT, 'mtk-mark.svg'),
  svg({ size: 512, pad: .03, radius: .22, wDia: 3, wLtr: 3.4, edge: 1 }), 'utf8');
console.log('wrote mtk-mark.svg');

fs.rmSync(TMP, { recursive: true, force: true });
