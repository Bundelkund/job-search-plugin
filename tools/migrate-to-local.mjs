#!/usr/bin/env node
// One-time, deterministic export: pulls a profile's own data OUT of the tenant
// service and writes it to the local Markdown layout that skills/*/references/
// storage.md specifies. Deliberately NOT an LLM skill — the profile text and CV
// text must land byte-for-byte (storage.md: "write the full text, not a
// summary"), and a model copying it out could paraphrase or trim it.
//
// Read-only against the server: three GETs, nothing else. No DELETE, no
// storage-mode switch — those stay separate, manual steps someone does WITH the
// person being migrated, never something this script decides on its own.
//
// Usage:
//   TENANT_API_KEY=... [TENANT_URL=...] [JOB_SEARCH_HOME=...] \
//     node tools/migrate-to-local.mjs
//
// Exit code 0 on success (including "nothing to do" / "some files already
// existed and were skipped"), non-zero on a hard failure (missing key, server
// unreachable, ...).

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Tenant HTTP client — same shape as mcp/index.mjs's tenantRequest (header
// names, timeout, error framing), trimmed to the GET-only subset this script
// needs. Kept separate rather than importing the bundled mcp/index.mjs: that
// file is a build artifact (27k lines, minified var names), not a module meant
// to be imported from tooling.
// ---------------------------------------------------------------------------

class TenantError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "TenantError";
  }
}

function loadConfig(env = process.env) {
  const apiKey = (env.TENANT_API_KEY ?? "").trim();
  if (!apiKey) {
    throw new TenantError(
      "TENANT_API_KEY is missing. Export your personal tenant API key first.",
      0,
    );
  }
  let baseUrl = (env.TENANT_URL ?? "https://tenant.konektos.de").trim();
  baseUrl = baseUrl.replace(/\/+$/, "");
  const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseUrl);
  if (!baseUrl.startsWith("https://") && !isLocalhost) {
    throw new TenantError(`TENANT_URL must be HTTPS (or localhost): ${baseUrl}`, 0);
  }
  const home = (env.JOB_SEARCH_HOME ?? "").trim() || join(homedir(), "job-search");
  return { baseUrl, apiKey, home };
}

