---
name: git-flow
description: Use when committing, branching, opening PRs, or deciding merge strategy. Covers GitHub Flow (default), trunk-based, branch naming conventions, squash vs rebase, branch lifecycle, and protected branch enforcement.
user-invocable: false
related-skills: commit, post-commit, commit-detection
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
6. gh pr merge --squash --delete-branch  # merge + cleanup
```

**Keep branches short-lived** (< 3 days ideally). Long-lived branches accumulate conflicts and lose context.

## Merge Strategy

| Strategy | When | Result |
|----------|------|--------|
| **Squash merge** | Default for features | 1 commit per feature on main, clean history |
| **Rebase merge** | Small atomic commits worth preserving | Linear history, individual commits kept |
| **Merge commit** | Rare, only for "merge events" worth marking | Adds noise, avoid by default |

**fuse-commit-pro recommendation**: squash merge via `gh pr merge --squash --delete-branch`.

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
