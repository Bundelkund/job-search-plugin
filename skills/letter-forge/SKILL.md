---
name: letter-forge
description: >
  Interactive career-narrative questionnaire — builds the 5-field application profile
  that /apply and /rank consume. Can start from pasted documents (CV, past cover
  letters, reference letters, or any other career document the user considers
  relevant) — drafts the profile fields from those first, then runs a shortened
  questionnaire for only what the documents didn't cover. Without documents, runs
  the full questionnaire: 5 parts (~35 questions) covering story & origin, values,
  assessment-centre evidence, STAR stories, and happiness alignment.
  Reads existing profile first (gap-fill mode), shows synthesized fields for confirmation,
  then writes them via set_my_profile.
  Use when user says "letter forge", "career questionnaire", "build my profile",
  "narrative", "upload my CV", "/letter-forge".
---

# /letter-forge — Career Narrative Questionnaire

> Know your story before you write it.
>
> Builds the 5-field application profile that `/apply` and `/rank` read — entirely
> in-conversation via the tenant MCP tools. No local filesystem, no shell commands.

## When to use

- Before your first `/apply` run — profile is empty or thin
- Before a new job-search phase — narrative needs refreshing
- User says "letter forge", "build my profile", "career questionnaire", "upload my CV", "/letter-forge"

Do **not** use for:
- Writing a cover letter — hand that off to `/apply <job_id>`
- Quick CV edits — call `set_my_profile({ cv_text: "..." })` directly
- Ranking jobs — use `/rank`

---

## Prerequisites

- Tenant connector (>= v0.2.0) installed with a provisioned API key
- No profile data required upfront — the skill builds it from scratch, from documents,
  or a mix of both

---

## MCP tools (the only I/O)

| Tool | Purpose |
|------|---------|
| `get_my_profile()` | Read existing profile — used in Phase 1 to identify gaps |
| `set_my_profile({...})` | Write profile — partial update, only passed fields are changed |

See `references/mcp-tools.md` for full signatures.

---

## Workflow

### Phase 1: Profile check + document offer

1. Call `get_my_profile()`.
2. Show the user which of the five fields already have content and which are empty or thin.
3. Ask: "Do you have a CV, past cover letters, or any other document you'd consider
   relevant (reference letter, portfolio summary, LinkedIn export, ...) to start from?
   Paste the text here, or tell me the path if it's a local file I can read. I'll draft
   the profile fields from those first, then only ask about what's still missing."
4. If the user has documents → go to **Phase 1b**. If not → go straight to **Phase 2**
   (full questionnaire).
5. If all five fields are already rich (from a prior run): confirm with the user before
   proceeding (avoid overwriting good content), regardless of which path they pick.

### Phase 1b: Document import (optional)

1. Collect every document the user offers — there is no fixed set; treat anything they
   consider relevant as in scope (CV, cover letters, reference/recommendation letters,
   portfolio write-ups, performance reviews, LinkedIn export, ...). Accept text pasted
   directly into the conversation, or read a local file the user points you to.
   **Never write any of it to a file in this repo or elsewhere** — it lives in the
   conversation only, same as questionnaire answers.
2. Follow `references/document-import.md` to draft the five profile fields from the
   collected documents. That guide also classifies each field as **covered**,
   **partial**, or **gap** based on what the documents actually support.
3. Show the drafted fields to the user as Markdown blocks — mark clearly which parts
   are direct extractions vs. inferred. Ask for corrections before moving on.
4. For every field marked **partial** or **gap**, run only the relevant questionnaire
   parts from the table below (see `references/document-import.md` for the
   field-to-part mapping) — skip parts that cover only **covered** fields.
5. Continue into Phase 3 once the gap-fill questions (if any) are answered.

### Phase 2: Questionnaire — 5 parts, a few questions at a time

Run the questionnaire interactively. **Never ask more than 3–4 questions per turn.**
Show a part intro when starting each new part. Users may run one part per session.

| Part | Title | Questions | Feeds |
|------|-------|-----------|-------|
| 1 | Story & Arc | ~8 | `positioning`, `writing_style` |
| 2 | Values & Motivation | ~7 | `positioning`, `writing_style` |
| 3 | Working Style & Voice | ~6 | `writing_style`, `skills_matrix` |
| 4 | STAR Achievement Evidence | ~8 | `achievements`, `skills_matrix` |
| 5 | Positioning & Target Roles | ~6 | `positioning` |

Full question bank: `references/questionnaire.md`.
Synthesis map (answers → fields): `references/synthesis.md`.

**Interaction rules** (see `references/questionnaire.md` for detail):
- Present 3–4 questions, wait for answers, then present the next batch.
- Each question includes a one-line *hint* in italics explaining what it reveals.
- STAR questions (Part 4) invite free narrative first; offer to unpack into
  Situation / Task / Action / Result / Reflection only if the user wants it.
- Accept "skip" on any question. Accept "pause" to stop and save progress notes in-conversation.
- Language: questions in English; answers accepted in any language.

### Phase 3: Synthesis

After the questionnaire (or after each part if the user prefers incremental saves):

1. Synthesize answers into the five profile fields following `references/synthesis.md`.
2. **Show each synthesized field to the user as a Markdown block before writing.**
3. Ask: "Does this capture it? Edit anything before I save?"
4. Apply edits if requested, then write.

### Phase 4: Write via MCP

Call `set_my_profile` with the confirmed fields. You may write one field at a time —
partial update is supported, existing fields are untouched.

```
set_my_profile({
  positioning: "...",
  achievements: "...",
  skills_matrix: "...",
  writing_style: "...",
  cv_text: "..."    ← only if CV data was collected
})
```

Confirm to the user which fields were written. Suggest `/apply` as the next step.

---

## Progress tracking (in-conversation)

After Phase 1 and at the start of each part, show a lightweight tracker:

```
Letter Forge — Progress
Part 1: Story & Arc          done
Part 2: Values & Motivation  done
Part 3: Working Style        in progress (Q3/6)
Part 4: STAR Evidence        not started
Part 5: Positioning          not started
```

No files are written mid-session — progress lives in-conversation only.

---

## Anti-patterns

- Asking all questions at once (ask 3–4 per turn, wait for answers)
- Writing to `set_my_profile` before showing the user the synthesized text
- Overwriting existing profile fields without user confirmation
- Evaluating or judging answers ("that's great!") — acknowledge briefly, move on
- Skipping the profile check in Phase 1
- Treating a document extraction as final without showing it for confirmation
- Marking `writing_style` as covered from a CV alone — a CV has no voice to extract;
  only actual past prose (cover letter, review, similar) supports that field
- Saving any uploaded document's raw text into a file — it is conversation input only

---

## Reference index

| File | Purpose |
|------|---------|
| `references/document-import.md` | How to draft profile fields from a pasted CV/cover letters/other documents, and how to identify what's still a gap |
| `references/questionnaire.md` | Full question bank (5 parts, ~35 questions) |
| `references/synthesis.md` | How answers map to the 5 profile fields |
| `references/mcp-tools.md` | `get_my_profile` + `set_my_profile` signatures |
| `examples/sam-thornbury/` | End-to-end fictional worked example |
