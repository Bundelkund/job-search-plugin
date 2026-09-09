# Storage — where interview material is kept

> This file is duplicated per skill on purpose. Codex installs copy each skill
> directory separately, so a shared file one level up would not survive the copy.

## Two modes

| Mode | When | Where prep/debrief material goes |
|------|------|----------------------------------|
| `local` (default) | You have a file-writing tool — Claude Code, Codex CLI | Markdown files under `$JOB_SEARCH_HOME` |
| `tenant` | No file tool — Claude Desktop, ChatGPT connectors | `save_interview` / `get_my_interviews` on the tenant service |

**Choosing:** if the environment variable `JOB_SEARCH_STORAGE` is set to exactly
`local` or `tenant` (lowercase), obey it. Any other value — a typo, `Local`,
`hybrid`, an empty string — is treated as unset AND mentioned to the user once
("JOB_SEARCH_STORAGE=<value> is not a mode I know, using local"), so a
misspelling never silently sends material to the wrong place. Unset: local when
you can write files, tenant when you cannot. Never ask the user which mode to use — decide, then state which one you
picked in your first reply of the run ("Saving locally under ~/job-search/...").

Search terms and job matches always come from the tenant service in both modes.
Only your own written material is affected by this choice.

## Local layout

Root: `$JOB_SEARCH_HOME`, or `~/job-search` when that variable is unset.
Create directories as needed — never ask permission to create the root.

```
~/job-search/
  interviews/
    <slug>/
      <stage>-prep.md
      <stage>-debrief.md
```

`<slug>` is `<company>-<role>` in lowercase kebab-case (e.g.
`nexus-ai-training-lead`). Reuse the slug that already exists for this
application — list `applications/` and `interviews/` before inventing one, and
use the SAME slug in both folders so the two halves stay connected.

### Before writing into a folder that already exists

A slug names a company and a role, not an application — two different postings
can produce the same one (same company, same title, re-advertised months later).
So before writing into an existing folder, read the `job_id` from its
`application.md` frontmatter (for `interviews/`, from the prep or debrief file)
and compare:

- same `job_id`, or neither side has one → same application, carry on.
- different `job_id` → a DIFFERENT application. Do not write into that folder.
  Use `<slug>-2` (then `-3`, …), and tell the user which folder you created and
  why.

Writing into it anyway would overwrite the earlier application's documents, and
nothing would report that it happened.

`<stage>` is the round name in kebab-case: `screening`, `technical`, `onsite`.

## File format

Every file starts with YAML frontmatter, then the content as Markdown:

```markdown
---
job_id: 7c3f9a12-...
stage: screening
company: Nexus AI
role: Training Lead
scheduled_at: 2026-09-15T10:00
outcome:            # only in the debrief file, empty until known
---

## Role summary
...
```

The frontmatter is what makes files findable. To answer "which rounds exist for
this job?", grep `job_id:` across `~/job-search/interviews/*/*.md` — there is no
index file to keep in sync.

## Reading the profile

`local`: read `~/job-search/profile.md` and take the sections you need
(`## Positioning`, `## Achievements`, `## Skills matrix`).
`tenant`: call `get_my_profile()`.

A missing file means an empty profile, not an error: say so and build the
dossier from the posting alone. Never write to the profile from this skill —
see the separation rule in SKILL.md.

## Rules that keep local storage honest

1. **Write the full text, not a summary.** The file is the only copy — the
   conversation is gone tomorrow.
2. **Never overwrite the other half.** Prep and debrief are separate files;
   writing one must not touch the other. Re-running prep for the same stage
   overwrites only `<stage>-prep.md`, and only after telling the user.
3. **Verify after writing.** Read the file back (or list the directory) and
   print the full path you wrote. A save you did not confirm did not happen.
4. **Never write anything to the profile.** The separation rule in SKILL.md
   applies in both modes — `profile.md` locally, `set_my_profile` on the server.

## Touching the tracker

This skill may set an application's status, but it is not the tracker's owner —
`/dispatch` is. Do the minimum:

`local`: update `status` and `updated` in
`~/job-search/applications/<slug>/application.md` (create the folder and the
file if this is the first entry for that job), then regenerate
`applications/INDEX.md`. Never move a status backwards without asking.
`tenant`: call `save_application({...})` and report its `effective` flag
honestly.

## When the local write fails

If the directory cannot be created or the file cannot be written, say so
plainly, show the dossier in the conversation, and offer the tenant service as
a fallback (`save_interview`) — the user decides. Never fail silently, and
never claim a save you could not verify.
