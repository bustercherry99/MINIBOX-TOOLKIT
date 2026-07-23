/* Builds materials/ACH-Payment-Authorization.pdf as a BLANK, TRULY FILLABLE PDF.
   Every box below is a real AcroForm field, so the customer can type into it in
   Acrobat / Preview / Chrome / phone mail apps and send it back.

   Rules baked in on purpose (2026-07-23):
     - ships 100% blank: no customer name, no dollar figures, no dates
     - no prices anywhere (rep fills them per deal)
     - wording matches the toolkit's on-screen ACH form word for word

   Run:  node _tools/pdf/build-ach-form-pdf.mjs
   Then: powershell -File v3/build-materials-data.ps1   (re-embeds it for email attach)
*/
import { PDFDocument, StandardFonts, rgb, PDFName, PDFBool } from 'pdf-lib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..', '..', 'v3', 'materials', 'ACH-Payment-Authorization.pdf');

/* PulmOne palette, lifted from the toolkit's CSS vars */
const NAVY   = rgb(0x0a / 255, 0x3d / 255, 0x6b / 255);
const BLUE   = rgb(0x0e / 255, 0x6a / 255, 0xbf / 255);
const LIGHT  = rgb(0xd6 / 255, 0xea / 255, 0xf8 / 255);
const TEXT   = rgb(0x1a / 255, 0x27 / 255, 0x33 / 255);
const GRAY   = rgb(0x5a / 255, 0x6a / 255, 0x7a / 255);
const LINE   = rgb(0xc8 / 255, 0xd0 / 255, 0xd8 / 255);
const AMBER  = rgb(0xe6 / 255, 0x7e / 255, 0x22 / 255);
const AMBERT = rgb(0x8a / 255, 0x4b / 255, 0x10 / 255);
const WASH   = rgb(0xf4 / 255, 0xf6 / 255, 0xf9 / 255);
const WHITE  = rgb(1, 1, 1);

const W = 612, H = 792, M = 42, CW = W - M * 2;

const doc = await PDFDocument.create();
doc.setTitle('ACH Payment Authorization Form');
doc.setAuthor('PulmOne USA Inc.');
doc.setSubject('ACH Payment Authorization - blank fillable form');
doc.setCreator('PulmOne USA Inc.');
doc.setProducer('PulmOne USA Inc.');

const reg = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const form = doc.getForm();

/* Let every viewer build its own field appearances too - some phone mail
   clients ignore the ones we generate. */
form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.True);

const FIELD_OPTS = {
  borderColor: LINE,
  borderWidth: 1,
  backgroundColor: WHITE,
  textColor: TEXT,
};

function txt(page, s, x, y, size, font, color) {
  page.drawText(s, { x, y, size, font: font || reg, color: color || TEXT });
}

/* word-wrap a paragraph, returns the y below the last line */
function para(page, s, x, y, width, size, font, color, lead) {
  const f = font || reg, step = lead || size * 1.45;
  const words = s.split(' ');
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (f.widthOfTextAtSize(test, size) > width && line) {
      txt(page, line, x, y, size, f, color);
      y -= step;
      line = w;
    } else line = test;
  }
  if (line) { txt(page, line, x, y, size, f, color); y -= step; }
  return y;
}

/* Returns the y of the FIELD BOX bottom for the first row under the header,
   already leaving room for that row's little grey label. */
function section(page, label, y) {
  txt(page, label.toUpperCase(), M, y, 9.5, bold, NAVY);
  page.drawRectangle({ x: M, y: y - 6, width: CW, height: 1.6, color: LIGHT });
  return y - 49;
}

let fieldSeq = 0;
function field(page, name, label, x, y, w, opts = {}) {
  const h = opts.h || 24;
  if (label) txt(page, label.toUpperCase(), x, y + h + 5, 7.5, bold, GRAY);
  const f = form.createTextField(`f${++fieldSeq}_${name}`);
  if (opts.multiline) f.enableMultiline();
  f.addToPage(page, { x, y, width: w, height: h, ...FIELD_OPTS });
  f.setFontSize(10.5); // must come after addToPage - that is what creates the /DA entry
  return f;
}

/* ---------------- page 1 ---------------- */
const p1 = doc.addPage([W, H]);
let y = H - 56;

