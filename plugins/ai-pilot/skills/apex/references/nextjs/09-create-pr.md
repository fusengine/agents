# 09 - Create PR (Next.js)

**Create Pull Request for Next.js project review and merge.**

## When to Use

- After all validation passes
- After tests pass
- When ready for code review

---

## Pre-PR Checklist

### Required

```text
[ ] Branch up-to-date with main
[ ] tsc --noEmit passes
[ ] eslint passes
[ ] pnpm build succeeds
[ ] All tests pass
[ ] Self-review completed
[ ] No console.logs/debug code
[ ] No TODO comments unaddressed
```

---

## Sync with Main

```bash
# Fetch latest
git fetch origin main

# Rebase (preferred for clean history)
git rebase origin/main

# Push updates
git push origin feature/branch-name --force-with-lease
```

---

## PR Title Format

### Conventional Format

```text
<type>(<scope>): <description>

Types:
- feat: New feature (route, component, API)
- fix: Bug fix
- refactor: Code refactoring (RSC migration)
- perf: Performance improvement
- docs: Documentation
- test: Test additions
```

### Next.js Examples

```text
feat(auth): add Better Auth login flow
fix(hydration): resolve client-server mismatch on dates
refactor(users): migrate to Server Components
perf(images): implement next/image lazy loading
feat(api): add user CRUD endpoints
```

---

## PR Description Template

```markdown
## Summary
<!-- 1-3 bullet points describing what this PR does -->
- Add user authentication with Better Auth
- Implement Server Actions for form handling
- Add protected route middleware

## Changes
### Added
- `modules/auth/` - Authentication module
- `app/(auth)/login/page.tsx` - Login page
- `proxy.ts` - Auth proxy (Next.js 16)

### Modified
- `app/layout.tsx` - Add SessionProvider

## Architecture Decisions
<!-- Explain any significant choices -->
- Used Server Actions instead of API routes for form mutations
- Separated Server/Client components for optimal hydration

## Related Issues
Closes #123
Related to #456

## Test Plan
- [ ] Login with valid credentials - redirects to dashboard
- [ ] Login with invalid credentials - shows error
- [ ] Access protected route without auth - redirects to login
- [ ] Logout - clears session, redirects to home

## Checklist
- [x] TypeScript strict mode passes
- [x] ESLint passes (no errors/warnings)
- [x] Build succeeds
- [x] Unit tests added (Vitest)
- [x] E2E tests added (Playwright)
- [x] Documentation updated
- [x] No breaking changes
```

---

## Create PR with gh CLI

### Standard PR

```bash
gh pr create \
  --title "feat(auth): add Better Auth login flow" \
  --body "$(cat <<'EOF'
## Summary
- Add user authentication with Better Auth
- Implement Server Actions for form handling

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
  --title "feat(auth): add Better Auth login flow" \
  --body-file .github/PR_TEMPLATE.md \
  --label "feature,auth,next.js" \
  --reviewer "teammate1" \
  --assignee "@me"
```

---

## Next.js Specific Checks

### Build Output Verification

```text
Include in PR description:
- Bundle size impact
- New routes added
- Rendering strategy (SSG/SSR/ISR)
```

### Example

```markdown
## Build Output
Route (app)                    Size     First Load JS
+ /(auth)/login (dynamic)      2.1 kB   89.3 kB
+ /dashboard (dynamic)         1.8 kB   88.9 kB

First Load JS increased by: +3.9 kB (acceptable)
```

---

## PR Best Practices

### Size Guidelines

```text
Small PRs (<400 lines changed):
- Easier to review
- Faster feedback
- Lower risk

For larger features:
- Split into multiple PRs
- Use stacked PRs pattern
- First PR: interfaces/types
- Second PR: services
- Third PR: components
- Fourth PR: integration
```

### Review-Friendly

```text
[ ] Single logical change per PR
[ ] Clear title and description
[ ] Screenshots for UI changes
[ ] Test instructions provided
[ ] Self-reviewed first
```

---

## After PR Created

### Monitor CI

```bash
# Check PR status
gh pr view --web

# Check CI runs
gh pr checks

# View specific check logs
gh run view [run-id] --log
```

### Address Review Comments

```text
1. Read all comments first
2. Respond to each:
   - "Done" if fixed
   - Discuss if disagree
3. Push fixes
4. Re-request review
5. Run: gh pr ready (if was draft)
```

---

## Merge

### Pre-merge Checklist

```text
[ ] All CI checks pass
[ ] Required reviews approved
[ ] No unresolved comments
[ ] Branch up-to-date
```

### Merge Command

```bash
# Squash and merge (recommended)
gh pr merge --squash --delete-branch

# Merge commit
gh pr merge --merge --delete-branch
```

---

## Post-Merge

### Cleanup

```bash
# Switch to main
git checkout main
git pull origin main

# Delete local branch
git branch -d feature/branch-name

# Verify merge
git log --oneline -5
```

### Update Related

```text
[ ] Close related issues
[ ] Update project board
[ ] Notify stakeholders
[ ] Monitor Vercel preview/production
```

---

## APEX Workflow Complete

```text
00-init-branch    - Created feature branch
01-analyze-code   - Understood Next.js codebase
02-features-plan  - Planned routes, components, actions
03-execution      - Implemented with SOLID principles
04-validation     - Verified with sniper (tsc, eslint, build)
05-review         - Self-reviewed Server/Client patterns
06-fix-issue      - Fixed any issues found
07-add-test       - Added Vitest/Playwright tests
08-check-test     - Verified all tests pass
09-create-pr      - Created and merged PR
```
