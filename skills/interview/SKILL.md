---
name: interview
description: >
  Prepares an interview dossier from a job posting + your profile + whatever
  you paste in (invitation email, salary research, prior debrief notes), and
  records what happened afterward via save_interview. Runs fully in-conversation
  via the tenant MCP tools — no local filesystem, no shell commands, no email
  search. Use when user says "prep my interview", "interview prep",
  "I have an interview", "log my interview", "debrief", "how did the interview
  go", "/interview".
---

# /interview — Prepare and Debrief

> Two moments, one skill: before the room, and right after you leave it.
>
> Builds a prep dossier and records a debrief for one interview round — entirely
> in-conversation via the tenant MCP tools. No local filesystem, no shell
> commands, no email search.

## When to use

- Before a scheduled interview round — user has a `job_id` (and, ideally, the
  invitation text pasted in) and wants a prep dossier
- Right after a round happened — user wants to record what was asked, how it
  went, and update the tracker
- User says "prep my interview", "I have an interview", "log my interview",
  "debrief", "how did it go", "/interview"

Do **not** use for:
- Writing the original cover letter/CV — that's `/apply <job_id>`
- Just marking an application as sent with no interview involved — that's `/dispatch`
- Building/updating the profile — use `/letter-forge`

---

## The separation rule — why prep/debrief content stays out of your profile

Your `positioning`/`achievements`/`skills_matrix`/`writing_style` fields are the
verified backbone `/apply` builds cover letters from. Interview material is a
different kind of thing: your own recollection of what was asked, guesses about
what the interviewer was really probing for, salary numbers you inferred from
the conversation. Useful for the *next* round with this company. Not something
`/apply` should ever quote as fact in a *different* cover letter.

**This skill never calls `set_my_profile`.** Prep dossiers and debrief notes stay
in `save_interview`'s `prep_notes`/`debrief_notes`/`outcome` fields — a separate
place from the profile, by design. If something from an interview genuinely
belongs in the profile (a phrasing that worked, a gap you now have a good answer
for), that's a conscious, separate `/letter-forge` update — never automatic.

---

## Prerequisites

- Tenant connector (>= v0.3.0 — `save_interview`/`get_my_interviews` are new)
  installed with a provisioned API key
- A `job_id` — from `get_my_matches()` or a prior `/apply <job_id>` run

---

## MCP tools (the only I/O)

| Tool | Purpose |
|------|---------|
| `get_job(job_id)` | Full posting text — the dossier's factual anchor |
| `get_my_profile()` | Your `positioning`/`achievements`/`skills_matrix` — what to bring into the room |
| `get_my_interviews(job_id?)` | Prior rounds for this job (or all rounds), including past debriefs |
| `save_interview({...})` | Write prep notes (before) or debrief notes (after) for one round |
| `save_application({...})` | Optional: update the application's tracker status once the outcome is known |

See `references/mcp-tools.md` for full signatures, and specifically the
`(job_id, stage)` identity rule — a second call with the same `stage` merges
onto the same row instead of creating a new one.

---

## Workflow

### Mode 1: Prep

1. Ask for (or infer from context) the `job_id` and the round's `stage`
   (e.g. "screening", "technical", "onsite" — free text, whatever the user calls it).
2. Call `get_job(job_id)` for the posting and `get_my_profile()` for background.
3. Call `get_my_interviews(job_id)` — if a prior round's debrief exists, its
   `debrief_notes` may hint at what this company probes for.
4. Ask the user to paste anything else relevant: the invitation email, known
   interviewer names/roles, salary research, anything they've already learned
   about the process. Optional — proceed without it if they have nothing.
5. Draft the dossier in-conversation (see `references/dossier-structure.md` for
   the section breakdown: role summary, likely question areas mapped to your
   `achievements`/`skills_matrix`, questions to ask them, salary framing if
   relevant, open gaps to prepare an answer for).
6. Show the dossier. Ask if the user wants it saved as prep notes.
7. If yes: call `save_interview({ job_id, stage, prep_notes: <dossier text> })`.
   Keep it as the polished dossier text, not a summary — this is the only place
   it's stored.

### Mode 2: Debrief

1. Get the `job_id` and `stage` (use `get_my_interviews(job_id)` to show existing
   stages if the user isn't sure which round this was).
2. Ask what happened: questions asked, how it went, any signals about next
   steps or salary, self-assessment. Free-form, a few prompts is enough —
   this isn't a questionnaire like `/letter-forge`.
3. Ask for an outcome if known ("moving to next round", "rejected", "no word
   yet") — leave `outcome` unset if genuinely unknown, don't guess.
4. Call `save_interview({ job_id, stage, debrief_notes: <synthesized text>, outcome? })`.
   This merges onto the same row Mode 1 wrote to, if there was a Mode-1 call —
   prep notes are preserved, not overwritten.
5. If the outcome changes the application's overall status (e.g. now clearly
   `interview`, `offer`, or `rejected`), offer to also call `save_application`
   with that status — confirm with the user before writing; this skill doesn't
   assume `/dispatch` was already used to open the tracker entry.

### Mode 3: Overview

User asks "what's coming up" or similar with no specific job: call
`get_my_interviews()` (no `job_id` filter), list rounds grouped by job, and flag
any round that has `prep_notes` but no `debrief_notes` yet — an interview
without a debrief is lost information, worth a nudge.

---

## Anti-patterns

- Calling `set_my_profile` from anything learned in this skill — see the
  separation rule above
- Writing a debrief that overwrites `prep_notes` — always let `save_interview`'s
  merge behavior handle it; only send the fields that changed
- Guessing an `outcome` the user hasn't told you
- Treating a prep dossier as ready to save without showing it to the user first
- Skipping `get_my_interviews(job_id)` in Mode 1 when a prior round likely
  exists — repeating question-area guesses a past debrief already answered

---

## Reference index

| File | Purpose |
|------|---------|
| `references/mcp-tools.md` | `save_interview`/`get_my_interviews` signatures, the `(job_id, stage)` merge identity, error handling |
| `references/dossier-structure.md` | The prep dossier's section breakdown and how to map profile fields into it |
