// Rebuilds slide-7.png only: the calculator giveaway CTA with a real app screenshot.
// Run: node make-slide7.mjs   (screenshot source: billing-helper-shot.png in this folder)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const dir = path.dirname(fileURLToPath(import.meta.url));
const logo = fs.readFileSync(path.join(dir, 'pulmone-logo.png')).toString('base64');
const LOGO = `data:image/png;base64,${logo}`;
const shot = fs.readFileSync(path.join(dir, 'billing-helper-shot.png')).toString('base64');
const SHOT = `data:image/png;base64,${shot}`;

const BLUE = '#00AEEF';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1080px;height:1350px;overflow:hidden}
  body{font-family:'Segoe UI',Arial,sans-serif;position:relative;background:${BLUE};color:#fff}
</style></head><body>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:70px 74px 64px">
    <div style="background:#fff;border-radius:22px;padding:26px 38px;align-self:flex-start"><img src="${LOGO}" style="height:84px;display:block"></div>
    <h1 style="font-family:'Segoe UI Black','Segoe UI',Arial,sans-serif;font-weight:900;font-size:86px;line-height:1.08;letter-spacing:-0.015em;margin-top:52px">Want our PFT<br>coding calculator?</h1>
    <div style="flex:1;display:flex;align-items:center;gap:56px;min-height:0;margin-top:20px">
      <div style="flex:1;display:flex;flex-direction:column;gap:46px">
        <div style="font-size:46px;line-height:1.5;font-weight:400">Comment <span style="background:#fff;color:#0077A8;font-weight:900;padding:6px 30px;border-radius:16px;white-space:nowrap">CODES</span> and we'll DM you the link. Free.</div>
        <div style="font-size:33px;line-height:1.55;color:#DFF4FE;font-weight:400">Check off the tests you ran. It builds the claim, and codes that can't go together grey out as you go.</div>
      </div>
      <div style="flex-shrink:0;width:350px;border-radius:30px;overflow:hidden;box-shadow:0 30px 80px rgba(0,40,60,.45);border:9px solid #fff;background:#fff">
        <img src="${SHOT}" style="width:100%;display:block">
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;border-top:4px solid rgba(255,255,255,.4);padding-top:34px;margin-top:26px">
      <span style="font-size:34px;font-weight:700">PFT Payday &middot; every Tuesday</span>
      <span style="font-size:34px;font-weight:600;font-style:italic">PFT Outside The Box</span>
    </div>
  </div>
</body></html>`;

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const tmpProfile = path.join(dir, 'edge-profile');
const f = path.join(dir, 'slide-7.html');
fs.writeFileSync(f, html);
const out = path.join(dir, 'slide-7.png');
execFileSync(edge, [
  '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${tmpProfile}`, '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1080,1350', `--screenshot=${out}`, `file:///${f.replace(/\\/g, '/')}`
], { stdio: 'pipe', timeout: 60000 });
console.log('rendered', path.basename(out));
