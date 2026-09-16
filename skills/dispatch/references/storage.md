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

Decide fresh at the start of THIS run using only the rule above
(`JOB_SEARCH_STORAGE`, then file-tool availability). Never justify a mode by
pointing to an earlier choice, a previous session, or something said earlier in
this conversation — that reasoning is not part of this rule, and it has already
caused real data to land in the wrong place.

Search terms, job matches and posting texts always come from the tenant service
in both modes. Only your own written material is affected by this choice.

Root: `$JOB_SEARCH_HOME`, or `~/job-search` when that variable is unset.
Create directories as needed — never ask permission to create the root.

## The applications folder

```
~/job-search/applications/
  INDEX.md                  # overview, regenerated — never hand-edited
  <slug>/
    application.md          # the tracker entry: frontmatter + free notes
    job-posting.md          # the posting text as fetched
    job-fit-analysis.md
    cover-letter.md
    cv.md
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


### `application.md`

```markdown
---
job_id: 7c3f9a12-...
company: Nexus AI
role: Training Lead
status: applied          # drafted | applied | interview | offer | rejected | paused
url: https://...
updated: 2026-09-09
---

Applied via referral from X. Interview set for next Tuesday.
```

This file is the truth about one application. `status` holds the current state —
overwrite it, never append a second status line. Notes accumulate in the body.

### `INDEX.md`

One table, one row per application, regenerated from the `application.md` files
every time one of them changes:

```markdown
| Status | Company | Role | Updated | Folder |
|--------|---------|------|---------|--------|
| applied | Nexus AI | Training Lead | 2026-09-09 | nexus-ai-training-lead |
```

Sort by `Updated`, newest first. Because it is regenerated, never edit it by
hand and never treat it as a source — if it disagrees with an `application.md`,
the folder wins and the index gets rebuilt.

## Status honesty (the local counterpart of `effective`)

On the server a later-dated entry can outrank the one you just wrote, which is
what the `effective` flag reports. Locally there is no event log: the status you
write is the status that shows. That makes one case your responsibility — if the
user reports something **older** than what the file already says (`status:
interview`, and they now mention having sent it last week), do not silently move
the status backwards. Say what the file currently holds, ask which one is
current, then write.

## Rules that keep local storage honest

1. **Write the full text, not a summary.** These files are the only copy — the
   conversation is gone tomorrow.
2. **Verify after writing.** Read back what you wrote and print the full paths.
   A save you did not confirm did not happen.
3. **Never invent a folder for a job you have not fetched.** The slug comes from
   the posting's company and role.

## When the local write fails

Say so plainly and show the content in the conversation. Do not offer or call
the tenant fallback (`save_application`) on your own — the server can now
reject that write for a locally-configured profile anyway. Ask the user how
they want to proceed. Never fail silently, and never claim a save you could
not verify.
