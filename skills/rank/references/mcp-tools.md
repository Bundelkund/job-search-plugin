# MCP Tools Reference

> The four tools exposed by the tenant connector. These are the only I/O the rank skill uses — no local filesystem, no direct API calls, no shell commands.

---

## get_my_matches

Fetch the current user's job match list. Returns metadata only — no description text.

**Signature**
```
get_my_matches(min_score?: number, limit?: number) → MatchList
```

**Parameters**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `min_score` | number | 0 | Filter by tenant match score. `40` is a sensible floor. |
| `limit` | number | none | Cap candidates. Use only as a budget guardrail — emits a warning that low-tenant-score / high-rubric-fit jobs may be missed. |

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

**Usage note**: `score` is the tenant's generic match score, not your rubric score. Sort by `score` only to order the candidate pull; final ranking uses your rubric total.

---

## get_job

Fetch the full posting for a single job. This is mandatory before scoring.

**Signature**
```
get_job(job_id: string) → Job
```

**Response shape**
```json
{
  "id": "a1b2-c3d4-...",
  "title": "AI Training Lead",
  "company": "Nexus Labs",
  "location": "Berlin, Germany",
  "remote": true,
  "description": "We are looking for ...",
  "keywords": ["machine learning", "training", "LLM"],
  "salary": "€65,000–€85,000",
  "source": "linkedin | indeed | company_site | ...",
  "url": "https://example.com/jobs/a1b2",
  "posted_at": "2026-06-14T00:00:00Z"
}
```

**Empty description handling**: LinkedIn jobs are frequently empty (`description: ""`) due to scraping restrictions. When `description` is blank or < 50 characters:
- Score the job on `title`, `company`, `keywords` only
- Add `"empty_description"` to `red_flags`
- Include in ranking — do not skip

---

## get_my_profile

Fetch the current user's application profile. Used in Phase 1 to calibrate the rubric and load the `positioning` text.

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

**Usage note for `/rank`**: Only `positioning` is needed for rubric calibration. The other fields are not used until `/apply`.

---

## save_application

Write a tracker entry for a job. Optional — only call in Phase 5 if the user confirms they want to mark picks.

**Signature**
```
save_application({
  job_id: string,
  status: "drafted" | "applied" | "interview" | "offer" | "rejected" | "paused",
  company?: string,
  role?: string,
  notes?: string
}) → { ok: boolean, id: string }
```

**Usage note for `/rank`**: Use `status: "drafted"` when the user marks a pick from the ranking. This flags the job for `/apply` and prevents it from appearing as "unreviewed" in future ranking runs (unless `--refresh` is passed).

---

## Error handling

| Scenario | Handling |
|----------|---------|
| `get_my_matches` returns empty list | Inform the user; suggest running the discovery pipeline first |
| `get_job` returns 404 | Skip the job; note it in the ranking summary as "not found" |
| Connector not installed / auth error | Stop and direct user to `references/setup.md` in `apply-skill` for setup |
| Partial batch failure | Continue with successful jobs; report the failed job_ids at the end |
