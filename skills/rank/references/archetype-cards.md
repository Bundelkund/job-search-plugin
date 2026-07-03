# Archetype Cards

> Archetype cards are few-shot anchors for the scoring agents. They describe 2–3 reference roles at different fit levels so that all scoring agents interpret the rubric consistently across batches.

---

## Why cards work

Without anchors, different agents reading the same rubric make different judgment calls about what "partial AI implementation" means. Cards resolve ambiguity concretely: "a role like X is a 35; a role like Y is a 15." The agents extrapolate from there.

Cards are role patterns — not resumes. They describe the job, not the person.

---

## How to write your own cards

Three cards is the minimum. The pattern:

```markdown
### [Card label] — archetype identifier

**Role pattern**: [1–2 sentences describing what this job primarily involves]
**Scoring anchor**:
- Dimension A: [score] — [why]
- Dimension B: [score] — [why]
- Intersection: [score] — [why]
- Total: [score]

**Signals in the posting**: [comma-separated keywords or phrases that mark this archetype]
**Distance from ideal**: [brief note — e.g. "strong match", "solid partial", "adjacent but not core"]
```

Write one "strong match" card (total ~80–90), one "solid partial" (total ~50–65), and one "adjacent but wrong" (total ~20–35). The contrast is what teaches the agents.

---

## Fictional example cards (Coaching × AI rubric)

These cards accompany the worked example in `references/scoring-rubric.md`. They use invented companies and people. Replace them with your own reference roles.

---

### coach-ai-full — Coaching meets AI implementation

**Role pattern**: The role is explicitly about helping people or organisations learn and adopt AI. Could be a trainer designing AI upskilling curricula, a coach supporting product teams through AI transformation, or an enablement lead who both builds AI demos and runs the workshops.

**Scoring anchor** (Coaching × AI rubric):
- Dimension A (Coaching): 38 — the primary deliverable is developing people's capability with AI
- Dimension B (AI): 30 — requires hands-on AI knowledge to credibly build the curriculum or demos
- Intersection: 18 — structurally demands both in the same role; you can't outsource either
- **Total: 86**

**Signals in the posting**: "AI upskilling", "train employees on LLMs", "AI adoption workshop", "enablement programme", "learning architect", "AI coach", "internal AI education"

**Distance from ideal**: Strong match — this is the archetype the rubric is designed for.

---

### enabler — AI team with some training duties

**Role pattern**: Primarily an AI implementation role (engineer, architect, or product manager) at a company undergoing AI transformation. Training and enablement appear in the description but as secondary activities — maybe 20% of the time.

**Scoring anchor** (Coaching × AI rubric):
- Dimension A (Coaching): 15 — training mentioned but not the primary output
- Dimension B (AI): 36 — most of the job is building or deploying AI systems
- Intersection: 8 — the overlap exists but it's incidental, not structural
- **Total: 59**

**Signals in the posting**: "AI engineer", "solutions architect", "you will occasionally run internal demos", "help teams adopt our AI platform", "some stakeholder enablement expected"

**Distance from ideal**: Solid partial — worth scoring but expect a gap on the coaching dimension.

---

### adjacent — L&D without AI

**Role pattern**: A learning and development or organisational development role at a company that mentions "digital transformation" or "future of work" but where AI is not a primary focus. The job is coaching, facilitation, or curriculum design in a traditional sense.

**Scoring anchor** (Coaching × AI rubric):
- Dimension A (Coaching): 36 — the whole job is about people development
- Dimension B (AI): 8 — AI mentioned in passing or as one tool among many
- Intersection: 3 — no structural intersection; AI is not central to the coaching work
- **Total: 47**

**Signals in the posting**: "leadership development", "coaching culture", "change management", "digital upskilling" (vague), "agile mindset" without AI specifics

**Distance from ideal**: Adjacent but not core — strong on coaching, weak on AI. Good signal of Dimension A ceiling, not a hire target.

---

## Using cards in the scoring prompt

When briefing a scoring subagent, include all three cards verbatim with this instruction:

> "Score each job using the rubric dimensions. Use the following archetype cards as calibration anchors — a job that looks like [coach-ai-full] scores around 86; a job like [enabler] scores around 59; a job like [adjacent] scores around 47. Interpolate or extrapolate from there. Do not anchor mechanically — use the cards for intuition, not formula."

The key is "interpolate" — agents should feel free to score above 86 (if a role is even more concentrated on the intersection) or below 47 (if it barely touches either dimension).
