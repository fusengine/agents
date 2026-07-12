---
name: commit-conventions
description: Conventional commit message format and examples for APEX workflow
---

# Commit Convention

## Format

```text
<type>(<scope>): <description>

Types: feat, fix, refactor, docs, test, chore
Scope: component/feature name
Description: imperative mood, <50 chars
```

## Examples

```bash
feat(auth): add JWT authentication
fix(cart): resolve quantity validation
refactor(api): extract fetch utilities
test(auth): add login component tests
```
