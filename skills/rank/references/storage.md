# Storage — where your material is kept

> This file is duplicated per skill on purpose. Codex installs copy each skill
> directory separately, so a shared file one level up would not survive the copy.

## Two modes

| Mode | When | Where your own material lives |
|------|------|-------------------------------|
| `local` (default) | You have a file-writing tool — Claude Code, Codex CLI | Markdown files under `$JOB_SEARCH_HOME` |
| `tenant` | No file tool — Claude Desktop, ChatGPT connectors | The tenant service, via the MCP tools |

**Choosing:** if the environment variable `JOB_SEARCH_STORAGE` is set to exactly
`local` or `tenant` (lowercase), obey it. Any other value — a typo, `Local`,
`hybrid`, an empty string — is treated as unset AND mentioned to the user once
("JOB_SEARCH_STORAGE=<value> is not a mode I know, using local"), so a
misspelling never silently sends material to the wrong place. Unset: local when
you can write files, tenant when you cannot. Never ask the user which mode to use — decide, then state which one you
picked in your first reply of the run ("Reading your profile from
~/job-search/profile.md").

Search terms, job matches and posting texts always come from the tenant service
in both modes. Only your own written material is affected by this choice.

Root: `$JOB_SEARCH_HOME`, or `~/job-search` when that variable is unset.
Create directories as needed — never ask permission to create the root.

## The profile file

`~/job-search/profile.md` — one file, five sections, fixed headings:

```markdown
---
updated: 2026-09-09
---

## Positioning
...

## CV
...

## Achievements
...

## Skills matrix
...

## Writing style
...
```

The headings map one-to-one onto the tenant fields `positioning`, `cv_text`,
`achievements`, `skills_matrix`, `writing_style`. Keep them exactly as written —
four skills read this file, and a renamed heading reads as an empty section.

A missing file means an empty profile, not an error: say so and carry on
(`/letter-forge` is what fills it).

## Reading the profile

`local`: read `~/job-search/profile.md` and take the sections you need.
`tenant`: call `get_my_profile()`.

Never write to the profile from this skill — only `/letter-forge` does that, in
either mode.

If the file is missing or a section is empty, treat that field as unknown. Say
which part is missing and continue with what you have; do not invent profile
content, and do not silently fall back to the tenant copy — a stale server-side
profile looks like success and produces a wrong letter.

## Folder names

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

## Touching the tracker

This skill may set an application's status, but it is not the tracker's owner —
`/dispatch` is. Do the minimum:

`local`: update `status` and `updated` in
`~/job-search/applications/<slug>/application.md` (create the folder and the
file if this is the first entry for that job), then regenerate
`applications/INDEX.md`. Never move a status backwards without asking.
`tenant`: call `save_application({...})` and report its `effective` flag
honestly.
