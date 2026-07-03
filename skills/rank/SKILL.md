---
name: rank
description: >
  Re-ranks your job matches by a fit rubric YOU define — a pre-step to /apply.
  Fetches matches via MCP, scores them in parallel against your rubric, and
  returns a ranked table entirely in-conversation. No local files, no Google
  Sheets, no eval capture — just the ranking.
  Use when user says "rank", "rank jobs", "rank my matches", "/rank".
---

# /rank — Job Match Re-Ranker

> Re-ranks tenant match results by a fit rubric the USER defines.
> Runs fully in-conversation via the tenant MCP tools — no local filesystem, no shell commands.
> Companion pre-step to `/apply`.

## When to use

- After a job-discovery run (matches are already in the tenant)
- Before `/apply`, to find the highest-signal jobs from a noisy match list
- When the user says "rank", "rank my matches", "which jobs are best", "/rank"

Do **not** use for:
- Writing cover letters — hand that off to `/apply <job_id>`
- Running batch applications
- Modifying the user's profile

---

## Prerequisites

- Tenant connector installed with a provisioned API key
- At least one job match in the tenant (`get_my_matches` returns results)
- A rubric — either the user's own, or the worked example in `references/scoring-rubric.md`

---

## MCP tools (the only I/O)

See `references/mcp-tools.md` for full signatures and response shapes.

| Tool | Purpose |
|------|---------|
| `get_my_matches(min_score?, limit?)` | Ranked job list — metadata only |
| `get_job(job_id)` | Full posting text — needed for scoring |
| `get_my_profile()` | User profile — drives rubric calibration |
| `save_application({job_id, status, ...})` | Optional: mark picks as "drafted" |

---

## Workflow

### Phase 1: Load rubric + profile

1. **Rubric** — ask the user: "Do you want to use the example Coaching × AI rubric, or define your own?" If own: guide them through two weighted dimensions (0–40 each) + an intersection bonus (0–20) = 100 total. Default fallback: the worked example in `references/scoring-rubric.md`.
2. **Profile** — call `get_my_profile()` and extract the `positioning` field. This becomes the calibration anchor for the archetype cards.
3. **Archetype cards** — ask the user for 2–3 reference roles or application types that represent their ideal fit. These become few-shot anchors for the scoring agents. See `references/archetype-cards.md` for the pattern.

### Phase 2: Pull candidates

1. Call `get_my_matches(min_score=<threshold>)` — default threshold: 40.
2. **Do not cap by tenant score before scoring.** The tenant match-loop uses a generic profile; your rubric may surface high-fit roles the tenant ranked low. Cap happens AFTER re-rank.
3. Warn the user if `--limit N` is set: "Jobs beyond rank N by tenant score will not be scored — high-fit roles with a low tenant score may be missed."
4. For each candidate: call `get_job(job_id)` to retrieve the full description.
   - If description is empty (common for LinkedIn jobs): score on title + company only; mark `red_flags: ["empty_description"]`.

### Phase 3: Parallel scoring

Chunk candidates into groups of ~20. Spawn one general-purpose subagent per chunk (Sonnet). Each agent receives:

1. The user's rubric (from Phase 1)
2. The archetype cards (from Phase 1)
3. ~20 jobs as JSON

Output per job (JSON):
```json
{
  "job_id": "string",
  "dim_a_score": 0-40,
  "dim_b_score": 0-40,
  "intersection_score": 0-20,
  "total": 0-100,
  "best_archetype": "archetype-label | none",
  "reasoning": "1-2 sentences",
  "red_flags": ["recruiter_ad", "empty_description", ...],
  "recommend": true | false
}
```

Red flag heuristics (automatic — agents apply these without being told explicitly):

| Flag | Trigger |
|------|---------|
| `recruiter_ad` | Posting is an agency/headhunter ad, no real employer named |
| `empty_description` | Description blank or < 50 chars |
| `boilerplate_only` | Posting is entirely generic copy, no specific role requirements |
| `title_company_mismatch` | Title signals one role, company signals an unrelated sector |

### Phase 4: Aggregate + present

Sort by `total` descending. Present the ranked table in-conversation:

```
| Rank | Score | Dim A | Dim B | ∩ | Company       | Title               | Location | Archetype | Flags | Rec |
|------|-------|-------|-------|---|---------------|---------------------|----------|-----------|-------|-----|
|  1   |  88   |  38   |  32   | 18| Nexus Labs    | AI Training Lead    | Berlin   | coach-ai  |       |  ✓  |
|  2   |  74   |  28   |  30   | 16| Orbit GmbH    | Learning Architect  | Remote   | enabler   |       |  ✓  |
...
```

Then present top-5 with reasoning and `/apply` suggestions:

```
Top pick: Nexus Labs / AI Training Lead (score 88)
Reasoning: Strong match on both coaching and AI dimensions; intersection bonus for training-led AI rollout.
→ /apply abc-123-def
```

### Phase 5: Optional save

Ask: "Do you want to mark any of these as drafted?" If yes: call `save_application({job_id, status: "drafted", company, role})` for each pick.

---

## Parameters

```
/rank                          # Default: min_score=40, all candidates, top-20 output
/rank --min-score 55           # Raise the tenant-score floor
/rank --limit 50               # Cap candidates at 50 (Sonnet-budget guardrail) — shows warning
/rank --rubric coaching-ai     # Load the worked example rubric from references/
/rank --refresh                # Re-score jobs already in tracker
```

---

## Anti-patterns

- Capping by tenant score BEFORE re-ranking — defeats the purpose; cap only after
- Inlining the full rubric logic here — keep it in `references/scoring-rubric.md`
- Writing cover letters inside this skill — hand off to `/apply`
- Copying the worked example rubric as if it were the user's rubric — always confirm first

---

## Reference index

| File | Purpose |
|------|---------|
| `references/mcp-tools.md` | Tool signatures, response shapes, error handling |
| `references/scoring-rubric.md` | Generic rubric structure + Coaching × AI worked example |
| `references/archetype-cards.md` | How to write archetype cards + fictional examples |
| `examples/nexus-ai-training-lead/example-ranking.md` | End-to-end worked example |
