---
name: multitasking
description: iPadOS multitasking with Slide Over, Split View, Stage Manager, and multi-window support
when-to-use: supporting iPad multitasking modes, multi-window apps, Stage Manager compatibility
keywords: multitasking, Split View, Slide Over, Stage Manager, multi-window, UIScene
priority: high
requires: adaptive-layouts.md
related: keyboard-shortcuts.md
---

# iPadOS Multitasking

## When to Use

- Supporting Split View
- Enabling Slide Over
- Stage Manager compatibility
- Multi-window applications
- External display support

## Key Concepts

### Multitasking Modes

| Mode | Description | Size Class |
|------|-------------|------------|
| Full Screen | Single app | Regular |
| Split View | Two apps side-by-side | Regular or Compact |
| Slide Over | Floating narrow window | Compact |
| Stage Manager | Multiple resizable windows | Varies |

### Size Class Changes
App receives compact/regular based on window size.

**Key Points:**
- Monitor `horizontalSizeClass`
- Adapt UI dynamically
- Don't assume full screen

### Multi-Window Support
Allow multiple app instances.

**SwiftUI:**
- Use `WindowGroup` for multi-instance
- `@Environment(\.openWindow)` to open new
- Each window has independent state

### Stage Manager (iPadOS 16+)
Desktop-like window management.

**Key Points:**
- Resizable windows
- Overlapping windows
- External display support
- Works with Split View too

### External Display
Extend to external monitor.

**Key Points:**
- Separate window content possible
- Different resolution
- UIScreen.screens for detection

---

## Implementation

### Enable Multi-Window

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        // Multiple WindowGroups for different window types
        WindowGroup("Detail", for: Item.self) { $item in
            DetailView(item: item)
        }
    }
}
```

### Open New Window

```swift
@Environment(\.openWindow) var openWindow

Button("Open Detail") {
    openWindow(value: selectedItem)
}
```

---

## Best Practices

- ✅ Support all multitasking modes
- ✅ Adapt to size class changes
- ✅ Test in Split View and Slide Over
- ✅ Support window state restoration
- ✅ Handle external display gracefully
- ❌ Don't assume single window
- ❌ Don't require full screen
- ❌ Don't break in compact width
