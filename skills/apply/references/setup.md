# Setup — first-time connection

> How a new user connects the apply skill to their personal data. Three steps; takes about 10 minutes.

## Step 1: Install the tenant connector

**Claude Code:** install via the plugin — `/plugin marketplace add Bundelkund/job-search-plugin` then `/plugin install job-search@konektos`. The tenant connector is included automatically.

**Claude Desktop:**
1. Obtain the `tenant-mcp.mcpb` connector file from the tenant owner (provisioned out-of-band)
2. In Claude Desktop: **Settings → MCP Connectors → Install from file** → select the `.mcpb` file
3. Enter your provisioned API key when prompted
4. Restart Claude Desktop

The API key resolves server-side to your `profile_id`. No profile id is ever passed from the client — identity is fully key-scoped.

## Step 2: Verify the connection

Open a new conversation and ask:

```
get_my_matches
```

Expected response: `{"count": N, "matches": [...]}` (may be empty if no jobs have been matched yet).

If you see an error: double-check your API key in **Settings → MCP Connectors**.

## Step 3: Populate your profile

The skill reads your application profile exclusively via `get_my_profile()`. The profile has five fields. The tenant owner populates them via `PUT /my/profile` — either manually or by syncing from Markdown files.

| Field | What goes in it |
|-------|-----------------|
| `positioning` | Three sentences, three pillars, one USP — your core narrative |
| `cv_text` | Your full CV as Markdown |
| `achievements` | Quantified wins, one per row (numbers + context + org/year) |
| `skills_matrix` | Skills with evidence (not a self-assessment scale) |
| `writing_style` | Tone, language rules, DON'Ts for your cover letters |

Once all five fields are set, `get_my_profile()` will return them. Then run `/apply` to start your first application.

## Re-running or updating

To update a single profile field, the tenant owner calls `PUT /my/profile` with only that field in the body — partial updates are supported, the other four fields stay unchanged.

To check your current profile: ask Claude to call `get_my_profile()` in any conversation where the connector is active.
