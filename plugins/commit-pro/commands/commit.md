---
description: Smart conventional commit with security validation, branch flow enforcement, and auto-detection. Use for git commit, commit changes, save work, stage and commit.
argument-hint: "[message] | [type scope message] | (empty for auto-detection)"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git tag:*), Bash(git push:*), Bash(git pull:*), Bash(git describe:*), Bash(git branch:*), Bash(git checkout:*), Bash(git rev-parse:*), Bash(git remote:*), Bash(git merge-base:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh pr checks:*), Bash(gh pr edit:*), Read, Edit
disable-model-invocation: false
---

# Smart Conventional Commit

## Current State

!`git status`

## Staged Changes

!`git diff --staged --stat`

## Recent Commits (style reference)

!`git log --oneline -5`

## Current Branch

!`git branch --show-current`

## Instructions

Based on the context above, create a professional commit.

### Step 0: Branch Check (GitHub Flow enforcement)

Read current branch from above.

**If current branch is `main`, `master`, `develop`, or `production`:**

BLOCK direct commits and propose a feature branch:

```text
🌿 Branch Protection
───────────────────────────────
Current: <branch>
Issue: Direct commits to protected branches discouraged (GitHub Flow)
───────────────────────────────

Pre-detect commit type/scope from staged changes (Step 2 logic) to suggest branch name:
  - feat(seo) → feat/seo
  - fix(sniper) → fix/sniper
  - chore(deps) → chore/deps

Proposed branch: <type>/<scope-or-summary>

Options:
  Y → Create branch + continue commit
  N → Abort
  C → Custom branch name
```

If user accepts → execute `git checkout -b <branch>` then proceed to Step 1.
If user declines → STOP, do not commit.

**If current branch already a feature branch** (e.g. `feat/*`, `fix/*`, `chore/*`, `docs/*`, `refactor/*`, `perf/*`, `test/*`, `ci/*`, `build/*`, `style/*`) → skip to Step 1 directly.

**Exceptions** (allow direct commit on main):
- Repo has only `main` branch and no remote (solo prototype)
- User explicitly passes `--no-branch-check` in `$ARGUMENTS`
- Commit type is `chore` AND scope is `release` or `version` (post-commit bump commits)

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

### Step 6: Post-Commit (universal)

After step 5 succeeds, execute the `post-commit` skill (CHANGELOG + version bump only — **no tag here**, see Step 8 for why).

This runs for ALL repos — the skill auto-detects the repo type internally.

### Step 7: Auto-Release (push + PR + CI watch + merge) — automatic when a remote exists

After post-commit completes, if current branch is a feature branch (not main/master) **and a remote is configured** (`git remote -v` non-empty), run the FULL release automatically — **no Y/N prompts**:

1. **Push branch**:
   ```bash
   git push -u origin <current-branch>
   ```
2. **Create the PR if absent** (else reuse the existing one):
   ```bash
   gh pr view --json url -q .url 2>/dev/null || gh pr create --base main --title "<commit subject>" --body "$(cat <<'EOF'
   ## Summary
   - <bullets from commit body>

   ## Changes
   <major changes>

   ## Test plan
   - [x] / [ ] as applicable

   ## Breaking changes
   None / <description>
   EOF
   )"
   ```
3. **Surveillance + merge auto** — squash merge (default GitHub Flow strategy, see `git-flow` skill):
   - Prefer GitHub native auto-merge (merges once required checks pass):
     ```bash
     gh pr merge <pr> --auto --squash --delete-branch
     ```
   - If auto-merge is not enabled on the repo, watch checks then merge:
     ```bash
     gh pr checks <pr> --watch && gh pr merge <pr> --squash --delete-branch
     ```
   - If the repo has **no CI checks**, merge immediately:
     ```bash
     gh pr merge <pr> --squash --delete-branch
     ```
4. Output PR URL + merge status. On successful merge, proceed to **Step 8** to create the release tag on `main`.

**Leave the PR OPEN (push + PR only, do NOT merge, skip Step 8) if**:
- User passes `--no-merge` in `$ARGUMENTS`
- CI checks **FAIL** → report the failing check, leave PR open for the user
- Branch protection rejects the merge → report, leave open

**Skip Step 7 entirely (and Step 8) if**: no remote configured, `--no-pr` in `$ARGUMENTS`, branch already merged, or no `gh` CLI (graceful degradation — output the manual commands).

### Step 8: Post-Merge Tag (main only, after a successful squash merge)

Only runs once Step 7 actually merged the PR.

```bash
git checkout main && git pull --ff-only
git fetch --prune   # drop remote-tracking refs (origin/*) of branches already deleted on the remote
git tag vX.Y.Z
git push origin vX.Y.Z
git merge-base --is-ancestor vX.Y.Z main && echo "tag on main ✅"
```

`vX.Y.Z` is the version bumped by `post-commit` in Step 6.

**Why the tag moves here, post-merge**: `gh pr merge --squash` creates a brand-new commit on `main` — none of the feature-branch commits (including the bump commit tagged in the old Step 6) ever land there. A tag created before the merge points at a commit that gets discarded by the squash, producing an orphaned tag off `main`. Tagging `main`'s actual squash-merge commit after the merge keeps the tag meaningful and verifiable via `git merge-base --is-ancestor`.

Output tag verification alongside the PR URL + merge status from Step 7.
