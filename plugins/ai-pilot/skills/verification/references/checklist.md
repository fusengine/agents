# Verification Checklist

Complete this checklist before marking any task as done. Every item must be checked with evidence.

---

## Functional Verification

- [ ] Original request re-read word by word
- [ ] All acceptance criteria extracted and listed
- [ ] Each criterion verified with concrete evidence
- [ ] Edge cases from original request covered
- [ ] User-facing behavior matches expectation
- [ ] Error scenarios handled as specified
- [ ] Default values behave correctly
- [ ] Input validation works for all specified constraints

### Evidence Types

| Criterion Type | Acceptable Evidence |
|---------------|-------------------|
| Bug fix | Test reproducing the bug now passes |
| Feature | Test demonstrating the feature works |
| UI change | Screenshot or snapshot test |
| API change | Request/response log output |
| Performance | Benchmark comparison before/after |
| Refactoring | All existing tests still pass |

---

## Regression Check

- [ ] Full test suite passes (not just new/modified tests)
- [ ] No new warnings introduced
- [ ] No new lint errors introduced
- [ ] No unrelated files modified
- [ ] No unrelated test failures
- [ ] Performance not degraded (if applicable)
- [ ] Build succeeds without errors
- [ ] No new TypeScript/type errors

### Regression Red Flags

| Red Flag | Action |
|----------|--------|
| Test that was passing now fails | Investigate immediately -- do not skip |
| New warning in unrelated file | Check if your changes caused it |
| Build time significantly increased | Review added dependencies |
| Bundle size increased unexpectedly | Check for unnecessary imports |

---

## Side Effect Check

- [ ] All modified files reviewed one by one
- [ ] No accidental changes to unrelated code
- [ ] No debug code left behind (console.log, debugger, TODO)
- [ ] Dependencies not unnecessarily changed
- [ ] Configuration files unchanged (unless required)
- [ ] Lock files updated only if dependencies changed
- [ ] No secrets or credentials exposed
- [ ] No file permission changes

### File Review Checklist

For **each** modified file, confirm:

1. The change is intentional and related to the task
2. No unrelated formatting or whitespace changes
3. No commented-out code added
4. Imports are clean (no unused imports added)
5. No temporary workarounds left in place

---

## Final Confirmation

Before marking complete, answer these questions:

1. **Does this solve the ORIGINAL problem?** (not a related problem)
2. **Would the requester accept this?** (meets their expectations)
3. **Is the evidence documented?** (test output, logs, screenshots)
4. **Are there any known limitations?** (if yes, document them)

Only mark as complete when all answers are satisfactory.
