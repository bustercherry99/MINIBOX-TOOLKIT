# MiniBox+ Toolkit — Numbers & Claims to Verify Before Rollout

_Last reviewed: (fill in date) · Applies to: MiniBox_Master_Toolkit_v2.27.html_

This is the trust checklist. One wrong number undoes a great pitch. Confirm each item
below with an authoritative source (CMS fee schedule, the published studies, current
PulmOne pricing) and check it off. **I did not invent or change any clinical or
financial number — these are the existing figures that need a human to confirm.**

---

## 1. Reimbursement rates — NOW IN ONE PLACE ✅

As of v2.27 the core rates live in a single block near the top of the toolkit's
JavaScript: `var MINIBOX_RATES = { ... }`. Edit them there **once** and the CPT
table, the "maximum payout" line, the whole ROI calculator, the per-test grid, and
the on-screen "Rates current as of…" stamp all update automatically.

| What | Current value | Source to confirm |
|------|---------------|-------------------|
| Complete PFT max payout | $151.45 | CMS national average (94010 + 94726 + 94729) |
| 94010 Spirometry | $27.34 | CMS Physician Fee Schedule |
| 94375 Flow Volume Loop | $39.11 | CMS |
| 94060 Pre/Post Bronchodilator | $38.80 | CMS |
| 94726 LVM Plethysmography | $55.72 | CMS |
| 94729 DLCO | $59.87 | CMS |
| Working weeks/year (ROI) | 48 | Internal assumption — confirm it's the one you want |

**After confirming, change `asOf:` in `MINIBOX_RATES` to the new date** (e.g. `'2026'`).
Set a calendar reminder to redo this every January when CMS updates the fee schedule.

## 2. Rate figures still hard-typed in prose (update these BY HAND)

These are baked into sentences, so they are NOT auto-updated by the single source.
Search the file for each and confirm/adjust:

- "**$165,600 per year at 10 patients a day**" (vs-Competition tab) — derived from $55/patient. Re-check the math if 94726 changes.
- "**$55 per patient forfeited**" / "~$55.72" mentions in the Competition tab.
- "**$155**" complete-PFT mention(s) — confirm against the $151.45 figure (they should agree).
- **Rheum Estimator** default reimbursement is `150` (a round placeholder). Confirm that's acceptable or set it to $151.45.
- The **embedded ROI Proposal Builder** and **Quote Builder** (the two iframes in the Forms tab) carry their **own** copies of the rates. They come from the standalone files `MiniBox_ROI_Proposal_Builder_v2.4.html` and `MiniBox_Quote_Builder_v1.0.html`. Update those source files and re-embed if rates change.

## 3. Clinical claims to confirm

- "**700+ patients across 11 medical centers**, published **CHEST 2021**" — confirm citation is exact.
- "**8.9% MiniBox NSD vs. body box**" (Clinical Proof stat) — confirm from the paper.
- "Validated equivalent to body plethysmography" wording — confirm it matches published conclusions.
- HL7 versions claim ("v2.5.1 native, integrated with v2.3/v2.4") — confirm with engineering.
- "Testable from **age 5**", "**15–20 minute** complete PFT", "**60-second** LVM" — confirm against spec sheet.

## 4. People & Contacts roster

- Roster note says "populated from US Roster.xlsx **v2.24**." Confirm it's current (names, titles, territories, phone/email).

## 5. Legal / compliance lines (already present — confirm wording is approved)

- "CPT coding should be based on medical necessity… Reimbursement subject to specific health plan policy." Confirm Compliance has signed off on this disclaimer everywhere it appears.

---

### How to update rates next year (the 2-minute version)
1. Open `MiniBox_Master_Toolkit_v2.27.html` in a text editor.
2. Find `var MINIBOX_RATES`.
3. Change the numbers and the `asOf:` date.
4. Save. Done — the table, the ROI tool, and the stamp all follow.
5. Update the prose figures in section 2 by hand.
