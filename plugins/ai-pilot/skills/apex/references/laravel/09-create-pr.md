# 09 - Create PR (Laravel)

**Create a well-documented pull request for Laravel changes.**

## When to Use

- After all validation passes
- After self-review complete
- When feature is ready for team review

---

## Pre-PR Checklist

### Quality Gates

```text
[ ] Larastan level 8+ passes
[ ] Pint passes (no style issues)
[ ] All Pest tests pass
[ ] Coverage > 80%
[ ] All files < 100 lines
[ ] Self-review completed
```

### Code Readiness

```text
[ ] No debug code (dd, dump, ray)
[ ] No commented-out code
[ ] PHPDoc complete
[ ] Migrations reversible
[ ] Routes documented in api.php
```

---

## Push Branch

```bash
# Ensure branch is up to date
git fetch origin main
git rebase origin/main

# Push branch
git push -u origin feature/ISSUE-123-description
```

---

## PR Template for Laravel

```markdown
## Summary

Brief description of changes (1-2 sentences).

## Changes

### Database
- Added `posts` table migration
- Added `PostStatus` enum

### Models
- Created `Post` model with User relationship

### Services
- Created `PostService` for business logic
- Implemented create, update, publish methods

### API
- Added CRUD endpoints for posts
- Created `PostResource` for JSON transformation

### Tests
- Added 8 feature tests for PostController
- Added 3 unit tests for PostService

## Test Plan

- [ ] Run `composer quality` locally
- [ ] Test API endpoints with Postman/Insomnia
- [ ] Verify database migrations work
- [ ] Check authorization policies

## Breaking Changes

None / List any breaking changes

## Related Issues

Closes #123
```

---

## Create PR with GitHub CLI

```bash
gh pr create \
  --title "feat(posts): add Post CRUD API" \
  --body "$(cat <<'EOF'
## Summary

Add complete CRUD API for blog posts with proper authorization.

## Changes

### Database
- Migration: `create_posts_table`

### Models
- `Post` model with User relationship

### Services
- `PostService` (create, update, publish)

### API Endpoints
- `GET /api/v1/posts` - List posts
- `POST /api/v1/posts` - Create post
- `GET /api/v1/posts/{id}` - Show post
- `PUT /api/v1/posts/{id}` - Update post
- `DELETE /api/v1/posts/{id}` - Delete post

### Tests
- 8 feature tests
- 3 unit tests
- Coverage: 87%

## Test Plan

- [ ] Run `composer quality`
- [ ] Test all API endpoints
- [ ] Verify migrations

Closes #123
EOF
)"
```

---

## PR Title Convention

### Format

```text
<type>(<scope>): <description>
```

### Examples

```text
feat(posts): add Post CRUD API
fix(auth): resolve token expiration issue
refactor(users): extract UserService
docs(api): add OpenAPI documentation
test(orders): add integration tests
chore(deps): update Laravel to 12.5
```

---

## Reviewer Checklist

### For Reviewers to Check

```text
Code Quality:
[ ] declare(strict_types=1) present
[ ] Type hints complete
[ ] PHPDoc for complex methods
[ ] No business logic in controllers

Architecture:
[ ] SOLID principles followed
[ ] Interfaces in Contracts/
[ ] Services handle business logic
[ ] Files < 100 lines

Security:
[ ] Input validated via FormRequest
[ ] Authorization with Policies
[ ] No SQL injection risks
[ ] Sensitive data protected

Performance:
[ ] No N+1 queries
[ ] Eager loading used
[ ] Indexes on queried columns

Tests:
[ ] Feature tests present
[ ] Edge cases covered
[ ] Mocks used appropriately
```

---

## After PR Created

### Monitor CI

```bash
# Check PR status
gh pr status

# View checks
gh pr checks
```

### Respond to Feedback

```text
1. Address all comments
2. Push fixes as new commits
3. Request re-review when ready
4. Don't force-push after review started
```

---

## Merge Strategies

### Squash and Merge (Recommended)

```text
- Combines all commits into one
- Clean history on main
- Good for feature branches
```

### Merge Commit

```text
- Preserves all commits
- Creates merge commit
- Shows complete history
```

### Rebase and Merge

```text
- Linear history
- No merge commits
- Clean but loses PR context
```

---

## Post-Merge Tasks

### Cleanup

```bash
# Delete local branch
git checkout main
git pull origin main
git branch -d feature/ISSUE-123-description

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/ISSUE-123-description
```

### Verify Deployment

```bash
# Check production/staging
php artisan about
php artisan migrate:status
```

---

## PR Checklist Summary

```text
Before Creating:
[ ] All quality tools pass
[ ] All tests pass
[ ] Self-review done
[ ] Branch rebased on main

PR Content:
[ ] Clear title with type
[ ] Summary of changes
[ ] Test plan included
[ ] Related issues linked

After Creating:
[ ] CI passes
[ ] Reviewers assigned
[ ] Respond to feedback
[ ] Merge when approved
```

---

## PR Report Template

```markdown
## PR Created

**Title:** feat(posts): add Post CRUD API
**Branch:** feature/123-post-crud
**PR URL:** https://github.com/org/repo/pull/456

### Quality Status
- Larastan: PASS
- Pint: PASS
- Tests: 78/78 PASS
- Coverage: 87%

### Files Changed
- 12 files added
- 3 files modified
- 0 files deleted

### Ready for Review
```
