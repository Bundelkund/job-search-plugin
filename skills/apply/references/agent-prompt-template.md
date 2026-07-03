# Writing reference — /apply

> The writing rules this skill follows. Tone and structure live here — not in SKILL.md. All profile data is loaded at runtime via `get_my_profile()`.

---

## Profile context (loaded at runtime)

The five fields from `get_my_profile()` map as follows:

| Field | Content |
|-------|---------|
| `positioning` | Core narrative — three sentences, three pillars, one USP |
| `cv_text` | Full CV as Markdown |
| `achievements` | Quantified wins, one per row |
| `skills_matrix` | Skills with evidence (not a self-assessment scale) |
| `writing_style` | Tone, language rules, DON'Ts |

At runtime, load the full profile once via `get_my_profile()`. On edge cases (unclear fit, missing evidence) reload and re-examine the relevant field.

---

## Positioning structure (from `positioning`)

Three sentences, three pillars, one USP.

**Three pillars**:
1. **{{Pillar 1 — e.g. Tech}}**: one-liner with evidence
2. **{{Pillar 2 — e.g. Mediation}}**: one-liner with evidence
3. **{{Pillar 3 — e.g. Systemic / Agile}}**: one-liner with evidence

**USP**: the unique combination — e.g. "X + Y. I can do A AND explain B."

---

## Key achievements (from `achievements`)

Quantified wins, one per row. Numbers + context + source.

| Evidence | Numbers | Context |
|----------|---------|---------|
| achievement 1 | number | org / year |
| achievement 2 | number | org / year |

> **Composition rules**:
> - Achievements from different workstreams or periods MUST NOT be linked as causality unless evidence supports it ("X went up BECAUSE of Y" requires a documented chain — e.g. two KPIs from the same project are NOT automatically causally related just because they occurred in the same role).
> - When in doubt, present achievements as parallel, independent facts.

---

## Tone (from `writing_style`)

- **DO**: concrete numbers, active verbs, name the impact, own projects as evidence
- **DON'T**: abstract buzzwords ("synergies"), therapy language, passive constructions, exaggeration, frameworks without context, unchecked anglicisms (in German text)

---

## The "Jonas rule" (cover-letter core)

> Describe how you have already solved this company's problem.

1. Name the company's problem (shows understanding)
2. A concrete example of how you solved exactly that problem
3. What the company gets from it (NOT: what you can do)

**No** achievement parade. Examples only as evidence for problem-solution.

---

## Three-pillar composition

Every cover letter has ONE leading pillar. The others serve it.

| Posting type | Leading pillar | Serving |
|--------------|----------------|---------|
| L&D / training / upskilling | Mediation | Tech as evidence, Agile as change-skill |
| Innovation / AI consulting | Tech | Mediation as differentiator, Agile as method |
| Agile coach / change | Systemic / Agile | Mediation as facilitation, Tech as context |

**Rules**:
1. Every paragraph connects at least 2 pillars
2. Tech projects are context, not parade
3. Red thread = company problem → my solution → company benefit
4. Closing paragraph = what the company gets (NOT: why I want to apply)

---

## Language rules (mandatory for German output)

- **Umlauts**: ALWAYS UTF-8 (ä, ö, ü, ß). NEVER ASCII replacements (ae, oe, ue, ss). This includes words like Führung, Veränderung, Gespräch, über, würde, Lücke, Lösung, Einführung.
- **Salutation**:
  - formal (default): "Sehr geehrte/r Frau/Herr {{Lastname}}"
  - informal (Du-culture): "Hallo," WITHOUT a name
  - forbidden: first name in salutation, body, or closing
  - never "Lieber/Liebe {{Name}}" — too personal
- **Em dashes**: always `—`, never `--`
- **No standalone name line in the body**: NEVER write a bare `{{Author Name}}` line before or after the closing formula. The template renders the author name automatically from the YAML header — a duplicate name line in the body produces a double name in the rendered output. The body ends with the last paragraph; the closing formula comes from the YAML header.

---

## Cover-letter structure (4 paragraphs, max 1 page)

1. **Opening** (2–3 sentences): name the company's problem
2. **Mediation evidence** (4–5 sentences): concrete example with numbers (lean into the leading pillar)
3. **Second pillar** (3–4 sentences): the serving pillar reinforces
4. **What the company gets** (2–3 sentences): concrete benefit + invitation

---

## Motivation block (always personalize!)

One paragraph from `positioning` — what drives you, in your own voice. Always tie it back to the concrete company.

---

## Anti-positioning (DO NOT use)

- Generic role labels with no evidence
- "Therapeutic AI trainer" / "Functional AI consultant" / "Digital transformation expert" — every cover letter has them, none of them mean anything
- Buzzwords without a concrete project as evidence

---

## Mandatory steps (do not skip)

1. **Company research before the cover letter** (web research in Phase 3a)
2. **Pick the leading pillar** (from posting type → three-pillar table)
3. **Produce both CV and cover letter** as polished Markdown
4. **Keyword reconciliation** (HTML comment at the bottom of the cover letter: every must-have keyword OK / NOT OK with reasoning)
5. **Template review** (Phase 4a checklist)
6. **Tracker update** via `save_application` (Phase 5a)
