# Scoring Rubric

> Generic rubric structure for `/rank`, followed by a fully worked example you can copy or adapt.

---

## Generic Structure

The rubric has three components that always sum to 100:

| Component | Range | Description |
|-----------|-------|-------------|
| **Dimension A** | 0–40 | Your primary fit axis |
| **Dimension B** | 0–40 | Your secondary fit axis |
| **Intersection** | 0–20 | Bonus for roles requiring BOTH A and B simultaneously |

### Defining your dimensions

When the user runs `/rank` without `--rubric`, the skill asks:

> "What are the two things a role must have for you to be the right person?
> Think in job-posting terms — not 'I like X' but 'the role requires X'."

Good dimensions are:
- **Observable in the posting** — you can score them from a job description
- **Differentiating** — they separate roles you'd excel at from roles you'd just fill
- **Exclusive** — the intersection bonus only fires when a single role demands both

### Scoring anchors (ask the user)

For each dimension, set three anchors:
- **Full (35–40)**: "A role like [example] — the whole job is this"
- **Partial (20–30)**: "A role like [example] — about half the job"
- **Incidental (0–15)**: "A role like [example] — maybe one project or one paragraph"

These become the few-shot prompt for the scoring agents. See `references/archetype-cards.md`.

### Intersection bonus

The intersection bonus rewards roles that structurally require both dimensions, not just roles that mention both. Heuristic:

| Condition | Intersection score |
|-----------|-------------------|
| Role requires A and B in the same workflow | 15–20 |
| Role has A team and B team, you'd straddle them | 8–14 |
| Role mentions both but they're separate tracks | 0–7 |

---

## Worked Example: Coaching × AI

> This rubric fits a profile at the intersection of human-development work (coaching, training, facilitation) and AI implementation (building, enabling, deploying AI systems). Copy it as a starting point or replace it entirely.

### Dimensions

| Component | Label | What scores high |
|-----------|-------|-----------------|
| Dimension A | **Coaching / Training** (0–40) | Role is primarily about developing people: coaching, training, facilitation, curriculum design, change management, enablement |
| Dimension B | **AI Implementation** (0–40) | Role is primarily about AI work: building, deploying, integrating, enabling, or strategising AI systems in practice |
| Intersection | **Coaching × AI** (0–20) | Role structurally requires both — e.g. "train employees on AI tools", "coach product teams through AI adoption", "design AI learning programmes" |

### Scoring anchors

**Dimension A — Coaching / Training**

| Score | Label | Example |
|-------|-------|---------|
| 35–40 | Full | Leadership coach, L&D manager, agile trainer, facilitator of transformation programmes |
| 20–30 | Partial | Consultant who sometimes runs workshops; PM who owns internal training; developer evangelist |
| 0–15 | Incidental | Engineer who onboards new hires once a quarter; PM who writes internal docs |

**Dimension B — AI Implementation**

| Score | Label | Example |
|-------|-------|---------|
| 35–40 | Full | AI engineer, ML engineer, AI product manager, AI solutions architect |
| 20–30 | Partial | Software engineer at an AI company; product manager for an AI feature; data analyst building ML pipelines |
| 0–15 | Incidental | Analyst who uses AI tools; PM at a company that "uses AI" |

**Intersection — Coaching × AI**

| Score | Condition |
|-------|-----------|
| 15–20 | Primary deliverable requires both: "train staff on AI", "coach teams through AI transformation", "design and deliver AI upskilling curriculum" |
| 8–14 | Role sits between two teams, e.g. AI engineer who also runs enablement sessions |
| 0–7 | Both mentioned but in separate contexts — e.g. "AI project + occasional team workshops" |

### Red flags (automatic — no extra instruction needed)

| Flag | Trigger |
|------|---------|
| `recruiter_ad` | Posting is an agency/headhunter ad; no employer named |
| `empty_description` | Description blank or < 50 chars |
| `boilerplate_only` | Entire description is generic copy ("dynamic team", "growth mindset") with no specific requirements |
| `title_company_mismatch` | Title signals coaching/AI but company is e.g. logistics, manufacturing with no digital transformation mention |

### Calibration run

Run the rubric against these three fictional archetypes first. If scoring agents disagree by more than ±8 points from the anchor scores below, revisit the rubric wording.

| Role | Company | A | B | ∩ | Expected total |
|------|---------|---|---|---|----------------|
| AI Upskilling Lead | Nexus Labs | 38 | 30 | 18 | ~86 |
| ML Engineer | Orbit GmbH | 5 | 38 | 3 | ~46 |
| Learning & Development Manager | Beacon Corp | 36 | 8 | 5 | ~49 |

If the ML Engineer score drifts above 55, Dimension B anchors are too generous — tighten the "incidental" threshold.

---

## Replacing this rubric

To use a different rubric entirely, replace the dimension labels and scoring anchors. The three-part structure (A + B + intersection = 100) stays fixed — it keeps the output schema stable for downstream use by `/apply`.

Minimal viable rubric (fill in the blanks):

```
Dimension A: [label] — scores high when the posting requires [X]
  Full (35-40): role like [example]
  Partial (20-30): role like [example]
  Incidental (0-15): role like [example]

Dimension B: [label] — scores high when the posting requires [Y]
  Full (35-40): role like [example]
  Partial (20-30): role like [example]
  Incidental (0-15): role like [example]

Intersection (0-20): fires when a single role requires BOTH [X] and [Y] in the same workflow
```
