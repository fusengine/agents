# 🍎 Swift Apple Expert Plugin

Expert Swift & SwiftUI development plugin for Claude Code covering all Apple platforms.

## Installation

The plugin is installed at `~/.claude/plugins/swift-apple-expert/`

To verify installation:
```bash
ls ~/.claude/plugins/swift-apple-expert/
```

## Skills Included

| Skill | Description |
|-------|-------------|
| `swiftui-components` | Build views, layouts, modifiers, @ViewBuilder |
| `swift-architecture` | MVVM, Clean Architecture, DI, repositories |
| `swift-concurrency` | async/await, actors, Sendable, Swift 6 |
| `swiftui-navigation` | NavigationStack, deep linking, routing |
| `swiftui-data` | SwiftData, Core Data, CloudKit, AppStorage |
| `apple-platforms` | macOS, iPadOS, watchOS, visionOS specifics |
| `swiftui-testing` | XCTest, UI tests, snapshot testing |
| `swift-performance` | Instruments, optimization, memory management |

## Agent

### `swift-expert`

Expert agent that combines all skills for comprehensive Apple development.

**Triggers automatically when you mention:**
- Swift, SwiftUI, iOS, macOS, iPadOS, watchOS, visionOS
- Building views, components, navigation
- Architecture patterns, MVVM, Clean Architecture
- Concurrency, async/await, actors
- Testing, performance, optimization

## Usage Examples

```
"Create a SwiftUI view with @Observable"
→ Activates: swiftui-components, swift-architecture

"Implement deep linking in my iOS app"
→ Activates: swiftui-navigation

"Fix this Swift 6 concurrency error"
→ Activates: swift-concurrency

"Build a menu bar app for macOS"
→ Activates: apple-platforms

"Write tests for my ViewModel"
→ Activates: swiftui-testing

"My list is scrolling slowly"
→ Activates: swift-performance
```

## Covered Topics

### SwiftUI (iOS 17+/26)
- @Observable, @State, @Binding, @Environment
- NavigationStack, NavigationSplitView
- Custom ViewModifiers
- Lazy containers (LazyVStack, LazyVGrid)
- Accessibility (VoiceOver, Dynamic Type)

### Swift 6 Concurrency
- async/await patterns
- Actor isolation
- Sendable conformance
- @MainActor usage
- Task groups and cancellation

### Data Persistence
- SwiftData models and queries
- CloudKit synchronization
- Core Data (legacy support)
- Keychain for sensitive data

### All Apple Platforms
- iOS: Standard patterns
- macOS: Menu bar, windows, commands
- iPadOS: Split views, keyboard
- watchOS: Complications, HealthKit
- visionOS: Spatial computing, RealityKit

## Version

- **Plugin**: 1.0.0
- **Swift**: 6.0+
- **iOS**: 17.0+ (SwiftData), 26.0 (latest features)
- **Xcode**: 16.0+

## Author

Bruno Azoulay

## License

MIT
