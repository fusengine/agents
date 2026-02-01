---
name: testing
description: XCTest for Swift with async testing, UI tests, snapshot testing, mocking patterns
when-to-use: writing unit tests for ViewModels, UI automation tests, snapshot tests, testing async code
keywords: XCTest, async, await, mock, stub, UI testing, snapshot, TDD
priority: high
requires: architecture.md, concurrency.md
related: performance.md
---

# Swift Testing

## When to Use

- Unit testing ViewModels and services
- Integration testing with dependencies
- UI automation testing
- Snapshot testing for visual regression
- Testing async/concurrent code

## Key Concepts

### Async Testing (Native)
XCTest supports async/await natively. No expectations needed.

**Key Points:**
- Mark test methods `async` or `async throws`
- Use `await` directly in tests
- Errors throw naturally
- Much cleaner than expectation-based tests

### Mock Pattern
Create mock implementations of protocols for testing.

**Key Points:**
- Mock implements same protocol as real dependency
- Stubbed return values for controlled tests
- Call tracking for verification
- Use `@unchecked Sendable` for mocks with mutable state

### @MainActor Tests
For testing ViewModels that use @MainActor.

**Key Points:**
- Mark test class or method `@MainActor`
- Tests run on main actor
- Required for @Observable ViewModels

### UI Testing
XCUITest for end-to-end UI automation.

**Key Points:**
- Use accessibility identifiers for element queries
- `waitForExistence(timeout:)` for async UI
- Launch arguments for test configuration
- Keep UI tests focused and fast

### Snapshot Testing
Visual regression testing with point-free/swift-snapshot-testing.

**Key Points:**
- Test light/dark mode variants
- Test dynamic type sizes
- Test different device sizes
- Commit reference images to git

---

## Test Structure (AAA Pattern)

```
// Arrange - Set up test data and mocks
// Act - Execute the code under test
// Assert - Verify the results
```

---

## Best Practices

- ✅ One assertion concept per test
- ✅ Use descriptive test names
- ✅ Test behavior, not implementation
- ✅ Mock external dependencies
- ✅ Use @MainActor for ViewModel tests
- ✅ Clean up in tearDown
- ❌ Don't test private methods directly
- ❌ Don't make tests dependent on each other
- ❌ Don't use real network in unit tests
- ❌ Don't sleep() - use async/await or waitForExistence

---

## Naming Convention

```
test_[methodName]_[scenario]_[expectedResult]
```

Examples:
- `test_loadUser_success_updatesState`
- `test_loadUser_networkError_showsError`
- `test_saveButton_tapped_savesData`

→ See `templates/viewmodel-tests.md` for code examples
