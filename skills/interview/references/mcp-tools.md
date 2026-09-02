# MCP Tools Reference

> The five tools `/interview` uses. Only I/O — no local filesystem, no shell commands, no email search, no browser.

---

## save_interview

Write/update one interview round for the authenticated profile. Identity is
**(job_id, stage)** — the same pair Mode 1 (prep) and Mode 2 (debrief) both
write to, so a debrief call after a prep call lands on the same row.

**Signature**
```
save_interview({
  job_id: string,
  stage: string,
  company?: string,
  role?: string,
  scheduled_at?: string,   // ISO-8601
  prep_notes?: string,
  debrief_notes?: string,
  outcome?: string
}) → Interview
```

**Response shape**
```json
{
  "id": 13,
  "job_id": "a1b2-c3d4-...",
  "stage": "screening",
  "company": "Nexus Labs",
  "role": "AI Training Lead",
  "scheduled_at": null,
  "prep_notes": "## Role summary\n...",
  "debrief_notes": null,
  "outcome": null,
  "created_at": "2026-09-02T12:00:00Z",
  "updated_at": "2026-09-02T12:00:00Z"
}
```

**Merge behavior — this is the whole point of the table**: only the fields you
send are written. Calling `save_interview({ job_id, stage, debrief_notes: "..." })`
after an earlier `save_interview({ job_id, stage, prep_notes: "..." })` does
**not** erase `prep_notes` — both end up on the same row. This is different from
`save_application` (an append-only event log where every call is a new event) —
here, identity is exact-match on `(job_id, stage)`, and a second call to the
same identity always updates in place.

A **different** `stage` for the same `job_id` is a different row — `"screening"`
and `"onsite"` for the same job never merge into each other, even though both
share the `job_id`.

---

## get_my_interviews

Read the caller's interview rounds, newest-scheduled first.

**Signature**
```
get_my_interviews(job_id?: string) → { interviews: Interview[] }
```

Without `job_id`: every round across every job (used in Mode 3 — overview).
With `job_id`: only that job's rounds (used in Mode 1 to check for a prior
round's debrief, and in Mode 2 to find the right `stage` to debrief).

---

## get_job

Fetch the full posting — the dossier's factual anchor in Mode 1.

**Signature**
```
get_job(job_id: string) → Job
```

Same tool, same response shape as in `/apply` and `/rank` — see either of those
skills' `references/mcp-tools.md` for the full field list. Handle
`degraded: true` / empty `description` the same way `/apply` does: note the gap,
don't fabricate role details the posting didn't actually contain.

---

## get_my_profile

Fetch the caller's application profile — used in Mode 1 to pull
`achievements`/`skills_matrix` into the "likely question areas" section of the
dossier.

**Signature**
```
get_my_profile() → Profile
```

See `/letter-forge`'s `references/mcp-tools.md` for the full field list (this
skill only reads `positioning`, `achievements`, `skills_matrix` — `cv_text` and
`writing_style` aren't relevant to interview prep).

---

## save_application

Optional, only used in Mode 2 if the user confirms the debrief should also
update the application's overall tracker status.

**Signature**
```
save_application({
  job_id: string,
  status: "drafted" | "applied" | "interview" | "offer" | "rejected" | "paused",
  company?: string,
  role?: string,
  notes?: string
}) → { ..., effective: boolean, displayed_status: string }
```

See `/dispatch`'s `references/mcp-tools.md` for the full response shape and the
`effective`/`displayed_status` semantics — the same honesty rule applies here:
never report the tracker as updated without checking `effective`.

---

## Error handling

| Scenario | Handling |
|----------|---------|
| `get_my_interviews(job_id)` returns empty in Mode 2 | No prior `save_interview` call exists for this job — ask for the `stage` directly instead of assuming one |
| `get_job` returns 404 or degraded | Note the gap in the dossier; do not invent posting details |
| Connector not installed / auth error, or `save_interview`/`get_my_interviews` return 404 | The connector is older than v0.3.0 — direct the user to reinstall per the plugin README |
