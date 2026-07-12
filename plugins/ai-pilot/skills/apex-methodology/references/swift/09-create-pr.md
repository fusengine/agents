---
name: 09-create-pr
description: Create Pull Request for Swift/iOS changes
prev_step: references/swift/08-check-test.md
next_step: null
---

# Swift Pull Request Guide

## PR Template

```markdown
## Summary
Brief description (1-2 sentences).

## Changes
- Added `ProfileViewModel` with @Observable
- Created `ProfileServiceProtocol`

## Checklist
- [ ] MVVM architecture followed
- [ ] @Observable (not ObservableObject)
- [ ] Files < 150 lines, Views < 80
- [ ] SwiftLint passes
- [ ] /// docs on public APIs
- [ ] Unit tests added
- [ ] #Preview for views
- [ ] Strings localized
- [ ] Models are Sendable

## Screenshots
| Before | After |
|--------|-------|
| N/A | [img] |
```

## Creating PR

```bash
git push -u origin feature/PROFILE-123-user-profile

gh pr create \
  --title "feat(profile): add user profile (#123)" \
  --base develop \
  --assignee @me
```

## Title Convention

```text
feat(scope): description (#ticket)
fix(scope): description (#ticket)
refactor(scope): description
```

## GitHub Actions Checks

```yaml
name: PR Checks
on: [pull_request]
jobs:
  lint:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - run: swiftlint --strict
  test:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - run: xcodebuild test -scheme MyApp -destination "platform=iOS Simulator,name=iPhone 16"
```

## Review Commands

```bash
gh pr diff 123                    # View diff
gh pr checks 123                  # Check status
gh pr merge 123 --merge --delete-branch   # Merge commit — never squash, it orphans the release tag's bump commit
```

## Post-Merge

```bash
git checkout develop && git pull
git branch -d feature/PROFILE-123-user-profile
```

## Update Task Phase

At the **start** of this phase, record it (and mark the task `completed` once the PR is opened) in `.claude/apex/task.json`:

```bash
jq --arg p "create-pr" '.tasks[.current_task].phase = $p' .claude/apex/task.json \
  > .claude/apex/task.json.tmp && mv .claude/apex/task.json.tmp .claude/apex/task.json
# after the PR is created:
jq '.tasks[.current_task].status = "completed"' .claude/apex/task.json \
  > .claude/apex/task.json.tmp && mv .claude/apex/task.json.tmp .claude/apex/task.json
```
