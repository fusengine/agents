---
description: Update the shared @fusengine/harness to the latest published version — bumps plugins/package.json and reinstalls the marketplace node_modules so every plugin hook runs the new binary.
disable-model-invocation: false
---

# Update Harness

Update the single shared `@fusengine/harness` install used by every plugin hook.

**Target dir** (the marketplace's shared install — where `node_modules/@fusengine/harness/dist/cli/bin.mjs` lives):
```bash
PLUGINS_DIR=~/.claude/plugins/marketplaces/fusengine-plugins/plugins
```

1. **Read current + latest versions**:
   ```bash
   grep -m1 '"version"' "$PLUGINS_DIR/node_modules/@fusengine/harness/package.json"   # installed
   grep '@fusengine/harness' "$PLUGINS_DIR/package.json"                              # declared spec
   npm view @fusengine/harness version                                               # latest published
   ```
   If `$ARGUMENTS` is a version (e.g. `0.1.73`), target that; otherwise target the latest published.

2. **Stop if already up to date**: installed == target → report "already on X.Y.Z", done.

3. **Bump the dependency spec** in `$PLUGINS_DIR/package.json` — set `"@fusengine/harness": "^<target>"` (use the Edit tool, single line, never `git`/heredoc).

4. **Reinstall** (bun is the lockfile manager for this dir):
   ```bash
   cd "$PLUGINS_DIR" && bun install
   ```

5. **Verify** the install actually moved:
   ```bash
   grep -m1 '"version"' "$PLUGINS_DIR/node_modules/@fusengine/harness/package.json"
   ```
   Must equal the target. If not, report the mismatch and stop.

6. **Sanity-check what shipped** (the dist is a bundle — not every source file is compiled in). Confirm the pieces you expected are present, e.g.:
   ```bash
   grep -rl 'resolveMaxLines' "$PLUGINS_DIR/node_modules/@fusengine/harness/dist" | wc -l
   ```
   Report which expected markers are present/absent so a source fix that never got wired into the build is caught, not assumed live.

7. **Report**: `installed X.Y.Z → Y.Y.Z`, the CHANGELOG entry (`$PLUGINS_DIR/node_modules/@fusengine/harness/CHANGELOG.md`, top section), and any expected marker missing from the dist.

**Notes**:
- Also bump the dep in the DEV source repo (`<repo>/plugins/package.json`) if you are working from it, so the committed marketplace matches.
- This never runs `npm publish` — publishing a new harness version is a separate step in the harness repo.

**Arguments**:
- `$ARGUMENTS` — optional target version (e.g. `0.1.73`). Empty → latest published.

**Example Usage**:
- `/update-harness` → bump to latest published + reinstall
- `/update-harness 0.1.73` → pin to a specific version