txt(p1, 'P U L M O N E   U S A   —   F I E L D   D O C U M E N T', M, y, 8, bold, BLUE);
y -= 26;
txt(p1, 'ACH Payment Authorization Form', M, y, 21, bold, NAVY);
y -= 17;
txt(p1, 'PulmOne USA Inc. — 444 Madison Avenue, Floor 6, New York, NY 10022', M, y, 9.5, reg, GRAY);
y -= 12;
p1.drawRectangle({ x: M, y, width: CW, height: 2.5, color: NAVY });
y -= 30;

y = section(p1, 'Customer & Date', y);
const COL = (CW - 18) / 2, RX = M + COL + 18;
field(p1, 'date', 'Date (MM/DD/YYYY)', M, y, COL);
field(p1, 'customer', 'Customer / Practice Name', RX, y, COL);
y -= 44;

y = section(p1, 'Purchase Summary', y);
field(p1, 'purchase_price', 'Total Purchase Price (USD)', M, y, COL);
field(p1, 'down_payment_date', 'Down Payment Date', RX, y, COL);
y -= 44;
field(p1, 'down_payment', 'Down Payment Amount (USD)', M, y, COL);
field(p1, 'balance_financed', 'Balance to Finance (USD)', RX, y, COL);
y -= 44;

const C3 = (CW - 36) / 3;
field(p1, 'num_payments', '# of Payments', M, y, C3);
field(p1, 'first_payment_date', 'First Payment Date', M + C3 + 18, y, C3);
txt(p1, 'FREQUENCY', M + (C3 + 18) * 2, y + 29, 7.5, bold, GRAY);
const freq = form.createDropdown(`f${++fieldSeq}_frequency`);
freq.addOptions(['Monthly', 'Quarterly', 'Bi-Weekly', 'Weekly']);
freq.addToPage(p1, { x: M + (C3 + 18) * 2, y, width: C3, height: 24, ...FIELD_OPTS });
freq.setFontSize(10.5);
y -= 34;

txt(p1, 'PAYMENT START TRIGGER', M, y, 7.5, bold, GRAY);
y -= 15;
const startTrigger = form.createRadioGroup(`f${++fieldSeq}_start_trigger`);
startTrigger.addOptionToPage('Specific Dates', p1, { x: M, y: y - 3, width: 13, height: 13, borderColor: LINE, backgroundColor: WHITE });
txt(p1, 'Specific dates listed in the schedule', M + 20, y, 10, reg, TEXT);
startTrigger.addOptionToPage('Post-Install', p1, { x: M + 250, y: y - 3, width: 13, height: 13, borderColor: LINE, backgroundColor: WHITE });
txt(p1, 'Relative to install and training', M + 270, y, 10, reg, TEXT);
y -= 32;

y = section(p1, 'Customer Bank Information', y);
field(p1, 'bank_name', 'Bank Name', M, y, COL);
field(p1, 'bank_address', 'Bank Address', RX, y, COL);
y -= 44;
field(p1, 'routing', 'ABA Routing Number', M, y, COL);
field(p1, 'account', 'Account Number', RX, y, COL);
y -= 44;

/* RE / authorization block */
const reTop = y;
p1.drawRectangle({ x: M, y: y - 62, width: CW, height: 62, color: WASH });
p1.drawRectangle({ x: M, y: y - 62, width: 3.5, height: 62, color: BLUE });
let ry = y - 16;
txt(p1, 'RE:', M + 14, ry, 10, bold, TEXT);
txt(p1, 'ACH by Vendor — PulmOne USA Inc. (address: 444 Madison Avenue, Floor 6, NY, 10022)', M + 36, ry, 10, reg, TEXT);
ry -= 20;
para(p1, 'Please accept this letter as an irrevocable authorization to allow PulmOne USA Inc. as an approved vendor to collect funds from our bank account as the detailed payment schedule shows below:', M + 14, ry, CW - 28, 9.5, reg, TEXT, 13);
y = reTop - 76;

/* install-trigger notice */
p1.drawRectangle({ x: M, y: y - 54, width: CW, height: 54, color: rgb(0xfe / 255, 0xf3 / 255, 0xe2 / 255), borderColor: AMBER, borderWidth: 1.6 });
let ay = y - 18;
txt(p1, 'IMPORTANT — Payment will begin day of install and training.', M + 14, ay, 10, bold, AMBERT);
ay -= 15;
para(p1, 'Do not initiate ACH debit prior to device installation. Payment schedule commences on the day the device is delivered, installed, and training is completed at the customer location.', M + 14, ay, CW - 28, 9, reg, AMBERT, 12);

