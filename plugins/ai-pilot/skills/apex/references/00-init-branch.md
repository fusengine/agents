---
name: 00-init-branch
description: Create feature branch following Git best practices
prev_step: null
next_step: references/01-analyze-code.md
---

# 00 - Init Branch

**Create feature branch following Git best practices.**

## When to Use

- Starting ANY new feature, fix, or task
- Before making any code changes
- After receiving a task/issue assignment

---

## Branch Naming Convention

### Format

```text
<type>/<issue-id>-<short-description>
```

### Types

| Type | Use Case | Example |
| --- | --- | --- |
| `feature/` | New functionality | `feature/123-user-auth` |
| `fix/` | Bug fixes | `fix/456-login-error` |
| `hotfix/` | Urgent production fix | `hotfix/789-security-patch` |
| `refactor/` | Code improvement | `refactor/321-clean-api` |
| `docs/` | Documentation | `docs/654-api-guide` |
| `test/` | Test additions | `test/987-unit-tests` |

### Rules

```text
✅ Lowercase only
✅ Hyphens for spaces
✅ Include issue/ticket ID
✅ Max 50 characters
✅ Descriptive but concise
```

---

## Workflow

### Step 1: Sync with Remote

```bash
git fetch origin
git checkout main
git pull origin main
```

### Step 2: Create Branch

```bash
git checkout -b feature/ISSUE-123-short-description
```

### Step 3: Verify Branch

```bash
git branch --show-current
git status
```

---

## Best Practices (2025)

### Short-Lived Branches

```text
✅ Merge within 1-3 days
✅ Small, focused changes
✅ One feature per branch
❌ Long-lived feature branches (merge hell)
```

### Sync Frequently

```bash
# Keep branch updated with main
git fetch origin main
git rebase origin/main
# OR
git merge origin/main
```

### Clean Commits

```text
✅ Atomic commits (one logical change)
✅ Conventional commit messages
✅ No WIP commits in final PR
```

---

## Validation Checklist

```text
□ Branch created from latest main
□ Branch name follows convention
□ Issue/ticket ID included
□ Working directory clean
□ Ready for development
```

---

## Next Phase

→ Proceed to `01-analyze-code.md`
