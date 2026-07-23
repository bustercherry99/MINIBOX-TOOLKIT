# MiniBox Academy — how the content pipeline works

The Academy is four files in the toolkit root plus an image folder:

| File | What it is |
|---|---|
| `MiniBox_Academy_v3.0.html` | the app shell: styles, the Study renderer, the flashcard and test engine |
| `academy-study.js` | **generated** — the Study (teaching) content |
| `academy-quiz.js` | **generated** — flashcards, test questions, module config |
| `academy-visuals.js` | the six hand-built interactive graphics |
| `academy-assets/` | slide images pulled out of PulmOne's training decks |

`academy-study.js` and `academy-quiz.js` are **generated**. Do not hand-edit them; your
changes will be wiped the next time anyone runs the assembler.

## To change lesson content

1. Edit the relevant `study-*.json` in this folder. Those are the masters.
2. Run the assembler:

```bash
node "_tools/academy/assemble.mjs"
```

It rebuilds both generated files and validates as it goes: every image id must exist in
`academy-assets/`, every image must have a caption, every interactive id must be real, and
every table row must match its header width. It prints any problem it finds and a count of
unused assets.

## To add a new image from the training decks

Source decks live in `wetransfer_2025-training_2026-07-21_1501.zip` in the toolkit root.
Unzip it, then unzip the individual `.pptx` files (a pptx is just a zip) and look in
`ppt/media/`. Add an entry to `picks.json`:

```json
{ "id": "short-kebab-id", "deck": "<media folder name>", "file": "image12.png", "kind": "diagram" }
```

`kind` is `diagram`, `table` or `photo`, which sets the output width and JPEG quality.
Tables get the most pixels because they carry small text. Then run:

```bash
node "_tools/academy/optimize.mjs" "_tools/academy/picks.json"
```

and copy the results from the scratchpad `assets/` folder into `academy-assets/`.

## Content rules

`SCHEMA.md` in this folder is the brief. The two that matter most:

- **Never invent a clinical number, threshold or CPT code.** Every figure in the Study text
  traces to a real slide. `slides.json` holds the extracted slide text per deck if you need
  to check one. Same rule as Boxy.
- **Prefer a native table over a slide screenshot for tabular content.** The source images
  are low resolution, often under 600px wide, so criteria tables go blurry when displayed
  large. Rebuild them as `{"t":"table"}` and they stay sharp on any screen.

## The interactive graphics

Six live in `academy-visuals.js`, referenced from study content as `{"t":"svg","id":"..."}`:

| id | what it does |
|---|---|
| `spirogram` | the four volumes and four capacities on a real breathing trace; tap one to highlight it |
| `fvloop` | a flow-volume loop that morphs between normal, obstructive, restrictive and fixed upper airway |
| `gates` | the three gates interpretation framework, airflow then lung size then gas transfer |
| `compartbars` | animated lung compartment bars comparing normal, obstruction and restriction |
| `dlcotimeline` | the single breath DLCO maneuver played out with a live breath-hold countdown |
| `boyle` | drag a piston, watch pressure and volume trade off while their product stays fixed |

These exist because those specific ideas only land when they move. Everything else that is
genuinely illustrative uses the real deck image.

## Testing it

The browser preview pane will not open `file://`, so serve it over http:

```bash
node "_tools/academy/serve.mjs"
```

then open `http://localhost:8899`. Note that the preview browser never paints, so
`requestAnimationFrame` never fires there and animations will look frozen. That is the
environment, not a bug. To exercise animation logic, shim `requestAnimationFrame` with a
fake clock and flush it by hand.
