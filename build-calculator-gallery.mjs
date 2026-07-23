// Builds a self-contained Calculator_Gallery.html with every calculator embedded
// via srcdoc (isolated iframe documents) so previews render on file:// or http.
import fs from 'fs';

const CARDS = [
  { group:'ROI / Revenue Calculators', gsub:'"Plug in daily volume → see annual PFT revenue." The core money conversation.', items:[
    { file:'MiniBox_ROI_Calculator_v2.1.html', title:'ROI Calculator v2.1', meta:'Jun 29 · 49 KB', live:true, latest:true, note:'The current exam-room ROI tool. Clean single-screen: daily volume in, annual reimbursable revenue out.' },
    { file:'MiniBox_ROI_Calculator_v2.0.html', title:'ROI Calculator v2.0', meta:'Apr 29 · 38 KB', note:'The earlier ROI layout — kept for reference in case you preferred its wording or flow.' },
  ]},
  { group:'ROI Proposal Builders', gsub:'The bigger, multi-section version — builds a full printable/emailable proposal, not just a number.', items:[
    { file:'MiniBox_ROI_Proposal_Builder_v2.5.html', title:'ROI Proposal Builder v2.5', meta:'Jun 29 · 72 KB', latest:true, note:'Full proposal generator: practice details, volume, revenue projection, and a formatted output to hand or send.' },
    { file:'MiniBox_ROI_Proposal_Builder_v2.4.html', title:'ROI Proposal Builder v2.4', meta:'Jun 18 · 62 KB', note:'Prior proposal-builder build — reference version.' },
  ]},
  { group:'Financing Calculators', gsub:'Customer-facing monthly-payment options (NewLane) — 12 / 24 / 36 months.', items:[
    { file:'MiniBox_Financing_Calculator_v1.1.html', title:'Financing Calculator v1.1', meta:'Jun 29 · 18 KB', live:true, latest:true, note:'The current financing tool: shows monthly payment sized to stay under the revenue the device generates.' },
    { file:'MiniBox_Financing_Calculator_v1.0.html', title:'Financing Calculator v1.0', meta:'Jun 28 · 8 KB', note:'The first, lighter financing layout — simpler, fewer options.' },
  ]},
  { group:'Quote Builders', gsub:'Build a line-item price quote for the practice. Not currently in the Pulmonology tab.', items:[
    { file:'MiniBox_Quote_Builder_v1.2.html', title:'Quote Builder v1.2', meta:'Jun 30 · 41 KB', latest:true, note:'Latest quote builder — line items, totals, formatted quote output.' },
    { file:'MiniBox_Quote_Builder_v1.1.html', title:'Quote Builder v1.1', meta:'Jun 29 · 41 KB', note:'Prior quote-builder build — reference version.' },
    { file:'MiniBox_Quote_Builder_v1.0.html', title:'Quote Builder v1.0', meta:'Jun 5 · 30 KB', note:'The original quote builder — simplest layout.' },
  ]},
  { group:'Billing / Coding Helper', gsub:'"How to code a PFT" — walks a practice that has never billed PFTs through the exact CPT/ICD codes.', items:[
    { file:'PFT_Billing_Helper_App.html', title:'PFT Billing Helper', meta:'Jun 29 · 102 KB · "How to Code a PFT"', live:true, latest:true, note:'The full interactive coding helper — which CPT codes, how to pair them, what each pays. Already in the tab as "How to Code a PFT."' },
  ]},
];

// Escape a full HTML doc for use inside a double-quoted srcdoc="" attribute.
function esc(s){ return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }

function badges(it){
  let b = '';
  if (it.live)   b += '<span class="badge live">In toolkit now</span>';
  if (it.latest) b += '<span class="badge new">Newest</span>';
  return b;
}

function cardHTML(it){
  const src = fs.readFileSync(it.file, 'utf8');
  return `
      <div class="card" data-label="${it.title}">
        <div class="card-top">
          <input type="checkbox" onchange="pick(this)">
          <div class="t"><h3>${it.title}</h3><div class="meta">${it.meta}</div></div>
          <div class="badges">${badges(it)}</div>
        </div>
        <div class="note">${it.note}</div>
        <div class="frame-wrap"><iframe loading="lazy" srcdoc="${esc(src)}"></iframe><a class="veil" href="${it.file}" target="_blank" title="Open full-screen"></a></div>
        <div class="card-btns"><a class="open" href="${it.file}" target="_blank">&#128065; Open full</a><button class="pickbtn" onclick="togglePick(this)">Pick this</button></div>
      </div>`;
}