async function tenantGet(cfg, path) {
  const url = `${cfg.baseUrl}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let resp;
  try {
    resp = await fetch(url, {
      method: "GET",
      headers: { "X-API-Key": cfg.apiKey, Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new TenantError(`Timed out after ${TIMEOUT_MS / 1000}s — ${path} unreachable`, 0);
    }
    throw new TenantError(`Network error — ${path} unreachable (${err.message})`, 0);
  } finally {
    clearTimeout(timer);
  }
  const text = await resp.text();
  let parsed;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      // leave parsed undefined — handled below
    }
  }
  if (!resp.ok) {
    const detail = parsed && typeof parsed === "object" && "detail" in parsed ? parsed.detail : text;
    throw new TenantError(`${path} -> HTTP ${resp.status}${detail ? `: ${JSON.stringify(detail)}` : ""}`, resp.status);
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Formatting helpers — mirror skills/apply/references/storage.md and
// skills/interview/references/storage.md exactly. Heading text and frontmatter
// keys are load-bearing: other skills read these files back by heading/key.
// ---------------------------------------------------------------------------

export function slugify(company, role) {
  const part = (s) =>
    (s ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "unknown";
  return `${part(company)}-${part(role)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function buildProfileMd(profile) {
  const p = profile ?? {};
  const section = (v) => (v && String(v).trim() ? String(v).trim() : "");
  return `---
updated: ${today()}
---

## Positioning
${section(p.positioning)}

## CV
${section(p.cv_text)}

## Achievements
${section(p.achievements)}

## Skills matrix
${section(p.skills_matrix)}

## Writing style
${section(p.writing_style)}
`;
}

export function buildApplicationMd(app) {
  const updated = (app.at ? String(app.at).slice(0, 10) : null) ?? today();
  const lines = [
    "---",
    `job_id: ${app.job_id ?? ""}`,
    `company: ${app.company ?? ""}`,
    `role: ${app.role ?? ""}`,
    `status: ${app.status ?? ""}`,
    `url: ${app.url ?? ""}`,
    `updated: ${updated}`,
    "---",
    "",
    app.notes && String(app.notes).trim() ? String(app.notes).trim() : "",
    "",
  ];
  return lines.join("\n");
}

export function buildIndexMd(rows) {
  const sorted = [...rows].sort((a, b) => String(b.updated).localeCompare(String(a.updated)));
  const header = "| Status | Company | Role | Updated | Folder |\n|--------|---------|------|---------|--------|";
  const body = sorted
    .map((r) => `| ${r.status} | ${r.company} | ${r.role} | ${r.updated} | ${r.slug} |`)
    .join("\n");
  return `${header}\n${body}\n`;
}

export function buildPrepMd(interview) {
  const lines = [
    "---",
    `job_id: ${interview.job_id ?? ""}`,
    `stage: ${interview.stage ?? ""}`,
    `company: ${interview.company ?? ""}`,
    `role: ${interview.role ?? ""}`,
    `scheduled_at: ${interview.scheduled_at ?? ""}`,
    "---",
    "",
    interview.prep_notes && String(interview.prep_notes).trim() ? String(interview.prep_notes).trim() : "",
    "",
  ];
  return lines.join("\n");
}

export function buildDebriefMd(interview) {
  const lines = [
    "---",
    `job_id: ${interview.job_id ?? ""}`,
    `stage: ${interview.stage ?? ""}`,
    `company: ${interview.company ?? ""}`,
    `role: ${interview.role ?? ""}`,
    `scheduled_at: ${interview.scheduled_at ?? ""}`,
    `outcome: ${interview.outcome ?? ""}`,
    "---",
    "",
    interview.debrief_notes && String(interview.debrief_notes).trim() ? String(interview.debrief_notes).trim() : "",
    "",
  ];
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Safe, idempotent, verified writes.
// ---------------------------------------------------------------------------

/**
 * Writes `content` to `path` unless a different file is already there.
 * Never overwrites a pre-existing file whose content differs — the caller
 * collects those in `conflicts` and reports them instead of guessing.
 * Returns one of: "written" | "unchanged" | "conflict".
 */
async function safeWrite(path, content, { written, conflicts }) {
  if (existsSync(path)) {
    const existing = await readFile(path, "utf8");
    if (existing === content) return "unchanged";
    conflicts.push(path);
    return "conflict";
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
  // Verify after writing (storage.md rule): read back, fail loudly on mismatch.
  const readBack = await readFile(path, "utf8");
  if (readBack !== content) {
    throw new Error(`Verification failed after writing ${path} — content on disk does not match`);
  }
  written.push(path);
  return "written";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function run(env = process.env) {
  const cfg = loadConfig(env);
  const written = [];
  const conflicts = [];

  const [profile, applicationsResp, interviewsResp] = await Promise.all([
    tenantGet(cfg, "/my/profile"),
    tenantGet(cfg, "/my/applications?history=true"),
    tenantGet(cfg, "/my/interviews"),
  ]);

  // profile.md
  await safeWrite(join(cfg.home, "profile.md"), buildProfileMd(profile), { written, conflicts });

  // applications/<slug>/application.md
  const apps = applicationsResp?.applications ?? [];
  const indexRows = [];
  const usedSlugs = new Map(); // slug -> job_id, to disambiguate same company+role
  for (const app of apps) {
    let slug = slugify(app.company, app.role);
    const existingJobId = usedSlugs.get(slug);
    if (existingJobId !== undefined && existingJobId !== app.job_id) {
      let n = 2;
      let candidate = `${slug}-${n}`;
      while (usedSlugs.has(candidate)) {
        n += 1;
        candidate = `${slug}-${n}`;
      }
      slug = candidate;
    }
    usedSlugs.set(slug, app.job_id);

    const path = join(cfg.home, "applications", slug, "application.md");
    await safeWrite(path, buildApplicationMd(app), { written, conflicts });
    indexRows.push({
      status: app.status ?? "",
      company: app.company ?? "",
      role: app.role ?? "",
      updated: app.at ? String(app.at).slice(0, 10) : today(),
      slug,
    });
  }
  if (indexRows.length > 0) {
    // INDEX.md is a derived view (storage.md: "regenerated — never hand-edited").
    // Regenerating it is always safe, so it is exempt from the conflict check.
    const indexPath = join(cfg.home, "applications", "INDEX.md");
    await mkdir(dirname(indexPath), { recursive: true });
    const content = buildIndexMd(indexRows);
    await writeFile(indexPath, content, "utf8");
    const readBack = await readFile(indexPath, "utf8");
    if (readBack !== content) {
      throw new Error(`Verification failed after writing ${indexPath}`);
    }
    written.push(indexPath);
  }

  // interviews/<slug>/<stage>-prep.md and <stage>-debrief.md
  const interviews = interviewsResp?.interviews ?? [];
  for (const iv of interviews) {
    const slug = slugify(iv.company, iv.role);
    const stage = (iv.stage ?? "interview").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (iv.prep_notes && String(iv.prep_notes).trim()) {
      const path = join(cfg.home, "interviews", slug, `${stage}-prep.md`);
      await safeWrite(path, buildPrepMd(iv), { written, conflicts });
    }
    if (iv.debrief_notes && String(iv.debrief_notes).trim()) {
      const path = join(cfg.home, "interviews", slug, `${stage}-debrief.md`);
      await safeWrite(path, buildDebriefMd(iv), { written, conflicts });
    }
  }

  return { written, conflicts, home: cfg.home };
}

function printSummary({ written, conflicts, home }) {
  console.log(`\nMigration target: ${home}\n`);
  console.log(`${written.length} file(s) written:`);
  for (const p of written) console.log(`  + ${p}`);
  if (conflicts.length > 0) {
    console.log(`\n${conflicts.length} file(s) already existed with different content — NOT touched, check manually:`);
    for (const p of conflicts) console.log(`  ! ${p}`);
  }
  console.log(
    conflicts.length > 0
      ? "\nDone, with skipped conflicts. Nothing was overwritten."
      : "\nDone. Nothing was deleted or changed on the server.",
  );
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  try {
    const result = await run();
    printSummary(result);
    process.exit(0);
  } catch (err) {
    console.error(`\n✗ Migration failed: ${err.message}`);
    process.exit(1);
  }
}
