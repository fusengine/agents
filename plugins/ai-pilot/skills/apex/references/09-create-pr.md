# 09 - Create PR

**Create Pull Request for review and merge.**

## When to Use

- After all validation passes
- After tests pass
- When ready for code review

---

## Pre-PR Checklist

### Required

```text
□ Branch up-to-date with main
□ All commits follow conventional format
□ sniper validation passes
□ All tests pass
□ Build succeeds
□ Self-review completed
□ No console.logs/debug code
□ No TODO comments unaddressed
```

---

## Sync with Main

### Before PR

```bash
# Fetch latest
git fetch origin main

# Rebase (preferred for clean history)
git rebase origin/main

# OR merge (if team prefers)
git merge origin/main

# Push updates
git push origin feature/branch-name
```

### Resolve Conflicts

```text
1. Identify conflicting files
2. Open each file
3. Resolve conflicts (keep correct code)
4. Stage resolved files
5. Continue rebase/merge
6. Run tests to verify
```

---

## PR Title Format

### Conventional Format

```text
<type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- docs: Documentation
- test: Test additions
- chore: Maintenance
```

### Examples

```text
✅ feat(auth): add social login with Google
✅ fix(cart): resolve quantity update bug
✅ refactor(api): extract fetch utilities
✅ docs(readme): add setup instructions

❌ Update stuff
❌ WIP
❌ fix
```

---

## PR Description Template

```markdown
## Summary
<!-- 1-3 bullet points describing what this PR does -->
- Add user authentication with JWT
- Implement login/logout flows
- Add protected route wrapper

## Changes
<!-- What was added/modified/removed -->
### Added
- `src/hooks/useAuth.ts` - Authentication hook
- `src/components/LoginForm.tsx` - Login form component

### Modified
- `src/app/layout.tsx` - Add auth provider

### Removed
- None

## Related Issues
<!-- Link to issues this PR addresses -->
Closes #123
Related to #456

## Test Plan
<!-- How to test these changes -->
- [ ] Login with valid credentials → redirects to dashboard
- [ ] Login with invalid credentials → shows error
- [ ] Logout → redirects to login page
- [ ] Access protected route without auth → redirects to login

## Screenshots
<!-- If UI changes, add before/after screenshots -->
| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] Self-review completed
- [x] No breaking changes (or documented)
```

---

## Create PR with gh CLI

### Basic PR

```bash
gh pr create \
  --title "feat(auth): add user authentication" \
  --body "$(cat <<'EOF'
## Summary
- Add JWT-based authentication
- Implement login/logout flows

## Test Plan
- [ ] Login works with valid credentials
- [ ] Logout clears session

Closes #123
EOF
)"
```

### With Labels and Reviewers

```bash
gh pr create \
  --title "feat(auth): add user authentication" \
  --body-file .github/PR_TEMPLATE.md \
  --label "feature,auth" \
  --reviewer "teammate1,teammate2" \
  --assignee "@me"
```

### Draft PR

```bash
gh pr create --draft \
  --title "WIP: feat(auth): add user authentication" \
  --body "Work in progress - do not review yet"
```

---

## PR Best Practices

### Size Guidelines

```text
✅ Small PRs (<400 lines changed)
   - Easier to review
   - Faster feedback
   - Lower risk

⚠️ Medium PRs (400-800 lines)
   - Split if possible
   - Detailed description needed

❌ Large PRs (>800 lines)
   - Split into smaller PRs
   - Or use stacked PRs
```

### Review-Friendly PRs

```text
✅ Single logical change
✅ Clear, descriptive title
✅ Thorough description
✅ Linked issues
✅ Test instructions
✅ Screenshots for UI
✅ Self-reviewed
```

---

## After PR Created

### Monitor CI

```bash
# Check PR status
gh pr view --web

# Check CI runs
gh pr checks

# View CI logs
gh run view [run-id]
```

### Address Review Comments

```text
1. Read all comments first
2. Respond to each:
   - "Done" if fixed
   - "Will address" if need time
   - Discuss if disagree
3. Push fixes
4. Re-request review
```

### Merge Strategies

```text
Squash and merge (recommended):
- Single commit in main
- Clean history

Merge commit:
- Preserves all commits
- Good for detailed history

Rebase and merge:
- Linear history
- No merge commit
```

---

## Merge

### Pre-merge Checklist

```text
□ All CI checks pass
□ Required reviews approved
□ No unresolved comments
□ Branch up-to-date
□ Ready to merge
```

### Merge Command

```bash
# Squash and merge
gh pr merge --squash

# With delete branch
gh pr merge --squash --delete-branch

# Merge commit
gh pr merge --merge
```

---

## Post-Merge

### Cleanup

```bash
# Delete local branch
git checkout main
git pull origin main
git branch -d feature/branch-name

# Verify merge
git log --oneline -5
```

### Update Related

```text
□ Close related issues
□ Update project board
□ Notify stakeholders
□ Update documentation if needed
□ Monitor production (if deployed)
```

---

## PR Checklist

```text
□ Branch synced with main
□ Conventional PR title
□ Description complete
□ Issues linked
□ Tests documented
□ CI passing
□ Review requested
□ Ready to merge
```

---

## Workflow Complete

```text
APEX Workflow Summary:
00-init-branch    → Created feature branch
01-analyze-code   → Understood codebase
02-features-plan  → Planned implementation
03-execution      → Wrote code
04-validation     → Verified quality
05-review         → Self-reviewed
06-fix-issue      → Fixed any issues
07-add-test       → Added tests
08-check-test     → Verified tests pass
09-create-pr      → Created and merged PR ✅
```
