# RED-GREEN-REFACTOR Cycle

The core discipline of Test-Driven Development. Each phase has strict rules.

---

## RED Phase: Write ONE Failing Test

**Goal**: Define the next behavior with a test that does not pass.

**Rules**:
1. Write exactly ONE test — not two, not a suite
2. Use a clear name that describes the expected behavior
3. Test real code — avoid mocks unless absolutely unavoidable
4. The test must compile/parse (syntax errors are not valid RED)
5. Assert the expected outcome, not implementation details

**Example test name patterns**:
```
should_return_empty_list_when_no_items_exist
throws_error_when_input_is_negative
creates_user_with_hashed_password
```

---

## VERIFY RED: Confirm Expected Failure

**Goal**: Prove the test fails for the RIGHT reason.

**Run the test suite.** Then verify:

| Check | Why |
|-------|-----|
| Test fails | If it passes, you tested existing behavior (delete it) |
| Failure reason is correct | A compilation error is not the same as a logic failure |
| Error message is clear | You should understand what broke from the output alone |

**If the test passes on first run**: STOP. Either the behavior already exists (remove the test) or the test is wrong (fix it).

---

## GREEN Phase: Write the Simplest Code to Pass

**Goal**: Make the failing test pass with minimum code.

**Rules**:
1. Write the SIMPLEST code that makes the test pass
2. Do not add error handling that no test requires
3. Do not add features that no test requires
4. Do not refactor yet — ugly code is fine
5. Hard-coded values are acceptable if only one test exists

**The mantra**: "Make it work, then make it right."

---

## VERIFY GREEN: Confirm All Tests Pass

**Goal**: The new test passes AND no existing tests broke.

**Run the FULL test suite.** Then verify:

| Check | Why |
|-------|-----|
| New test passes | The implementation satisfies the requirement |
| All other tests pass | No regressions introduced |
| No skipped tests | Skipped tests hide failures |

**If any existing test breaks**: Fix the implementation, not the old test. The old test represents a valid requirement.

---

## REFACTOR Phase: Clean Up While Green

**Goal**: Improve code quality without changing behavior.

**Rules**:
1. All tests must stay green throughout refactoring
2. Run tests after EVERY change — not just at the end
3. Extract duplication, rename for clarity, simplify logic
4. Apply SOLID principles where appropriate
5. Keep files under 100 lines — split if approaching 90

**What to refactor**:
- Duplicate code between production and test files
- Unclear variable or function names
- Long functions that do multiple things
- Magic numbers or strings

**What NOT to refactor**:
- Working test names (they document behavior)
- Code unrelated to the current feature

---

## REPEAT: Next Behavior = Next Failing Test

After refactoring, pick the next behavior and return to RED.

**Progression order**:
1. Happy path (simplest valid case)
2. Edge cases (empty input, boundary values)
3. Error cases (invalid input, failures)
4. Integration points (if unit tests are solid)

---

## Good Test Qualities

| Quality | Description |
|---------|-------------|
| Minimal | Tests ONE specific behavior |
| Clear | Name describes what is tested |
| Intent-showing | Demonstrates desired API usage |
| Real | Mocks only when unavoidable |
| Fast | Runs in milliseconds, not seconds |
| Independent | No dependency on other tests or order |
| Deterministic | Same result every run, no flakiness |
