# MiniBox Toolkit — What We've Built & What Still Needs to Go In
_Plain-English inventory, June 25, 2026_

## First, the one thing that matters: which file is "live"

There are three copies of the toolkit floating around. Here's which is which so you never get confused again:

| File | What it is | Use it? |
|------|-----------|---------|
| `v3/MiniBox Sales Toolkit (LATEST).html` | **The newest build — 18 tabs.** Updated today. | ✅ This is the master. Everything new goes here first. |
| `_deploy_toolkit/index.html` | The **website copy** (mirror of LATEST, set up for hosting). | ✅ Auto-gets the update when we publish. |
| `v3/index.html` | An **older** June 15 build — missing the Billing and Trunk Stock tabs. | ❌ Outdated. Ignore. |

**Bottom line:** "the toolkit" = the LATEST file. The website pulls from the deploy copy. We update one, mirror to the other.

---

## What's already IN the toolkit (the 18 tabs)

These are done and live — no action needed:

Product Overview · Clinical Proof · vs. Competition · CPT & Revenue · Patient Coaching · PFT Interpretation · 🎯 Key Messages · People & Contacts · IT & Connectivity · Troubleshooting · 📋 Forms · ⚡ Daily Hub · ✉️ Email Library · ⚠️ Aging Devices · ⚙️ Ops & Admin · 🦴 Rheumatology · 🧰 Trunk Stock · 💵 Billing Helper

Tools that were once standalone files and are **now absorbed** into those tabs:

- **ROI Calculator** → built into the toolkit
- **ROI Proposal Builder** → built in
- **Quote Builder** → inside the Forms tab
- **ACH Payment form** → inside the Forms tab
- **PFT Billing Helper** → its own 💵 tab
- **Trunk Stock** → its own 🧰 tab
- **Email templates + auto-signature** → Email Library tab
- **Materials Library** (23 PDFs: brochure, studies, CPT sheet, W-9, etc.) → inside Forms / Email Center

---

## The GAPS — built, but NOT in the toolkit yet

Only two real ones, plus one judgment call:

### 1. Credit Card Authorization Form `MiniBox_Credit_Card_Auth_Form_v1.1.html` — **clear gap**
The Forms tab has the ACH (bank draft) form but **not** the credit-card version. A rep closing a card-paying customer has to go dig up a separate file. This belongs right next to ACH in the Forms tab.
**Recommendation: add it. Quick.**

### 2. Field Sales Playbook `MiniBox_Sales_Playbook_v1.0.html` — **judgment call**
A big (148KB) "Field Sales Playbook & Physician Leave-Behind Pack." Some of its pieces (objection handling, key messages) already echo across existing tabs, but the **full playbook as one piece** isn't in the toolkit. Two options:
- (a) Add it as its own 📘 **Playbook** tab, or
- (b) Drop it into the Materials Library as a downloadable/emailable leave-behind.
**Recommendation: (b) first** — fastest, and it makes the whole thing shareable with a doctor. Promote to a full tab later if reps want it on-screen.

### 3. Erik Signature / ROI Email Template — **probably leave as-is**
The toolkit already auto-signs emails and has an email generator, so these standalone files are effectively covered. No action unless you want the standalone signature file for something outside the toolkit.

---

## Stuff we built that is NOT toolkit material (and shouldn't be)

These are **customer deliverables / one-off packages** — keep them filed, don't merge them in:

- **`Dr Nejat - NY Allergy/`** — a full ROI + email + quote package for one prospect.
- **`Patchogue_Submission_v1.0` and `v1.1`** — corporate bid submission packages (cover letter, brochure, clinical validation, sole-source letter, W-9, etc.).
- **`PFT_Billing_App/`, `_deploy_pft/`, the `.cmd` launcher, QuickStart PDF** — the standalone Billing Helper packaged as a forwardable app. Separate product from the toolkit (the toolkit already has the Billing tab).

---

## Cleanup worth doing (optional, 2 minutes)

Some junk is cluttering the main folder: leftover temp files `lu382b5yc.tmp`, `lu922b6od.tmp`, and `.~lock...` / `~$...` files (these are just "file is open" markers from Word/LibreOffice). Safe to delete. I can sweep them if you want.

---

## The EASY way to get the gaps in — you don't lift a finger

Here's the whole process, and your part is one word:

1. You say **"add the credit card form and the playbook."**
2. I open the LATEST toolkit, drop the Credit Card form into the Forms tab (next to ACH) and register the Playbook in the Materials Library.
3. I bump the version (so your old copy stays intact — you can always see what changed).
4. I mirror it to the `_deploy_toolkit` website copy so the live link updates too.
5. I tell you it's done and show you the file.

No file-wrangling, no code on your end. Same as always: you decide what goes in, I do the building and the publishing.

**Your call:** want me to add both now, just the credit card form, or hold off and talk through the Playbook (tab vs. leave-behind) first?
