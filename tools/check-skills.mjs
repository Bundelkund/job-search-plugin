#!/usr/bin/env node
// One runnable check for the skill texts. No dependencies: node tools/check-skills.mjs
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, sep } from "node:path";

const SKILLS = "skills";
// Claims that stopped being true when local storage became the default.
const STALE = [
  "no local filesystem",
  "the only I/O",
  "Only I/O —",
  "no files written to disk",
];
let problems = 0;
const fail = (where, msg) => { console.error(`  ✗ ${where}: ${msg}`); problems++; };

for (const skill of readdirSync(SKILLS)) {
  const dir = join(SKILLS, skill);
  const skillFile = join(dir, "SKILL.md");
  if (!existsSync(skillFile)) { fail(skill, "no SKILL.md"); continue; }
  const text = readFileSync(skillFile, "utf8");
  const files = readdirSync(dir, { recursive: true }).map(String);

  const fm = text.startsWith("---\n") ? text.slice(4, text.indexOf("\n---", 4)) : "";
  if (!/^name:/m.test(fm)) fail(skill, "frontmatter without name:");

  // Every referenced reference file must exist INSIDE this skill — Codex copies
  // skill directories one by one, so a path leaving the directory breaks there.
  // readdirSync gives OS-native separators (backslashes on Windows), the refs in
  // the Markdown always use "/" — normalise before comparing, or every file
  // would look missing on Windows.
  const owned = new Set(files.map((f) => f.split(sep).join("/")));
  for (const ref of text.match(/references\/[a-z0-9-]+\.md/g) ?? []) {
    if (!owned.has(ref)) fail(skill, `references a missing file: ${ref}`);
  }
  for (const esc of text.match(/\.\.\/[a-z0-9_-]+\//g) ?? []) {
    fail(skill, `path escapes the skill directory (breaks on Codex): ${esc}`);
  }

  // A skill that writes locally must carry its own storage rules.
  const isLocal = text.includes("$JOB_SEARCH_HOME") || text.includes("~/job-search");
  if (isLocal && !files.includes("references/storage.md")) {
    fail(skill, "mentions local storage but has no references/storage.md");
  }
  // Checked for EVERY skill, not just the local-storage ones: a skill that no
  // longer writes locally can carry the same outdated claim, and gating this on
  // isLocal used to let exactly that through.
  for (const f of files.filter((f) => f.endsWith(".md"))) {
    const body = readFileSync(join(dir, f), "utf8");
    for (const phrase of STALE) {
      if (body.includes(phrase)) fail(`${skill}/${f}`, `stale claim: "${phrase}"`);
    }
  }
}
console.log(problems === 0 ? "✓ skills consistent" : `✗ ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
