# Example Ranking Run — Nexus Labs / AI Training Lead

> **Fictional example.** All companies, names, scores, and job descriptions are invented.
> Persona: "Jordan Muster", a career-changer targeting roles at the intersection of coaching and AI.

---

## Setup (Phase 1)

**Rubric selected**: Coaching × AI (from `references/scoring-rubric.md`, worked example)

**Profile positioning** (from `get_my_profile()`):
> "Five years running L&D programmes at a consulting firm, pivoting into AI enablement. Delivered 80+ workshops on agile and digital tools. Now building AI-powered learning experiences and coaching product teams through LLM adoption."

**Archetype cards loaded**: coach-ai-full, enabler, adjacent, gap-blocked (see `references/archetype-cards.md`)

---

## Candidate pull (Phase 2)

```
get_my_matches(min_score=40) → 39 matches
```

Note: no `--limit` set — all 39 candidates scored. 6 jobs had empty descriptions (LinkedIn source); scored on title + company only, flagged.

---

## Scoring output (Phase 3) — all 39 candidates

After parallel scoring (2 agents × ~20 jobs):

| job_id | Title | Company | A | B | ∩ | Gap | Total | Flags | Rec |
|--------|-------|---------|---|---|---|-----|-------|-------|-----|
| `nx-001` | AI Training Lead | Nexus Labs | 38 | 32 | 18 | 0 | **88** | | true |
| `or-002` | Learning Architect | Orbit GmbH | 34 | 28 | 16 | 0 | **78** | | true |
| `bc-003` | AI Enablement Consultant | Beacon Corp | 30 | 34 | 15 | 0 | **79** | | true |
| `sv-004` | ML Engineer | Silvana AI | 6 | 38 | 2 | 0 | **46** | | false |
| `pr-005` | L&D Manager | Prism Retail | 36 | 10 | 4 | 0 | **50** | | false |
| `qt-006` | AI Product Manager | Quanta Tech | 18 | 34 | 10 | 0 | **62** | | false |
| `dn-007` | Senior Trainer (Digital) | Denova GmbH | 35 | 12 | 5 | 0 | **52** | | false |
| `fm-008` | AI Coach | Fernwood Health | 38 | 22 | 14 | 0 | **74** | | true |
| `lp-009` | Data Scientist | Luma Platform | 4 | 36 | 1 | 0 | **41** | | false |
| `cr-010` | Change Manager | Crest Advisory | 33 | 8 | 3 | 0 | **44** | | false |
| `ax-011` | AI Solutions Architect | Axon Systems | 10 | 38 | 6 | 0 | **54** | | false |
| `gl-012` | Facilitator (LLM rollout) | Glide Studios | 36 | 30 | 17 | 0 | **83** | | true |
| `tp-013` | Head of Learning | Taper Group | 38 | 14 | 6 | 0 | **58** | | false |
| `vx-014` | AI Curriculum Designer | Voltex | 36 | 26 | 16 | 0 | **78** | | true |
| `rm-015` | Agile Coach | Remora Ltd | 36 | 6 | 2 | 0 | **44** | | false |
| `hl-016` | AI Trainer (unknown posting) | LinkedIn | 0 | 0 | 0 | 0 | **0** | `empty_description` | false |
| `fw-017` | Agentic AI Consultant | Fenwick Digital | 30 | 34 | 15 | −16 | **63** | `requirements_gap` | false |
| ... | *(22 more — scores 20–45)* | | | | | | | | |

---

## Final ranked table (Phase 4)

Top-20 after sorting by total:

| Rank | Score | A | B | ∩ | Gap | Company | Title | Location | Archetype | Flags | Rec |
|------|-------|---|---|---|-----|---------|-------|----------|-----------|-------|-----|
| 1 | 88 | 38 | 32 | 18 | 0 | Nexus Labs | AI Training Lead | Berlin | coach-ai-full | | ✓ |
| 2 | 83 | 36 | 30 | 17 | 0 | Glide Studios | Facilitator (LLM rollout) | Remote | coach-ai-full | | ✓ |
| 3 | 79 | 30 | 34 | 15 | 0 | Beacon Corp | AI Enablement Consultant | Munich | coach-ai-full | | ✓ |
| 4 | 78 | 34 | 28 | 16 | 0 | Orbit GmbH | Learning Architect | Hamburg | coach-ai-full | | ✓ |
| 5 | 78 | 36 | 26 | 16 | 0 | Voltex | AI Curriculum Designer | Remote | coach-ai-full | | ✓ |
| 6 | 74 | 38 | 22 | 14 | 0 | Fernwood Health | AI Coach | Frankfurt | coach-ai-full | | ✓ |
| 7 | 63 | 30 | 34 | 15 | −16 | Fenwick Digital | Agentic AI Consultant | Remote | gap-blocked | `requirements_gap` | ✗ |
| 8 | 62 | 18 | 34 | 10 | 0 | Quanta Tech | AI Product Manager | Berlin | enabler | | ✗ |
| 9 | 58 | 38 | 14 | 6 | 0 | Taper Group | Head of Learning | Cologne | adjacent | | ✗ |
| 10 | 54 | 10 | 38 | 6 | 0 | Axon Systems | AI Solutions Architect | Stuttgart | enabler | | ✗ |
| 11 | 52 | 35 | 12 | 5 | 0 | Denova GmbH | Senior Trainer (Digital) | Remote | adjacent | | ✗ |
| 12 | 50 | 36 | 10 | 4 | 0 | Prism Retail | L&D Manager | Düsseldorf | adjacent | | ✗ |
| 13 | 46 | 6 | 38 | 2 | 0 | Silvana AI | ML Engineer | Berlin | enabler | | ✗ |
| 14 | 44 | 33 | 8 | 3 | 0 | Crest Advisory | Change Manager | Remote | adjacent | | ✗ |
| 15 | 44 | 36 | 6 | 2 | 0 | Remora Ltd | Agile Coach | Munich | adjacent | | ✗ |
| 16 | 41 | 4 | 36 | 1 | 0 | Luma Platform | Data Scientist | Berlin | — | | ✗ |
| 17 | 40 | 30 | 6 | 4 | 0 | Parvus Group | OD Consultant | Remote | adjacent | | ✗ |
| 18 | 38 | 2 | 30 | 6 | 0 | Forma AI | AI Researcher | Munich | — | | ✗ |
| 19 | 35 | 28 | 4 | 3 | 0 | Linden Corp | Training Specialist | Hamburg | adjacent | | ✗ |
| 20 | 32 | 26 | 4 | 2 | 0 | Mortar & Co | Business Coach | Remote | adjacent | | ✗ |

*Rows 21–39 (scores < 32) omitted from display. Available on request.*

**Rank 7 is the case the Requirements Gap dimension exists for.** Content alone (30/34/15 = 79) would have put Fenwick Digital in the top 3 — but the posting's must-have list requires 3+ years of production software engineering, which Jordan's profile doesn't show. The −16 penalty and `requirements_gap` flag push it out of the recommended set even though it reads, on the surface, like one of the best matches.

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
