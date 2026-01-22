---
name: 06-fix-issue
description: Systematic workflow for fixing Swift issues
prev_step: references/swift/05-review.md
next_step: references/swift/07-add-test.md
---

# Swift Fix Workflow

## 1. Reproduce Issue

```bash
# Run failing test
xcodebuild test -scheme MyApp \
  -only-testing:MyAppTests/ProfileViewModelTests/testLoadProfile

# Check crash logs
open ~/Library/Logs/DiagnosticReports/
```

## 2. Identify Root Cause

```bash
grep -rn "ProfileViewModel" --include="*.swift"
git blame Sources/Features/Profile/ProfileViewModel.swift
```

## Common Issues & Fixes

### Force Unwrap Crash

```swift
// BAD
let name = user!.name

// GOOD
guard let user else { return }
let name = user.name
```

### Concurrency Data Race

```swift
// BAD: shared mutable state
class Counter { var count = 0 }

// GOOD: use actor
actor Counter { var count = 0 }
```

### Main Thread Violation

```swift
// BAD
Task.detached { self.label.text = "X" }

// GOOD
@MainActor @Observable final class ViewModel { ... }
```

### Memory Leak

```swift
// BAD: retain cycle
service.fetch { result in self.data = result }

// GOOD: async/await
data = try await service.fetch()
```

## 3. Create Fix Branch

```bash
git checkout develop && git pull
git checkout -b bugfix/ISSUE-123-profile-crash
```

## 4. Write Failing Test First

```swift
@Test func testProfileLoadHandlesNil() async {
    let service = MockProfileService(returnsNil: true)
    let viewModel = ProfileViewModel(service: service)
    await viewModel.load(id: "invalid")
    #expect(viewModel.error != nil)
}
```

## 5. Verify Fix

```bash
xcodebuild test -scheme MyApp
swiftlint --strict
git commit -m "fix(profile): handle nil user (#123)"
```
