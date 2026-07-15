## MCP Servers

| Server | Usage | Agent |
|--------|-------|-------|
| **Context7** | Documentation | `research-expert` |
| **Exa** | Web search | `research-expert`, `websearch` |
| **Magic** | UI generation | `design-expert` |
| **shadcn** | Component registry | `design-expert`, `shadcn-ui-expert` |
| **Gemini Design** | AI frontend | `design-expert` |
| **fuse-browser** | Browser automation, scraping, SERP, visual diff, CWV | `seo`, `security-expert`, `design-expert`, frontend experts, `changelog-watcher`, ai-pilot `research-expert`/`websearch`/`sniper` |

**Verification chain (any uncertain API/version — ZERO TOLERANCE):** ① fuse-browser fast-path (`browser_fetch` on known doc URLs, `serp_batch` for discovery) → ② Context7 (official docs) → ③ Exa code context. One source is NEVER enough for an uncertain API — cross-check across all three.

## fuse-browser — Efficient Usage (ZERO TOLERANCE)

1. **Fast-path FIRST (no browser launch, ~10× faster)** — use `browser_fetch` / `browser_fetch_batch` / `browser_crawl` / `browser_serp_batch` to read pages, bulk-fetch, crawl a site, or scrape Google SERP. Open a live session ONLY when you need interaction, JS rendering, or pixels.
2. **One session, always closed** — `browser_open` once → reuse the `sessionId` across `browser_navigate` calls → `browser_close` when done. Never leak sessions (the 2-min TTL is a safety net, not a substitute for closing).
3. **Batch over loops** — `browser_serp_batch` (N queries), `browser_fetch_batch` / `browser_shots_batch` (N URLs), `browser_screenshot { viewports:[...], colorScheme }` (responsive + dark in a single call).
4. **Deterministic extraction** — `browser_extract_schema` with `containerSelector` (card-by-card, correlated fields) over manual `browser_snapshot` parsing.
5. **Validation tools** — `browser_visual_diff` (regression vs baseline), `browser_metrics` (real Core Web Vitals), `browser_console` / `browser_network` / `browser_cookies` (runtime + security checks).
6. **Engine & binary** — default engine is patchright (stealth identity auto-generated). The Chromium binary is installed by `setup.sh`; set `channel:"chrome"` or `executablePath` only to reuse a system browser. Tune the enforcement TTL via `FUSE_ENFORCE_TTL_SEC` (default 120s).

## Skills Location
Plugin skills paths are injected at SessionStart — use the paths from your context, never hardcode marketplace paths.
SOLID refs: `skills/solid-*/references/` (inside each agent plugin)

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
4. Step 6: post-commit (CHANGELOG + version bump — no tag)
5. Step 7: push branch + PR + CI watch + merge
6. Step 8: post-merge — tag `vX.Y.Z` on `main` + push tag (after merge validated — never squash, the tag targets the bump commit and squash would orphan it)

**Merge strategy**: merge (never squash) via `gh pr merge --merge --delete-branch` — the release tag points to the bump commit; squash rewrites history and orphans it. Keep branches < 3 days.

Skill reference: `fuse-commit-pro:git-flow`.
