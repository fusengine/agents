# Swift Test Execution

## xcodebuild Tests

```bash
# Full test suite
xcodebuild test -scheme MyApp \
  -destination "platform=iOS Simulator,name=iPhone 16" \
  -resultBundlePath TestResults.xcresult

# With code coverage
xcodebuild test -scheme MyApp \
  -destination "platform=iOS Simulator,name=iPhone 16" \
  -enableCodeCoverage YES

# Single test class
xcodebuild test -scheme MyApp \
  -only-testing:MyAppTests/ProfileViewModelTests

# Single test method
xcodebuild test -scheme MyApp \
  -only-testing:MyAppTests/ProfileViewModelTests/testLoadProfile
```

## SPM Tests

```bash
swift test                          # All tests
swift test --filter ProfileTests    # Filtered
swift test --parallel               # Parallel
swift test --enable-code-coverage   # Coverage
```

## Test Results

```bash
open TestResults.xcresult           # View in Xcode
xcrun xcresulttool get --path TestResults.xcresult --format json
```

## CI/CD (GitHub Actions)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - run: sudo xcode-select -s /Applications/Xcode_16.app
      - run: xcodebuild test -scheme MyApp -destination "platform=iOS Simulator,name=iPhone 16"
```

## Debugging Failures

```bash
# Retry flaky tests
xcodebuild test -scheme MyApp -retry-tests-on-failure -test-iterations 3

# With sanitizers
xcodebuild test -scheme MyApp \
  -enableAddressSanitizer YES \
  -enableThreadSanitizer YES
```

## Test Checklist

- [ ] All unit tests pass
- [ ] All UI tests pass
- [ ] Coverage > 80%
- [ ] No flaky tests
- [ ] No memory leaks
- [ ] No data races
