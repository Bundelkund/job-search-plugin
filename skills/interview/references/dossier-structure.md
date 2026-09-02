# Prep Dossier Structure

> The section breakdown for Mode 1's dossier. Fill in what the sources actually
> support — an empty section beats a fabricated one.

---

## Sections

### 1. Role summary

2-4 sentences from `get_job`'s `description` and `title`/`company`: what the
role actually is, in the poster's own framing. Not a restatement of the whole
posting — the load-bearing facts (team, seniority signal, what problem this
role exists to solve).

### 2. What this stage likely covers

Base this on the `stage` name and, if available, a prior round's
`debrief_notes` from `get_my_interviews(job_id)` — a technical round after a
screening round usually goes deeper on exactly what the screening flagged as
uncertain. If nothing else is known, use the posting's stated requirements as
the best guess for what a first round probes.

### 3. Likely question areas — mapped to your evidence

For each requirement or theme the posting emphasizes, pull the matching line(s)
from `get_my_profile`'s `achievements`/`skills_matrix` (same fields `/apply`
draws from). Format:

```
**[Posting theme]**
Your evidence: [achievement or skill line that speaks to it]
Possible follow-up: [what an interviewer might probe next]
```

If a theme in the posting has **no** matching evidence in the profile: say so
explicitly under a "Gaps to prepare an answer for" subsection, rather than
silently omitting it. This is the dossier's most useful part — better to know
the gap now than get asked cold.

### 4. Questions to ask them

3-5 candidate questions, informed by what the posting and any prior
debrief left ambiguous — not generic ("what's the culture like?") unless
nothing more specific is available.

### 5. Salary framing (if relevant to this stage)

Only include if the user provided salary research or the posting states a
range. Never invent a number. If nothing is known, omit this section rather
than leaving a placeholder.

### 6. From the last round (if any)

If `get_my_interviews(job_id)` returned a prior round with `debrief_notes`,
summarize what's relevant going into this one — a signal about pace, a
question that came up, a name to remember. Omit this section entirely for a
first round.

---

## What NOT to include

- Anything not traceable to `get_job`, `get_my_profile`, a prior debrief, or
  something the user pasted into this conversation — no invented company facts
- The user's `cv_text` or `writing_style` verbatim — irrelevant to interview
  prep, and bulks up the dossier without adding value
- A generic "how to interview well" primer — the dossier is specific to this
  role and this user's evidence, not general advice
