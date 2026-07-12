---
name: branching-strategy
description: Branch naming convention and 2025 branching best practices for APEX workflow
---

# Branching Strategy

## Branch Naming

```text
feature/ISSUE-123-short-description
fix/ISSUE-456-bug-name
hotfix/ISSUE-789-urgent-fix
refactor/ISSUE-321-cleanup
docs/ISSUE-654-readme
test/ISSUE-987-coverage
```

## Best Practices (2025)

```text
✅ Short-lived branches (1-3 days)
✅ Small, focused changes
✅ Sync frequently with main
✅ Merge commit (--merge), never squash — squash orphans the release tag's bump commit
```

See `references/00-init-branch.md` for the full branch-creation workflow (sync, create, verify) and validation checklist.
