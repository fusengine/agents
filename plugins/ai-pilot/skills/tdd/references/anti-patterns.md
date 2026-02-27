# TDD Anti-Patterns

Common mistakes, rationalizations, and red flags that break the TDD cycle.

---

## Common Rationalizations (ALL INVALID)

Every excuse below has been used to skip writing tests first. None hold up.

| Excuse | Why It Fails |
|--------|-------------|
| "Too simple to test" | Simple code breaks; testing takes seconds |
| "I'll test after" | Tests pass immediately, proving nothing |
| "Already manually tested" | Manual testing is unrepeatable and unreliable |
| "Deleting code is wasteful" | Keeping unverified code creates technical debt |
| "This situation is different" | No. Write the test first |
| "The deadline is tight" | TDD catches bugs now instead of in production |
| "It's just a refactor" | Refactors without tests break behavior silently |
| "Mocking is too hard" | If it's hard to mock, the design needs improvement |
| "I know this works" | You don't. Write the test and prove it |

---

## Red Flags (Restart Immediately)

If any of these occur, STOP and return to the RED phase:

| Red Flag | Problem | Action |
|----------|---------|--------|
| Writing code before tests | Violates the Iron Law | Delete code, write test first |
| Test passes on first run | Test is wrong or behavior exists | Investigate, fix or remove test |
| "I'll test later" | Tests written after code prove nothing | Stop, write the test NOW |
| Cannot explain why test failed | You don't understand the behavior | Read the error, understand it |
| Multiple tests written at once | Losing focus on ONE behavior | Keep only the first, delete rest |
| Modifying tests to match code | Tests should drive code, not follow it | Revert test, fix the code instead |
| Skipping VERIFY steps | Cannot confirm the cycle is working | Run tests before proceeding |

---

## Test Smells

Signs that tests exist but are not providing value:

| Smell | Symptom | Fix |
|-------|---------|-----|
| Testing implementation | Test breaks when refactoring | Test behavior, not internals |
| Excessive mocking | More mocks than real objects | Reduce dependencies, test real code |
| Brittle assertions | Tests break on unrelated changes | Assert on outcomes, not structure |
| Test duplication | Same behavior tested multiple ways | Keep one, remove duplicates |
| Slow tests | Suite takes minutes to run | Isolate slow tests, fix dependencies |
| Flaky tests | Pass sometimes, fail others | Fix non-determinism or remove |
| Giant arrange | 20+ lines of setup per test | Extract builders or fixtures |
| No assertions | Test runs code but checks nothing | Add meaningful assertions |

---

## The Test-After Trap

Writing tests after implementation is fundamentally different from TDD:

```
TDD:        Test -> Fail -> Code -> Pass -> Refactor
Test-After: Code -> Test -> Pass (immediately) -> False confidence
```

**Why test-after fails**:
1. Tests always pass — they were written to match existing code
2. No design pressure — tests adapt to bad design instead of improving it
3. Missing edge cases — you only test what you remember implementing
4. No regression safety — tests don't catch the bugs you didn't think of

---

## Recovery Protocol

When you realize TDD discipline has been broken:

1. **STOP** writing production code immediately
2. **IDENTIFY** what untested behavior was just written
3. **DELETE** the untested production code
4. **WRITE** a failing test for that behavior
5. **VERIFY** the test fails (it must, since you deleted the code)
6. **RE-IMPLEMENT** following GREEN phase rules
7. **CONTINUE** the normal RED-GREEN-REFACTOR cycle