/* ---------------- page 2 ---------------- */
const p2 = doc.addPage([W, H]);
y = H - 56;
txt(p2, 'ACH Payment Authorization Form', M, y, 13, bold, NAVY);
txt(p2, 'PulmOne USA Inc.', W - M - reg.widthOfTextAtSize('PulmOne USA Inc.', 9.5), y + 2, 9.5, reg, GRAY);
y -= 10;
p2.drawRectangle({ x: M, y, width: CW, height: 2, color: NAVY });
y -= 32;

txt(p2, 'PAYMENT SCHEDULE', M, y, 9.5, bold, NAVY);
p2.drawRectangle({ x: M, y: y - 6, width: CW, height: 1.6, color: LIGHT });
y -= 22;

const NUM_W = 30, DATE_W = 300, AMT_W = CW - NUM_W - DATE_W - 24;
const DATE_X = M + NUM_W + 12, AMT_X = M + NUM_W + DATE_W + 24;
txt(p2, '#', M + 8, y, 7.5, bold, GRAY);
txt(p2, 'MONTH / DATE', DATE_X, y, 7.5, bold, GRAY);
txt(p2, 'AMOUNT (USD)', AMT_X, y, 7.5, bold, GRAY);
y -= 6;

const ROWS = 10;
for (let i = 1; i <= ROWS; i++) {
  const rowY = y - 22;
  txt(p2, String(i), M + 8, rowY + 7, 10, reg, GRAY);
  field(p2, `sched_${i}_when`, '', DATE_X, rowY, DATE_W, { h: 22 });
  field(p2, `sched_${i}_amount`, '', AMT_X, rowY, AMT_W, { h: 22 });
  y = rowY - 4;
}
y -= 16;

/* totals */
p2.drawRectangle({ x: M, y: y - 104, width: CW, height: 104, color: WASH, borderColor: BLUE, borderWidth: 1.6 });
let ty = y - 28;
const LBLX = M + 18, VALW = 170, VALX = W - M - 18 - VALW;
txt(p2, 'Scheduled Payments Subtotal', LBLX, ty + 7, 10, reg, GRAY);
field(p2, 'sched_subtotal', '', VALX, ty, VALW, { h: 22 });
ty -= 30;
txt(p2, 'Down Payment', LBLX, ty + 7, 10, reg, GRAY);
field(p2, 'down_payment_total', '', VALX, ty, VALW, { h: 22 });
ty -= 32;
txt(p2, 'Total Authorized (Grand Total)', LBLX, ty + 8, 11.5, bold, NAVY);
field(p2, 'grand_total', '', VALX, ty, VALW, { h: 24 });
y -= 120;

y = para(p2, 'We request that this irrevocable authorization will be implemented as soon as possible and without any delay. If you have any questions, please contact the undersigned.', M, y, CW, 9.5, reg, GRAY, 13);
y -= 18;

y = section(p2, 'Authorized Signature', y);
const GAP = 16, SPARE = CW - GAP * 3;
const SIG_W = SPARE * 0.34, NAME_W = SPARE * 0.26, TITLE_W = SPARE * 0.18, SDATE_W = SPARE - SIG_W - NAME_W - TITLE_W;
field(p2, 'signature', 'Signature', M, y, SIG_W, { h: 30 });
field(p2, 'printed_name', 'Printed Name', M + SIG_W + GAP, y, NAME_W, { h: 30 });
field(p2, 'title', 'Title', M + SIG_W + NAME_W + GAP * 2, y, TITLE_W, { h: 30 });
field(p2, 'signed_date', 'Date Signed', M + SIG_W + NAME_W + TITLE_W + GAP * 3, y, SDATE_W, { h: 30 });

/* footer on both pages */
const FOOT = 'PulmOne USA Inc.  ·  1-844-PulmOne (785-6663)  ·  USinfo@pulm-one.com  ·  www.pulm-one.com';
for (const p of [p1, p2]) {
  p.drawRectangle({ x: M, y: 54, width: CW, height: 0.8, color: LINE });
  txt(p, FOOT, (W - reg.widthOfTextAtSize(FOOT, 8)) / 2, 40, 8, reg, GRAY);
}

form.updateFieldAppearances(reg);
fs.writeFileSync(OUT, await doc.save());
const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`Wrote ${OUT} (${kb} KB, ${form.getFields().length} fillable fields)`);
