---
name: apply
description: Cover-letter + CV generator from job posting to ready-to-send Markdown. Fetches the job posting and your profile via MCP tools, runs job-fit analysis, CV tailoring, company research, cover letter writing, and adversarial review — entirely in-conversation. Use when user says "apply", "Bewerbung", "cover letter", "Anschreiben", "/apply".
---

# /apply — Application Builder

> From job posting to a polished cover letter + CV in Markdown. Runs fully in-conversation via the tenant MCP tools — no local filesystem, no shell commands, no PDF pipeline.

## When to use

Use this skill when:
- User has a job posting (text or a `job_id` from `get_my_matches`)
- User says "apply", "Bewerbung schreiben", "cover letter", "/apply"
- User runs `/apply` without an argument → list top jobs from `get_my_matches`

Do **not** use for:
- Editing the user's profile directly (the tenant owner does that via `PUT /my/profile`)
- Batch / automation runs (not available in-conversation — see note below)

---

## Prerequisites

- Tenant connector installed and a provisioned API key (see `references/setup.md`)
- Profile populated by the tenant owner via `PUT /my/profile` (5 fields required — see setup)

---

## MCP tools (the only I/O)

| Tool | Purpose |
|------|---------|
| `get_my_matches(min_score?, limit?)` | Ranked job list — metadata only |
| `get_job(job_id)` | Full posting text — mandatory input for cover letter |
| `get_my_profile()` | 5-field profile (positioning, cv_text, achievements, skills_matrix, writing_style) |
| `save_application({job_id, status, company?, role?, notes?})` | Tracker write; `status` ∈ `drafted \| applied \| interview \| offer \| rejected \| paused` |

---

## Workflow

### Phase 1: Input & setup

1. **Job suggestions** (when `/apply` called without a posting): call `get_my_matches` and present top results; user picks one
2. **Receive the posting**: text pasted inline **or** `job_id` → call `get_job(job_id)` to retrieve the full description
3. **Load profile**: call `get_my_profile()` — this replaces all `profile/*.md` files
4. **Confirm the job**: present company, role, location, fit-score (if available) to the user

### Phase tracking (mandatory after Phase 1)

```
- [ ] Job posting loaded (Phase 1)
- [ ] job-fit-analysis produced (Phase 2a) — incl. coverage list + gap register
- [ ] cv-anpassung produced (Phase 2b)
- [ ] cv produced (Phase 2c)
- [ ] Company research done (Phase 3a)
- [ ] Contact found or addressed generically (Phase 3b)
- [ ] anschreiben produced + grounding gate passed (Phase 3c)
- [ ] Template review + content gate done (Phase 4a)
- [ ] Adversarial review done if job-fit >= 70 (Phase 4a.5)
- [ ] Tracker updated via save_application (Phase 5)
```

### Phase 2: Analysis

Job-fit check, CV bullet-point upgrade, CV as Markdown.

Read `references/phase-2-analysis.md`.

### Phase 3: Research + cover letter

Company research (mandatory), contact lookup via web research, cover letter using the writing rules in `references/agent-prompt-template.md`.

Read `references/phase-3-research-letter.md`.

### Phase 4: Review

Template review against `references/agent-prompt-template.md`, optional in-context adversarial review (Generator-Verifier gate at job-fit >= 70).

Read `references/phase-4-review.md`.

### Phase 5: Completion

Tracker update via `save_application`, application channel research, questions for the hiring team.

Read `references/phase-5-completion.md`.

---

## Revision mode: `/apply --revise`

Reworks the current in-conversation draft based on review feedback.

Read `references/revision-mode.md`.

---

## Artifacts produced in-conversation

All output is in-conversation Markdown (no files written to disk):

| Artifact | Phase |
|----------|-------|
| Job posting summary | Phase 1 |
| `job-fit-analysis` | Phase 2a |
| `cv-anpassung` (bullet upgrade) | Phase 2b |
| `cv` (final tailored CV) | Phase 2c |
| `anschreiben` (cover letter) | Phase 3c |
| Review notes | Phase 4 |

**PDF export**: not available in-conversation. Copy the final Markdown to your preferred editor for PDF export.

---

## Principles

1. **Template = single source of truth.** Tone and structure live in `references/agent-prompt-template.md`.
2. **Company research is mandatory.** Never write a cover letter without it.
3. **Profile data = data source.** Every claim must be traceable to `get_my_profile()` fields.
4. **Job text is mandatory.** Call `get_job(job_id)` before Phase 2.

## Anti-patterns

- Inline writing rules in SKILL.md (they belong in `references/agent-prompt-template.md`)
- Skipping company research
- Cover letter > 1 page
- Writing without calling `get_job` first

## Note: batch mode and automation

Batch mode (parallel applications) and daily auto-apply automation are not available in-conversation. For automation, use the Claude Code variant of this skill.

---

## Reference index

| File | Purpose |
|------|---------|
| `references/setup.md` | First-time connector + profile setup |
| `references/agent-prompt-template.md` | Writing rules (tone, structure, Jonas-Regel) |
| `references/phase-2-analysis.md` | Job-fit + CV tailoring |
| `references/phase-3-research-letter.md` | Company research, contact lookup, cover letter |
| `references/phase-4-review.md` | Review + adversarial review |
| `references/phase-5-completion.md` | Tracker update, channel research |
| `references/revision-mode.md` | Revision workflow |
| `references/templates.md` | CV + cover-letter Markdown structure |
