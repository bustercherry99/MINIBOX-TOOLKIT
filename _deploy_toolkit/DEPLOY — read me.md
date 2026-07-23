# MiniBox+ Toolkit — turn it into an app (computer, phone, iPad)

This folder IS the app. Putting it online once gives your whole team a tap-to-open
icon on every device, it works offline after the first open, and any update I make
later reaches everyone automatically — nobody re-downloads anything.

It's protected by a **team password** so it's private, not public on Google.
- **Default password:** `MiniBox2026`  (you can change this — see bottom)

---

## STEP 1 — Put it online (one time, ~5 minutes)

You already use Vercel for the Dragons site, so we'll use Vercel again.
Open a terminal (Windows: search "PowerShell"), then copy-paste these one at a time:

    npm install -g vercel
    cd "C:\Users\erikb\Documents\Claude\Projects\MINIBOXSALES TOOL\_deploy_toolkit"
    vercel

- The first time, `vercel` asks you to log in — it pops open your browser, click **Continue**.
- Then it asks a few questions. Just press **Enter** to accept the defaults
  ("Set up and deploy?" Yes · scope = your account · link to existing? No ·
  project name = Enter · directory = Enter · settings? No).
- When it finishes it prints a link like `https://minibox-toolkit-xxxx.vercel.app`.

Now make it the real/live version:

    vercel --prod

It prints your final link. **That link is the app.** Send it to your team.

> Tell me the link when you have it and I'll double-check the password screen
> and the install work on a real phone.

---

## STEP 2 — Your team installs the icon (10 seconds each)

Send them the link + the password. Then:

- **iPhone / iPad:** open the link in **Safari** → tap the **Share** button →
  **Add to Home Screen**. A MiniBox+ icon appears like a real app.
- **Android phone:** open in Chrome → it shows an **"Add to home screen"** banner (or
  menu → Install app).
- **Windows / Mac computer:** open in Chrome or Edge → click the **Install** icon in the
  address bar (or our blue "Install" bar at the bottom).

After that, they tap the icon — no link, no password re-typing, works on the road.

---

## STEP 3 — When I update the toolkit later

You don't email anyone a new file. I update this folder and run `vercel --prod`
again (or you paste me the go-ahead and I prep it). Everyone's app shows a small
blue **"A new version is ready — Refresh"** bar next time they open it. One tap, done.

---

## Changing the team password (no code needed)

1. Go to **vercel.com** → your **minibox-toolkit** project → **Settings** →
   **Environment Variables**.
2. Add: Name = `SITE_PASSWORD`, Value = whatever you want, then **Save**.
3. Click **Redeploy** (Deployments tab → ⋯ → Redeploy).

That's it. Until you do this, the password is `MiniBox2026`.

---

## What's in this folder (for reference)
- `index.html` + `materials-data.js` — the toolkit itself (your v3.3 / "LATEST").
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — the bits that make it installable + offline.
- `middleware.js` — the password gate (runs on Vercel, before anyone sees a thing).
