---
name: git-flow
description: Use when committing, branching, opening PRs, or deciding merge strategy. Covers GitHub Flow (default), trunk-based, branch naming conventions, squash vs rebase, branch lifecycle, and protected branch enforcement.
user-invocable: false
related-skills: commit-optimization, post-commit, commit-detection
---

# Git Flow Best Practices (2026)

## Workflow Choice

| Strategy | When | Verdict |
|----------|------|---------|
| **Trunk-based** (direct main) | Solo dev, prototypes, strong CI | OK if you have automated tests |
| **GitHub Flow** (feature branch → PR → merge → delete) | Teams, OSS, code review | ✅ Default |
| **Git Flow** (develop/release/hotfix) | Heavy release cycles | ❌ Outdated for most projects |

**fuse-commit-pro default: GitHub Flow.**

## Branch Naming Convention

Format: `<type>/<scope-or-summary>` (kebab-case).

| Type | Use | Example |
|------|-----|---------|
| `feat/` | New feature | `feat/seo`, `feat/oauth-google` |
| `fix/` | Bug fix | `fix/sniper-loop`, `fix/csv-parser` |
| `chore/` | Maintenance, deps | `chore/bump-deps`, `chore/rename-files` |
| `docs/` | Documentation | `docs/api-reference` |
| `refactor/` | Refactoring (no behavior change) | `refactor/extract-utils` |
| `perf/` | Performance | `perf/db-indexes` |
| `test/` | Tests only | `test/auth-coverage` |
| `ci/` | CI/CD config | `ci/github-actions-cache` |
| `build/` | Build system | `build/vite-config` |
| `style/` | Formatting | `style/prettier-pass` |

**Rules**:
- kebab-case only (no underscores, no spaces, no caps)
- < 50 chars total
- No personal prefix (`bruno/...`) — collaborators don't know who you are 6 months later
- No issue number alone (`fix/123`) — meaningless once issue closed

## Protected Branches

`main`, `master`, `develop`, `production` → **never commit directly**.

`fuse-commit-pro:commit` enforces this in Step 0:
- Detects current branch
- If protected → blocks + proposes auto-named feature branch from commit type/scope
- Exceptions: solo prototype (no remote), explicit `--no-branch-check`, or post-commit version bump

## Branch Lifecycle

```
1. git checkout -b feat/<scope>      # create
2. work + commit                      # multiple commits OK
3. git push -u origin feat/<scope>    # push with upstream
4. gh pr create                       # open PR
5. (review + CI)
6. gh pr merge --merge --delete-branch  # merge + cleanup
```

**Keep branches short-lived** (< 3 days ideally). Long-lived branches accumulate conflicts and lose context.

## Merge Strategy

| Strategy | When | Result |
|----------|------|--------|
| **Merge commit** | fuse-commit-pro default | Branch commits (incl. the bump commit) land on `main` intact, no rewrite |
| **Rebase merge** | Small atomic commits worth preserving, no merge commit wanted | Linear history, individual commits kept |
| **Squash merge** | *not used here*: the release tag points at the bump commit, squash would orphan it | 1 commit per feature, but incompatible with fuse-commit-pro's post-merge tagging |

**fuse-commit-pro recommendation**: real merge commit via `gh pr merge --merge --delete-branch` (see `commands/commit.md` Step 7).

## CI Gate Before Merge

**Cardinal rule: never merge before CI checks are resolved; never assume "zero CI" without verifying.**

