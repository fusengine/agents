---
name: post-commit
description: Universal post-commit actions. CHANGELOG update for all repos (git tag is created POST-MERGE, not here — see `commit` command Step 8). Plugin version bumping for marketplace repos. Triggered after any code commit (except wip/amend/undo).
allowed-tools: Bash, Read, Edit
---

# Post-Commit Skill

Universal post-commit actions after a successful code commit.

## Step 1: Read Last Commit

```bash
git log --format='%s' -1
```

Save the commit message for CHANGELOG entry.

## Step 2: Detect Repo Type

Check if `.claude-plugin/marketplace.json` exists in the repo root.

- **EXISTS** → Follow **Marketplace Path** (Steps M1–M5)
- **DOES NOT EXIST** → Follow **Standard Path** (Steps S1–S2)

## Standard Path (any repo without marketplace.json)

### Step S1: Update CHANGELOG

Read the latest git tag to determine current version:

```bash
git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"
```

Increment PATCH: `X.Y.Z` → `X.Y.(Z+1)`. Add a new entry at the top of `CHANGELOG.md` (create it with a `# Changelog` heading first if missing). Load `references/changelog-templates.md` for the exact entry format and `references/changelog-type-mapping.md` for the commit-type prefix.

### Step S2: Commit CHANGELOG

```bash
git add CHANGELOG.md
git commit -m "$(cat <<'EOF'
chore: update CHANGELOG to X.Y.Z
EOF
)"
```

STOP. Output summary. **No tag here** — it is created POST-MERGE by the `commit` command's Step 8 (or locally-only in LOCAL/DEGRADED mode when no remote/`gh` is available — see the Step 7 decision tree in `commands/commit.md`). Load `references/tag-timing.md` for the full post-merge rationale and the standalone-use exception.

## Marketplace Path (repo with .claude-plugin/marketplace.json)

### Step M1: Detect Modified Plugins

```bash
git diff --name-only HEAD~1 | grep '^plugins/' | cut -d/ -f2 | sort -u
```

If no plugins modified, skip to Step M3 (still bump suite version). Skip directories without `.claude-plugin/plugin.json`.

### Step M2: Bump Plugin Versions

For each modified plugin: read `plugins/{name}/.claude-plugin/plugin.json`, increment PATCH (`X.Y.Z` → `X.Y.(Z+1)`), write it back. Load `references/plugin-version-bump.md` for the marketplace.json type-detection rule (`plugins[]` vs `core[]`).

### Step M3: Bump Suite Version + Recompute README Badges

Read `metadata.version` from `.claude-plugin/marketplace.json`, increment PATCH (`X.Y.Z` → `X.Y.(Z+1)`), write it back.

Then recompute EVERY shields.io badge in `README.md` from the filesystem — never hand-maintain counts (they drift). Load `references/badge-recompute.md` for the exact count commands and `sed` replacements (version/plugins/agents/skills tokens).

### Step M3.5: Documentation Parity

For any plugin **added** in this commit, create its docs page and link it. Doc filenames are abbreviated (e.g. dir `nextjs-expert` → `docs/plugins/nextjs.md`), so match existing naming in `docs/plugins/`, not the raw dir. Load `references/plugin-docs-parity.md` for the detection command and the full per-plugin checklist.

### Step M4: Update CHANGELOG

Add a new entry at the top of `CHANGELOG.md`, using the new suite version `X.Y.Z` from Step M3 and `(plugin-name X.Y.Z)` for each bumped plugin. Load `references/changelog-templates.md` for the exact entry format and `references/changelog-type-mapping.md` for the commit-type prefix.

### Step M5: Commit the Bump

Stage all modified files:

```bash
git add CHANGELOG.md README.md .claude-plugin/marketplace.json plugins/*/.claude-plugin/plugin.json docs/
```

Commit with HEREDOC format:

```bash
git commit -m "$(cat <<'EOF'
chore: bump marketplace and CHANGELOG to X.Y.Z
EOF
)"
```

This MUST be a separate commit from the code changes. Never combine. **No tag here** — same post-merge rationale as Step S2. Load `references/tag-timing.md` for details.

## Version Bump Rules

- ALL commit types trigger **PATCH** bump only
- MINOR/MAJOR bumps are **manual user decisions**, never automatic
- The bump commit is always SEPARATE from code changes

## CHANGELOG Type Mapping

See `references/changelog-type-mapping.md` for the commit-type → CHANGELOG-prefix table used in Step S1 and Step M4 entries.
