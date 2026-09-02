# Document Import — Drafting Profile Fields from Existing Material

> How to turn a pasted CV, past cover letters, or any other document the user considers
> relevant into draft profile fields — and how to tell what still needs the questionnaire.

Documents shorten the questionnaire; they don't replace the confirmation discipline.
Every field drafted here still gets shown to the user before it's written.

---

## What counts as a document

There is no fixed list — accept anything the user offers and considers relevant:
CV/résumé, past cover letters, reference or recommendation letters, portfolio
write-ups, performance reviews, a LinkedIn "About" export, a bio from a speaker
page, even rough notes. More documents generally close more gaps, especially
multiple cover letters (see `writing_style` below).

Input method: pasted text in the conversation, or a local file the user points you
to (use your normal file-reading capability — this skill still makes no MCP or shell
calls to fetch it). Either way, the content is **conversation input only**. It is
never written to a file in this repo, in the tenant database beyond the profile
fields themselves, or anywhere else.

---

## Field-by-field extraction guide

### cv_text

**Best source**: the CV itself, almost verbatim.

- Reformat into the Markdown structure from `synthesis.md` (`## Experience`, `## Skills`,
  `## Education`). Preserve the user's actual role titles, dates, and bullets — this
  is a reformat, not a rewrite.
- If no CV was provided but cover letters mention enough role history (company,
  title, rough dates, one achievement each), you may draft a thin CV from that —
  flag it explicitly as "reconstructed from your cover letters, please check
  carefully" when showing it.
- **Classification**: `covered` if a CV was provided, `partial` if reconstructed
  from other documents, `gap` otherwise.

### achievements

**Best source**: CV bullets with numbers, plus any results mentioned in cover letters
or reviews.

- Pull every bullet that already has a quantified result (%, currency, headcount,
  time, rank) into the `[Verb] [what] at [context] — [result] ([year])` format from
  `synthesis.md`.
- CV bullets without numbers are candidates, not achievements yet — list them
  separately as "found but unquantified" and ask the user for a number during
  gap-fill rather than inventing one.
- **Classification**: `covered` if 4+ quantified lines were extracted, `partial` if
  1–3, `gap` if none.

### skills_matrix

**Best source**: CV skills section, plus skills implied by achievement bullets and
role descriptions.

- Every line still needs evidence per `synthesis.md`'s rule — a skill listed in a
  CV's skills section with no supporting bullet anywhere is weaker evidence than
  the rule wants. Pull it in but mark it for a quick confirmation rather than
  treating it as fully evidenced.
- **Classification**: `covered` if 6+ evidenced lines were extracted, `partial`
  if fewer or evidence is thin, `gap` if the CV has no skills section and no
  other document mentions skills.

### positioning

**Best source**: a CV's summary/objective line (if present) and a cover letter's
opening framing — cover letters are more useful here than CVs, since positioning
is about narrative, not facts.

- Draft using the structure in `synthesis.md` (opening sentence, thread paragraph,
  USP sentence), pulling phrasing from the documents where it already reads well.
- A CV alone rarely supports this field well — CVs list facts, not narrative arcs.
  If only a CV was provided, treat this as `partial` at best and expect to ask at
  least P5.3/P5.4 (target roles, USP) during gap-fill.
- **Classification**: `covered` only if at least one cover letter (or equivalent
  narrative document) was provided and yields a clear thread; `partial` if only
  fragments exist; `gap` if only a bare CV was provided.

### writing_style

**Best source**: actual past prose — cover letters, above all. **A CV cannot supply
this field** — a bullet list has no tone to extract.

- If one or more past cover letters were provided, analyze their actual voice:
  sentence length, formality, use of analogy vs. abstraction, first-person vs.
  passive constructions, recurring phrases. Draft the ruleset in the format
  `synthesis.md` specifies (tone, sentence style, DON'Ts, signature phrases).
- **Always flag this one explicitly for confirmation**, even more than the others:
  "this is how you *wrote before* — is it still how you want to sound, or has your
  style shifted?" Past style is a strong prior, not a guarantee of current intent.
- If only a CV (no prior cover letters) was provided: `gap`. Run the full
  writing-style question set (P2.1, P2.7, P3.2, P3.4, P3.6).
- **Classification**: `covered` only with at least one past cover letter analyzed
  and confirmed by the user; `gap` otherwise. There is no meaningful `partial` state
  for this field — either there's prose to analyze or there isn't.

---

## After extraction: mapping gaps back to questionnaire parts

Once every field has a classification, use this table (same parts as in
`SKILL.md`/`questionnaire.md`) to decide what to still ask:

| Field | Feeding parts | Skip the part if... |
|-------|---------------|----------------------|
| `positioning` | Part 1, Part 5 | `positioning` is `covered` |
| `writing_style` | Part 1, Part 2, Part 3 | `writing_style` is `covered` **and** no other field in that part is `partial`/`gap` |
| `skills_matrix` | Part 3, Part 4 | `skills_matrix` is `covered` **and** `achievements` is `covered` |
| `achievements` | Part 4 | `achievements` is `covered` |

A part feeds more than one field — only skip it once every field it feeds is
`covered`. Run the full part (not a hand-picked subset of its questions) when it
isn't skippable; partial credit within a part isn't worth the bookkeeping.

If every field ends up `covered`, you may skip the questionnaire phase entirely and
go straight to showing the drafts (Phase 1b, step 3) — but still get explicit
confirmation before writing anything.

---

## Anti-patterns specific to document import

- Copying document text into a field verbatim without adapting it to the field's
  structure (e.g. dumping a whole cover letter into `positioning`)
- Marking `writing_style` `covered` from a CV — CVs don't have a voice
- Skipping the confirmation step because "the CV said so" — the user still needs
  to see and approve every drafted field, same as questionnaire output
- Treating one old cover letter's tone as permanent — always ask if it still fits
- Retaining the raw document text anywhere after the drafted fields are confirmed
  and written
