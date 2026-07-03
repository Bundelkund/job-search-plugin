# MCP Tools Reference

> The two tools used by letter-forge. Provided by the `tenant-mcp` connector (>= v0.2.0).
> No local filesystem, no direct API calls, no shell commands.

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

## Error handling

| Scenario | Handling |
|----------|---------|
| Connector not installed / auth error | Stop; direct user to README install steps |
| `get_my_profile` returns 404 or null | Treat as empty profile; proceed with questionnaire |
| `set_my_profile` returns `{ ok: false }` | Retry once; if still failing, show the content to the user and suggest manual copy-paste via `PUT /my/profile` |
| `tenant-mcp` version < 0.2.0 | `set_my_profile` will be missing from the tool list; inform user to upgrade the connector |

---

## Version note

`set_my_profile` was added in `tenant-mcp v0.2.0`. Earlier connector versions expose
`get_my_profile` and `save_application` only. If `set_my_profile` is not in the tool
list, ask the user to upgrade via the tenant owner before proceeding.
