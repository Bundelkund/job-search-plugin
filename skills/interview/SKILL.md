---
name: interview
description: >
  Prepares an interview dossier from a job posting + your profile + whatever
  you paste in (invitation email, salary research, prior debrief notes), and
  records what happened afterward. Saves prep and debrief as Markdown files
  under ~/job-search by default, or to the tenant service where no file tool
  exists. No shell commands, no email search. Use when user says "prep my interview", "interview prep",
  "I have an interview", "log my interview", "debrief", "how did the interview
  go", "/interview".
---

# /interview — Prepare and Debrief

> Two moments, one skill: before the room, and right after you leave it.
>
> Builds a prep dossier and records a debrief for one interview round. Job
> postings and your profile come from the tenant service; what you write stays
> local by default. No shell commands, no email search.

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

**This skill never writes to the profile.** Prep dossiers and debrief notes stay
in their own place — `interviews/<slug>/` locally, `save_interview`'s
`prep_notes`/`debrief_notes`/`outcome` fields on the server. Never `profile.md`,
never `set_my_profile`. If something from an interview genuinely
belongs in the profile (a phrasing that worked, a gap you now have a good answer
for), that's a conscious, separate `/letter-forge` update — never automatic.

---

## Prerequisites

- Tenant connector installed with a provisioned API key (v0.3.0+ if you run in
  `tenant` storage mode — `save_interview`/`get_my_interviews` are new there)
- A `job_id` — from `get_my_matches()` or a prior `/apply <job_id>` run
- Somewhere to write: `$JOB_SEARCH_HOME`, or `~/job-search` by default. Read
  `references/storage.md` before the first read or write of this run — it
  decides local vs. tenant and fixes the file layout

---

## I/O

The job posting always comes from the tenant service:

| Tool | Purpose |
|------|---------|
| `get_job(job_id)` | Full posting text — the dossier's factual anchor |

Everything else follows the storage mode (`references/storage.md`):

| Purpose | `local` (default) | `tenant` |
|---------|-------------------|----------|
| Read the profile | `~/job-search/profile.md` | `get_my_profile()` |
| Update the tracker (optional, once the outcome is known) | `applications/<slug>/application.md` + `INDEX.md` | `save_application({...})` |

Your own written material — depends on the storage mode (`references/storage.md`):

| Purpose | `local` (default) | `tenant` |
|---------|-------------------|----------|
| Read prior rounds | grep `job_id:` across `~/job-search/interviews/*/*.md` | `get_my_interviews(job_id?)` |
| Save prep notes | write `interviews/<slug>/<stage>-prep.md` | `save_interview({prep_notes})` |
| Save debrief | write `interviews/<slug>/<stage>-debrief.md` | `save_interview({debrief_notes, outcome?})` |

See `references/mcp-tools.md` for full signatures, and specifically the
`(job_id, stage)` identity rule — a second call with the same `stage` merges
onto the same row instead of creating a new one.

---

## Workflow

### Mode 1: Prep

1. Ask for (or infer from context) the `job_id` and the round's `stage`
   (e.g. "screening", "technical", "onsite" — free text, whatever the user calls it).
2. Call `get_job(job_id)` for the posting and `get_my_profile()` for background.
3. Look up prior rounds for this job — `local`: grep `job_id:` across
   `~/job-search/interviews/*/*.md`; `tenant`: `get_my_interviews(job_id)`.
   If an earlier debrief exists, it may hint at what this company probes for.
4. Ask the user to paste anything else relevant: the invitation email, known
   interviewer names/roles, salary research, anything they've already learned
   about the process. Optional — proceed without it if they have nothing.
5. Draft the dossier in-conversation (see `references/dossier-structure.md` for
   the section breakdown: role summary, likely question areas mapped to your
   `achievements`/`skills_matrix`, questions to ask them, salary framing if
   relevant, open gaps to prepare an answer for).
6. Show the dossier. Ask if the user wants it saved as prep notes.
7. If yes, write it — `local`: `interviews/<slug>/<stage>-prep.md` with the
   frontmatter from `references/storage.md`, then read it back and print the
   full path; `tenant`: `save_interview({ job_id, stage, prep_notes })`.
   Keep the polished dossier text, not a summary — this is the only copy.

### Mode 2: Debrief

1. Get the `job_id` and `stage` (list the existing stages the same way Mode 1
   step 3 does, if the user isn't sure which round this was).
2. Ask what happened: questions asked, how it went, any signals about next
   steps or salary, self-assessment. Free-form, a few prompts is enough —
   this isn't a questionnaire like `/letter-forge`.
3. Ask for an outcome if known ("moving to next round", "rejected", "no word
   yet") — leave `outcome` unset if genuinely unknown, don't guess.
4. Show the synthesized debrief and ask whether to save it — the same courtesy
   Mode 1 extends to the dossier. On yes, write it: `local`:
   `interviews/<slug>/<stage>-debrief.md`, a separate file that leaves
   `<stage>-prep.md` untouched, then read it back and print the path;
   `tenant`: `save_interview({ job_id, stage, debrief_notes, outcome? })`,
   which merges onto the Mode-1 row and preserves `prep_notes`.
5. If the outcome changes the application's overall status (e.g. now clearly
   `interview`, `offer`, or `rejected`), offer to update the tracker too — see
   the tracker section of `references/storage.md`. Confirm with the user before
   writing; this skill doesn't assume `/dispatch` was already used to open the
   entry.

### Mode 3: Overview

User asks "what's coming up" or similar with no specific job — `local`: list
`~/job-search/interviews/*/`, reading each file's frontmatter; `tenant`:
`get_my_interviews()` with no filter. Group rounds by job and flag any round
that has a prep file but no debrief file (or `prep_notes` without
`debrief_notes`) — an interview without a debrief is lost information, worth a
nudge.

---

## Anti-patterns

- Calling `set_my_profile` from anything learned in this skill — see the
  separation rule above
- Losing the prep notes when writing a debrief — locally they are separate
  files, so never write the debrief into `<stage>-prep.md`; on the server let
  `save_interview`'s merge handle it and only send the fields that changed
- Guessing an `outcome` the user hasn't told you
- Treating a prep dossier or a debrief as ready to save without showing it first
- Skipping the prior-rounds lookup in Mode 1 when a round likely exists —
  repeating question-area guesses a past debrief already answered
- Reporting a save you did not verify — read the file back and print its path,
  or say plainly that the write failed (see `references/storage.md`)
- Asking the user which storage mode to use — decide it, then say which one

---

## Reference index

| File | Purpose |
|------|---------|
| `references/storage.md` | **Read first.** local vs. tenant mode, the `~/job-search` layout, file frontmatter, verify-after-write |
| `references/mcp-tools.md` | `save_interview`/`get_my_interviews` signatures for `tenant` mode, the `(job_id, stage)` merge identity, error handling |
| `references/dossier-structure.md` | The prep dossier's section breakdown and how to map profile fields into it |
