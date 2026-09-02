---
name: dispatch
description: >
  Records what happened to an application in the tenant tracker — you mark it as
  sent (or move it to interview / offer / rejected / paused) after you've actually
  submitted it yourself. Runs fully in-conversation via save_application; it does
  not fill in portal forms or send email on your behalf — the sending happens in
  your own browser or mail client, this skill only logs the outcome.
  Use when user says "I sent it", "mark as applied", "update application status",
  "log this application", "I got an interview invite", "I got rejected", "/dispatch".
---

# /dispatch — Track an Application's Status

> You send it. This skill remembers what happened.
>
> Logs an application's status in the tenant tracker via `save_application` —
> entirely in-conversation via the tenant MCP tools. No portal automation, no
> email, no local filesystem, no shell commands.

## When to use

- Right after you've submitted an application yourself (portal, email, referral —
  doesn't matter how) and want it tracked
- When an application's status changes — interview invite, offer, rejection, or
  you're pausing/withdrawing it
- User says "I sent it", "mark as applied", "log this application", "I got an
  interview invite", "/dispatch"

Do **not** use for:
- Actually writing the cover letter/CV — that's `/apply <job_id>`, run it first
- Filling out a portal form or sending an email for the user — this skill has no
  browser or email access; the user does the actual sending themselves
- Building/updating the profile — use `/letter-forge`

---

## Prerequisites

- Tenant connector (>= v0.2.0) installed with a provisioned API key
- A `job_id` to log against — usually from a prior `/apply <job_id>` run or from
  `get_my_matches()`

---

## MCP tools (the only I/O)

| Tool | Purpose |
|------|---------|
| `save_application({...})` | Write/update one application's status in the tracker |
| `get_my_matches()` | Fallback lookup if the user gives a company/role but not a `job_id` |

See `references/mcp-tools.md` for full signatures, the status enum, and the
`effective`/`displayed_status` semantics — read that before writing the confirmation
message in Phase 2, it changes what you're allowed to claim happened.

---

## Workflow

### Phase 1: Identify the application + the new status

1. Get the `job_id`. If the user gives one directly, use it. If they only give a
   company/role, call `get_my_matches()` and match by company/role — confirm the
   match with the user before proceeding if more than one candidate fits.
2. Get the new `status` — must be one of `drafted`, `applied`, `interview`, `offer`,
   `rejected`, `paused`. If the user's phrasing is ambiguous ("I heard back" could
   be `interview`, `offer`, or `rejected`), ask which one rather than guessing.
3. Optionally collect `notes` (e.g. "applied via referral from X", "interview set
   for next Tuesday") — free text, not required.

### Phase 2: Write + report honestly

1. Call `save_application({ job_id, status, company, role, notes })`.
2. Read the response's `effective` field:
   - `true` → the tracker's visible status is now what you just wrote. Confirm
     plainly: "Logged — [company] / [role] is now marked `[status]`."
   - `false` → the write was saved as a history event but did **not** change the
     visible status (a later-dated entry already exists). Report both: "Saved as a
     note, but the tracker still shows `[displayed_status]` as the current status —
     that's from a more recent entry than this one." **Never report `false` as a
     plain success** — the user needs to know the visible state didn't move.

### Phase 3: Suggest the next step

Based on the new status, a short, honest nudge — no other skill in this plugin
handles interview prep or negotiation, so keep it to what's actually true:

- `applied` → "Tracked. I'll leave interview prep and follow-ups to you — this
  plugin doesn't have a skill for that yet."
- `interview` → same caveat; do not offer to prepare questions or draft anything
  this plugin can't actually do.
- `offer` / `rejected` / `paused` → simple acknowledgement, no fabricated next steps.

---

## Anti-patterns

- Claiming the application was "sent" — this skill never sends anything; only log
  what the user tells you they already did
- Reporting a `save_application` call as successful without checking `effective`
- Guessing a `status` value from vague phrasing instead of asking
- Offering interview prep, negotiation help, or portal automation — out of scope
  for this skill and this plugin
- Calling `get_my_matches()` and picking a job_id without confirming the match
  when more than one candidate fits

---

## Reference index

| File | Purpose |
|------|---------|
| `references/mcp-tools.md` | `save_application` + `get_my_matches` signatures, status enum, `effective`/`displayed_status` semantics |
