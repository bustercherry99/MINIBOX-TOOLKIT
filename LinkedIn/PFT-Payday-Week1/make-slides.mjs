import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const dir = path.dirname(fileURLToPath(import.meta.url));
const logo = fs.readFileSync(path.join(dir, 'embedded-4.png')).toString('base64');
const LOGO = `data:image/png;base64,${logo}`;

const BLUE = '#00AEEF';
const INK = '#2E3538';
const GRAY = '#676766';
const MIST = '#EAF7FD';

const shell = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1080px;height:1350px;overflow:hidden}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:${INK};position:relative}
  .pad{position:absolute;inset:0;padding:80px 84px;display:flex;flex-direction:column}
  .eyebrow{display:inline-flex;align-items:center;gap:14px;background:${MIST};color:#0077A8;font-size:27px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:14px 30px;border-radius:able 999px;border-radius:999px;align-self:flex-start}
  .num{font-size:27px;font-weight:700;color:#fff;background:${BLUE};border-radius:50%;width:46px;height:46px;display:inline-flex;align-items:center;justify-content:center}
  h1{font-family:'Segoe UI Black','Segoe UI',Arial,sans-serif;font-weight:900;letter-spacing:-0.015em}
  .foot{position:absolute;left:84px;right:84px;bottom:56px;display:flex;align-items:center;justify-content:space-between;border-top:4px solid ${MIST};padding-top:30px}
  .foot img{height:64px}
  .foot span{font-size:26px;color:${GRAY};font-weight:600}
  ul{list-style:none}
  ul li{font-size:44px;line-height:1.45;color:#3F4A4E;padding-left:56px;position:relative;margin-bottom:34px;font-weight:400}
  ul li::before{content:'';position:absolute;left:0;top:22px;width:26px;height:26px;border-radius:50%;background:${BLUE}}
  .callout{background:${MIST};border-left:14px solid ${BLUE};border-radius:0 18px 18px 0;padding:38px 44px;font-size:40px;line-height:1.4;font-weight:600;color:#00658F}
</style></head><body>${body}</body></html>`;

const slides = [];

slides.push(shell(`
  <div class="pad" style="padding:0">
    <div style="padding:84px 84px 0;display:flex;justify-content:space-between;align-items:flex-start">
      <img src="${LOGO}" style="height:110px">
      <div style="background:${MIST};color:#0077A8;font-size:27px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:14px 30px;border-radius:999px">PFT Payday · Week 1</div>
    </div>
    <div style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:0 84px">
      <h1 style="font-size:128px;line-height:1.04">Who needs<br>a <span style="color:${BLUE}">PFT?</span></h1>
      <div style="width:180px;height:14px;background:${BLUE};border-radius:7px;margin:44px 0"></div>
      <div style="font-size:46px;color:${GRAY};font-weight:400">The 60-second guide<br>for busy practices</div>
    </div>
    <div style="flex-shrink:0;background:${BLUE};color:#fff;padding:38px 84px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:34px;font-weight:700">One question, every Tuesday</span>
      <span style="font-size:34px;font-weight:700">swipe &#8594;</span>
    </div>
  </div>`));

slides.push(shell(`
  <div class="pad">
    <div style="display:flex;align-items:center;gap:24px"><span class="num">1</span><span class="eyebrow">The obvious ones</span></div>
    <h1 style="font-size:88px;line-height:1.12;margin-top:70px">Known or suspected <span style="color:${BLUE}">COPD and asthma</span></h1>
    <div style="font-size:46px;color:#3F4A4E;line-height:1.5;margin-top:60px">Diagnosis. Staging.<br>Annual follow-up.</div>
    <div class="callout" style="margin-top:auto;margin-bottom:120px">No spirometry, no COPD diagnosis.<br>Full stop.</div>
    <div class="foot"><img src="${LOGO}"><span>2 / 7</span></div>
  </div>`));

slides.push(shell(`
  <div class="pad">
    <div style="display:flex;align-items:center;gap:24px"><span class="num">2</span><span class="eyebrow">The missed ones</span></div>
    <h1 style="font-size:80px;line-height:1.12;margin-top:66px">Already in your <span style="color:${BLUE}">waiting room</span></h1>
    <ul style="margin-top:70px">
      <li>Unexplained shortness of breath</li>
      <li>Chronic cough over 8 weeks</li>
      <li>Smokers and ex-smokers 40+</li>
      <li>Abnormal chest imaging</li>
      <li>Occupational exposures</li>
    </ul>
    <div class="foot"><img src="${LOGO}"><span>3 / 7</span></div>
  </div>`));

slides.push(shell(`
  <div class="pad">
    <div style="display:flex;align-items:center;gap:24px"><span class="num">3</span><span class="eyebrow">The surprising ones</span></div>
    <h1 style="font-size:80px;line-height:1.12;margin-top:66px">Testing you may <span style="color:${BLUE}">not have considered</span></h1>
    <ul style="margin-top:70px">
      <li>Pre-op clearance</li>
      <li>Autoimmune disease with possible lung involvement</li>
      <li>Long-COVID follow-up</li>
      <li>Baseline before lung-toxic medications</li>
    </ul>
    <div class="foot"><img src="${LOGO}"><span>4 / 7</span></div>
  </div>`));

slides.push(shell(`
  <div class="pad">
    <div style="display:flex;align-items:center;gap:24px"><span class="num">4</span><span class="eyebrow">Beyond spirometry</span></div>
    <h1 style="font-size:80px;line-height:1.12;margin-top:66px">When spirometry alone <span style="color:${BLUE}">can't answer it</span></h1>
    <ul style="margin-top:70px">
      <li>Suspected restriction</li>
      <li>Unexplained low FVC</li>
      <li>Any time you need DLCO</li>
    </ul>
    <div class="callout" style="margin-top:auto;margin-bottom:120px">That calls for full PFTs:<br>lung volumes + diffusion.</div>
    <div class="foot"><img src="${LOGO}"><span>5 / 7</span></div>
  </div>`));

slides.push(shell(`
  <div class="pad">
    <div style="display:flex;align-items:center;gap:24px"><span class="num">5</span><span class="eyebrow">The money question</span></div>
    <h1 style="font-size:104px;line-height:1.1;margin-top:80px">Yes — it's <span style="color:${BLUE}">reimbursable</span></h1>
    <div style="font-size:48px;color:#3F4A4E;line-height:1.5;margin-top:64px">Every test on this list has an established CPT code.</div>
    <div style="margin-top:auto;margin-bottom:120px;display:flex;align-items:center;gap:28px">
      <div style="width:70px;height:70px;border-radius:50%;background:${BLUE};color:#fff;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900">&#8594;</div>
      <div style="font-size:42px;font-weight:700;color:#0077A8">The codes, in plain English:<br>next Tuesday</div>
    </div>
    <div class="foot"><img src="${LOGO}"><span>6 / 7</span></div>
  </div>`));

slides.push(shell(`
  <div style="position:absolute;inset:0;background:${BLUE};display:flex;flex-direction:column;padding:84px">
    <div style="background:#fff;border-radius:24px;padding:30px 44px;align-self:flex-start"><img src="${LOGO}" style="height:96px;display:block"></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <h1 style="font-size:112px;line-height:1.08;color:#fff">Want the printable version?</h1>
      <div style="font-size:54px;color:#fff;margin-top:64px;line-height:1.45;font-weight:400">Comment <span style="background:#fff;color:#0077A8;font-weight:900;padding:6px 34px;border-radius:16px">GUIDE</span> and we'll send the clinic-wall cheat sheet.</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;border-top:4px solid rgba(255,255,255,.4);padding-top:36px">
      <span style="font-size:34px;color:#fff;font-weight:700">PFT Payday · every Tuesday</span>
      <span style="font-size:34px;color:#fff;font-weight:600;font-style:italic">PFT Outside The Box</span>
    </div>
  </div>`));

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const tmpProfile = path.join(dir, 'edge-profile');
slides.forEach((html, i) => {
  const f = path.join(dir, `slide-${i + 1}.html`);
  fs.writeFileSync(f, html);
  const out = path.join(dir, `slide-${i + 1}.png`);
  execFileSync(edge, [
    '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${tmpProfile}`, '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1080,1350', `--screenshot=${out}`, `file:///${f.replace(/\\/g, '/')}`
  ], { stdio: 'pipe', timeout: 60000 });
  console.log('rendered', path.basename(out));
});
