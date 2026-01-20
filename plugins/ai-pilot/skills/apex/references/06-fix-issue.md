# 06 - Fix Issue

**Handle issues found during review or testing.**

## When to Use

- When validation finds errors
- When tests fail
- When reviewer requests changes
- When bugs are discovered

---

## Issue Triage

### Classify Issue

| Type | Priority | Action |
| --- | --- | --- |
| Build failure | P0 | Fix immediately |
| Test failure | P1 | Fix before PR |
| Linter error | P1 | Fix before PR |
| Type error | P1 | Fix before PR |
| Review comment | P2 | Address in order |
| Enhancement | P3 | Evaluate scope |

---

## Fix Workflow

### Step 1: Understand

```text
1. Read error message completely
2. Identify affected file(s)
3. Understand root cause
4. Check if related to your changes
```

### Step 2: Isolate

```text
1. Can you reproduce locally?
2. Is it a new issue or existing?
3. What's the minimal reproduction?
4. Does reverting your change fix it?
```

### Step 3: Fix

```text
1. Make minimal change to fix
2. Don't introduce new features
3. Follow same code standards
4. Add regression test if applicable
```

### Step 4: Verify

```text
1. Run sniper agent again
2. Run affected tests
3. Build locally
4. Test the specific scenario
```

---

## Common Issues

### Build Failures

```text
Error: Property/method does not exist

Fixes:
- Add property to interface
- Use optional access (?. or equivalent)
- Add type guard/check
```

### Test Failures

```text
Error: Assertion failed
Expected: "value"
Received: undefined

Fixes:
- Check mock setup
- Verify test data
- Check async handling
```

### Linter Errors

```text
Error: Variable defined but never used

Fixes:
- Delete unused imports/variables
- Remove dead code
- Prefix with _ if intentional
```

### Type Errors

```text
Error: Type mismatch

Fixes:
- Fix source type
- Add proper type annotation
- Use type casting if safe
```

---

## Review Comments

### Handling Feedback

```text
For each comment:

1. READ: Understand the concern
2. AGREE/DISCUSS: Valid point or misunderstanding?
3. FIX: Implement if valid
4. RESPOND: Explain what you did

Response formats:
✅ "Done" - Fixed as requested
💬 "Good point, fixed with [approach]"
❓ "Could you clarify...?" - Need more info
🤔 "I chose X because..." - Explain reasoning
```

### Common Review Requests

| Request | Action |
| --- | --- |
| "Add tests" | Write unit/integration tests |
| "Add docs" | Add documentation comments |
| "Simplify" | Refactor for clarity |
| "Extract" | Move to separate function/file |
| "Rename" | Use clearer naming |
| "Handle error" | Add try/catch/validation |

---

## Regression Prevention

### Before Fixing

```text
1. Write failing test for the bug
2. Fix the bug
3. Verify test passes
4. Ensure no other tests break
```

### Test Structure

```text
describe: Bug fix: [description]
  it: should [expected behavior]

    // Arrange: Set up conditions that caused bug
    // Act: Perform the action
    // Assert: Verify correct behavior
```

---

## Commit Fixes

### Fix Commit Format

```bash
# For validation fixes
git commit -m "fix(scope): resolve linter error in Component"

# For review fixes
git commit -m "fix(scope): address review feedback on validation"

# For test fixes
git commit -m "test(scope): fix flaky test in auth module"
```

### Keep History Clean

```text
Option 1: Squash fix into original commit
git rebase -i HEAD~N
# Change 'pick' to 'fixup' for fix commits

Option 2: Separate fix commits (for traceability)
# Keep as separate commits with clear messages
```

---

## Escalation

### When to Ask for Help

```text
□ Bug cause is unclear after investigation
□ Fix would require significant changes
□ Fix affects other team's code
□ Security implications
□ Unsure about correct approach
```

### How to Ask

```markdown
## Issue: [Brief description]

### What I tried
1. [Approach 1] - Result: [outcome]
2. [Approach 2] - Result: [outcome]

### What I think is happening
[Your hypothesis]

### Questions
1. [Specific question]
2. [Specific question]
```

---

## Fix Checklist

```text
□ Issue understood and reproduced
□ Root cause identified
□ Minimal fix implemented
□ Regression test added (if applicable)
□ sniper validation passes
□ All tests pass
□ Build succeeds
□ Ready for re-review
```

---

## Next Phase

→ Return to `04-validation.md` (verify fix)
→ Then `05-review.md` (re-review)
