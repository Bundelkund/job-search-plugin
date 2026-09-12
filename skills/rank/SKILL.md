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
> Matches and postings come from the tenant connector, your profile from `~/job-search/profile.md` by default. No shell commands.
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
- A profile to calibrate against — `~/job-search/profile.md` by default; read
  `references/storage.md` before loading it
- Search terms set for this user — `get_my_search_terms()` returns a non-empty
  list. Without them no match can ever exist; Phase 0 checks this first
- At least one job match in the tenant (`get_my_matches` returns results)
- A rubric — either the user's own, or the worked example in `references/scoring-rubric.md`

---

## I/O

See `references/mcp-tools.md` for full signatures and response shapes.

| Tool | Purpose |
|------|---------|
| `get_my_search_terms(kind?)` | Phase 0 precondition — no terms, no matches, ever |
| `get_my_matches(min_score?, limit?)` | Ranked job list — metadata only |
| `get_job(job_id)` | Full posting text — needed for scoring |
| the profile — `~/job-search/profile.md` locally, `get_my_profile()` on the server | Drives rubric calibration (see `references/storage.md`) |
| `save_application({job_id, status, ...})` | Optional: mark picks as "drafted" |

---

## Workflow

### Phase 0: Precondition — are there terms to search with?

**Run this before anything else.** Call `get_my_search_terms()`.

An empty list means the nightly run has never had anything to look for, so there
are no matches and none will appear. Say that plainly and send the user to
`/letter-forge` (Phase 5) to set role and location terms. Do **not** continue into
the rubric work: making someone define a scoring rubric and pick archetype cards,
only to report zero matches afterwards, wastes their time and hides the cause.

This is not hypothetical. The first outside user ran the full onboarding, then
`/rank`, and got "0 job matches" with no explanation — the terms had never been
set, and nothing in the flow said so.

If terms exist but `get_my_matches` is still empty, that is a **different** state
and deserves a different sentence: the terms are stored, but no nightly run has
produced matches for them yet. Matching runs once a day; freshly added terms take
until the next run. Say which of the two cases applies — never just "0 matches".

### Phase 1: Load rubric + profile

