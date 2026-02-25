---
description: Smart conventional commit with security validation and auto-detection. Use for git commit, commit changes, save work, stage and commit.
argument-hint: [message] | [type scope message] | (empty for auto-detection)
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*)
---

# Smart Conventional Commit

## Current State

!`git status`

## Staged Changes

!`git diff --staged --stat`

## Recent Commits (style reference)

!`git log --oneline -5`

## Instructions

Based on the context above, create a professional commit.

### Step 1: Security Check

BLOCK and output if secrets detected:

```text
🔒 Security Alert
───────────────────────────────
Found: [file or pattern]
Action: Commit blocked
Fix: Remove sensitive data before committing
```

Check for:
- `.env`, `.env.*` files
- Patterns: `password=`, `secret=`, `api_key=`, `token=`
- Files: `*.pem`, `*.key`, `*credentials*`

### Step 2: Analyze and Detect

Output analysis:

```text
📊 Analysis
───────────────────────────────
Files changed: [X]
Files staged: [Y]
Pattern detected: [type]
```

### Step 3: Generate Message

Format: `type(scope): imperative description`

**FORBIDDEN (NO AI SIGNATURE):**
- NEVER add "Co-authored-by: Claude" or any AI mention
- Commit must appear 100% human-written

### Step 4: Propose Commit

Output proposal:

```text
📝 Proposed Commit
───────────────────────────────
type(scope): description

[body if needed]
───────────────────────────────

⚡ Ready to commit? [Y/N/E]
```

### Step 5: Execute and Confirm

On confirmation, execute and output:

```text
✅ Committed successfully
───────────────────────────────
Hash: [short-hash]
Message: type(scope): description
Files: [X] changed
```

Execute with HEREDOC format:

```bash
git commit -m "$(cat <<'EOF'
type(scope): description
EOF
)"
```

If $ARGUMENTS provided, use as hint for the message.

### Step 6: Version Bump & CHANGELOG (MANDATORY)

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
