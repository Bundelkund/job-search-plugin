# Example Ranking Run — Nexus Labs / AI Training Lead

> **Fictional example.** All companies, names, scores, and job descriptions are invented.
> Persona: "Jordan Muster", a career-changer targeting roles at the intersection of coaching and AI.

---

## Setup (Phase 1)

**Rubric selected**: Coaching × AI (from `references/scoring-rubric.md`, worked example)

**Profile positioning** (from `get_my_profile()`):
> "Five years running L&D programmes at a consulting firm, pivoting into AI enablement. Delivered 80+ workshops on agile and digital tools. Now building AI-powered learning experiences and coaching product teams through LLM adoption."

**Archetype cards loaded**: coach-ai-full, enabler, adjacent (see `references/archetype-cards.md`)

---

## Candidate pull (Phase 2)

```
get_my_matches(min_score=40) → 38 matches
```

Note: no `--limit` set — all 38 candidates scored. 6 jobs had empty descriptions (LinkedIn source); scored on title + company only, flagged.

---

## Scoring output (Phase 3) — all 38 candidates

After parallel scoring (2 agents × ~20 jobs):

| job_id | Title | Company | A | B | ∩ | Total | Flags | Rec |
|--------|-------|---------|---|---|---|-------|-------|-----|
| `nx-001` | AI Training Lead | Nexus Labs | 38 | 32 | 18 | **88** | | true |
| `or-002` | Learning Architect | Orbit GmbH | 34 | 28 | 16 | **78** | | true |
| `bc-003` | AI Enablement Consultant | Beacon Corp | 30 | 34 | 15 | **79** | | true |
| `sv-004` | ML Engineer | Silvana AI | 6 | 38 | 2 | **46** | | false |
| `pr-005` | L&D Manager | Prism Retail | 36 | 10 | 4 | **50** | | false |
| `qt-006` | AI Product Manager | Quanta Tech | 18 | 34 | 10 | **62** | | false |
| `dn-007` | Senior Trainer (Digital) | Denova GmbH | 35 | 12 | 5 | **52** | | false |
| `fm-008` | AI Coach | Fernwood Health | 38 | 22 | 14 | **74** | | true |
| `lp-009` | Data Scientist | Luma Platform | 4 | 36 | 1 | **41** | | false |
| `cr-010` | Change Manager | Crest Advisory | 33 | 8 | 3 | **44** | | false |
| `ax-011` | AI Solutions Architect | Axon Systems | 10 | 38 | 6 | **54** | | false |
| `gl-012` | Facilitator (LLM rollout) | Glide Studios | 36 | 30 | 17 | **83** | | true |
| `tp-013` | Head of Learning | Taper Group | 38 | 14 | 6 | **58** | | false |
| `vx-014` | AI Curriculum Designer | Voltex | 36 | 26 | 16 | **78** | | true |
| `rm-015` | Agile Coach | Remora Ltd | 36 | 6 | 2 | **44** | | false |
| `hl-016` | AI Trainer (unknown posting) | LinkedIn | 0 | 0 | 0 | **0** | `empty_description` | false |
| ... | *(22 more — scores 20–45)* | | | | | | | |

---

## Final ranked table (Phase 4)

Top-20 after sorting by total:

