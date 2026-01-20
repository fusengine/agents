# Swift Self-Review Checklist

## Code Quality

### Architecture

- [ ] MVVM pattern followed correctly
- [ ] ViewModels use @Observable (not ObservableObject)
- [ ] Dependencies injected via protocols
- [ ] Protocols defined in separate files (Protocols/)
- [ ] No business logic in Views

### File Organization

- [ ] No file exceeds 150 lines
- [ ] Views under 80 lines
- [ ] ViewModels under 100 lines
- [ ] Services under 100 lines
- [ ] Subviews extracted at 30+ lines

### Swift 6 Concurrency

- [ ] All async functions use async/await
- [ ] No completion handlers (use async/await)
- [ ] ViewModels marked @MainActor
- [ ] Models are Sendable
- [ ] Actors used for shared mutable state
- [ ] Task cancellation handled properly

## SwiftUI Best Practices

### Views

- [ ] #Preview exists for every view
- [ ] Multiple preview variants (light/dark, sizes)
- [ ] Accessibility labels on images/icons
- [ ] Dynamic Type supported
- [ ] Safe area respected

### State Management

```swift
// Checklist items
- [ ] @State for local view state
- [ ] @Environment for shared dependencies
- [ ] @Binding for child view mutations
- [ ] No @Published (use @Observable)
```

## Documentation

- [ ] All public APIs have /// documentation
- [ ] Parameter descriptions included
- [ ] Return types documented
- [ ] Throws documented

```swift
/// Fetches user profile from API.
///
/// - Parameter id: User unique identifier
/// - Returns: User profile if found
/// - Throws: `NetworkError` on failure
func fetchProfile(id: String) async throws -> UserProfile
```

## Localization

- [ ] All user-facing strings use String Catalogs
- [ ] No hardcoded strings in UI
- [ ] Key naming follows convention: `module.screen.element`
- [ ] Interpolated strings use proper format

## Security

- [ ] No secrets in code
- [ ] Sensitive data in Keychain (not UserDefaults)
- [ ] Network calls use HTTPS
- [ ] Input validation on user data

## Performance

- [ ] LazyVStack/LazyHStack for lists
- [ ] Images loaded asynchronously
- [ ] No heavy computation in view body
- [ ] Formatters cached (not recreated)

## Testing Readiness

- [ ] ViewModels testable (protocol dependencies)
- [ ] No singletons blocking tests
- [ ] Preview data available (.preview extensions)

## Final Checks

```bash
# Run all validations
swiftlint --strict
swift-format lint --strict Sources/
xcodebuild test -scheme MyApp -destination "platform=iOS Simulator,name=iPhone 16"
```
