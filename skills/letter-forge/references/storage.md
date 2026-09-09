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

## Writing the profile (letter-forge only)

1. **Update sections, never rewrite the file.** Read `profile.md` first, replace
   only the sections you have new text for, keep the rest byte-for-byte. The
   local equivalent of a partial `set_my_profile` — a full rewrite silently
   destroys fields the user spent an hour on.
2. **Show before you save**, same as in tenant mode.
3. **Set `updated:`** to today's date in the frontmatter on every write.
4. **Verify after writing.** Read the file back and print the full path. A save
   you did not confirm did not happen.

## When the local write fails

Say so plainly, show the synthesized text in the conversation, and offer the
tenant service as a fallback (`set_my_profile`) — the user decides. Never fail
silently, and never claim a save you could not verify.
