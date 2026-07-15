---
description: Smart conventional commit with security validation, branch flow enforcement, and auto-detection. Use for git commit, commit changes, save work, stage and commit.
argument-hint: "[message] | [type scope message] | (empty for auto-detection)"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git tag:*), Bash(git push:*), Bash(git pull:*), Bash(git describe:*), Bash(git branch:*), Bash(git checkout:*), Bash(git rev-parse:*), Bash(git remote:*), Bash(git merge-base:*), Bash(git fetch:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh pr checks:*), Bash(gh pr edit:*), Bash(gh auth:*), Bash(command:*), Read, Edit
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

### Step 7: Auto-Release (push + PR + CI watch + merge)

After post-commit completes, if current branch is a feature branch (not main/master), run the **remote-flow decision tree** below — **no Y/N prompts** in FULL mode.

#### Remote-flow decision tree (run first, every time)

```
git remote -v
```

- **Empty output → LOCAL mode.**
  No remote at all. STOP after Step 6 — do not push, do not open a PR, do not merge.
  In this mode, tag right away (see Step 8, LOCAL/DEGRADED branch): local `git tag` only, never pushed automatically.
  Output explicitly:
  ```text
  📍 Pas de remote configuré — rituel distant sauté (push/PR/merge).
  Commandes manuelles pour plus tard :
    git remote add origin <url>
    git push -u origin <current-branch>
    gh pr create --base main --title "<subject>" --body-file - <<'EOF'
    <body>
    EOF
    (après merge) git tag vX.Y.Z && git push origin vX.Y.Z
  ```

- **Non-empty output → a remote exists.** Check tooling next:
  ```bash
  command -v gh        # exit 0 = gh installed
  gh auth status        # exit 0 = authenticated
  ```
  - **`gh` missing OR `gh auth status` fails → DEGRADED mode.**
    Still push the branch (git itself doesn't need `gh`):
    ```bash
    git push -u origin <current-branch>
    ```
    Then STOP — skip PR creation/merge/watch entirely. Never fail silently: state exactly which check failed (`gh` not installed vs. not authenticated) and print the manual commands the user must run once `gh` is available (PR create with `--body-file -` on stdin, merge with `--merge`, then the Step 8 tag sequence). Tag locally per Step 8's LOCAL/DEGRADED branch.
  - **`gh` present and authenticated → FULL mode.** Proceed with steps 1-4 below.

  In both branches, the first push always uses `-u`: this transparently covers the case where the current branch has no upstream yet (first push sets it) and is a no-op if upstream already exists.

#### FULL mode steps (remote + `gh` OK)

1. **Push branch**:
   ```bash
   git push -u origin <current-branch>
   ```
2. **Create the PR if absent** (else reuse the existing one), body piped via `--body-file -` on stdin — never inline in `--body`, to avoid quoting/escaping issues, and no temp file to write or clean up:
   ```bash
   gh pr view --json url -q .url 2>/dev/null || gh pr create --base main --title "<commit subject>" --body-file - <<'EOF'
   ## Summary
   - <bullets from commit body>

   ## Changes
   <major changes>

   ## Test plan
   - [x] / [ ] as applicable

   ## Breaking changes
   None / <description>
   EOF
   ```
3. **Surveillance + merge auto** — real merge commit, **never squash** (squash rewrites the branch's commits into a brand-new one on `main`; a `--merge` commit keeps them intact, including the bump commit Step 8 tags). Full rationale: `git-flow` skill's "CI Gate Before Merge" section. Branch on **whether required status checks are configured** (`gh pr merge --auto` only ever waits for *required* checks — on a repo where checks run but aren't required, `--auto` merges immediately without waiting):
   1. **Required checks configured** (verify: `gh pr checks <pr> --required` returns checks, not `no required checks reported`) → the only case `--auto` actually gates, no race:
      ```bash
      gh pr merge <pr> --auto --merge --delete-branch
      ```
   2. **Checks exist but none are required** → don't use `--auto` here (it wouldn't wait). Checks take a few seconds to register after `gh pr create`/a push — never `--watch` immediately ([cli/cli#7401](https://github.com/cli/cli/issues/7401)): poll until checks register (bounded, ~90s), THEN watch. **Never pipe** the final `--watch` call itself (e.g. `| tail`): a pipe swallows the exit code and lets a merge proceed after failing CI. Chain with `&&` so the merge only runs if checks passed:
      ```bash
      pr=<pr>
      max_attempts=18   # 18 × 5s ≈ 90s
      attempt=0
      until gh pr checks "$pr" 2>&1 | grep -qv "no checks reported"; do
        attempt=$((attempt + 1))
        [ "$attempt" -ge "$max_attempts" ] && { echo "Timeout: no checks registered — verify before treating as zero-CI." >&2; break; }
        sleep 5
      done
      gh pr checks "$pr" --watch && gh pr merge "$pr" --merge --delete-branch
      ```
   3. **Repo has no CI checks at all** (verified, not assumed), merge immediately:
      ```bash
      gh pr merge <pr> --merge --delete-branch
      ```
   A non-required check never blocks the merge — only *required* checks gate; mark CI checks required in branch protection so case 1 has teeth.
4. Output PR URL + merge status. On successful merge, proceed to **Step 8** to create/push the release tag on `main`.

**Leave the PR OPEN (push + PR only, do NOT merge, skip Step 8's push) if**:
- User passes `--no-merge` in `$ARGUMENTS`
- CI checks **FAIL** → report the failing check, leave PR open for the user
- Branch protection rejects the merge → report, leave open

**Skip PR/merge (stay in LOCAL/DEGRADED behavior) if**: `--no-pr` in `$ARGUMENTS`, or branch already merged.

### Step 8: Release Tag — timing depends on the Step 7 mode

`vX.Y.Z` is the version bumped by `post-commit` in Step 6.

#### FULL mode (remote + `gh` OK) — tag only after a validated merge

Only runs once Step 7 actually merged the PR (never before — a tag created before the merge is validated could end up on a commit that CI rejects or that never reaches `main`).

```bash
git checkout main && git pull --ff-only
git fetch --prune   # drop remote-tracking refs (origin/*) of branches already deleted on the remote
git tag vX.Y.Z
git push origin vX.Y.Z
git merge-base --is-ancestor vX.Y.Z main && echo "tag on main ✅"
```

**Why the tag waits for post-merge**: the merge strategy is `--merge` (real merge commit, never `--squash`), so the branch's commits — including the bump commit — do land on `main` intact once the merge succeeds. The risk this guards against isn't squash-orphaning, it's *sequencing*: a tag pushed before Step 7 confirms the merge could point at a commit that CI later fails, or that branch protection blocks from ever reaching `main`. Waiting for a validated merge, then verifying with `git merge-base --is-ancestor`, keeps the tag meaningful.

#### LOCAL mode (no remote) / DEGRADED mode (no `gh`) — tag locally, never auto-push

There is no PR/merge to wait for, so tag right after the Step 6 bump commit, on the current branch:

```bash
git tag vX.Y.Z
```

Do **not** run `git push origin vX.Y.Z` automatically — there is either no remote to push to, or no confirmed merge yet. Print the manual command for the user to run once the remote/`gh` prerequisite is met and the change has actually landed on `main`.

Output tag verification (FULL mode) or the manual push reminder (LOCAL/DEGRADED mode) alongside the PR URL + merge status from Step 7.