1. **Rubric** — ask the user: "Do you want to use the example Coaching × AI rubric, or define your own?" If own: guide them through two weighted dimensions (0–40 each) + an intersection bonus (0–20) + a requirements-gap penalty (0 to −20, for postings that demand something you don't have) = up to 100 total. Default fallback: the worked example in `references/scoring-rubric.md`.
2. **Profile** — load the profile as `references/storage.md` prescribes and take its `positioning` section. This becomes the calibration anchor for the archetype cards.
3. **Archetype cards** — ask the user for 2–3 reference roles or application types that represent their ideal fit. These become few-shot anchors for the scoring agents. See `references/archetype-cards.md` for the pattern.

### Phase 2: Pull candidates

1. Call `get_my_matches(min_score=<threshold>)` — default threshold: 40.
2. **Do not cap by tenant score before scoring.** The tenant match-loop uses a generic profile; your rubric may surface high-fit roles the tenant ranked low. Cap happens AFTER re-rank.
3. Warn the user if `--limit N` is set: "Jobs beyond rank N by tenant score will not be scored — high-fit roles with a low tenant score may be missed." This is not theoretical: in a measured run, capping at 60 % of the candidates still dropped 8 of the final top 20, because the tenant score bunches most candidates on two or three values and the cut lands inside a tie.
4. **Cross-check against the tracker before scoring** (skip with `--refresh`). In `local` mode, read `job_id` and posting URL from every `applications/<slug>/application.md`; a candidate that matches one of them gets `red_flags: ["already_applied"]` and is never presented as a pick — even if its `recommend` comes back `true`, because `recommend` is the rubric's opinion of the role, not a go-ahead. A different role at a company you already applied to is allowed; flag it as `company_applied_elsewhere` so the user sees it. In `tenant` mode the connector cannot read applications yet — say so, and ask the user to name anything they have already applied to.
5. For each candidate: call `get_job(job_id)` to retrieve the full description.
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
  "requirements_gap": 0 to -20,
  "total": 0-100,
  "best_archetype": "archetype-label | none",
  "reasoning": "1-2 sentences",
  "red_flags": ["recruiter_ad", "empty_description", ...],
  "recommend": true | false
}
```

**Count what came back.** After the agents return, compare the `job_id`s you sent per chunk with the ones you received, and re-request the missing ones from the same agent before aggregating. Agents drop jobs silently: in a measured run two of seven agents each returned one job short while reporting "done" — the loss is invisible in the totals and, because low-tenant-score jobs sit at the end of a chunk, it tends to hit exactly the roles the re-rank exists to find.

`total = dim_a_score + dim_b_score + intersection_score + requirements_gap` (the gap term is negative or zero — see `references/scoring-rubric.md` for why this dimension exists: it catches roles that score perfectly on content but are unreachable because of a hard must-have you don't meet).

Red flag heuristics (automatic — agents apply these without being told explicitly):

| Flag | Trigger |
|------|---------|
| `recruiter_ad` | Posting is an agency/headhunter ad, no real employer named |
| `empty_description` | Description blank or < 50 chars |
| `boilerplate_only` | Posting is entirely generic copy, no specific role requirements |
| `title_company_mismatch` | Title signals one role, company signals an unrelated sector |
| `requirements_gap` | `requirements_gap` deduction is −8 or worse |
| `already_applied` | Set in Phase 2, not by the agent: the tracker already holds this posting — never a pick |
| `company_applied_elsewhere` | Set in Phase 2: same company, different role — allowed, shown to the user |

### Phase 4: Aggregate + present

Sort by `total` descending. Treat the score as a noisy measurement, not a precise value: re-scoring the same job with the same rubric moved it by a median of 5 points in a measured run, a quarter of the jobs moved 10 or more, and a few flipped `recommend`. So present ties and near-ties as ties, and if you keep results across runs (Phase 5, `--refresh`), aggregate each job with the **median** of its runs rather than the latest value — the median ignores a single outlier run, the mean does not.

Present the ranked table in-conversation:

```
| Rank | Score | Dim A | Dim B | ∩ | Gap | Company       | Title               | Location | Archetype | Flags | Rec |
|------|-------|-------|-------|---|-----|---------------|---------------------|----------|-----------|-------|-----|
|  1   |  88   |  38   |  32   | 18|  0  | Nexus Labs    | AI Training Lead    | Berlin   | coach-ai  |       |  ✓  |
|  2   |  74   |  28   |  30   | 16|  0  | Orbit GmbH    | Learning Architect  | Remote   | enabler   |       |  ✓  |
...
```

Then present top-5 with reasoning and `/apply` suggestions:

```
Top pick: Nexus Labs / AI Training Lead (score 88)
Reasoning: Strong match on both coaching and AI dimensions; intersection bonus for training-led AI rollout.
→ /apply abc-123-def
```

### Phase 5: Optional save

Ask: "Do you want to mark any of these as drafted?" If yes, record it for each
pick the way `references/storage.md` prescribes — `local`: an `application.md`
with `status: drafted` under `applications/<slug>/`, then regenerate `INDEX.md`;
`tenant`: `save_application({job_id, status: "drafted", company, role})`.

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
- Skipping the requirements-gap dimension — a role that scores well on content but fails a hard must-have is a guaranteed rejection, not a top pick; scoring content alone puts unreachable roles at the top
- Reading `recommend: true` as clearance to apply — it is the rubric's verdict on the role; the tracker cross-check (Phase 2) decides whether the job is still open for you
- Trusting an agent's "done" instead of counting returned `job_id`s — silent drops are the norm, not the exception
- Comparing two runs by their latest scores — a 5-point move between runs is noise; use the median across runs

---

## Reference index

| File | Purpose |
|------|---------|
| `references/storage.md` | **Read first.** local vs. tenant mode, where the profile lives, the `profile.md` format |
| `references/mcp-tools.md` | Tool signatures, response shapes, error handling |
| `references/scoring-rubric.md` | Generic rubric structure + Coaching × AI worked example |
| `references/archetype-cards.md` | How to write archetype cards + fictional examples |
| `examples/nexus-ai-training-lead/example-ranking.md` | End-to-end worked example |
