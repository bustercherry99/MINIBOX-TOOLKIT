# MiniBox Sales Toolkit — Project Rules

Erik's PulmOne day-job app: a private PWA sales toolkit for PulmOne field reps.
Live at **https://deploytoolkit.vercel.app**. The front door is an **invite list** —
see "Who gets in" below. The old shared password (`minibox2026`) now only powers the
one-tap `?k=` share links.

## NORTH STAR — Built for the rep, not the company

This might literally become the slogan. Every feature, screen, and line of copy must feel
like it's on the **rep's** side — a tool they *want* to open — never the company watching
over their shoulder or telling them what to do.

- Before building anything, ask: does this help the rep, or does it help the company
  monitor the rep? If it's the latter, don't build it.
- **No Salesforce/CRM "daily hygiene" nudges or nagging** — Erik explicitly ruled these
  out. Process discipline is between the rep and their manager, not the app.
- Default to helpful and optional, never prescriptive or mandatory. No "you should have
  done X" language. Copy tone = teammate, not supervisor.

## How Erik works (autonomy)

- **Never ask permission — just do it.** Make the change, deploy, then tell him it's done
  in plain English (he's non-technical — no jargon). The ONLY things that wait for his
  sign-off: actually SENDING something (emails, messages) and anything customer/marketing-
  facing that leaves the building.
- He fires off voice notes mid-drive with many projects in parallel. Other bots may be
  editing the same files concurrently — use atomic Node string-splices with unique anchors
  when the Edit tool hits staleness, and take the next service-worker version letter if
  another bot grabbed yours.
- End every work session with a clear "done" signal.

## Who gets in (the front door)

Built 2026-07-22. Three pieces, and the signature in them must stay byte-identical:

1. `_deploy_toolkit\middleware.js` — the gate. Reads a **signed cookie** that carries the
   person's email (`mbx_pass=v2.<b64url(email)>.<HMAC-SHA256 over "mbx1|<email>", 32 chars>`),
   and on every **page load** (not every asset) re-checks that email against the list in
   Redis. Storage unreachable → let them through; a Redis hiccup must never lock the team
   out of their own tool.
2. `_deploy_toolkit\api\access.js` — the only URL the middleware lets through
   unauthenticated, because it *is* the way in. Checks the list, emails a 6-digit code
   (Resend), verifies it, sets the cookie. Codes: 10-minute life, 6 wrong tries, 5 sends
   per 15 minutes, single use.
3. Command Center → **Who can get in** (`reports.html` + `action:'access*'` in `api\admin.js`).
   Add, Remove, approve someone who asked. Remove really does lock them out — next page load.

- The list is `mbx:access:allow` (HASH email → `{name, addedBy, ts, lastIn}`). Requests to
  join are `mbx:access:requests`; door traffic is `mbx:access:log` (last 200).
- **No `RESEND_API_KEY` set = no code step.** The list is still enforced; people just aren't
  asked to prove the inbox is theirs. Add the key in Vercel and codes start sending on their
  own — no code change. `MAIL_FROM` must be on a domain verified in Resend.
- `AUTH_SECRET` (Vercel) signs the cookie. Changing it signs *everybody* out. The shipped
  fallback is in all three files plus `scripts\issue-triage\mbx-issues.mjs` — change one,
  change all four, or the nightly triage run stops getting through the door.
- `erik.bernard@pulm-one.com` is hard-coded as owner in `access.js` + `middleware.js` so he
  can never lock himself out, and the Command Center won't show a Remove button on his row.
- `?k=<SITE_PASSWORD>` share links still work and skip the list entirely — that is the point
  (prospects, one-tap deep links). They sign in as `@guest`, which no list check applies to.

## The three copies — keep them in sync

1. **Master (edit this):** `v3\MiniBox Sales Toolkit (LATEST).html`
2. **Online app:** `_deploy_toolkit\index.html` — a byte-for-byte mirror of LATEST.
   Edits to LATEST are INVISIBLE in the app until you mirror + bump + deploy.
3. **Offline zip:** `v3\MiniBox_Toolkit_v3_offline.zip` — reps run this with no internet.
   It NEVER auto-updates and must NEVER be deleted.

**Deploy routine (every ship, no exceptions):**
copy LATEST → `_deploy_toolkit\index.html` (byte copy; never strip the `mbx-pwa` block)
→ bump `VERSION` in `_deploy_toolkit\sw.js` → `vercel deploy --prod --yes` (from
`_deploy_toolkit`) → rebuild the offline zip (stage files into a scratch folder first —
`Compress-Archive` dies on locked files like open .mp4s; use a `.zip` temp name).
- **ALWAYS `node --check _deploy_toolkit\sw.js` after bumping VERSION.** A past regex
  bump mangled the line to `var VERSION$1'...'` (the `$1` backreference ate the ` = `),
  which silently killed the whole service worker — no offline cache, no update banner,
  which is a big part of the "change isn't there / stale" complaints. Keep it
  `var VERSION = 'mbx-YYYY-MM-DD<letter>';` and verify it parses before deploying.
If materials changed, mirror `materials-data.js` + `materials\` too.

## PFT Teaching Suite (separate site)

Live at **https://minibox-pft-suite.vercel.app** — no password. Landing page (Teaching
Suite) + PFT Report Studio trainer + all six pattern-library study pages, one link.
Masters are the loose files in this folder (`MiniBox_PFT_Teaching_Suite.html`,
`MiniBox_PFT_Report_Studio_v1.0.html`, `MiniBox_PFT_Training_*.html`). The online copy
lives in `_deploy_pft_suite\` (Teaching Suite = `index.html`, everything else keeps its
filename so relative links hold). Edits to the masters are INVISIBLE online until you
re-copy them into `_deploy_pft_suite` and run `vercel deploy --prod --yes` from there.

## MiniBox Academy (the rep training course, in this folder)

`MiniBox_Academy_v3.0.html` is the current one. v1 and v2 are flashcards-only and are
superseded, leave them alone.

**LIVE at https://minibox-academy-course.vercel.app** — its own Vercel project
(`minibox-academy-course`), no password, deletable anytime without touching the toolkit.
The online copy lives in `_deploy_academy\` (course = `index.html`, plus the three
`academy-*.js` files and the whole `academy-assets\` folder). **Deploy routine:** re-run
`node _tools\academy\assemble.mjs` if content changed → copy `MiniBox_Academy_v3.0.html`
to `_deploy_academy\index.html` and re-copy the three JS files (and `academy-assets\` if
images changed) → `vercel deploy --prod --yes` from `_deploy_academy`. Edits to the master
are INVISIBLE online until you do that.

**Reps reach it from the toolkit** via the purple graduation-cap **MiniBox Academy** tile,
first in App Launchers on the Daily Hub (`.lb-academy`, opens in a new tab). It's a normal
`<a class="launcher-btn">`, so the arrange registry picks it up and the rep can move or hide
it like any other tile. Boxy knows about it too (`api\bot-knowledge.js`). It needs internet
and is deliberately NOT in the offline zip.

v3 added the **Study layer**, the part that actually teaches: 102 sections across 11 modules,
built from PulmOne's own 2025 training decks (the WeTransfer zip in this folder), with 66 real
slide diagrams plus six hand-built interactive graphics. v2's flashcards and tests are carried
over unchanged underneath it.

- `academy-study.js` and `academy-quiz.js` are **GENERATED**. Never hand-edit them. The content
  masters are the `study-*.json` files in `_tools\academy\`; edit those and re-run
  `node _tools\academy\assemble.mjs`, which rebuilds and revalidates both.
- Full instructions, content rules and the image pipeline: **`_tools\academy\README.md`**.
- Same never-invent-a-number rule as Boxy: every clinical figure traces to a real slide.
- Rebuild criteria tables as native HTML rather than pasting the slide screenshot. Those source
  images are often under 600px wide and turn to mush when shown large.

## Key gotchas

- **HQ (top of the Daily Hub, `<script id="mbx-hq">`) is the rep's home board.** It reads
  what's already on the device — My Day route, `mbx_accounts_v1`, daily notes, queued visit
  notes/orders, Team Chat unread — so it works offline and reports nothing anywhere. Its
  Inbox + Calendar panels are built and dark, waiting on the SAME Microsoft 365 approval as
  attachments. **When IT finally replies: paste the Application (client) ID and Directory
  (tenant) ID into the `MS = { clientId, tenantId }` object at the top of that block, mirror,
  bump, deploy. That is the whole job** — the auth (auth-code + PKCE, no library, read-only
  `Mail.Read` + `Calendars.Read`, token in sessionStorage) is already written and the panels
  light up on their own. The IT request in `EMAIL TO IT — Graph approval (copy-paste).txt`
  now asks for all three scopes, so one approval covers HQ and attachments together.
- **The Hub layout is the rep's, not ours** (`<script id="mbx-arrange">`, v2). Every thing on the
  Daily Hub is ONE item with two shapes: a round **tile** in the launcher box, or a **fat panel**
  down the page. Edit-layout mode (pill in the hero) lets the rep drag any item between the two — it
  changes shape on drop — and hide anything with the red × into a tray
  at the bottom. A panel riding in the launcher box opens **full size in a sheet** when tapped, so
  nothing is ever in two places at once (that was Erik's complaint about Shipping). Layout is
  per-device (`mbx_hub_layout_v2` = `{pad,col,off}`) and reported nowhere.
  - **DIRECT DRAG IS THE DEFAULT — no mode button first (2026-07-23).** Erik's rule: "you should be
    able to drag everything and move anything around," and having to arm an Arrange mode to move one
    tile was the complaint. So dragging works with the mode OFF: **press-and-hold (finger, 320ms) or
    press-and-move ~6px (mouse)** picks a thing up; a **quick tap still opens it**. That
    tap-vs-drag call is the whole trick — `pend` holds the undecided press and only `startDrag()`
    commits it, `drag.moved` means a pick-up that never actually moved is handed back as a tap, and
    `justDragged` swallows the click for 60ms after a real drag so a drop doesn't also fire
    "Open the day". On touch, moving BEFORE the hold fires cancels the pick-up so the page still
    scrolls normally — never put `touch-action:none` on hub items outside the mode or scrolling dies.
  - **Only real handles start a direct drag** (`directHandle()`): a launcher tile grabs anywhere;
    a fat panel and the HQ board grab by their **header only** (`.hub-acc-head` / `.hq-bar`) because
    their bodies hold fields the rep types into; the launcher box grabs by its own chrome, never a
    tile inside it; and a press on an `#mbx-hq .hq-card` is refused outright so HQ's own card
    reorderer gets it. Buttons/inputs inside a header never start a drag. Direct drag is also
    **zone-locked** (`drag.lock`) so a casual reorder can't accidentally convert a tile into a fat
    panel — that conversion stays a deliberate Edit-layout-mode act.
  - **The launcher tiles are painted from a registry, not from markup.** The shipped `<a
    class="launcher-btn">` tags are read once at boot and then removed from the DOM. Editing those
    tags still works (they seed the registry); adding a tile by hand anywhere else does nothing.
  - **A new Hub section must have an id and an entry in `PANELS`** (icon, name, short desc) or it
    can't be moved, hidden, or brought back. `DEF.pad` / `DEF.col` decide its shipped home, and a
    new item is spliced in next to its default neighbour — never just appended.
  - **Don't blanket `pointer-events:none` on children of a draggable.** It is inherited, so the
    tiles inside the launcher box went dead and the whole box moved as one lump. The fix that has
    to stay is the paired rule `body.mbxa-on [data-arr] [data-arr] { pointer-events:auto }`.
- **HQ's own cards reorder independently of the outer Hub arrange** (`<script id="mbx-hq-arrange">`,
  2026-07-23). `mbx-arrange` above only ever moves the whole HQ board as one panel — it never reaches
  the cards inside it (Today/Inbox/Calendar/Accounts/My notes/The team/Daily Cut). **Grab a card
  anywhere** — same press-hold / press-move rule as direct drag above, no mode button and no tiny
  handle (a first pass shipped a grip handle in the card header; Erik wanted the whole card, so it
  was removed — don't reintroduce `.hqa-handle`). A quick tap still works the card's own buttons.
  It **stands down while the outer Edit-layout mode is on** (`modeOn()`), so the two systems never
  fight over one press: mode = move the whole board, no mode = reorder the cards inside it.
  Order is `mbx_hq_card_order_v1` in localStorage, per-device, reported
  nowhere. Because `render()` in `mbx-hq` rewrites the whole grid from scratch on every tab switch/
  refresh/visibilitychange, this block watches `div#mbx-hq` with a MutationObserver (+ a cheap 2.5s
  poll as a safety net) and reapplies the saved order immediately after — same "watch it and put it
  back" trick Daily Cut and the version-stamp block already use for the same reason. A card this block
  has never heard of (a future new panel, or Daily Cut before its own async placement lands) slots in
  right after its nearest already-placed neighbour in `DEFAULT_ORDER`, same idea as `mbx-arrange`'s
  own `reconcile()`. New HQ cards are draggable automatically (any `.hq-card` in `.hq-grid` counts)
  — but add the id to `DEFAULT_ORDER` too so a stale saved layout on an old device knows where the
  new card belongs.
- **Testing drag on the live page: make sure the Daily Hub is actually the visible tab.** Half a
  debugging session went into a "broken" panel drag that was nothing of the sort — an earlier test
  had clicked an HQ card's "Open the map", which switched to the Accounts tab, so `#tab-hub` was
  `display:none` and every `getBoundingClientRect()` came back all-zeros. `place()` skips zero-size
  items (`if (!r.width && !r.height) return`), so no drop target is ever found and the slot never
  moves. If a synthetic drag "starts but never reorders," check the tab is on screen before
  suspecting the drag code, and space dispatched taps out past the 60ms `justDragged` window.
- **Anchors for Node splices must be unique — check first.** Nearly every `mbx-*` block ends
  with the same four lines (`if (document.readyState === 'loading') ... else boot(); })();
  </script>`), so a replace on that tail lands in the FIRST block in the file, not yours.
  A helper function once got spliced into the template-library block that way and the arrange
  block died with a ReferenceError. Grep the anchor and confirm exactly one hit before writing.
- **`getElementById` on a block's own id returns the SCRIPT TAG, not the thing it built.**
  This silently killed the entire HQ board (2026-07-23): `<script id="mbx-hq">` creates a
  board `<div id="mbx-hq">`, and `mount()`'s already-mounted guard `if ($('mbx-hq')) return;`
  therefore matched the script and bailed on every load — no HQ on the Daily Hub at all, and
  no console error to show for it. Anything that looks up an element a block CREATED must
  ask for the tag too: `document.querySelector('div#mbx-hq')`. Never reuse the script's id
  for the element it injects without that.
- **Daily Cut** (`<script id="mbx-daily">`) is the team's daily word game — one
  five-letter word a day, the same one for everybody, played from a card on HQ. The word
  is computed on the device from the Eastern date (`LIST` in that block, 240 words), so it
  works offline and no server ever knows it; `api/daily.js` is only the shared scoreboard.
  Because it's a game and not work, it is deliberately kept **out** of the usage report
  (the click hook skips `#mbxd-back`) and out of the Command Center. Keep it that way.
  To add words, append to `LIST` — never reorder it, or everyone's puzzle number shifts.
- Erik uses **Outlook on the web** — mailto/OWA links physically cannot attach files.
  Current flow = ready-to-send .eml draft (v3.22 `m3AttachSend`) with a per-device
  fallback to zip+drag. The only true zero-click fix is Microsoft Graph (waiting on
  PulmOne IT since 7/7). Never "fix" attachments by tweaking compose links.
- **Scope a tab's CSS variables to `#tab-<name>`, never to the playbook view div.** Every
  specialty tab declares its palette (`--alt`, `--rht`, ...) in a `<style>` at the top of the
  tab. If that rule is scoped to the *view* container (`.alp`, `.rhp`, `.plp`), anything that
  is a **sibling** of the view — most importantly the sub-nav strip — resolves those vars to
  nothing, so `border-color:var(--alt)` silently becomes `currentColor` and
  `background:var(--alt-wash)` becomes transparent. The result is a nav where the active pill
  is indistinguishable from the resting ones and the rep loses their place. This is exactly
  how Allergy broke (fixed 2026-07-22, same trap as the earlier rheum one).
- **Sub-nav active state is centralized** in `<style id="mbx-subnav">` (just above
  `#mbx-katana`). It styles all six families — `.cxsub-btn .imsub-btn .rhsub-btn .plsub-btn
  .alsub-btn .finsub-btn` — off one pair of per-tab vars, `--sn` / `--sn-deep`. Active =
  solid `--sn-deep` fill + white 700 text; resting = white pill, grey text, quiet border.
  **Don't restyle a sub-nav inside its own tab block** — those rules sit earlier in the
  document and lose to this one at equal specificity. To add a nav, just give the tab a
  `--sn`/`--sn-deep` pair and add its selectors to the block.
- Never round-trip the toolkit HTML through PowerShell Get-Content/-replace (mojibakes
  em-dashes/emoji) — use Node. Use function-form `str.replace(a, () => b)` ($ safety).
- Cross-cutting features go in self-contained append-only `<script id="mbx-*">` blocks
  before `</body>` (collision-safe pattern: mbx-pwa, mbx-chat, mbx-videos-hub, mbx-boxy-fab).
- When Erik says a tab is "empty" or a change "isn't there," it's almost always his
  installed PWA on a stale cache — the sw bump + Refresh bar fixes it — or content buried
  under a sub-view (surface it on the landing view).
- **Never put `loading="lazy"` on an iframe that starts inside a hidden container** (a
  `display:none` sub-view like `#fin-view-calc`, or a collapse-by-default `formToggle`
  body). With no layout box it never intersects the viewport, so it never loads and the
  rep sees an empty panel — no field borders, nothing to type into. This is exactly how
  the ROI Proposal Builder broke in BOTH its embeds (Financing + Forms), 2026-07-22.
  Embedded forms here are collapsed by default, so plain eager loading is the rule.
- Any new email/recipient input needs the mbx-emails wiring (`list="mbx-emails"` + name +
  `autocomplete="email"` + `onchange="mbxRememberEmail(this.value)"`) or its dropdown
  won't be clickable.
- Boxy (Team Chat AI bot) answers wrong about WHERE something lives → fix the tab
  directory in `_deploy_toolkit\api\bot-knowledge.js` + redeploy (API-only: no sw bump).
  That file is Boxy's whole brain (system prompt): it now carries a CODE & TERM REFERENCE
  (the rheum ICD-10 codes) and is allowed to EXPLAIN a code/term already on the screen —
  reading back the toolkit is not "inventing." To teach Boxy anything new, add it there.
  Boxy needs `ANTHROPIC_API_KEY` (set in Vercel) to answer live; without it every reply
  is the canned "sent to administration" fallback in `api\chat.js`.
- Problem-report resolve → auto-reply: marking a report "fixed" in the Command Center
  (Boxy's owner view, `reports.html` → `api\admin.js` setStatus) makes Boxy post a note
  back to the reporter BY NAME in Team Chat, once only (`notified` flag). Copy never says
  "Erik will do it" — it's "sent to administration, answer shortly."
- **`materials\ACH-Payment-Authorization.pdf` is GENERATED and must stay blank + fillable.**
  It is a real AcroForm PDF (41 typable fields) built by `node _tools\pdf\build-ach-form-pdf.mjs`;
  after rebuilding it, re-run `powershell -File v3\build-materials-data.ps1` (and mirror
  `materials-data.js` into `_deploy_toolkit`) or the email attachment still ships the old bytes.
  Until 2026-07-23 that file was a flat print of a real deal — a customer name and dollar
  figures baked in, nothing typable — and every rep who attached it sent another practice's
  numbers out. **Never replace it with a "Save as PDF" of a filled-in form.** Same rule for
  any customer-facing form: the attachable copy ships blank, no names, no prices.
- **Never invent prices, CPT codes, or clinical claims.** Internal discount math stays
  behind "rep eyes only" walls. Customer-specific docs (e.g. Dr. Nejat's) stay OUT of the
  shared toolkit.
- The full build history/changelog lives in the Dragons project's memory file
  `minibox-toolkit-v3.md` (sessions there carry the long log); this file is the durable
  rulebook.
- **Problem reports triage themselves daily.** `scripts\issue-triage\mbx-issues.mjs` reads and
  writes the "Report a problem" inbox (`list` / `note <id> <status> "..."` / `digest "..."`),
  opening both doors: the team-password cookie (djb2 hash of `SITE_PASSWORD`, must stay in
  step with `middleware.js`) and the owner password sent to `api/admin.js`. The scheduled
  task `minibox-problem-triage` (7 AM daily, `~\.claude\scheduled-tasks\`) runs it, fixes
  what is safe, and posts the write-up to `mbx:issue:digest` — shown under **Overnight
  triage** atop the Command Center. Money math, clinical/CPT content, admin access and
  anything ambiguous are escalated to Erik, never auto-fixed.
