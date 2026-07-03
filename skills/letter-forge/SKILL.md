---
name: letter-forge
description: >
  Interactive career-narrative questionnaire — builds the 5-field application profile
  that /apply and /rank consume. Runs fully in-conversation via 5 parts (~35 questions):
  story & origin, values, assessment-centre evidence, STAR stories, and happiness alignment.
  Reads existing profile first (gap-fill mode), shows synthesized fields for confirmation,
  then writes them via set_my_profile.
  Use when user says "letter forge", "career questionnaire", "build my profile",
  "narrative", "/letter-forge".
---

# /letter-forge — Career Narrative Questionnaire

> Know your story before you write it.
>
> Builds the 5-field application profile that `/apply` and `/rank` read — entirely
> in-conversation via the tenant MCP tools. No local filesystem, no shell commands.

## When to use

- Before your first `/apply` run — profile is empty or thin
- Before a new job-search phase — narrative needs refreshing
- User says "letter forge", "build my profile", "career questionnaire", "/letter-forge"

Do **not** use for:
- Writing a cover letter — hand that off to `/apply <job_id>`
- Quick CV edits — call `set_my_profile({ cv_text: "..." })` directly
- Ranking jobs — use `/rank`

---

## Prerequisites

- Tenant connector (>= v0.2.0) installed with a provisioned API key
- No profile data required upfront — the skill builds it from scratch

---

## MCP tools (the only I/O)

| Tool | Purpose |
|------|---------|
| `get_my_profile()` | Read existing profile — used in Phase 1 to identify gaps |
| `set_my_profile({...})` | Write profile — partial update, only passed fields are changed |

See `references/mcp-tools.md` for full signatures.

---

## Workflow

### Phase 1: Profile check

1. Call `get_my_profile()`.
2. Show the user which of the five fields already have content and which are empty or thin.
3. Ask: "Run the full questionnaire, or focus on the empty fields only?"
4. If all five fields are already rich: confirm with the user before proceeding (avoid overwriting good content).

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

---

## Reference index

| File | Purpose |
|------|---------|
| `references/questionnaire.md` | Full question bank (5 parts, ~35 questions) |
| `references/synthesis.md` | How answers map to the 5 profile fields |
| `references/mcp-tools.md` | `get_my_profile` + `set_my_profile` signatures |
| `examples/sam-thornbury/` | End-to-end fictional worked example |
