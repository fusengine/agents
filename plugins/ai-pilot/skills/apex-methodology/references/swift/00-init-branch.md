---
name: 00-init-branch
description: Git flow and branching strategy for Swift/iOS projects
prev_step: null
next_step: references/swift/01-analyze-code.md
---

# Swift Branching Strategy

## Git Flow for iOS Projects

```text
main (production)
  └── develop (integration)
       ├── feature/AUTH-123-login-screen
       └── bugfix/UI-789-button-crash
```

## Branch Naming

```bash
feature/TICKET-description    # New features
bugfix/TICKET-description     # Bug fixes
release/1.2.0                 # Releases
hotfix/1.2.1-critical-fix     # Hotfixes
```

## Creating Feature Branch

```bash
git checkout develop && git pull origin develop
git checkout -b feature/AUTH-123-login-screen
git push -u origin feature/AUTH-123-login-screen
```

## SPM Package Versioning

```bash
# Tag release (SemVer)
git tag -a 1.2.0 -m "Release 1.2.0"
git push origin 1.2.0

# Package.swift dependency
.package(url: "https://github.com/org/Package", from: "1.2.0")
```

## Essential .gitignore

```text
xcuserdata/
DerivedData/
.build/
Pods/
*.xcscmblueprint
```

## Merge Strategy

```bash
# Rebase before PR
git fetch origin && git rebase origin/develop

# Squash merge
git checkout develop
git merge --squash feature/AUTH-123-login-screen
git commit -m "feat(auth): add Apple Sign-In (#123)"
```

## Branch Protection Rules

- Require PR reviews (min 1)
- Require status checks (SwiftLint, tests)
- Require linear history
- No force push to main/develop

## Release Process

```bash
git checkout -b release/1.2.0 develop
# Bump version, update CHANGELOG
git checkout main && git merge --no-ff release/1.2.0
git tag -a 1.2.0 -m "Release 1.2.0"
git push origin main --tags
git checkout develop && git merge main
```

## Update Task Phase

At the **start** of this phase, record it (and the resolved task subject) in `.claude/apex/task.json`:

```bash
jq --arg p "init-branch" --arg s "$TASK_SUBJECT" \
  '.tasks[.current_task].phase = $p | .tasks[.current_task].subject = $s' \
  .claude/apex/task.json > .claude/apex/task.json.tmp && mv .claude/apex/task.json.tmp .claude/apex/task.json
```

Replace `$TASK_SUBJECT` with the real task description, quoted for the shell.

## Next Phase

→ Proceed to `01-analyze-code.md`
