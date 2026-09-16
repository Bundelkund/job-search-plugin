#!/usr/bin/env node
// One runnable check for migrate-to-local.mjs (Pocock "One Runnable Check").
// Spins up a tiny local mock of the tenant service (plain node:http, no deps),
// points the migration script at it, and asserts the generated Markdown
// matches the format specified in skills/apply/references/storage.md and
// skills/interview/references/storage.md.
//
// Run: node tools/migrate-to-local.test.mjs

import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

import { run, slugify, buildIndexMd } from "./migrate-to-local.mjs";

const MOCK_PROFILE = {
  positioning: "Senior AI enablement lead with 10 years in adult education.",
  cv_text: "## Experience\n- Nexus AI, Training Lead, 2022-2026",
  achievements: "Trained 4,000+ employees across 12 countries.",
  skills_matrix: "| Skill | Evidence |\n|---|---|\n| Facilitation | ... |",
  writing_style: "Direct, no filler, short paragraphs.",
};

const MOCK_APPLICATIONS = {
  applications: [
    {
      job_id: "7c3f9a12-test",
      folder_name: null,
      status: "applied",
      company: "Nexus AI",
      role: "Training Lead",
      url: "https://example.com/job/1",
      notes: "Applied via referral from X.",
      at: "2026-09-09T10:00:00Z",
      history: [],
    },
  ],
};

const MOCK_INTERVIEWS = {
  interviews: [
    {
      id: 1,
      job_id: "7c3f9a12-test",
      stage: "screening",
      company: "Nexus AI",
      role: "Training Lead",
      scheduled_at: "2026-09-15T10:00:00Z",
      prep_notes: "## Role summary\nTraining lead for enterprise AI rollout.",
      debrief_notes: "Went well, moving to technical round.",
      outcome: "advanced",
      created_at: "2026-09-01T00:00:00Z",
      updated_at: "2026-09-15T11:00:00Z",
    },
  ],
};

function startMockServer() {
  const server = createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.headers["x-api-key"] !== "test-key") {
      res.writeHead(401);
      res.end(JSON.stringify({ detail: "bad key" }));
      return;
    }
    const url = req.url.split("?")[0];
    if (url === "/my/profile") {
      res.writeHead(200);
      res.end(JSON.stringify(MOCK_PROFILE));
    } else if (url === "/my/applications") {
      res.writeHead(200);
      res.end(JSON.stringify(MOCK_APPLICATIONS));
    } else if (url === "/my/interviews") {
      res.writeHead(200);
      res.end(JSON.stringify(MOCK_INTERVIEWS));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ detail: "not found" }));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

let problems = 0;
const check = (label, cond) => {
  if (cond) {
    console.log(`  ok - ${label}`);
  } else {
    console.error(`  FAIL - ${label}`);
    problems++;
  }
};

const server = await startMockServer();
const port = server.address().port;
const home = await mkdtemp(join(tmpdir(), "job-search-migrate-test-"));

try {
  // --- unit checks, no server involved ---
  check("slugify lowercases and kebab-cases", slugify("Nexus AI", "Training Lead") === "nexus-ai-training-lead");
  check(
    "buildIndexMd sorts newest first",
    buildIndexMd([
      { status: "a", company: "A", role: "R", updated: "2026-01-01", slug: "a-r" },
      { status: "b", company: "B", role: "R", updated: "2026-02-01", slug: "b-r" },
    ]).startsWith("| Status | Company | Role | Updated | Folder |\n|--------|---------|------|---------|--------|\n| b |"),
  );

  // --- full run against the mock server ---
  const result = await run({
    TENANT_URL: `http://127.0.0.1:${port}`,
    TENANT_API_KEY: "test-key",
    JOB_SEARCH_HOME: home,
  });

  check("no conflicts on a clean directory", result.conflicts.length === 0);
  check("wrote profile.md + application.md + INDEX.md + prep + debrief", result.written.length === 5);

  const profileMd = await readFile(join(home, "profile.md"), "utf8");
  check("profile.md has all 5 fixed headings", [
    "## Positioning",
    "## CV",
    "## Achievements",
    "## Skills matrix",
    "## Writing style",
  ].every((h) => profileMd.includes(h)));
  check("profile.md carries the CV text verbatim", profileMd.includes("Nexus AI, Training Lead, 2022-2026"));

  const appPath = join(home, "applications", "nexus-ai-training-lead", "application.md");
  const appMd = await readFile(appPath, "utf8");
  check("application.md has frontmatter with job_id/company/role/status/url/updated", [
    "job_id: 7c3f9a12-test",
    "company: Nexus AI",
    "role: Training Lead",
    "status: applied",
    "url: https://example.com/job/1",
    "updated: 2026-09-09",
  ].every((line) => appMd.includes(line)));
  check("application.md body carries the notes", appMd.includes("Applied via referral from X."));

  const indexMd = await readFile(join(home, "applications", "INDEX.md"), "utf8");
  check("INDEX.md is a table row for the application", indexMd.includes("| applied | Nexus AI | Training Lead | 2026-09-09 | nexus-ai-training-lead |"));

  const prepMd = await readFile(join(home, "interviews", "nexus-ai-training-lead", "screening-prep.md"), "utf8");
  check("prep.md has job_id/stage/company/role/scheduled_at frontmatter", [
    "job_id: 7c3f9a12-test",
    "stage: screening",
    "company: Nexus AI",
    "role: Training Lead",
    "scheduled_at: 2026-09-15T10:00:00Z",
  ].every((line) => prepMd.includes(line)));
  check("prep.md carries prep_notes verbatim", prepMd.includes("Training lead for enterprise AI rollout."));
  check("prep.md has no outcome field (debrief-only per storage.md)", !prepMd.includes("outcome:"));

  const debriefMd = await readFile(join(home, "interviews", "nexus-ai-training-lead", "screening-debrief.md"), "utf8");
  check("debrief.md carries outcome", debriefMd.includes("outcome: advanced"));
  check("debrief.md carries debrief_notes verbatim", debriefMd.includes("Went well, moving to technical round."));

  // --- idempotency / conflict-avoidance: run again unchanged, then corrupt and rerun ---
  const second = await run({
    TENANT_URL: `http://127.0.0.1:${port}`,
    TENANT_API_KEY: "test-key",
    JOB_SEARCH_HOME: home,
  });
  check("second run against unchanged data writes nothing new (only INDEX.md, which always regenerates)", second.written.length <= 1);
  check("second run reports no conflicts when content is identical", second.conflicts.length === 0);

  const { writeFile } = await import("node:fs/promises");
  await writeFile(appPath, "hand-edited, do not touch\n", "utf8");
  const third = await run({
    TENANT_URL: `http://127.0.0.1:${port}`,
    TENANT_API_KEY: "test-key",
    JOB_SEARCH_HOME: home,
  });
  check("a hand-edited file is reported as a conflict, not overwritten", third.conflicts.includes(appPath));
  const stillHandEdited = await readFile(appPath, "utf8");
  check("the conflicting file's content is untouched", stillHandEdited === "hand-edited, do not touch\n");
} finally {
  server.close();
  await rm(home, { recursive: true, force: true });
}

console.log(problems === 0 ? "\n✓ migrate-to-local behaves as specified" : `\n✗ ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
