# Job Search — Claude Code Plugin

> Build your application profile, re-rank your job matches, generate cover letters + CVs, track what happened, and prep/debrief interviews — all inside Claude Code or Codex. Five skills plus the tenant connector in one install. **Your material stays on your machine**: everything you write is saved as Markdown under `~/job-search`, and only your search terms travel to the service that finds the jobs.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What's inside

| Component | Type | What it does |
|-----------|------|--------------|
| `letter-forge` | skill | Builds your application profile — paste a CV/past cover letters/other documents to draft it, or answer the interactive questionnaire for what's left. Saved as `~/job-search/profile.md` |
| `rank` | skill | Re-ranks your job matches by a fit rubric you define |
| `apply` | skill | Turns a job posting into a cover letter + CV, saved under `~/job-search/applications/<company-role>/` |
| `dispatch` | skill | Logs an application's status (drafted/applied/interview/offer/rejected/paused) in your tracker — after you've submitted it yourself; no portal or email automation |
| `interview` | skill | Preps an interview dossier, then records the debrief afterward — kept in `~/job-search/interviews/`, separate from your profile by design |
| `tenant` | MCP server | Connects to the tenant service for the things that must be central: your matches and the job postings behind them |

No database, no PDF toolchain — just Markdown files you can read and edit yourself.

## Where your material is stored

Two places, and the split is deliberate:

| What | Where | Why |
|------|-------|-----|
| Profile, cover letters, CVs, tracker, interview notes | **Your machine**, as Markdown under `$JOB_SEARCH_HOME` (default `~/job-search`) | It is yours. Nothing that you write needs to leave the laptop |
| Search terms, and the matches they produce | The tenant service | The matching runs nightly on the server; it has to know what you are looking for even when no chat is open |

```
~/job-search/
  profile.md
  applications/
    INDEX.md
    nexus-ai-training-lead/
      application.md · job-posting.md · job-fit-analysis.md · cv.md · cover-letter.md
  interviews/
    nexus-ai-training-lead/
      screening-prep.md · screening-debrief.md
```

Set `JOB_SEARCH_HOME` to put that folder somewhere else. In an environment without
a file tool — Claude Desktop, a ChatGPT connector — the skills fall back to storing
the same material in the tenant service; set `JOB_SEARCH_STORAGE=tenant` to force
that, `local` to force files.

## Requirements

- Claude Code, or Codex CLI (the skills follow the Agent Skills standard both read)
- **Node.js 20+** on your PATH (runs the bundled MCP server)
- A personal **tenant API key** (ask the tenant owner) — provided via the `TENANT_API_KEY` environment variable
- A place to write: `~/job-search` is created on first use; set `JOB_SEARCH_HOME` to choose another folder
- The Discovery Engine + Tenant service run centrally — you connect to the live instance, you don't host them

## Install

### Claude Code

```
/plugin marketplace add Bundelkund/job-search-plugin
/plugin install job-search@konektos
```

Set your API key so the bundled connector can authenticate — it has to persist across terminal
sessions, so put it in your shell profile (macOS/Linux) or the user environment (Windows):

```bash
# macOS / Linux
export TENANT_API_KEY="your-personal-key"   # add to ~/.zshrc or ~/.bashrc
```

```powershell
# Windows — sets it permanently for your user, no script execution needed
[Environment]::SetEnvironmentVariable("TENANT_API_KEY", "your-personal-key", "User")
```

On Windows, open a **new** terminal afterwards — running processes do not pick up a newly set
variable. You do not need to change the PowerShell execution policy for any of this.

By default the connector targets `https://tenant.konektos.de`. Restart Claude Code after installing so the MCP server picks up the key.

Your documents land in `~/job-search` — no extra setup, the folder is created on first use.

### Codex CLI

Codex has no plugin system, so you install the two halves yourself — the skills into the
Agent Skills directory Codex reads, and the bundled MCP server as a Codex MCP entry.

```bash
# 1. Clone — this repo ships the skills and the pre-bundled MCP server
git clone https://github.com/Bundelkund/job-search-plugin.git ~/job-search-plugin

# 2. Make the skills visible to Codex
mkdir -p ~/.agents/skills
cp -R ~/job-search-plugin/skills/* ~/.agents/skills/

# 3. Register the tenant connector (insert your own key)
codex mcp add tenant \
  --env TENANT_URL=https://tenant.konektos.de \
  --env TENANT_API_KEY=your-personal-key \
  -- node "$HOME/job-search-plugin/mcp/index.mjs"

# 4. Verify
codex mcp list
```

No `npm install` needed — `mcp/index.mjs` is a self-contained bundle.

Restart Codex, then ask for `get_my_matches` in a fresh conversation. A JSON list of jobs means
you're set; a 401 means the key is wrong. An empty list usually means no search terms yet —
add some before expecting matches.

Storage works the same as in Claude Code: your profile, applications and interview
notes are written to `~/job-search`, the connector is used for matches and postings.

Two differences from Claude Code, both cosmetic:

- Skills are invoked with `$name` (Codex) instead of `/job-search:name`.
- The `rank` skill asks for one subagent per chunk of candidates. Codex scores them sequentially
  instead — same ranking, just slower on long match lists.

## Use

```
/job-search:letter-forge     # first run only — build your profile
/job-search:rank             # re-rank your current matches
/job-search:apply <job_id>   # write the application for one job
/job-search:dispatch         # log what happened after you send it yourself
/job-search:interview        # prep before a round, debrief after it
```

On Codex the same five, as `$letter-forge`, `$rank`, `$apply <job_id>`, `$dispatch`, `$interview`.

Typical flow: `letter-forge` once → `rank` to find the best jobs → `apply` on the top pick → send it yourself → `dispatch` to log it → `interview` when a round gets scheduled, and again right after it happens.

## How it fits together

```
Discovery Engine (central) ──► Tenant service (central) ──► tenant MCP (this plugin)
                                                                  │
                                    letter-forge ─ writes ──► your profile
                                    rank / apply ─ read ────► matches + profile
                                    dispatch ─── writes ───► your tracker
                                    interview ── writes ───► your interview rounds
                                                              (never your profile — see
                                                              the interview skill's
                                                              separation rule)
```

## Individual skills

Each skill is also maintained as its own repo:
- https://github.com/Bundelkund/letter-forge-skill
- https://github.com/Bundelkund/rank-skill
- https://github.com/Bundelkund/apply-skill

The tenant MCP server: https://github.com/Bundelkund/tenant-mcp

## License

MIT — see [LICENSE](LICENSE).
