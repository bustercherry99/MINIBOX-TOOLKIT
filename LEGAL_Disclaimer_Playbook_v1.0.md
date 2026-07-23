# MiniBox Outbound Materials — Disclaimer Playbook v1.0

Written 2026-07-22. Research-backed, plain English. **This document is research, not legal advice** — two items below are flagged for a real attorney.

Standing rule this document creates: **every material that leaves a rep's hands (email, print, PDF, QR, copy-to-clipboard) carries the matching disclaimer block below.** New features that send anything outward pick the matching block at build time.

---

## Why (the 60-second version)

Four different bodies of law touch what MiniBox sends out. A disclaimer is strong protection in some of them and weak in others — the honest breakdown:

| Category | The law | Who's on the hook | Does a disclaimer help? |
|---|---|---|---|
| 1. CPT/coding guidance | False Claims Act (treble damages), OIG compliance guidance | The **practice** that submits the claim, always — and billing-adjacent companies have paid their own FCA settlements (Medical Business Service Inc., $1.95M, DOJ N.D. Ga.) | Helps set expectations; does **not** move FCA liability. Accuracy of the content is the real protection. |
| 2. ROI / revenue estimates | FTC advertising substantiation (verified: a "reasonable basis" must exist **before** the claim is made; a specific dollar figure implies you already have support) | The company making the claim | Yes — honestly labeling estimates + stating assumptions is exactly what the FTC framework rewards. This is where disclaimers work best. |
| 3. Financing / Section 179 | NY Commercial Finance Disclosure Law (23 NYCRR 600, in force since Aug 2023, penalties $2k–$10k/violation); IRS circular-230-adjacent caution on tax claims | The financing **provider** for binding offers; "broker" is defined broadly enough to possibly reach a rep who helps with financing paperwork (partially verified — attorney question) | Yes for the tax-advice line; the CFDL question is structural, not fixable by disclaimer. Note: verification **refuted** the claim that equipment leases are automatically covered — true leases are excluded; it depends on deal structure. |
| 4. Device capability claims | FDA — promotional materials, websites, and sales handouts count as regulated "labeling"; off-label/beyond-clearance claims = misbranding (active enforcement: 2025 warning letters incl. a compatibility claim in sales materials) | The **manufacturer/vendor** | **No.** A disclaimer cannot fix an off-label claim. The rule is claim discipline: never describe capability beyond the FDA clearance. |