| Rank | Score | A | B | ∩ | Company | Title | Location | Archetype | Flags | Rec |
|------|-------|---|---|---|---------|-------|----------|-----------|-------|-----|
| 1 | 88 | 38 | 32 | 18 | Nexus Labs | AI Training Lead | Berlin | coach-ai-full | | ✓ |
| 2 | 83 | 36 | 30 | 17 | Glide Studios | Facilitator (LLM rollout) | Remote | coach-ai-full | | ✓ |
| 3 | 79 | 30 | 34 | 15 | Beacon Corp | AI Enablement Consultant | Munich | coach-ai-full | | ✓ |
| 4 | 78 | 34 | 28 | 16 | Orbit GmbH | Learning Architect | Hamburg | coach-ai-full | | ✓ |
| 5 | 78 | 36 | 26 | 16 | Voltex | AI Curriculum Designer | Remote | coach-ai-full | | ✓ |
| 6 | 74 | 38 | 22 | 14 | Fernwood Health | AI Coach | Frankfurt | coach-ai-full | | ✓ |
| 7 | 62 | 18 | 34 | 10 | Quanta Tech | AI Product Manager | Berlin | enabler | | ✗ |
| 8 | 58 | 38 | 14 | 6 | Taper Group | Head of Learning | Cologne | adjacent | | ✗ |
| 9 | 54 | 10 | 38 | 6 | Axon Systems | AI Solutions Architect | Stuttgart | enabler | | ✗ |
| 10 | 52 | 35 | 12 | 5 | Denova GmbH | Senior Trainer (Digital) | Remote | adjacent | | ✗ |
| 11 | 50 | 36 | 10 | 4 | Prism Retail | L&D Manager | Düsseldorf | adjacent | | ✗ |
| 12 | 46 | 6 | 38 | 2 | Silvana AI | ML Engineer | Berlin | enabler | | ✗ |
| 13 | 44 | 33 | 8 | 3 | Crest Advisory | Change Manager | Remote | adjacent | | ✗ |
| 14 | 44 | 36 | 6 | 2 | Remora Ltd | Agile Coach | Munich | adjacent | | ✗ |
| 15 | 41 | 4 | 36 | 1 | Luma Platform | Data Scientist | Berlin | — | | ✗ |
| 16 | 40 | 30 | 6 | 4 | Parvus Group | OD Consultant | Remote | adjacent | | ✗ |
| 17 | 38 | 2 | 30 | 6 | Forma AI | AI Researcher | Munich | — | | ✗ |
| 18 | 35 | 28 | 4 | 3 | Linden Corp | Training Specialist | Hamburg | adjacent | | ✗ |
| 19 | 32 | 26 | 4 | 2 | Mortar & Co | Business Coach | Remote | adjacent | | ✗ |
| 20 | 28 | 4 | 20 | 4 | Stride Labs | Junior ML Ops | Berlin | — | `recruiter_ad` | ✗ |

*Rows 21–38 (scores < 28) omitted from display. Available on request.*

---

## Top-5 picks with reasoning

**1. Nexus Labs / AI Training Lead** — score 88
> Primary deliverable is training employees on production LLM tools; role owns the curriculum design AND the AI platform integration. Perfect intersection of coaching output and AI implementation input.
> `/apply nx-001`

**2. Glide Studios / Facilitator (LLM rollout)** — score 83
> Explicitly hired to facilitate the company's LLM rollout across 4 business units. Strong coaching signal ("facilitate", "change adoption") + hands-on AI expectation ("you will configure and demo our LLM stack"). Remote.
> `/apply gl-012`

**3. Beacon Corp / AI Enablement Consultant** — score 79
> Consulting role enabling client teams to adopt AI. Slightly heavier on the AI implementation side than coaching, but the client-facing "enablement" framing brings it into intersection territory.
> `/apply bc-003`

**4. Orbit GmbH / Learning Architect** — score 78
> "Learning Architect" title in an AI-first scale-up. AI dimension is solid (30) because the company's product IS an AI learning platform — hard to separate the coaching from the AI.
> `/apply or-002`

**5. Voltex / AI Curriculum Designer** — score 78
> Full-time curriculum design for an AI training product. Strong coaching dimension; AI dimension partial (26) because the role designs but does not build the underlying AI.
> `/apply vx-014`

---

## Save picks (Phase 5)

Jordan confirmed picks 1–3. Calls made:

```
save_application({ job_id: "nx-001", status: "drafted", company: "Nexus Labs", role: "AI Training Lead" })
save_application({ job_id: "gl-012", status: "drafted", company: "Glide Studios", role: "Facilitator (LLM rollout)" })
save_application({ job_id: "bc-003", status: "drafted", company: "Beacon Corp", role: "AI Enablement Consultant" })
```

Confirmed: 3 entries written to tracker.

---

*Phase outputs: ranking table + top-5 suggestions + save confirmations. Next step: `/apply nx-001`.*
