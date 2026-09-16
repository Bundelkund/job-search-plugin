# Phase 4: Review

## GATE — artifact check (mandatory before Phase 4)

Confirm that all of the following in-conversation artifacts exist from prior phases:

- [ ] job posting (Phase 1)
- [ ] job-fit-analysis (Phase 2a)
- [ ] cv-anpassung (Phase 2b)
- [ ] cv (Phase 2c)
- [ ] anschreiben (Phase 3c)

If any is missing: stop. Ask the user whether to produce it or skip.

## 4a: Review against the template

Check the cover letter against `references/agent-prompt-template.md`:

- [ ] Structure matches the template (4 paragraphs by default)
- [ ] All DON'Ts from the template respected
- [ ] Keyword reconciliation comment at the bottom (HTML comment format)
- [ ] Every must-have keyword from `job-fit-analysis` covered
- [ ] Cover letter <= 1 page
- [ ] Recipient and subject correct
- [ ] No spelling errors
- [ ] **Salutation present**: first line after `---` is a real salutation
- [ ] **Closing correct**: umlauts present, no backslash before name
- [ ] **Umlauts throughout**: no ASCII replacements
- [ ] **No first name** of the contact in salutation or body
- [ ] **No unchecked anglicisms** (e.g. German "Adoption" → "Adaption" or "Annahme")

### Content gate (against job-fit-analysis, mandatory)

- [ ] **Coverage**: every bullet in the coverage list (Phase 2a item 6) is addressed in the cover letter — including distinct sub-responsibilities
- [ ] **Gaps in opening**: every gap rated Medium or above (Phase 2a item 7) is named in paragraph 1, not as a closing hedge
- [ ] **Claims grounded**: every employer name, job title, skill claim, and number in the cover letter is traceable to a profile field — no template residue, no invented figures. Backstop to the Phase 3c grounding gate.
- [ ] **Channel discipline**: no salary expectation / availability / preferred hours in the cover letter when the posting names a portal or form for those
- [ ] **Taxonomy adopted**: the cover letter uses the competency dimensions the posting itself named (Phase 2a item 9) as its structural axis, not self-invented categories

## 4a.5: Adversarial review (Generator-Verifier gate)

> **Optional, recommended for**: high-interest postings (job-fit >= 70), leadership roles, or when the user passes `/apply --thorough`.
> **Skip for**: low job-fit, or `/apply --fast`.

**Pattern**: Generator-Verifier — the cover letter is the generated artifact, reviewed in-context with a sceptic persona.

**Steps**:

1. **Adopt the reviewer perspective** — re-read the cover letter with a sceptical eye, against the posting. Your job is to find weaknesses, NOT to confirm it is good.

2. **Score 4 criteria** (1–10, threshold 7):

   | Criterion | What to test |
   |-----------|-------------|
   | `posting-match` | Every must-have requirement from the posting is addressed. Count missing keywords. Compare posting paragraph by paragraph with the letter. |
   | `authenticity` | No generic filler, concrete examples with numbers / context, no "I am highly motivated" style. Mark every sentence that would also fit another role. |
   | `jonas-rule` | Paragraphs 2–3 show concrete value for the company, not just what the candidate can do. Check that "Sie/Ihr/your company" appears more often than "Ich/I/my". |
   | `no-donts` | None of the DON'Ts in `writing_style` (from the profile) are violated. Check against the DON'T list. |

   Produce output as a YAML block:
   ```yaml
   posting-match: {score: N, evidence: "..."}
   authenticity:  {score: N, evidence: "..."}
   jonas-rule:    {score: N, evidence: "..."}
   no-donts:      {score: N, evidence: "..."}
   ```

3. **Feedback loop** — max 2 rounds:
   - Round 1: score all 4 criteria
   - On FAILs (score < 7): rewrite the affected paragraphs in the cover letter directly
   - Round 2: re-score only the failed criteria
   - After round 2 still FAILs → ask the user

4. **Result** — append a short note at the end of the cover letter Markdown:

```
<!-- Adversarial Review: PASS | R1: posting-match 5->8, authenticity 8, jonas-rule 7, no-donts 9 -->
```

## 4b: Handoff — PDF export

Call `render_pdf` only after the user has approved the Markdown in this review
phase — never before. Render both documents:

```
render_pdf({
  kind: "cover_letter",
  markdown: "<exact content of cover-letter.md>",
  sender: { name, city?, email?, phone?, linkedin? }   // from the CV frontmatter / profile
})
render_pdf({
  kind: "cv",
  markdown: "<exact content of cv.md>",
  photo_path?: "<only if the user provided a photo — never ask pushily>"
})
```

In `local` mode pass `out_path` as `$JOB_SEARCH_HOME/applications/<slug>/cover-letter.pdf`
resp. `cv.pdf`; otherwise the tool defaults to `~/Downloads/<cover-letter|cv>.pdf`.
`markdown` must be the exact content of `cover-letter.md` / `cv.md` in the format
of `references/templates.md` — no paraphrasing.

**If `overflow` is non-empty**: the document does not fit the page. Shorten the
named part in the Markdown and render again — max ~3 rounds, then tell the user
and hand over the Markdown as-is.

**If the tool errors with "no browser found"**: tell the user to install Chrome
or Edge, and hand over the Markdown as before — this is the fallback, not a
failure to report as broken.

**On success**: report `pdf_path` to the user, and mention if `overwritten` is
true.

The application text never leaves the machine — `render_pdf` renders locally
using the user's installed Chrome, Edge, or Chromium.
