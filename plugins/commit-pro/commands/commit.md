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

### Step 6: Update CHANGELOG.md (MANDATORY)

After commit, update `CHANGELOG.md` with semantic versioning:

**Version Increment Rules:**
- ALL commit types → **PATCH only**: 1.37.0 → 1.37.1
- MINOR/MAJOR bumps are **manual decisions** by the user, never automatic

**Format:**
```markdown
## [X.Y.Z] - DD-MM-YYYY

### Added/Changed/Fixed
- Description of change
```

**CHANGELOG commit order (MANDATORY):**
- ALWAYS commit CHANGELOG.md as a **separate commit LAST**
- NEVER include CHANGELOG.md in the main feature/fix commit
- If `marketplace.json` is also modified (version bump) → **include it in the same last commit**
- Format: `chore: bump marketplace and CHANGELOG to X.Y.Z`
