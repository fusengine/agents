---
description: Smart conventional commits with auto-detection. Analyzes changes, detects type, commits with minimal interaction.
disable-model-invocation: false
---

# Smart Commit Workflow

## 1. Pre-flight

```bash
if ! grep -q "^\.DS_Store$" .gitignore 2>/dev/null; then
  echo ".DS_Store" >> .gitignore
fi
find . -name ".DS_Store" -type f -exec git rm --cached {} \; 2>/dev/null
git add .
```

## 2. Analyze & Detect Type

Run analysis:
```bash
git diff --cached --stat
git diff --cached --name-only
```

**Detection Rules (priority order):**

| Files Pattern | Type | Confidence |
|---------------|------|------------|
| Only `*.md`, `README*`, `CHANGELOG*` | `docs` | HIGH |
| Only `*.test.*`, `*.spec.*`, `__tests__/*` | `test` | HIGH |
| Only `*.json`, `*.yml`, `.*rc`, configs | `chore` | HIGH |
| Only `.github/*`, CI files | `ci` | HIGH |
| Diff contains "fix", "bug", "error" | `fix` | MEDIUM |
| New files with business logic | `feat` | MEDIUM |
| Renamed/moved without logic change | `refactor` | MEDIUM |
| Only formatting/whitespace | `style` | HIGH |
| Mixed or unclear | analyze deeper | LOW |

## 3. Determine Scope

Extract from primary directory:
```
src/components/* → ui
src/api/* → api
plugins/* → plugins
lib/utils/* → utils
```

## 4. Execute Based on Confidence

**HIGH confidence → Commit directly (no question)**
```bash
git commit -m "<type>(<scope>): <description>"
```

**MEDIUM confidence → Show proposal, ask confirmation**
```
Proposed: fix(auth): resolve token validation
Files: src/auth/token.ts
Confirm? [Y/n]
```

**LOW confidence → Ask user for type**

## 5. Commit Rules (STRICT)

- **50 chars MAX** for subject line
- **NO signatures** (no Claude, no Co-Authored-By)
- **NO body** unless exceptional
- Format: `<type>(<scope>): <description>`

## 6. Version Bump & CHANGELOG (MANDATORY)

**Version Rules:** ALL types → PATCH only. MINOR/MAJOR = manual user decision.

**Plugin repo auto-detection** (if `.claude-plugin/marketplace.json` exists):
1. Detect: `git diff --name-only HEAD~1 | grep '^plugins/' | cut -d/ -f2 | sort -u`
2. Each modified plugin → bump PATCH in `plugins/{name}/.claude-plugin/plugin.json`
3. Sync same version in `.claude-plugin/marketplace.json` plugins array
4. Bump suite PATCH in `.claude-plugin/marketplace.json` → `metadata.version`
5. Core plugins (`core[]` array): only bump plugin.json (no version in marketplace)

**CHANGELOG:** `## [X.Y.Z] - DD-MM-YYYY` — include `(plugin-name X.Y.Z)` in descriptions

**Commit order (MANDATORY):**
- Separate LAST commit (never with code changes)
- Include: CHANGELOG.md + marketplace.json + all bumped plugin.json
- Format: `chore: bump marketplace and CHANGELOG to X.Y.Z`

## Arguments

- `$ARGUMENTS` = scope hint or context
- `/commit auth` → scope = auth
- `/commit` → auto-detect scope
