# Job Search — Claude Code Plugin

> Build your application profile, re-rank your job matches, generate cover letters + CVs, track what happened, and prep/debrief interviews — all inside Claude Code. Bundles five skills plus the tenant MCP connector in one install.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What's inside

| Component | Type | What it does |
|-----------|------|--------------|
| `letter-forge` | skill | Builds your application profile via `set_my_profile` — paste a CV/past cover letters/other documents to draft it, or answer the interactive questionnaire for what's left |
| `rank` | skill | Re-ranks your job matches by a fit rubric you define |
| `apply` | skill | Turns a job posting into a cover letter + CV |
| `dispatch` | skill | Logs an application's status (applied/interview/offer/rejected/paused) in the tracker via `save_application` — after you've submitted it yourself; no portal or email automation |
| `interview` | skill | Preps an interview dossier via `save_interview`, then records the debrief afterward — kept separate from your profile by design |
| `tenant` | MCP server | Connects to the tenant service — your matches, job text, profile, tracker, interviews |

The skills read and write your personal data **only** through the bundled `tenant` MCP server, scoped to your own API key. No local database, no PDF toolchain.

## Requirements

- Claude Code
- **Node.js 20+** on your PATH (runs the bundled MCP server)
- A personal **tenant API key** (ask the tenant owner) — provided via the `TENANT_API_KEY` environment variable
- The Discovery Engine + Tenant service run centrally — you connect to the live instance, you don't host them

## Install

```
/plugin marketplace add Bundelkund/job-search-plugin
/plugin install job-search@konektos
```

Set your API key so the bundled connector can authenticate (add it to your shell profile so it persists):

```bash
export TENANT_API_KEY="your-personal-key"
```

By default the connector targets `https://tenant.konektos.de`. Restart Claude Code after installing so the MCP server picks up the key.

## Use

```
/job-search:letter-forge     # first run only — build your profile
/job-search:rank             # re-rank your current matches
/job-search:apply <job_id>   # write the application for one job
/job-search:dispatch         # log what happened after you send it yourself
/job-search:interview        # prep before a round, debrief after it
```

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
