## MCP Servers

| Server | Usage | Agent |
|--------|-------|-------|
| **Context7** | Documentation | `research-expert` |
| **Exa** | Web search | `research-expert`, `websearch` |
| **Magic** | UI generation | `design-expert` |
| **shadcn** | Component registry | `design-expert`, `shadcn-ui-expert` |
| **Gemini Design** | AI frontend | `design-expert` |
| **fuse-browser** | Browser automation, scraping, SERP, visual diff, CWV | `seo`, `security-expert`, `design-expert`, frontend experts, `changelog-watcher`, ai-pilot `research-expert`/`websearch`/`sniper` |

## fuse-browser — Efficient Usage (ZERO TOLERANCE)

1. **Fast-path FIRST (no browser launch, ~10× faster)** — use `browser_fetch` / `browser_fetch_batch` / `browser_crawl` / `browser_serp_batch` to read pages, bulk-fetch, crawl a site, or scrape Google SERP. Open a live session ONLY when you need interaction, JS rendering, or pixels.
2. **One session, always closed** — `browser_open` once → reuse the `sessionId` across `browser_navigate` calls → `browser_close` when done. Never leak sessions (the 2-min TTL is a safety net, not a substitute for closing).
3. **Batch over loops** — `browser_serp_batch` (N queries), `browser_fetch_batch` / `browser_shots_batch` (N URLs), `browser_screenshot { viewports:[...], colorScheme }` (responsive + dark in a single call).
4. **Deterministic extraction** — `browser_extract_schema` with `containerSelector` (card-by-card, correlated fields) over manual `browser_snapshot` parsing.
5. **Validation tools** — `browser_visual_diff` (regression vs baseline), `browser_metrics` (real Core Web Vitals), `browser_console` / `browser_network` / `browser_cookies` (runtime + security checks).
6. **Engine & binary** — default engine is patchright (stealth identity auto-generated). The Chromium binary is installed by `setup.sh`; set `channel:"chrome"` or `executablePath` only to reuse a system browser. Tune the enforcement TTL via `FUSE_ENFORCE_TTL_SEC` (default 120s).

## Skills Location
`~/.claude/plugins/marketplaces/fusengine-plugins/plugins/{agent}/skills/`
SOLID refs: `skills/solid-*/references/`

## Documentation
ALL docs in `docs/` folder - NEVER outside except root `README.md`

## Git & GitHub Flow (ZERO TOLERANCE)

**Commit tool**: ALWAYS `/fuse-commit-pro:commit`. NEVER `git commit` directly.

**Branch enforcement**:
- `main`, `master`, `develop`, `production` → **protected**, no direct commits
- All work on feature branches: `<type>/<scope>` (e.g. `feat/seo`, `fix/sniper-loop`, `chore/deps`)
- Types: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `perf/`, `test/`, `ci/`, `build/`, `style/`
- kebab-case, < 50 chars, no personal prefix

**Workflow** (handled by `/fuse-commit-pro:commit`):
1. Step 0: branch check — block if on protected, propose feature branch
2. Step 1: security scan (secrets, .env)
3. Steps 2-5: conventional commit with auto-detection
4. Step 6: post-commit (CHANGELOG + version bump + tag)
5. Step 7: push branch + propose `gh pr create`

**Merge strategy**: squash via `gh pr merge --squash --delete-branch`. Keep branches < 3 days.

Skill reference: `fuse-commit-pro:git-flow`.
