/* MiniBox Academy — hand-built interactive visuals.
   Every one of these is drawn live as SVG or DOM, so it stays sharp at any size and can be
   poked at. Slide screenshots are used elsewhere; these are the ones where MOVING the thing
   is what teaches it.

   Each entry in ACADEMY_VIS is { html(), init(root) }. The study renderer calls html() to
   place it and then init() once it is in the document. */
(function () {
  'use strict';

  var VIS = {};

  /* ---------------------------------------------------------------- helpers */
  function el(root, sel) { return root.querySelector(sel); }
  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  /* Runs fn(progress 0..1) each frame for ms, then fn(1). */
  function animate(ms, fn) {
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / ms);
      fn(ease(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =================================================================
     1. SPIROGRAM — the four volumes and four capacities
     A real breathing trace. Tap a volume or capacity and it lights up
     on the trace with its definition. This is the foundational picture
     of lung function and it deserves to be touchable.
     ================================================================= */

  // Litres. These are the textbook reference values used on the source slide.
  var LV = { RV: 1.5, ERV: 1.5, VT: 0.5, IRV: 2.5 };
  var LEVEL = {
    zero: 0,
    rv: LV.RV,                                  // 1.5  bottom of a maximal exhale
    frc: LV.RV + LV.ERV,                        // 3.0  resting end-expiration
    tidalTop: LV.RV + LV.ERV + LV.VT,           // 3.5  top of a normal breath
    tlc: LV.RV + LV.ERV + LV.VT + LV.IRV        // 6.0  completely full
  };

  var BANDS = {
    VT:  { lo: LEVEL.frc,  hi: LEVEL.tidalTop, label: 'Tidal volume (V<tspan baseline-shift="sub" font-size="9">T</tspan>)', name: 'Tidal volume', v: '500 mL',
           def: 'The air you move in and out on one normal, relaxed breath. You are doing it right now without thinking about it.' },
    IRV: { lo: LEVEL.tidalTop, hi: LEVEL.tlc, label: 'IRV', name: 'Inspiratory reserve volume', v: '2500 mL',
           def: 'The extra air you could still pull in at the top of a normal breath if you really tried. It is your reserve on the way in.' },
    ERV: { lo: LEVEL.rv, hi: LEVEL.frc, label: 'ERV', name: 'Expiratory reserve volume', v: '1500 mL',
           def: 'The extra air you could still push out after a normal breath out. Your reserve on the way out.' },
    RV:  { lo: LEVEL.zero, hi: LEVEL.rv, label: 'RV', name: 'Residual volume', v: '1500 mL',
           def: 'The air that is always left behind, even after you blow out as hard as you possibly can. You can never empty your lungs completely, and this is the reason spirometry alone cannot measure total lung size.' },
    IC:  { lo: LEVEL.frc, hi: LEVEL.tlc, label: 'IC', name: 'Inspiratory capacity', v: '3000 mL', cap: true,
           def: 'Everything you can breathe in starting from a relaxed breath out. It is tidal volume plus the inspiratory reserve.' },
    FRC: { lo: LEVEL.zero, hi: LEVEL.frc, label: 'FRC', name: 'Functional residual capacity', v: '3000 mL', cap: true,
           def: 'What is still sitting in your chest after a relaxed breath out. This is the one plethysmography actually measures, and everything else is derived from it.' },
    VC:  { lo: LEVEL.rv, hi: LEVEL.tlc, label: 'VC', name: 'Vital capacity', v: '4500 mL', cap: true,
           def: 'The biggest breath you can move, from completely full down to completely empty. This is what a spirometer can see.' },
    TLC: { lo: LEVEL.zero, hi: LEVEL.tlc, label: 'TLC', name: 'Total lung capacity', v: '6000 mL', cap: true,
           def: 'Everything your lungs hold when completely full. Vital capacity plus the residual volume you can never blow out.' }
  };

  VIS.spirogram = {
    html: function () {
      return '' +
        '<div class="vis vis-spiro">' +
          '<svg viewBox="0 0 700 380" class="vis-svg" role="img" aria-label="Spirogram of lung volumes and capacities">' +
            '<g class="sp-grid"></g>' +
            '<g class="sp-bands"></g>' +
            '<path class="sp-trace" d=""/>' +
            '<g class="sp-marks"></g>' +
          '</svg>' +
          '<div class="vis-pills">' +
            '<span class="vis-pills-lab">Volumes</span>' +
            '<button data-b="VT">V<sub>T</sub></button><button data-b="IRV">IRV</button>' +
            '<button data-b="ERV">ERV</button><button data-b="RV">RV</button>' +
          '</div>' +
          '<div class="vis-pills">' +
            '<span class="vis-pills-lab">Capacities</span>' +
            '<button data-b="IC" class="cap">IC</button><button data-b="FRC" class="cap">FRC</button>' +
            '<button data-b="VC" class="cap">VC</button><button data-b="TLC" class="cap">TLC</button>' +
          '</div>' +
          '<div class="vis-read" aria-live="polite"></div>' +
        '</div>';
    },
    init: function (root) {
      var svg = el(root, '.sp-trace').ownerSVGElement;
      var W = 700, H = 380, PADL = 46, PADR = 130, PADB = 34, PADT = 14;
      var plotW = W - PADL - PADR, plotH = H - PADT - PADB;
      var maxV = 6.6;
      function y(v) { return PADT + plotH - (v / maxV) * plotH; }
      function x(t) { return PADL + t * plotW; }

      // Axis and gridlines every litre.
      var grid = '';
      for (var v = 0; v <= 6; v++) {
        grid += '<line x1="' + PADL + '" y1="' + y(v) + '" x2="' + (PADL + plotW) + '" y2="' + y(v) + '" class="sp-gl"/>';
        grid += '<text x="' + (PADL - 8) + '" y="' + (y(v) + 4) + '" class="sp-ax">' + v + '</text>';
      }
      grid += '<text x="14" y="' + (PADT + plotH / 2) + '" class="sp-axt" transform="rotate(-90 14 ' + (PADT + plotH / 2) + ')">Volume (L)</text>';
      grid += '<text x="' + (PADL + plotW / 2) + '" y="' + (H - 6) + '" class="sp-axt">Time</text>';
      el(root, '.sp-grid').innerHTML = grid;

      /* The trace: three tidal breaths, a maximal inhale to TLC, a maximal exhale to RV,
         then back to quiet breathing. Built from smooth cubic segments. */
      var pts = [];
      function breathe(t0, t1, lo, hi) { pts.push([t0, lo], [(t0 + t1) / 2, hi], [t1, lo]); }
      breathe(0.02, 0.12, LEVEL.frc, LEVEL.tidalTop);
      breathe(0.12, 0.22, LEVEL.frc, LEVEL.tidalTop);
      breathe(0.22, 0.32, LEVEL.frc, LEVEL.tidalTop);
      pts.push([0.42, LEVEL.tlc]);      // maximal inspiration
      pts.push([0.56, LEVEL.rv]);       // maximal expiration
      pts.push([0.66, LEVEL.frc]);      // back to resting
      breathe(0.66, 0.76, LEVEL.frc, LEVEL.tidalTop);
      breathe(0.76, 0.86, LEVEL.frc, LEVEL.tidalTop);

      var d = 'M' + x(pts[0][0]) + ',' + y(pts[0][1]);
      for (var i = 1; i < pts.length; i++) {
        var p0 = pts[i - 1], p1 = pts[i];
        var cx = (x(p0[0]) + x(p1[0])) / 2;
        d += ' C' + cx + ',' + y(p0[1]) + ' ' + cx + ',' + y(p1[1]) + ' ' + x(p1[0]) + ',' + y(p1[1]);
      }
      var trace = el(root, '.sp-trace');
      trace.setAttribute('d', d);

      // Draw the trace on once, so the eye follows a breath rather than meeting a finished chart.
      var len = trace.getTotalLength();
      trace.style.strokeDasharray = len;
      trace.style.strokeDashoffset = len;
      animate(1600, function (t) { trace.style.strokeDashoffset = len * (1 - t); });

      var bandsG = el(root, '.sp-bands');
      var marksG = el(root, '.sp-marks');
      var read = el(root, '.vis-read');
      var current = null;

      function show(key) {
        var b = BANDS[key];
        current = key;
        all(root, '.vis-pills button').forEach(function (btn) {
          btn.classList.toggle('on', btn.getAttribute('data-b') === key);
        });

        var top = y(b.hi), bot = y(b.lo);
        bandsG.innerHTML = '<rect x="' + PADL + '" y="' + top + '" width="' + plotW + '" height="' + (bot - top) +
          '" class="sp-band' + (b.cap ? ' cap' : '') + '"/>';

        // Measuring bracket out to the right of the trace.
        var bx = PADL + plotW + 26;
        marksG.innerHTML = '' +
          '<line x1="' + PADL + '" y1="' + top + '" x2="' + bx + '" y2="' + top + '" class="sp-tick"/>' +
          '<line x1="' + PADL + '" y1="' + bot + '" x2="' + bx + '" y2="' + bot + '" class="sp-tick"/>' +
          '<line x1="' + bx + '" y1="' + top + '" x2="' + bx + '" y2="' + bot + '" class="sp-arrow' + (b.cap ? ' cap' : '') + '"/>' +
          '<text x="' + (bx + 9) + '" y="' + ((top + bot) / 2 - 2) + '" class="sp-lab' + (b.cap ? ' cap' : '') + '">' + b.label + '</text>' +
          '<text x="' + (bx + 9) + '" y="' + ((top + bot) / 2 + 13) + '" class="sp-val">' + b.v + '</text>';

        // Animate the bracket growing from the middle so the eye lands on the span.
        var arrow = marksG.querySelector('.sp-arrow');
        var mid = (top + bot) / 2;
        animate(280, function (t) {
          arrow.setAttribute('y1', lerp(mid, top, t));
          arrow.setAttribute('y2', lerp(mid, bot, t));
        });

        read.innerHTML = '<b>' + b.name + '</b> <span class="vis-read-v">' + b.v + '</span><br>' + b.def;
      }

      all(root, '.vis-pills button').forEach(function (btn) {
        btn.addEventListener('click', function () { show(btn.getAttribute('data-b')); });
      });
      setTimeout(function () { if (!current) show('VT'); }, 1500);
    }
  };

  /* =================================================================
     2. FLOW VOLUME LOOP — morphing between patterns
     The single most useful shape in this whole business. Seeing the
     normal loop actually deform into the scooped obstructive one
     lands in a way that four separate static pictures never do.
     ================================================================= */

  var LOOPS = {
    normal: {
      name: 'Normal', fvc: 5.0, pef: 9.4, k: 1.06, pif: 5.6, flatE: 0, flatI: 0,
      note: 'A sharp peak early, then a straight, steady fall back to zero. The expiratory limb is a clean triangle. That straight line is what normal looks like.'
    },
    obstructive: {
      name: 'Obstructive', fvc: 3.7, pef: 6.2, k: 3.0, pif: 4.9, flatE: 0, flatI: 0,
      note: 'The peak still happens, then flow collapses and the curve scoops inward. Air is getting trapped on the way out, so the tail drags along the axis. This scooped shape is the signature of asthma and COPD.'
    },
    restrictive: {
      name: 'Restrictive', fvc: 2.5, pef: 7.2, k: 1.02, pif: 4.2, flatE: 0, flatI: 0,
      note: 'The shape is right but the whole loop is small and narrow. Flow is fine, there is simply less air to move. The lungs cannot expand properly, so the loop is squeezed from the sides.'
    },
    upper: {
      name: 'Fixed upper airway', fvc: 4.5, pef: 4.0, k: 1.1, pif: 3.6, flatE: 3.6, flatI: 3.3,
      note: 'Both limbs flatten into plateaus, top and bottom. A fixed narrowing in the trachea or larynx caps how fast air can move in either direction, which is why the loop turns into a box.'
    }
  };

  var NPT = 90;

  // Sample one half of the loop into NPT points so every pattern morphs point for point.
  function loopPoints(cfg) {
    var pts = [], i, t, v, f;
    var vp = 0.12 * cfg.fvc;                     // volume at which peak flow happens
    for (i = 0; i < NPT; i++) {                  // expiratory limb, left to right
      t = i / (NPT - 1);
      v = t * cfg.fvc;
      if (v <= vp) f = cfg.pef * Math.pow(v / vp, 0.65);
      else f = cfg.pef * Math.pow(1 - (v - vp) / (cfg.fvc - vp), cfg.k);
      if (cfg.flatE) f = Math.min(f, cfg.flatE);
      pts.push([v, f]);
    }
    for (i = 0; i < NPT; i++) {                  // inspiratory limb, right back to left
      t = i / (NPT - 1);
      v = cfg.fvc * (1 - t);
      f = -cfg.pif * Math.sin(Math.PI * (1 - v / cfg.fvc) * 0.5 + 0.35) * Math.sin(Math.PI * (v / cfg.fvc) * 0.75 + 0.5);
      f = -Math.abs(f);
      if (cfg.flatI) f = Math.max(f, -cfg.flatI);
      pts.push([v, f]);
    }
    return pts;
  }

  VIS.fvloop = {
    html: function () {
      return '' +
        '<div class="vis vis-loop">' +
          '<svg viewBox="0 0 640 400" class="vis-svg" role="img" aria-label="Flow volume loop">' +
            '<g class="fl-grid"></g>' +
            '<path class="fl-ghost" d=""/>' +
            '<path class="fl-path" d=""/>' +
          '</svg>' +
          '<div class="vis-pills">' +
            '<button data-l="normal" class="on">Normal</button>' +
            '<button data-l="obstructive">Obstructive</button>' +
            '<button data-l="restrictive">Restrictive</button>' +
            '<button data-l="upper">Upper airway</button>' +
          '</div>' +
          '<label class="vis-check"><input type="checkbox" class="fl-ghost-on" checked> Keep the normal loop behind for comparison</label>' +
          '<div class="vis-read" aria-live="polite"></div>' +
        '</div>';
    },
    init: function (root) {
      var W = 640, H = 400, PADL = 52, PADR = 18, PADT = 16, PADB = 40;
      var plotW = W - PADL - PADR, plotH = H - PADT - PADB;
      var maxV = 5.6, maxF = 10.5, minF = -7;
      function x(v) { return PADL + (v / maxV) * plotW; }
      function y(f) { return PADT + ((maxF - f) / (maxF - minF)) * plotH; }

      var grid = '';
      for (var f = -6; f <= 10; f += 2) {
        grid += '<line x1="' + PADL + '" y1="' + y(f) + '" x2="' + (PADL + plotW) + '" y2="' + y(f) + '" class="fl-gl' + (f === 0 ? ' zero' : '') + '"/>';
        grid += '<text x="' + (PADL - 8) + '" y="' + (y(f) + 4) + '" class="sp-ax">' + f + '</text>';
      }
      for (var v = 0; v <= 5; v++) {
        grid += '<line x1="' + x(v) + '" y1="' + PADT + '" x2="' + x(v) + '" y2="' + (PADT + plotH) + '" class="fl-gl v"/>';
        grid += '<text x="' + x(v) + '" y="' + (PADT + plotH + 18) + '" class="sp-ax mid">' + v + '</text>';
      }
      grid += '<text x="16" y="' + (PADT + plotH / 2) + '" class="sp-axt" transform="rotate(-90 16 ' + (PADT + plotH / 2) + ')">Flow (L/s)</text>';
      grid += '<text x="' + (PADL + plotW / 2) + '" y="' + (H - 6) + '" class="sp-axt">Volume (L)</text>';
      grid += '<text x="' + (PADL + 8) + '" y="' + (y(9.6)) + '" class="fl-side">expiration</text>';
      grid += '<text x="' + (PADL + 8) + '" y="' + (y(-6.2)) + '" class="fl-side">inspiration</text>';
      el(root, '.fl-grid').innerHTML = grid;

      function toPath(pts) {
        var d = 'M' + x(pts[0][0]).toFixed(1) + ',' + y(pts[0][1]).toFixed(1);
        for (var i = 1; i < pts.length; i++) d += 'L' + x(pts[i][0]).toFixed(1) + ',' + y(pts[i][1]).toFixed(1);
        return d + 'Z';
      }

      var path = el(root, '.fl-path');
      var ghost = el(root, '.fl-ghost');
      var read = el(root, '.vis-read');
      var normalPts = loopPoints(LOOPS.normal);
      ghost.setAttribute('d', toPath(normalPts));

      var currentPts = normalPts.map(function (p) { return p.slice(); });
      path.setAttribute('d', toPath(currentPts));
      read.innerHTML = '<b>Normal</b><br>' + LOOPS.normal.note;

      function morphTo(key) {
        var target = loopPoints(LOOPS[key]);
        var from = currentPts.map(function (p) { return p.slice(); });
        animate(520, function (t) {
          for (var i = 0; i < target.length; i++) {
            currentPts[i][0] = lerp(from[i][0], target[i][0], t);
            currentPts[i][1] = lerp(from[i][1], target[i][1], t);
          }
          path.setAttribute('d', toPath(currentPts));
        });
        read.innerHTML = '<b>' + LOOPS[key].name + '</b><br>' + LOOPS[key].note;
      }

      all(root, '.vis-pills button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          all(root, '.vis-pills button').forEach(function (b) { b.classList.remove('on'); });
          btn.classList.add('on');
          morphTo(btn.getAttribute('data-l'));
        });
      });
      el(root, '.fl-ghost-on').addEventListener('change', function () {
        ghost.style.display = this.checked ? '' : 'none';
      });
    }
  };

  /* =================================================================
     3. THE THREE GATES — the house interpretation framework
     Airflow, then lung size, then gas transfer. Same three gates the
     PFT Report Studio and Boxy use, so a rep hears one story everywhere.
     ================================================================= */

  var GATES = [
    { n: '01', t: 'Airflow', q: 'Is air getting out?', m: 'FEV<sub>1</sub>/FVC against the lower limit of normal',
      yes: { l: 'At or above LLN', r: 'No obstruction. Move to gate 2.' },
      no:  { l: 'Below LLN', r: 'Obstruction. Air is getting stuck on the way out.' },
      why: 'This is always the first question, because obstruction changes how you read everything after it. One ratio, one decision.' },
    { n: '02', t: 'Lung size', q: 'Are the lungs the right size?', m: 'TLC against the lower limit of normal',
      yes: { l: 'At or above LLN', r: 'Normal lung size. Move to gate 3.' },
      no:  { l: 'Below LLN', r: 'Restriction. The lungs cannot expand to a normal volume.' },
      why: 'Spirometry alone cannot answer this, because it cannot see the air left behind after a maximal exhale. This is exactly the gate that needs lung volumes, and it is the gate a spirometer-only practice is guessing at.' },
    { n: '03', t: 'Gas transfer', q: 'Is oxygen crossing into the blood?', m: 'DLCO against the lower limit of normal',
      yes: { l: 'At or above LLN', r: 'The membrane is doing its job.' },
      no:  { l: 'Below LLN', r: 'Gas transfer is impaired. This is what separates emphysema from asthma, and interstitial disease from a chest wall problem.' },
      why: 'Gate 3 is the tie breaker. Two patients can have identical spirometry and completely different disease, and DLCO is what tells them apart.' }
  ];

  VIS.gates = {
    html: function () {
      var h = '<div class="vis vis-gates">';
      GATES.forEach(function (g, i) {
        h += '<button class="gate" data-g="' + i + '">' +
               '<span class="gate-n">' + g.n + '</span>' +
               '<span class="gate-b"><span class="gate-t">' + g.t + '</span>' +
               '<span class="gate-q">' + g.q + '</span></span>' +
               '<span class="gate-chev">+</span>' +
             '</button>' +
             '<div class="gate-body" data-b="' + i + '">' +
               '<div class="gate-m">Measured by ' + g.m + '</div>' +
               '<div class="gate-row ok"><b>' + g.yes.l + '</b><span>' + g.yes.r + '</span></div>' +
               '<div class="gate-row no"><b>' + g.no.l + '</b><span>' + g.no.r + '</span></div>' +
               '<div class="gate-why">' + g.why + '</div>' +
             '</div>';
      });
      return h + '</div>';
    },
    init: function (root) {
      all(root, '.gate').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var i = btn.getAttribute('data-g');
          var body = el(root, '.gate-body[data-b="' + i + '"]');
          var open = body.classList.toggle('on');
          btn.classList.toggle('on', open);
          btn.querySelector('.gate-chev').textContent = open ? '−' : '+';
        });
      });
      el(root, '.gate').click();
    }
  };

  /* =================================================================
     4. COMPARTMENT BARS — where the air actually sits
     Same total-lung-capacity story as the slide bar chart, but animated,
     so you watch the residual volume swell in obstruction.
     ================================================================= */

  var COMPART = {
    normal:      { name: 'Normal',      IRV: 2.5, VT: 0.5, ERV: 1.5, RV: 1.5,
                   note: 'The reference shape. Total lung capacity of six litres, split the way a healthy chest splits it.' },
    obstructive: { name: 'Obstructive', IRV: 1.7, VT: 0.5, ERV: 0.9, RV: 3.4,
                   note: 'Total lung capacity is normal or even bigger, but look where the air went. Residual volume has ballooned because air is trapped behind narrowed airways, and it crowds out the room available for a useful breath. This is hyperinflation.' },
    restrictive: { name: 'Restrictive', IRV: 1.3, VT: 0.4, ERV: 0.9, RV: 1.1,
                   note: 'Everything shrinks together. Total lung capacity is genuinely reduced, and every compartment is smaller than it should be. The lungs simply cannot get big.' }
  };
  var ORDER = [
    { k: 'IRV', c: 'c-irv', l: 'IRV' }, { k: 'VT', c: 'c-vt', l: 'V<sub>T</sub>' },
    { k: 'ERV', c: 'c-erv', l: 'ERV' }, { k: 'RV', c: 'c-rv', l: 'RV' }
  ];

  VIS.compartbars = {
    html: function () {
      var h = '<div class="vis vis-comp"><div class="comp-wrap">';
      ['normal', 'obstructive', 'restrictive'].forEach(function (k) {
        h += '<div class="comp-col" data-c="' + k + '"><div class="comp-stack">';
        ORDER.forEach(function (o) {
          h += '<div class="comp-seg ' + o.c + '" data-k="' + o.k + '"><span>' + o.l + '</span></div>';
        });
        h += '</div><div class="comp-name">' + COMPART[k].name + '</div>' +
             '<div class="comp-tlc" data-tlc="' + k + '"></div></div>';
      });
      h += '</div><div class="vis-read"></div></div>';
      return h;
    },
    init: function (root) {
      var SCALE = 34; // pixels per litre
      var read = el(root, '.vis-read');
      all(root, '.comp-col').forEach(function (col) {
        var key = col.getAttribute('data-c'), cfg = COMPART[key];
        var tlc = ORDER.reduce(function (s, o) { return s + cfg[o.k]; }, 0);
        el(col, '[data-tlc="' + key + '"]').textContent = 'TLC ' + tlc.toFixed(1) + ' L';
        all(col, '.comp-seg').forEach(function (seg) {
          var h = cfg[seg.getAttribute('data-k')] * SCALE;
          seg.style.height = '0px';
          animate(700, function (t) { seg.style.height = (h * t).toFixed(1) + 'px'; });
        });
        col.addEventListener('click', function () {
          all(root, '.comp-col').forEach(function (c) { c.classList.remove('on'); });
          col.classList.add('on');
          read.innerHTML = '<b>' + cfg.name + '</b><br>' + cfg.note;
        });
      });
      read.innerHTML = '<b>Tap a column.</b> Each bar is one set of lungs, stacked from the residual volume at the bottom up to a full breath at the top.';
    }
  };

  /* =================================================================
     5. DLCO SINGLE BREATH TIMELINE
     The four steps of the maneuver played out on a volume trace, with
     the breath hold ticking down. Reps have to coach this, so watching
     it run beats reading four bullets about it.
     ================================================================= */

  var DSTEPS = [
    { t: 'Empty out',      p: 'A relaxed, complete exhale all the way down to residual volume. On the MiniBox this is automatic, the machine stops the patient once they are empty.' },
    { t: 'Fill up fast',   p: 'A rapid full inhale to total lung capacity. Speed matters here, and so does going all the way, because a half hearted inhale drags the result down.' },
    { t: 'Hold it',        p: 'Breath hold for about ten seconds. While they hold, carbon monoxide crosses into the blood while the tracer gas just dilutes. The gap between the two is the measurement.' },
    { t: 'Let it out',     p: 'A smooth, unforced exhale. The first part is discarded to clear the dead space, and the machine samples the alveolar gas that follows.' }
  ];

  VIS.dlcotimeline = {
    html: function () {
      var h = '<div class="vis vis-dlco">' +
        '<svg viewBox="0 0 660 260" class="vis-svg" role="img" aria-label="DLCO single breath maneuver">' +
          '<g class="dl-grid"></g><path class="dl-trace" d=""/><path class="dl-done" d=""/>' +
          '<g class="dl-zones"></g><circle class="dl-dot" r="7" cx="0" cy="0"/>' +
          '<text class="dl-timer" x="330" y="42"></text>' +
        '</svg>' +
        '<div class="vis-pills"><button class="dl-play">Play the maneuver</button>' +
        '<span class="dl-count"></span></div><div class="dl-steps">';
      DSTEPS.forEach(function (s, i) {
        h += '<div class="dl-step" data-s="' + i + '"><b>' + (i + 1) + '. ' + s.t + '</b><span>' + s.p + '</span></div>';
      });
      return h + '</div></div>';
    },
    init: function (root) {
      var W = 660, H = 260, PADL = 40, PADR = 20, PADT = 52, PADB = 30;
      var plotW = W - PADL - PADR, plotH = H - PADT - PADB;
      function x(t) { return PADL + t * plotW; }
      function y(v) { return PADT + plotH - (v / 6.4) * plotH; }

      var g = '';
      for (var v = 0; v <= 6; v += 2) {
        g += '<line x1="' + PADL + '" y1="' + y(v) + '" x2="' + (PADL + plotW) + '" y2="' + y(v) + '" class="sp-gl"/>';
        g += '<text x="' + (PADL - 8) + '" y="' + (y(v) + 4) + '" class="sp-ax">' + v + '</text>';
      }
      el(root, '.dl-grid').innerHTML = g;

      /* Key frames of the maneuver as (time 0..1, volume L). Tidal breathing, down to RV,
         fast up to TLC, a flat ten second hold, then the sampled exhale. */
      var KF = [
        [0.00, 3.0], [0.05, 3.5], [0.10, 3.0], [0.15, 3.5], [0.20, 3.0],
        [0.30, 1.2],                 // step 1, relaxed exhale to residual volume
        [0.38, 6.0],                 // step 2, rapid inhale to TLC
        [0.72, 6.0],                 // step 3, the breath hold
        [0.92, 1.3],                 // step 4, smooth exhale
        [1.00, 2.9]
      ];
      var d = 'M' + x(KF[0][0]) + ',' + y(KF[0][1]);
      for (var i = 1; i < KF.length; i++) {
        var a = KF[i - 1], b = KF[i], cx = (x(a[0]) + x(b[0])) / 2;
        d += ' C' + cx + ',' + y(a[1]) + ' ' + cx + ',' + y(b[1]) + ' ' + x(b[0]) + ',' + y(b[1]);
      }
      var trace = el(root, '.dl-trace'), done = el(root, '.dl-done');
      trace.setAttribute('d', d); done.setAttribute('d', d);

      // Shade the discard and sample windows on the exhale.
      el(root, '.dl-zones').innerHTML =
        '<rect x="' + x(0.72) + '" y="' + PADT + '" width="' + (x(0.82) - x(0.72)) + '" height="' + plotH + '" class="dl-zone discard"/>' +
        '<text x="' + x(0.77) + '" y="' + (PADT + 14) + '" class="dl-zt">discard</text>' +
        '<rect x="' + x(0.82) + '" y="' + PADT + '" width="' + (x(0.90) - x(0.82)) + '" height="' + plotH + '" class="dl-zone sample"/>' +
        '<text x="' + x(0.86) + '" y="' + (PADT + 14) + '" class="dl-zt">sample</text>' +
        '<line x1="' + x(0.38) + '" y1="' + y(6.0) + '" x2="' + x(0.72) + '" y2="' + y(6.0) + '" class="dl-hold"/>';

      var total = done.getTotalLength();
      done.style.strokeDasharray = total;
      var dot = el(root, '.dl-dot'), timer = el(root, '.dl-timer'), count = el(root, '.dl-count');
      var steps = all(root, '.dl-step');

      function reset() {
        done.style.strokeDashoffset = total;
        dot.style.opacity = 0; timer.textContent = ''; count.textContent = '';
        steps.forEach(function (s) { s.classList.remove('on'); });
      }
      reset();

      // Which step is running at a given point along the trace.
      function stepAt(p) {
        if (p < 0.20) return -1;
        if (p < 0.30) return 0;
        if (p < 0.38) return 1;
        if (p < 0.72) return 2;
        return 3;
      }

      var playing = false;
      el(root, '.dl-play').addEventListener('click', function () {
        if (playing) return;
        playing = true; reset(); dot.style.opacity = 1;
        var btn = this; btn.disabled = true;
        var start = null, DUR = 7200;
        function frame(ts) {
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / DUR);
          done.style.strokeDashoffset = total * (1 - p);
          var pt = done.getPointAtLength(total * p);
          dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);

          var si = stepAt(p);
          steps.forEach(function (s, i) { s.classList.toggle('on', i === si); });
          count.textContent = si >= 0 ? 'Step ' + (si + 1) + ' of 4 — ' + DSTEPS[si].t : 'Quiet tidal breathing';

          // Live breath-hold countdown across the plateau.
          if (p >= 0.38 && p <= 0.72) {
            var held = ((p - 0.38) / (0.72 - 0.38)) * 10;
            timer.textContent = 'breath hold  ' + held.toFixed(1) + ' s';
          } else if (p > 0.72) timer.textContent = 'breath hold  10.0 s';
          else timer.textContent = '';

          if (p < 1) requestAnimationFrame(frame);
          else { playing = false; btn.disabled = false; count.textContent = 'Done. One breath, one measurement.'; }
        }
        requestAnimationFrame(frame);
      });

      steps.forEach(function (s) {
        s.addEventListener('click', function () {
          steps.forEach(function (o) { o.classList.remove('on'); });
          s.classList.add('on');
        });
      });
    }
  };

  /* =================================================================
     6. BOYLE'S LAW — why a sealed box can measure trapped air
     Drag the piston. Pressure and volume trade off in front of you,
     and the product stays put. Then the same idea, applied to a chest.
     ================================================================= */

  VIS.boyle = {
    html: function () {
      return '' +
        '<div class="vis vis-boyle">' +
          '<div class="by-stage">' +
            '<div class="by-cyl">' +
              '<div class="by-piston"><span></span></div>' +
              '<div class="by-gas"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
            '</div>' +
            '<div class="by-meters">' +
              '<div class="by-m"><span class="by-lab">Volume</span><b class="by-v"></b></div>' +
              '<div class="by-m"><span class="by-lab">Pressure</span><b class="by-p"></b></div>' +
              '<div class="by-m const"><span class="by-lab">P &times; V</span><b class="by-c"></b></div>' +
            '</div>' +
          '</div>' +
          '<input type="range" class="by-range" min="20" max="100" value="100" aria-label="Compress the gas">' +
          '<div class="by-hint">Drag to squeeze the gas</div>' +
          '<div class="vis-read">Squeeze the same gas into half the space and the pressure doubles. Multiply them together and you always get the same number. That is Boyle\'s law, and it is the entire trick behind plethysmography: seal a patient in a box, have them make a small effort against a closed shutter, measure how the pressure changes, and you can work out the volume of air in their chest, including the air that is trapped and never comes out.</div>' +
        '</div>';
    },
    init: function (root) {
      var range = el(root, '.by-range'), piston = el(root, '.by-piston'), gas = el(root, '.by-gas');
      var vEl = el(root, '.by-v'), pEl = el(root, '.by-p'), cEl = el(root, '.by-c');
      var dots = all(root, '.by-gas i');

      // Randomised but stable dot placement, so the gas looks like gas.
      dots.forEach(function (d, i) {
        d.style.left = (6 + ((i * 37) % 82)) + '%';
        d.style.top = (8 + ((i * 53) % 78)) + '%';
      });

      function render() {
        var pct = +range.value;                 // 20..100 percent of full volume
        var vol = (pct / 100) * 6;              // litres, arbitrary but readable
        var press = 6 / vol;                    // P times V held at 6
        gas.style.height = pct + '%';
        piston.style.bottom = pct + '%';
        vEl.textContent = vol.toFixed(1) + ' L';
        pEl.textContent = press.toFixed(2) + ' atm';
        cEl.textContent = (vol * press).toFixed(1);
        // Crowd the molecules visually as it compresses.
        gas.style.setProperty('--crowd', (100 / pct).toFixed(2));
      }
      range.addEventListener('input', render);
      render();

      // A single slow demo sweep on load, so the idea is shown before it is asked for.
      var startedByUser = false;
      range.addEventListener('pointerdown', function () { startedByUser = true; });
      setTimeout(function () {
        if (startedByUser) return;
        animate(1100, function (t) {
          if (startedByUser) return;
          range.value = String(100 - 55 * Math.sin(t * Math.PI));
          render();
        });
      }, 600);
    }
  };

  window.ACADEMY_VIS = VIS;
})();
