# Phase 5: Completion

## 5a: Save the documents and open the tracker entry

Do this at the end of Phase 3c (not only after Phase 4 review) so the work
survives even if the session ends before review.

**`local` (default)** — create `~/job-search/applications/<slug>/` and write:
`job-posting.md`, `job-fit-analysis.md`, `cv.md`, `cover-letter.md`, and
`application.md` with `status: drafted` plus the fit score and channel as notes.
Then regenerate `applications/INDEX.md`, read the files back, and tell the user
the folder path. Full text, never a summary — this is the only copy. See
`storage.md` for the layout and frontmatter.

**`tenant`** — the documents stay in the conversation; write the tracker entry:

```
save_application({
  job_id:  "<job_id from get_job>",
  status:  "drafted",
  company: "<company name>",
  role:    "<role title>",
  notes:   "Fit score: {{N}}. Channel: {{portal/email/check}}."
})
```

**Status enum** (server validates — any other value → 422):

| Status | Meaning |
|--------|---------|
| `drafted` | Cover letter + CV produced, not yet sent |
| `applied` | Application submitted |
| `interview` | Interview scheduled |
| `offer` | Offer received |
| `rejected` | Rejected |
| `paused` | On hold |

Update the status after each lifecycle change — `local`: edit `status` and
`updated` in `application.md`, then regenerate `INDEX.md`; `tenant`: call
`save_application` again with the new status (there the tracker is an event log,
each call appends a row). `/dispatch` does this for you in both modes.

## 5b: Application channel research (mandatory)

**Step 1 — read the posting**: portal link? email? explicit instructions?

**Step 2 — find the company's careers page** (when unclear):
- Web search: `"{{company}} careers"`
- Typical patterns: `{{company}}.jobs.personio.de`, `jobs.ashbyhq.com/{{company}}`, `{{company}}.teamtailor.com`

**Step 3 — classify the result**:

| Channel | Meaning |
|---------|---------|
| `Portal` | Company-owned ATS with a direct link |
| `Email` | Apply by email |
| `Check` | No portal / email found |

**Important**: Indeed / Glassdoor / LinkedIn links are NOT valid application channels.

Include the channel finding in the `notes` field when calling `save_application`.

## 5c: Prepare company-specific questions

1. Use `writing_style` and `positioning` from the profile for context
2. Add company context from Phase 3a research
3. Formulate 2–3 questions: 1x role, 1x culture, 1x optional strategic

## 5d: Next steps for the user

1. Present the final cover letter and CV Markdown to the user
2. Mention any extra requirements (videos, portfolio, work samples)
3. State the application channel (portal link or email address)
4. Show the prepared questions for the hiring team
5. Remind the user: review both documents carefully before submitting
