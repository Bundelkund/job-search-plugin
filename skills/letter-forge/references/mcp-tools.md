# MCP Tools Reference

> The four tools used by letter-forge. Provided by the tenant connector (>= v0.4.0).
> No local filesystem, no direct API calls, no shell commands.
>
> Two of them write the **profile** (who you are), two write the **search terms**
> (what the nightly run looks for). Both are needed: a profile without search
> terms produces no matches at all.

---

## get_my_profile

Read the current user's 5-field application profile.

**Signature**
```
get_my_profile() → Profile
```

**Response shape**
```json
{
  "positioning": "Three sentences describing your core USP and target role type.",
  "cv_text": "Full CV in Markdown.",
  "achievements": "Quantified wins, one per row.",
  "skills_matrix": "Skills with evidence.",
  "writing_style": "Tone, DON'Ts, language rules."
}
```

**Usage in letter-forge**: called once in Phase 1 to identify which fields are already
populated. Empty string `""` means the field has never been set. A non-empty field should
be shown to the user before the questionnaire so they can decide whether to update it.

---

## set_my_profile

Write one or more profile fields. This is a **partial update** — only the fields you pass
are changed; fields you omit are left untouched.

**Signature**
```
set_my_profile({
  positioning?: string,
  cv_text?: string,
  achievements?: string,
  skills_matrix?: string,
  writing_style?: string
}) → { ok: boolean }
```

**Parameters**

| Field | Type | Notes |
|-------|------|-------|
| `positioning` | string | Core narrative, 1–2 paragraphs |
| `cv_text` | string | CV as Markdown |
| `achievements` | string | One quantified achievement per line |
| `skills_matrix` | string | Skills with evidence, one per line |
| `writing_style` | string | Tone rules, DON'Ts, language patterns |

All fields are optional. Pass only the fields you want to write.

**Usage in letter-forge**: called in Phase 4 after user confirmation. You may call it once
per field (safest for incremental confirmation) or once with all fields together.

```javascript
// Writing just one field after Part 4
set_my_profile({ achievements: "Rebuilt onboarding — reduced ramp from 6w to 3w (2023)\n..." })

// Writing all five after a full questionnaire run
set_my_profile({
  positioning: "...",
  achievements: "...",
  skills_matrix: "...",
  writing_style: "...",
  cv_text: "..."
})
```

**IMPORTANT**: always show the synthesized content to the user and get confirmation
before calling `set_my_profile`. Never write without confirmation.

---

## get_my_search_terms

Read the terms the nightly matching run uses for this user.

**Signature**
```
get_my_search_terms({ kind?: "role" | "location" }) → { terms: string[] }
```

| Parameter | Meaning |
|---|---|
| `kind` | `role` (default) = job titles. `location` = cities and `Remote`. |

**Response shape**
```json
{ "terms": ["Scrum Master", "Agile Coach"] }
```

**Usage in letter-forge**: called at the end of Phase 5 to read back what was
stored, so the user sees the result instead of trusting a silent write. An empty
list after writing means the write did not land — do not paper over it.

---

## set_my_search_terms

Set the terms of one kind to exactly this list.

**Signature**
```
set_my_search_terms({ terms: string[], kind?: "role" | "location", allow_shrink?: boolean }) → { terms: string[] }
```

| Parameter | Meaning |
|---|---|
| `terms` | The complete desired list for that kind — **not** only the new ones |
| `kind` | `role` (default) or `location` |
| `allow_shrink` | Only after the user confirmed that terms may be dropped |

**Set semantics, not append.** Anything missing from the list is removed. To add
one term, send the existing terms plus the new one — read them first with
`get_my_search_terms`.

**Shrink guard**: if the new list drops terms, the call returns
```json
{ "status": "bestaetigung_noetig", "wuerden_entfernt": ["..."], "hinweis": "..." }
```
This is a question, not a failure. Show which terms would go, ask, and only then
repeat with `allow_shrink: true`.

**Usage in letter-forge**: Phase 5, once per kind. Role terms come from the Part 5
answers; location terms are asked for explicitly, including `Remote`. Both kinds
go to the service even in `local` storage mode.

---

## Error handling

| Scenario | Handling |
|----------|---------|
| Connector not installed / auth error | Stop; direct user to README install steps |
| `get_my_profile` returns 404 or null | Treat as empty profile; proceed with questionnaire |
| `set_my_profile` returns `{ ok: false }` | Retry once; if still failing, show the content to the user and suggest manual copy-paste via `PUT /my/profile` |
| `tenant-mcp` version < 0.2.0 | `set_my_profile` will be missing from the tool list; inform user to upgrade the connector |
| `set_my_search_terms` missing from the tool list | Connector older than v0.4.0. Say so plainly and stop — do **not** fall back to writing terms into the profile text, they would never reach the matching run |
| `set_my_search_terms` returns `bestaetigung_noetig` | Not an error: terms would be dropped. Show `wuerden_entfernt`, ask, repeat with `allow_shrink: true` only if confirmed |

---

## Version note

`set_my_profile` was added in connector v0.2.0. Earlier versions expose
`get_my_profile` and `save_application` only. If `set_my_profile` is not in the tool
list, ask the user to upgrade via the tenant owner before proceeding.
