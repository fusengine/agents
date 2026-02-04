---
description: Smart conventional commits with auto-detection. Analyzes changes, detects type, commits with minimal interaction.
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

## 6. Post-Commit: Update CHANGELOG.md (MANDATORY)

**Version Increment Rules (PATCH only):**
- ALL commit types → PATCH: 1.5.4 → 1.5.5 → 1.5.6 → ...
- `fix`, `feat`, `chore`, `docs`, `style`, `refactor`, `test`, `ci` → +0.0.1

**Sequential chronology:** Increment by 1 only (no jumps: 1.5 → 1.6, not 1.5 → 1.8)

**Format:**
```markdown
## [X.Y.Z] - DD-MM-YYYY

### Added/Changed/Fixed
- Description of change
```

## Arguments

- `$ARGUMENTS` = scope hint or context
- `/commit auth` → scope = auth
- `/commit` → auto-detect scope
