# 09 - Create PR (React/Vite)

**Create Pull Request for React features.**

## When to Use

- After all validation passes
- After tests pass
- When ready for code review

---

## Pre-PR Checklist

```text
[ ] Branch up-to-date with main
[ ] sniper validation passes
[ ] All tests pass (bun run test)
[ ] Build succeeds (bun run build)
[ ] TypeScript clean (bun run tsc --noEmit)
[ ] No console.log/debug code
[ ] Self-review completed
```

---

## Sync with Main

```bash
git fetch origin main
git rebase origin/main
git push origin feature/branch-name
```

---

## PR Title Format

```text
<type>(<scope>): <description>

Examples:
feat(UserCard): add user profile display component
fix(useAuth): resolve token refresh race condition
refactor(forms): extract validation to custom hook
ui(Button): add loading state variant
test(UserProfile): add integration tests
```

---

## PR Description Template (React)

```markdown
## Summary
- Add UserCard component with edit functionality
- Create useUser hook for data fetching
- Add comprehensive test coverage

## Changes

### Added
- `modules/users/components/UserCard.tsx` - User display component
- `modules/users/src/hooks/useUser.ts` - User data hook
- `modules/users/src/interfaces/user.interface.ts` - Type definitions

### Modified
- `modules/users/components/UserList.tsx` - Use new UserCard

## Technical Details
- Uses React 19 patterns (no forwardRef needed)
- TanStack Query integration for caching
- Optimistic updates for edit actions

## Related Issues
Closes #123

## Test Plan
- [ ] UserCard renders user information
- [ ] Edit button triggers callback
- [ ] Loading state displays correctly
- [ ] Error state handled gracefully

## Screenshots
| Before | After |
|--------|-------|
| N/A | ![UserCard](url) |

## Checklist
- [x] Tests added (hooks + components)
- [x] All files <100 lines
- [x] Interfaces in src/interfaces/
- [x] JSDoc on exports
- [x] No React antipatterns
```

---

## Create PR with gh CLI

```bash
gh pr create \
  --title "feat(UserCard): add user profile component" \
  --body "$(cat <<'EOF'
## Summary
- Add UserCard component for user display
- Create useUser hook for data fetching

## Test Plan
- [ ] Component renders correctly
- [ ] Hook handles loading/error states

Closes #123
EOF
)"
```

---

## PR Best Practices (React)

### Size Guidelines

```text
Ideal React PR:
- 1-3 components
- 1-2 hooks
- Associated tests
- <400 lines total

Split if:
- Multiple unrelated features
- >800 lines
- Multiple module changes
```

### Review-Friendly

```text
- Clear component boundaries
- Hooks tested separately
- Types documented
- Screenshots for UI changes
- Storybook link if available
```

---

## After PR Created

### Monitor CI

```bash
gh pr view --web
gh pr checks
```

### Common CI Failures

| Failure | Fix |
| --- | --- |
| TypeScript error | Fix types locally |
| ESLint error | Run lint --fix |
| Test failure | Debug with --ui |
| Build failure | Check imports/exports |

---

## Merge

```bash
# After approval
gh pr merge --squash --delete-branch
```

---

## Post-Merge

```bash
git checkout main
git pull origin main
git branch -d feature/branch-name
```

---

## PR Checklist

```text
[ ] Branch synced with main
[ ] Conventional PR title
[ ] Description complete
[ ] Tests documented
[ ] Screenshots for UI
[ ] CI passing
[ ] Review requested
```

---

## APEX Workflow Complete

```text
00-init-branch    -> Created feature branch
01-analyze-code   -> Understood React codebase
02-features-plan  -> Planned components/hooks
03-execution      -> Wrote React 19 code
04-validation     -> Verified with sniper
05-review         -> Self-reviewed patterns
06-fix-issue      -> Fixed any issues
07-add-test       -> Added Vitest tests
08-check-test     -> Verified tests pass
09-create-pr      -> Created and merged PR
```