function groupHTML(g){
  return `
  <div class="group">
    <div class="group-h"><h2>${g.group}</h2><span class="g-sub">${g.gsub}</span></div>
    <div class="grid">${g.items.map(cardHTML).join('')}
    </div>
  </div>`;
}

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MiniBox+ Calculator Gallery — pick which ones to use</title>
<style>
  :root{ --navy:#0a3d6b; --navy2:#0d4a82; --red:#c0392b; --ink:#12222f; --soft:#5a6b78; --line:#dce4ec; --wash:#eff5fb; --gold:#c98a2b; }
  *{ box-sizing:border-box; }
  body{ margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; color:var(--ink); background:#f4f7fb; }
  header{ background:linear-gradient(180deg,var(--navy),var(--navy2)); color:#fff; padding:26px 28px 22px; }
  header .logo{ display:inline-flex; align-items:center; gap:10px; font-weight:800; font-size:15px; letter-spacing:.02em; opacity:.9; }
  header .logo b{ background:#fff; color:var(--navy); width:30px; height:30px; border-radius:8px; display:grid; place-items:center; font-size:18px; }
  header .logo b i{ color:var(--red); font-style:normal; }
  header h1{ margin:12px 0 6px; font-size:26px; letter-spacing:-.01em; }
  header p{ margin:0; max-width:760px; font-size:14.5px; line-height:1.6; color:#cfe0f0; }
  .wrap{ padding:22px 28px 140px; max-width:1400px; margin:0 auto; }
  .legend{ display:flex; flex-wrap:wrap; gap:16px; margin:6px 0 22px; font-size:12.5px; color:var(--soft); }
  .legend span{ display:inline-flex; align-items:center; gap:6px; }
  .badge{ display:inline-block; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; padding:3px 8px; border-radius:20px; }
  .badge.live{ background:#e5f4ec; color:#0f7a4f; }
  .badge.new{ background:#fdf2e2; color:var(--gold); }
  .group{ margin-top:30px; }
  .group-h{ display:flex; align-items:baseline; gap:12px; border-bottom:2px solid var(--line); padding-bottom:8px; margin-bottom:16px; flex-wrap:wrap; }
  .group-h h2{ margin:0; font-size:18px; color:var(--navy); }
  .group-h .g-sub{ font-size:12.5px; color:var(--soft); }
  .grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(400px,1fr)); gap:18px; }
  .card{ background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden; box-shadow:0 2px 14px rgba(10,61,107,.05); display:flex; flex-direction:column; transition:box-shadow .15s, border-color .15s; }
  .card.picked{ border-color:var(--navy); box-shadow:0 4px 20px rgba(10,61,107,.18); }
  .card-top{ display:flex; align-items:flex-start; gap:10px; padding:13px 15px 11px; }
  .card-top input{ width:20px; height:20px; margin-top:2px; accent-color:var(--navy); cursor:pointer; flex-shrink:0; }
  .card-top .t{ flex:1; min-width:0; }
  .card-top .t h3{ margin:0; font-size:14.5px; color:var(--ink); }
  .card-top .t .meta{ margin-top:3px; font-size:11.5px; color:var(--soft); }
  .card-top .badges{ display:flex; flex-direction:column; gap:4px; align-items:flex-end; }
  .note{ padding:0 15px 11px; font-size:12px; color:var(--soft); line-height:1.5; }
  .frame-wrap{ position:relative; height:280px; margin:0 12px; border:1px solid var(--line); border-radius:9px; overflow:hidden; background:#fff; }
  .frame-wrap iframe{ position:absolute; top:0; left:0; width:1180px; height:800px; border:0; transform:scale(.353); transform-origin:top left; background:#fff; }
  .frame-wrap .veil{ position:absolute; inset:0; cursor:pointer; }
  .card-btns{ display:flex; gap:8px; padding:12px 15px 15px; }
  .card-btns a, .card-btns button{ flex:1; text-align:center; text-decoration:none; font-size:12.5px; font-weight:700; padding:9px 10px; border-radius:9px; cursor:pointer; border:1.5px solid var(--navy); }
  .card-btns a.open{ background:var(--navy); color:#fff; }
  .card-btns button.pickbtn{ background:#fff; color:var(--navy); }
  .card-btns a.open:hover{ filter:brightness(1.08); }
  .pickbar{ position:fixed; left:0; right:0; bottom:0; background:#fff; border-top:2px solid var(--navy); box-shadow:0 -4px 20px rgba(0,0,0,.1); padding:12px 22px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; z-index:50; }
  .pickbar .lbl{ font-weight:800; color:var(--navy); font-size:13px; }
  .pickbar .list{ flex:1; min-width:200px; font-size:12.5px; color:var(--ink); }
  .pickbar .list .empty{ color:var(--soft); }
  .pickbar button{ background:var(--navy); color:#fff; border:0; border-radius:9px; padding:10px 16px; font-weight:800; font-size:13px; cursor:pointer; }
  .pickbar button.ghost{ background:#fff; color:var(--navy); border:1.5px solid var(--navy); }
  .chip{ display:inline-block; background:var(--wash); border:1px solid var(--line); border-radius:20px; padding:3px 11px; margin:2px 5px 2px 0; font-size:12px; }
  .copied{ color:#0f7a4f; font-weight:700; font-size:12px; }
</style>
</head>
<body>
<header>
  <div class="logo"><b>M<i>+</i></b> MiniBox+ Toolkit</div>
  <h1>Calculator Gallery &mdash; pick which ones we use</h1>
  <p>Every calculator and builder in the project, live and interactive below. Click any preview to open it full-screen and actually run it. Tick the box on the ones you want in the Pulmonology tab, then hit <b>Show my picks</b> at the bottom and read them back to me &mdash; I&rsquo;ll wire exactly those in.</p>
</header>
<div class="wrap">
  <div class="legend">
    <span><span class="badge live">In toolkit now</span> already wired into the app</span>
    <span><span class="badge new">Newest</span> latest version of that tool</span>
    <span>&#128065; Click a preview to open it full-screen</span>
  </div>
${CARDS.map(groupHTML).join('\n')}
</div>

<div class="pickbar">
  <span class="lbl">My picks:</span>
  <div class="list" id="pickList"><span class="empty">None yet &mdash; tick the calculators you want.</span></div>
  <button class="ghost" onclick="clearPicks()">Clear</button>
  <button onclick="showPicks()">Show my picks</button>
</div>

<script>
  function cardOf(el){ return el.closest('.card'); }
  function pick(cb){
    var card = cardOf(cb);
    card.classList.toggle('picked', cb.checked);
    var btn = card.querySelector('.pickbtn');
    if (btn) btn.textContent = cb.checked ? 'Picked \\u2713' : 'Pick this';
    render();
  }
  function togglePick(btn){
    var cb = cardOf(btn).querySelector('input[type=checkbox]');
    cb.checked = !cb.checked; pick(cb);
  }
  function render(){
    var picks = [].slice.call(document.querySelectorAll('.card.picked'));
    var list = document.getElementById('pickList');
    if (!picks.length){ list.innerHTML = '<span class="empty">None yet &mdash; tick the calculators you want.</span>'; return; }
    list.innerHTML = picks.map(function(c){ return '<span class="chip">' + c.dataset.label + '</span>'; }).join('');
  }
  function clearPicks(){
    document.querySelectorAll('.card.picked').forEach(function(c){
      c.classList.remove('picked');
      var cb = c.querySelector('input[type=checkbox]'); if (cb) cb.checked = false;
      var b = c.querySelector('.pickbtn'); if (b) b.textContent = 'Pick this';
    });
    render();
  }
  function showPicks(){
    var picks = [].slice.call(document.querySelectorAll('.card.picked')).map(function(c){ return c.dataset.label; });
    if (!picks.length){ alert('Tick at least one calculator first.'); return; }
    var txt = 'Calculators I want in the Pulmonology tab:\\n\\n\\u2022 ' + picks.join('\\n\\u2022 ');
    try {
      navigator.clipboard.writeText(txt);
      var list = document.getElementById('pickList');
      list.insertAdjacentHTML('beforeend', ' <span class="copied">\\u2713 copied — paste this back to me</span>');
      setTimeout(function(){ var s=list.querySelector('.copied'); if(s) s.remove(); }, 4000);
    } catch(e){}
    alert(txt + '\\n\\n(Copied to your clipboard — just paste it back to me in the chat.)');
  }
</script>
</body>
</html>`;

fs.writeFileSync('Calculator_Gallery.html', page);
console.log('Built Calculator_Gallery.html — ' + (page.length/1024).toFixed(0) + ' KB, ' +
  CARDS.reduce((n,g)=>n+g.items.length,0) + ' calculators embedded.');