What disclaimers genuinely do: kill "but you told us…" claims, defeat misunderstanding-based lawsuits, and satisfy the professional standard (OIG's own guidance documents carry a not-legal-advice footnote). What they don't do: shift False Claims Act liability, substitute for having a basis for a dollar figure, or cure an off-label device claim.

---

## The wording blocks

### Universal footer — goes on EVERYTHING outbound
> Provided by PulmOne for general information and education of healthcare professionals. Not medical, billing, coding, legal, or tax advice. Estimates are illustrative only. Verify current payer policy before billing.

### Block 1 — Coding/billing surfaces (Billing Helper, claim sheet, rheum estimator, any email containing CPT/ICD codes)
> CPT and ICD-10 information is provided for general education only. It is not billing, coding, legal, or reimbursement advice, and it is not a guarantee of coverage or payment. Coverage and coding rules vary by payer and plan and change over time. The practice is solely responsible for claims submitted under its own provider number. Verify current CPT, NCCI, and payer policy, and have your billing staff or a certified coder confirm before submitting. CPT® is a registered trademark of the American Medical Association.

### Block 2 — ROI / revenue estimates (calculators, proposals, any email quoting a dollar figure like $151.45/test)
> Revenue figures are illustrative estimates based on national Medicare/Medicaid averages and the stated assumptions. They are not a promise, quote, or projection of your practice's actual results. Actual reimbursement depends on your payer mix, contracts, documentation, coding, patient volume, and collections. Involve your billing staff and financial advisor before making a purchase decision.

### Block 3 — Financing / tax (calculators, financing views, anything mentioning Section 179)
> Payment figures are estimates for illustration only. This is not a financing offer or commitment. All financing is subject to credit approval and the terms of the final agreement with the lender. References to Section 179 or other tax provisions are general information, not tax advice. Consult your tax professional about your own situation.

### Block 4 — Device capability marketing
> For healthcare professionals. Product capabilities described here are as stated in the device's FDA clearance and labeling. Refer to the operator's manual for indications, contraindications, and instructions for use.

### Line 5 — EMR copy path (Interpretation Composer "Copy interpretation")
Append to the copied text (mirrors the existing print footer):
> Draft interpretation for physician review. Not a diagnosis. Physician review and signature required.

### Line 6 — Quote Builder addition
> This quote is an estimate for discussion. Final pricing, taxes, shipping, and terms are set by the executed sales agreement and invoice.

(Plus the universal footer. Quote validity window, e.g. "valid 30 days," is Erik's call.)

---

## Placement map (from the 2026-07-22 code audit)

Already covered — leave alone: Cardiology flip + Evidence view, Reimbursement-tab ROI print path, ROI Calculator v2.1, ROI Proposal Builder v2.5 (both embeds), Financing Calculator v1.1, Rheum Billing Estimator, Billing Helper, Mode-B `roi-send` email template, ACH + credit-card forms (own legal text, separate category).

**Gaps to fix (priority order):**
1. **Quote Builder** — master-file embed (~line 6029 footer, `.q-foot`) AND standalone `MiniBox_Quote_Builder_v1.2.html` (DocuSign-routed). Add Line 6 + universal footer. *Highest priority: signed, priced, zero caveat today.*
2. **Claim sheet (`mbx-claimsheet`, landed 2026-07-22 by parallel session)** — add Block 1 (short form) to the rendered card in `render()` AND the copied text in `asText()`. Current "Dollar rates live in the Billing Helper / verify local MAC" lines are not sufficient.
3. **`MiniBox_ROI_Email_Template_v1.1.html`** — all 4 generated email variants quote $151.45 + CPTs with no hedge. Add Block 2 (short form) above the signature.
4. **Master-file `cardio_followup` email template (~line 11882)** — same fix as #3.
5. **Interpretation Composer copy path (`rhcCopy`, ~line 15005)** — append Line 5 to clipboard text.
6. **Filter & Mouthpiece Pricing** (`materials/MiniBox-Filter-Pricing.html`) — printable price quote, no caveat. Add Line 6 variant + universal footer. **Both copies:** `v3\materials\` and `_deploy_toolkit\materials\`.
7. Lower: Installation Completion Form (no $ or CPT content — universal footer only), PulmSuite One/Two-Pager PDFs (regenerate from source with Block 4; they also assert HIPAA/HITRUST badges — corporate claims, confirm with PulmOne marketing).

Deploy note: master → mirror → sw bump → `node --check` → vercel → offline zip, per CLAUDE.md. Standalone root files have no deploy step but the materials/ files exist in two synced copies.

---

## The two things that genuinely need a real attorney

1. **The coding-guidance content itself** (Billing Helper + claim sheet). This is False Claims Act territory; the disclaimer is the weakest here and content accuracy is everything. A healthcare-compliance attorney reviewing the code pairings/exclusions for an hour or two is the single highest-value legal spend. (OIG's own guidance says its documents are no substitute for counsel.)
2. **NY Commercial Finance Disclosure Law scope**: (a) does a rep who helps a practice fill out financing paperwork meet the reg's broad "broker" definition, and (b) can any toolkit output be read as a binding "specific offer"? One narrow question for a finance-regulatory attorney. Until answered, reps hand over lender contacts and let the lender run the paperwork.

Secondary: whoever handles PulmOne's sales contracts should confirm Line 6 doesn't conflict with the actual sales agreement language.

---

## Sources (key ones)

- FTC Policy Statement Regarding Advertising Substantiation (verified 3-0): ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation
- OIG Compliance Program Guidance for Third-Party Medical Billing Companies (FCA mechanics verified 3-0): oig.hhs.gov/documents/compliance-guidance/805/thirdparty.pdf
- DOJ press release, Medical Business Service Inc. FCA settlement (party + amount verified 3-0): justice.gov/usao-ndga/pr/radiology-billing-company-pay-195-million-resolve-false-claims-act-allegations
- HHS-OIG General Compliance Program Guidance, Nov 2023 (via Sidley/Crowell summaries; unverified detail)
- NY DFS 23 NYCRR 600 reg text + Holland & Knight CFDL analysis (broker breadth 1-0 partial; lease-coverage claim refuted — true leases excluded)
- Covington FDA Advertising & Promotion Enforcement update 2025; FDA warning letters (Insightra — compatibility claims in promo materials as misbranding; unverified detail)
- Abbott cardiovascular coding/coverage pages (real-world Block-1-style vendor language example)

Verification status: 5 claims triple-verified, 3 refuted and excluded or corrected above, 17 found-but-unverified (session limit) — unverified items are marked in context. Finish-verification pass optional after limit reset.
