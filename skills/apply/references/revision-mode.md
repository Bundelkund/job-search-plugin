# Revision mode: `/apply --revise`

> Reworks the current in-conversation draft based on review feedback.

## When to use

- User runs `/apply --revise` or says "revise", "rework", "überarbeite das Anschreiben"
- User provides explicit feedback after reviewing the draft

## Workflow

### R1: Load the revision request

Collect the revision instructions from the user. If the user has written review feedback in-conversation, read it now. If there is an existing `anschreiben` draft in-conversation, load it as the working document.

Ask the user if any specific criteria should be re-checked (posting-match, tone, Jonas-Regel, DON'Ts).

### R2: Identify the revision scope

Map the feedback to the affected paragraphs or sections:

| Feedback type | Scope |
|---------------|-------|
| "Tone too formal / too casual" | Salutation, closing, paragraph style |
| "Missing keyword X" | Paragraphs 2–3, keyword reconciliation comment |
| "Jonas-Regel weak" | Paragraphs 1–3 (problem/solution/benefit arc) |
| "CV section missing Y" | Relevant CV section |
| "Too long" | Trim paragraphs to max 1 page |

### R3: Re-load profile and job context

Call `get_my_profile()` and confirm the `job_id` / job posting are still in context. If the conversation context has shifted, re-call `get_job(job_id)` to refresh the posting text.

### R4: Apply the revision

1. Rewrite the affected paragraphs or sections inline
2. Re-run the template review checklist (Phase 4a) on the revised version
3. Re-run adversarial review if the original score was < 7 on any criterion

### R5: Update the tracker

Call `save_application` with a status update or revised notes:

```
save_application({
  job_id:  "<job_id>",
  status:  "drafted",
  notes:   "Revision {{N}}: [summary of changes]"
})
```

Each call appends an event — history is preserved.

### R6: Wrap up

1. Present the revised cover letter (and CV if changed) as fresh Markdown blocks
2. Summarize what changed and why
3. Remind the user to review before submitting
