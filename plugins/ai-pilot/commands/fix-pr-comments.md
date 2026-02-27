---
description: Systematically resolve Pull Request review comments using gh CLI to fetch comments and apply requested changes.
disable-model-invocation: true
---

# Fix PR Comments

Systematically address all PR review comments:

1. **Fetch PR Comments**:
   ```bash
   gh pr view [PR_NUMBER] --comments
   gh api repos/{owner}/{repo}/pulls/[PR_NUMBER]/comments
   ```

2. **Categorize Comments**:
   - **Must Fix**: Blocking issues (security, bugs, breaking changes)
   - **Should Fix**: Code quality, performance, best practices
   - **Nice to Have**: Style preferences, minor suggestions
   - **Questions**: Clarifications needed

3. **Address Each Comment**:
   For each comment:
   - Locate relevant file and line
   - Understand the requested change
   - > Use research-expert if clarification needed on best practices
   - Apply fix following project patterns
   - Mark comment as resolved

4. **Run Quality Checks**:
   > Use sniper to ensure all changes maintain code quality

   ```bash
   bun run lint
   bun test
   ```

5. **Commit Fixes**:
   ```bash
   git commit -m "$(cat <<'EOF'
   fix: Address PR review comments

   - [Comment 1 fix]
   - [Comment 2 fix]
   - [Comment 3 fix]


   EOF
   )"
   ```

6. **Push and Notify**:
   ```bash
   git push
   gh pr comment [PR_NUMBER] --body "✅ All review comments addressed"
   ```

**Arguments**:
- $ARGUMENTS specifies PR number or focuses on specific comment type

**Example Usage**:
- `/fix-pr-comments 123` → Fix all comments for PR #123
- `/fix-pr-comments` → Fix comments for current PR
