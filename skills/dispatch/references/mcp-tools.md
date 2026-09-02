# MCP Tools Reference

> The two tools `/dispatch` uses. Only I/O — no local filesystem, no direct API calls, no shell commands, no browser, no email.

---

## save_application

Write/update one application's status in the tracker. This is the only tool that
actually changes anything — everything else in this skill is preparation for this
one call.

**Signature**
```
save_application({
  job_id: string,
  status: "drafted" | "applied" | "interview" | "offer" | "rejected" | "paused",
  company?: string,
  role?: string,
  notes?: string
}) → ApplicationCreated
```

The server validates `status` against the enum above — anything else is rejected
(422), so confirm ambiguous phrasing with the user before calling rather than
guessing a value and letting the call fail.

**Response shape**
```json
{
  "job_id": "a1b2-c3d4-...",
  "status": "applied",
  "company": "Nexus Labs",
  "role": "AI Training Lead",
  "notes": "applied via referral",
  "at": "2026-09-02T14:03:00Z",
  "effective": true,
  "displayed_status": "applied"
}
```

**Read `effective` and `displayed_status` before telling the user anything happened.**
The tracker is an event log, not a single overwritten field — every call adds an
event, and the *visible* status is whichever event is most recent by its `at`
timestamp, not necessarily the one you just wrote.

- `effective: true` — your event is now the most recent one; `displayed_status`
  equals the `status` you just sent. Safe to report as "logged, now showing as
  `[status]`."
- `effective: false` — your event was saved but a *later*-dated event already
  exists, so the visible status didn't move. `displayed_status` tells you what it
  actually shows instead. Report both facts — never say "logged" without also
  saying what the tracker currently displays if it isn't what was just written.

This matters most when the user is backfilling ("I actually sent this last week,
forgot to log it") — the write still happens and is preserved in history, but if
a more recent event already exists, don't imply the tracker now shows the old one.

---

## get_my_matches

Only used as a fallback: if the user gives a company/role but not a `job_id`.

**Signature**
```
get_my_matches(min_score?: number, limit?: number) → MatchList
```

**Response shape**
```json
{
  "count": 142,
  "matches": [
    {
      "job_id": "a1b2-c3d4-...",
      "score": 67,
      "job_title": "AI Training Lead",
      "company": "Nexus Labs",
      "location": "Berlin, Germany",
      "url": "https://example.com/jobs/a1b2",
      "first_seen_at": "2026-06-15T08:00:00Z",
      "last_seen_at": "2026-06-29T12:00:00Z"
    }
  ]
}
```

Match by `company` and `job_title` (case-insensitive, loose match is fine — this
is a lookup convenience, not a scoring step). If more than one match plausibly
fits, list them and ask the user to pick rather than guessing.

---

## Error handling

| Scenario | Handling |
|----------|---------|
| `save_application` returns 422 (bad `status`) | Ask the user which of the six allowed values they mean; do not retry with a guessed value |
| No `job_id` and `get_my_matches` finds no match | Ask the user for the job_id directly, or offer to proceed with `company`/`role` only if the tracker allows it — otherwise stop and explain the tracker needs an identifier |
| Connector not installed / auth error | Stop and direct the user to the plugin README's Install section |
| More than one match candidate | List all candidates with company/role/location; ask the user to confirm which one |
