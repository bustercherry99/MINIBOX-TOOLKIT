# MiniBox Academy v3.0 — Study content schema

You are writing the **Study** layer for a module. Today the app only has flip-cards and a
multiple-choice test — no teaching, no visuals. The Study layer is the part a rep reads
BEFORE the cards, and it must be visual-first.

## Audience

PulmOne field sales reps. Mostly **not** clinicians. They sell the MiniBox+ — a compact
pulmonary function testing (PFT) device — to pulmonology, allergy and primary-care practices.
They need to hold their own in a conversation with a physician and coach office staff
through a test. Write like a smart teammate explaining it at a bar, not like a textbook.

## Hard rules

1. **Never invent a clinical number, threshold, CPT code, or claim.** Every number must come
   from the source slide text you were given. If you want to state a threshold and it is not
   in the source, leave it out. This is a medical-device company; a wrong number in front of
   a physician is a real-world problem.
2. Plain English first, jargon second. When a term must be used, define it in the same
   sentence the first time: "FRC (the air still in your lungs after a normal, relaxed breath out)".
3. No em dashes and no hyphens used as dashes in prose. Use commas or split the sentence.
4. Every section should earn its place. Six to nine sections is the target for a full module.

## Shape

Return a single JSON object (no prose around it, no markdown fence):

```json
{
  "minutes": 8,
  "intro": "One short paragraph that tells the rep why this module matters to them in the field.",
  "sections": [
    {
      "h": "Section heading, five words or fewer",
      "p": "The teaching paragraph. Inline HTML allowed: <b>, <i>, <br>. No block tags.",
      "list": ["optional bullet", "another bullet"],
      "visual": { "...see visual types below..." },
      "key": "Optional one line takeaway, shown as a highlighted strip. Under 120 characters."
    }
  ],
  "angle": "The MiniBox sales tie-in for this whole module. Two or three sentences. What does knowing this let the rep SAY to a doctor?"
}
```

`list`, `visual` and `key` are each optional per section. `h` and `p` are required.

## Visual types

Every section that can carry a visual should. A wall of text is the exact failure we are fixing.

**Real image from the training decks** (use the `id` values from the image list you were given):
```json
{ "t": "img", "src": "copd-pathology", "cap": "Healthy airway and alveoli versus COPD: mucus narrows the bronchiole and alveolar walls break down." }
```
The caption is not optional and it should teach, not just label. Say what the reader should
notice in the image.

**Crisp native table** — use this for anything that is a table of criteria, thresholds, or
comparisons. Do NOT use a screenshot image for tabular data; the source slides are low
resolution and the text goes blurry.
```json
{ "t": "table",
  "head": ["Grade", "What it means"],
  "rows": [["A", "..."], ["B", "..."]],
  "note": "Optional small print under the table, e.g. a source citation." }
```

**Numbered steps** — for procedures and maneuvers:
```json
{ "t": "steps", "items": [ {"h": "Relaxed full exhale", "p": "What happens and what the rep should watch for."} ] }
```

**Comparison columns** — for "this versus that":
```json
{ "t": "vs", "a": {"h": "Obstructive", "items": ["...", "..."]}, "b": {"h": "Restrictive", "items": ["...", "..."]} }
```

**Built-in interactive** — these are hand-built animated SVG components that already exist in
the app. Reference one only if it is listed as available for your module:
```json
{ "t": "svg", "id": "spirogram" }
```

## Tone example

Bad:  "The FEV1/FVC ratio is a key spirometric index used to differentiate obstructive from
      restrictive ventilatory defects."
Good: "Everything starts with one ratio: how much of your total breath you can blow out in the
      first second. If that fraction is low, air is getting stuck on the way out, and that is
      obstruction."