**Known race condition** ([cli/cli#7401](https://github.com/cli/cli/issues/7401), confirmed by GitHub CLI maintainers): checks take a few seconds to register on a freshly-created PR. Calling `gh pr checks --watch` immediately after `gh pr create` can error out — exit code 1, `no checks reported on the '<branch>' branch` — even though checks are about to appear. The GitHub API gives no way to tell "genuinely zero checks" apart from "not registered yet," so the client must either sidestep the race (native auto-merge) or poll for registration before watching.

Determine which of the three cases applies from what actually exists on the PR — never from assumption. The key branch point is **whether the repo enforces *required* status checks in branch protection**, not merely whether auto-merge is available: `gh pr merge --auto` only ever waits for *required* checks. On a repo where checks run but aren't marked required (e.g. this repo — CodeQL + Analyze execute but aren't required), `--auto` merges **immediately without waiting**, silently reproducing the exact race this section exists to close. Check first with `gh pr checks <pr> --required` (empty output / `no required checks reported on the '<branch>' branch` → no required checks configured) before picking a branch:

1. **Repo has required status checks in branch protection** → the only case where `--auto` actually gates. GitHub waits server-side for the *required* checks to appear and pass — no race, regardless of their state at call time:
   ```bash
   gh pr merge <pr> --auto --merge --delete-branch
   ```
   Also requires "Allow auto-merge" enabled in repo Settings → General (otherwise `GraphQL: Auto merge is not allowed for this repository`).
2. **Repo has checks but none are required** (this repo's current state — CodeQL/Analyze run but aren't required) — `--auto` would merge immediately without waiting, so don't use it here. Poll client-side until checks register, then watch: don't `--watch` right after `gh pr create`/a push. Poll `gh pr checks` until it stops reporting "no checks reported" (bounded retries), THEN watch. The poll's pipe to `grep` only detects check registration — it never gates the merge, which still runs un-piped via `&&`:
   ```bash
   pr=<pr>
   max_attempts=18   # 18 × 5s ≈ 90s — raise if this repo's CI is known to queue slower
   attempt=0
   until gh pr checks "$pr" 2>&1 | grep -qv "no checks reported"; do
     attempt=$((attempt + 1))
     if [ "$attempt" -ge "$max_attempts" ]; then
       echo "Timeout: no checks registered after $((max_attempts * 5))s — verify .github/workflows/ before treating this as zero-CI." >&2
       break
     fi
     sleep 5
   done
   gh pr checks "$pr" --watch && gh pr merge "$pr" --merge --delete-branch
   ```
   **Never pipe** the final `gh pr checks <pr> --watch` call itself (e.g. `| tail`): a pipe swallows the exit code and lets a merge proceed after failing CI. Chain with `&&` so the merge only runs if checks passed.
3. **Repo has zero CI checks (verified, not assumed — e.g. no `.github/workflows/*` and the poll above timed out)** → immediate merge is allowed:
   ```bash
   gh pr merge <pr> --merge --delete-branch
   ```

**A non-required check never blocks the merge** — only *required* checks actually gate. Mark CI checks as required in branch protection so case 1's `--auto` has teeth; without that, checks stay in case 2 forever.

**Note on `--required`**: the poll loop in case 2 intentionally queries `gh pr checks` *without* `--required` — it only needs to know "has *any* check registered yet." If a future revision adds `--required` to that same loop, the zero-checks message becomes `no required checks reported on the '<branch>' branch`, which does **not** contain the substring `no checks reported` (the inserted word "required" breaks the contiguous match) — the grep would need to change to `checks reported on the` (matches both variants) or handle both strings explicitly.

Merge is always `--merge` (real merge commit) — **never `--squash`**, it would orphan the release tag's target (see Tagging timing below).

**Tagging timing**: never push the tag before the merge is validated — CI could still fail or branch protection could still block the merge, and a tag pushed early would point at a commit that never lands on `main`. Tag `vX.Y.Z` on `main` AFTER the merge completes, then push the tag (`fuse-commit-pro:commit` does this automatically in Step 8 — see also `commands/commit.md` Step 8 and `post-commit/references/tag-timing.md`).

## After Merge

- Delete branch automatically (`--delete-branch` flag or GitHub auto-delete setting)
- Pull main: `git checkout main && git pull --ff-only origin main`
- Delete local: `git branch -d feat/<scope>` (automatic if `--delete-branch` used remotely)

## Pull Request Template

```markdown
## Summary
<1-3 bullet points of what changed>

## Changes
<list of major files/components touched>

## Test plan
- [ ] Manual test on X
- [ ] CI green
- [ ] Sniper validation clean

## Breaking changes
None / <description with migration path>
```

## Anti-Patterns

- ❌ **Long-lived feature branches** (> 1 week) — rebase early or split
- ❌ **Commits on main "to save time"** — bypasses review, breaks CI gates
- ❌ **Force push to main** — never. Forbidden in fuse-commit-pro.
- ❌ **Branch named `wip`, `temp`, `test123`** — meaningless, can't be found later
- ❌ **PR without description** — reviewers can't context-switch
- ❌ **Merging your own PR without review** (when working in a team)
- ❌ **Stale branches** (no commits > 30 days) — delete or close

## Solo Dev Mode

If you're alone on a repo with no PR review:
- Still use feature branches (rollback safety net)
- Self-PR is fine for sanity check (you'll see the diff fresh)
- Or commit-then-push on main with strong CI as safety
- `fuse-commit-pro:commit` detects no-remote case and skips Step 7
