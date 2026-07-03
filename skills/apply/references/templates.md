# Document templates — Markdown structure

> Self-contained section layouts for the cover letter and CV. Use these as the structural reference when producing Phase 2c (cv) and Phase 3c (anschreiben) artifacts.

---

## Cover letter (Anschreiben)

One page maximum. All placeholder text in `{{...}}` is replaced from `get_my_profile()` + `get_job()` at runtime.

```markdown
---
empfaenger: |
  {{Company}} GmbH\
  z.Hd. {{Herr/Frau}} {{Contact Lastname}}\
  {{Street and number, if known}}\
  {{ZIP City}}
datum: "{{City}}, {{Date}}"
betreff: "Bewerbung als {{Role}}"
---

{{Salutation — e.g. "Sehr geehrte Frau Muster,"}}

{{Opening paragraph (2–3 sentences): name the company's problem}}

{{Evidence paragraph (4–5 sentences): concrete example with numbers — leading pillar}}

{{Second-pillar paragraph (3–4 sentences): serving pillar reinforces}}

{{Closing paragraph (2–3 sentences): what the company gets + invitation to talk}}

Mit freundlichen Grüßen\
{{Author full name}}

<!-- Keywords:
- {{Keyword 1}}: {{yes / not addressed — reason}}
- {{Keyword 2}}: {{yes / not addressed — reason}}
-->
```

**Layout rules**:
- Recipient block (`empfaenger`) + date on the same page header
- Subject line bold
- Body: 4 paragraphs, no section headings, justified text in the rendered version
- Closing: "Mit freundlichen Grüßen" + name on the next line (no backslash before the name)

---

## CV

Two pages for senior profiles; one page acceptable for junior/early career. Sections in the order below.

```markdown
---
author: "{{Full Name}}"
city: "{{City}}"
phone: "{{Phone}}"
email: "{{Email}}"
linkedin: "{{LinkedIn URL}}"
subtitle: "{{Role headline — e.g. Solutions Architect & AI Adoption Lead}}"
---

# {{Full Name}}

{{City}} · {{Email}} · {{Phone}} · {{LinkedIn}}

## Profil

{{3–5 sentence positioning summary. Use `positioning` from the profile as the base.
Tailor to the role: lead with the relevant pillar.}}

## Erfahrung

### {{Job Title}} — {{Company}}, {{City}}
*{{Start year}} – {{End year / heute}}*

- {{Bullet: verb → impact → number}}
- {{Bullet: verb → impact → number}}
- {{Bullet: verb → impact → number (max 2 lines)}}

### {{Job Title}} — {{Company}}, {{City}}
*{{Start year}} – {{End year}}*

- {{Bullet}}
- {{Bullet}}

[repeat for each relevant position; drop or compress older/less-relevant ones]

## Ausbildung

- **{{Degree}}**, {{Institution}}, {{Year}}
- **{{Certificate / training}}**, {{Year}}

## Skills

- **{{Category — e.g. Tech}}**: {{comma-separated list}}
- **{{Category — e.g. AI/ML}}**: {{comma-separated list}}
- **{{Category — e.g. Soft Skills}}**: {{comma-separated list}}
- **{{Sprachen}}**: {{Language (Level)}}

## Erfolge

- {{Quantified achievement with number + org/year}}
- {{Quantified achievement with number + org/year}}
- {{Quantified achievement with number + org/year}}
```

**Layout rules**:
- Profil section: always present, tailored to the posting's leading pillar
- Erfahrung: reverse-chronological; current/recent role first
- Bullet points: max 2 lines each; start with a strong verb; embed ATS keywords from the posting
- Skills: evidence-based categories, no self-assessment percentages or rating bars
- Erfolge: numbers + context + org/year; pick 3–5 most relevant to the posting
