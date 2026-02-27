# Common Verification Misses

Things frequently forgotten during verification. Use this as a supplemental checklist.

---

## By Category

| Category | Common Miss | How to Catch |
|----------|-------------|--------------|
| Edge cases | Empty inputs, null values | Test with boundary values |
| Edge cases | Very long strings, special characters | Test with unicode, emojis, 10000+ chars |
| Edge cases | Zero, negative numbers, MAX_INT | Test numeric boundaries |
| Error handling | Network failures, timeouts | Test with mocked failures |
| Error handling | Malformed API responses | Test with invalid JSON, 500 errors |
| Error handling | Disk full, permission denied | Test filesystem edge cases |
| Permissions | Unauthorized access | Test with different user roles |
| Permissions | Expired tokens, revoked access | Test auth edge cases |
| Mobile/responsive | Small screens | Test at 375px width |
| Mobile/responsive | Touch interactions | Verify tap targets are 44px+ |
| Mobile/responsive | Landscape orientation | Test rotated views |
| i18n | Long translations | Test with German or Finnish strings |
| i18n | RTL languages | Test with Arabic or Hebrew |
| i18n | Date/number formats | Test with non-US locales |
| Accessibility | Keyboard navigation | Tab through all interactive elements |
| Accessibility | Screen reader | Test with VoiceOver or NVDA |
| Accessibility | Color contrast | Verify WCAG AA compliance |
| Performance | Large datasets | Test with 1000+ items |
| Performance | Slow network | Throttle to 3G and test |
| Performance | Memory leaks | Monitor memory over repeated actions |
| Concurrency | Race conditions | Test with parallel requests |
| Concurrency | Double submissions | Click submit rapidly |
| Concurrency | Stale data | Test with concurrent edits |

---

## The "It Works on My Machine" Trap

The most dangerous verification failure is environment-specific success.

**Common traps:**

| Trap | Reality |
|------|---------|
| Works in dev, fails in prod | Different env vars, URLs, or configs |
| Works with fresh data, fails with real data | Production data has edge cases |
| Works with fast network, fails on slow | Timeout and loading state issues |
| Works in Chrome, fails in Safari | Browser-specific behavior |
| Works on macOS, fails on Linux | Path separators, case sensitivity |
| Works for admin, fails for regular user | Permission and role differences |

**Rules:**

1. Always verify in the environment closest to production
2. Never mark as done based solely on local success
3. Test with realistic data, not just happy-path samples
4. If CI passes but local fails (or vice versa), investigate the difference

---

## By Task Type

### Bug Fixes

| Miss | Prevention |
|------|-----------|
| Fix the symptom, not the root cause | Ask "why" five times before fixing |
| Introduce a new bug while fixing | Run full test suite after fix |
| Fix only one instance of a repeated bug | Grep for similar patterns across codebase |
| Forget to add a regression test | Every bug fix needs a test proving it is fixed |

### New Features

| Miss | Prevention |
|------|-----------|
| Happy path works, error path does not | Test every error scenario explicitly |
| Feature works but breaks existing feature | Run full regression suite |
| Feature works but is not discoverable | Verify UI/UX flow from user perspective |
| Missing loading/empty/error states | Check all UI states, not just success |

### Refactoring

| Miss | Prevention |
|------|-----------|
| Behavior changed unintentionally | Compare before/after test output exactly |
| Public API contract broken | Check all callers and consumers |
| Performance regressed | Benchmark before and after |
| Types became less strict | Review type changes carefully |

---

## Pre-Close Sanity Check

Before marking any task as complete, ask yourself:

1. Did I actually **test** this, or did I just **read** the code?
2. Am I marking this done because it **works** or because I am **tired**?
3. If someone else reviewed this in 5 minutes, would they find an issue?
4. Is there a scenario I deliberately avoided testing?
