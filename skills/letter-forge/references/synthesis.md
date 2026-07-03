# Synthesis — Answers to Profile Fields

> How the questionnaire answers map to the five `set_my_profile` fields.
> Follow this guide when synthesizing after the questionnaire (or after each part).

---

## The five fields

| Field | Purpose in /apply and /rank |
|-------|----------------------------|
| `positioning` | Core narrative; drives the cover letter opening and job-fit calibration |
| `cv_text` | Full CV as Markdown; drives CV tailoring in Phase 2 of /apply |
| `achievements` | Quantified wins; evidence layer in cover letter and CV bullets |
| `skills_matrix` | Skills with evidence; keyword matching in job-fit analysis |
| `writing_style` | Tone and language rules; enforced in every cover letter |

---

## Field-by-field synthesis guide

### positioning

**Source questions**: P1.1, P1.3, P1.8, P5.1, P5.3, P5.4, P5.6 (and P2.7 for colour)

**Structure** (1–2 paragraphs, ~150–200 words total):

1. **Opening sentence**: who you are in professional terms — role type + domain + career stage.
   Do not start with a name.
2. **Thread paragraph**: the connecting narrative — origin (P1.1 / P1.3), what you have built
   or enabled, what makes the path coherent. Use the user's own phrasing where possible.
3. **USP sentence**: the one thing most candidates at this level cannot claim (P5.4),
   plus the target role types (P5.3).

**Tone check**: positioning should read like a confident, honest professional wrote it —
not a recruiter, not a PR agency. Avoid superlatives ("outstanding", "exceptional").
Concrete > generic.

**Example shape** (fictional):
> "Learning designer turned AI enablement lead with seven years building training programmes
> at the intersection of instructional design and enterprise software adoption. Started in
> classroom facilitation, moved into digital curriculum design, then into helping product
> teams teach their tools to non-technical users.
>
> Specializes in making complex technology accessible to people who didn't choose to work
> with it. Targeting enablement, learning experience, and AI adoption roles in organizations
> that are mid-transition — where the gap between what the tools can do and what the team
> can do is the main bottleneck."

---

### achievements

**Source questions**: P4.1–P4.8 (primary), P1.4 (secondary)

**Structure**: one achievement per line in this format:

```
[Verb] [what] at [context/org type] — [quantified result] ([year or range])
```

Rules:
- Every line needs at least one number (%, £/$, headcount, time saved, NPS, rank).
- If the user gave a STAR story but no number: ask once ("can you put a rough number on the result?"). Accept estimates ("~30%", "roughly 5x").
- Avoid job-description language ("responsible for"). Use outcome verbs: reduced, grew, shipped, saved, rebuilt, led, closed.
- 4–8 lines is the target. More dilutes impact.

**Example shape** (fictional):
```
Rebuilt onboarding programme for 120-person ops team — reduced time-to-productivity from 6 weeks to 3 (2023)
Led cross-functional rollout of LLM-powered triage tool across 4 business units — adoption reached 78% in 90 days (2024)
Designed and delivered 60+ AI literacy workshops — average NPS 8.6, zero facilitation budget (2022–2024)
Negotiated vendor contract restructure — saved €180k annually without scope reduction (2022)
```

---

### skills_matrix

**Source questions**: P3.1–P3.6 (working style), P4.1–P4.8 (evidence), P1.8 (peer perception)

**Structure**: skill name + evidence snippet, one per line:

```
[Skill or capability] — [specific evidence from questionnaire answers]
```

Rules:
- Evidence must be traceable to a specific answer, not a claim ("strong communicator" alone = rejected).
- Mix hard skills (tools, languages, methods) and soft skills (collaboration, communication, leadership style).
- 6–12 lines. Group loosely by domain if helpful.

**Example shape** (fictional):
```
Instructional design — designed 60+ workshops; built blended learning curriculum for 3 enterprise clients
Facilitation — ran live sessions up to 200 participants; adapted style for technical vs. executive audiences
LLM integration (applied) — built two production AI workflows using OpenAI + n8n; no prior ML background
Stakeholder management — led quarterly reviews with C-suite; managed expectations across 4 departments
Written communication — comfortable with long-form; described by colleagues as "clear and direct"
Change adoption — onboarded 120-person ops team to new tooling; tracked adoption to 78% in 90 days
```

---

### writing_style

**Source questions**: P2.1 (non-negotiables reveal what to avoid), P2.7 (authentic self at work),
P3.2 (how they explain things), P3.4 (written communication relationship), P3.6 (perfectionism)

**Structure**: a short ruleset — tone, DON'Ts, and 1–2 example phrases or patterns.

Rules:
- Derive rules FROM the answers, don't invent generic rules.
- If P3.4 shows the user is formal: note "no contractions, formal register".
- If P3.2 shows strong analogy use: note "use analogies and concrete examples".
- DON'Ts are as important as DOs — they prevent /apply from defaulting to generic cover-letter prose.
- 150–250 words.

**Example shape** (fictional):
```
Tone: direct, specific, warm but not casual. Write in first person. No management-speak.

Sentence style: short to medium. Use analogies and concrete examples (the user explains
complex things by grounding them in familiar situations). Avoid abstract nouns ("leverage",
"synergy", "ecosystem").

Cover letter voice: write as someone who thinks carefully before speaking — measured,
not effusive. The user finds excessive enthusiasm embarrassing; dial back exclamation
marks and superlatives entirely.

DON'Ts:
- No "I am passionate about..." openers
- No "track record of delivering results" or similar hollow phrases
- No lists in the cover letter body — prose only
- Do not overstate certainty; "I expect to contribute X" not "I will definitely deliver X"

Signature phrases that fit: "what I've found is...", "the pattern I've noticed...",
"the clearest example of this is..."
```

---

### cv_text

**Source questions**: Parts 1 and 4 often surface timeline data (company types, role names,
durations, outcomes). If the user provides enough structured information, generate a Markdown CV.

**Trigger for generating cv_text**: the user has provided role names, rough dates,
and at least one achievement per role. If data is sparse, note the gap and leave
`cv_text` blank rather than fabricating.

**Structure** (Markdown):
```markdown
## [Name — omit if not provided]

[Positioning paragraph — copy from `positioning` field, shortened to 3 sentences]

## Experience

### [Role Title] — [Company type / sector], [Year range]
- [Achievement or responsibility, one per bullet]
- ...

## Skills
[Key skills, one line each]

## Education
[Degree / certification, year]
```

---

## Synthesis workflow

1. After the questionnaire (or after each part in incremental mode), gather all collected answers.
2. For each field: identify the source questions, extract the key phrases and facts.
3. Draft each field following the structure above.
4. **Show each draft to the user as a Markdown block** — never write without showing first.
5. Apply any edits the user requests.
6. Call `set_my_profile({field: "..."})` for each confirmed field.
