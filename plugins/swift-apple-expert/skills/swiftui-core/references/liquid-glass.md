---
name: liquid-glass
description: Liquid Glass design system for iOS 26, macOS 26, iPadOS 26, visionOS 26, tvOS 26, watchOS 26
when-to-use: implementing translucent UI, glass effects, modern Apple design language, platform-specific adaptations
keywords: Liquid Glass, glassmorphism, translucency, lensing, iOS 26, macOS 26, visionOS 26
priority: high
related: views-modifiers.md, navigation.md
---

# Liquid Glass Design System (2026)

## Concept

Liquid Glass uses **light lensing** (not blur) for translucency. Content behind glass remains visible with dynamic color reflection.

---

## API Reference

### Basic Usage

```swift
MyView()
    .glassEffect(.regular)                  // Standard glass
    .glassEffect(.regular.interactive)      // Responds to touch
    .glassEffect(.prominent)                // Stronger emphasis
    .glassEffect(.regular, in: .capsule)    // Custom shape
```

### Glass Options

```swift
Glass.regular                    // Default translucency
Glass.prominent                  // More visible
Glass.regular.interactive        // Touch feedback
```

### Morphing Container

```swift
GlassEffectContainer {
    ForEach(items) { item in
        ItemView(item).glassEffect(.regular, in: .capsule)
    }
}
```

### UIKit Integration

```swift
// UIButton with glass style
let config = UIButton.Configuration.glass()
let button = UIButton(configuration: config)

// SwiftUI buttonStyle
Button("Action") { }
    .buttonStyle(.glass)
```

### Automatic Application

Xcode 26 recompile automatically applies to:
- NavigationBar, TabBar, Toolbar
- Sheets, Popovers, Menus, Alerts
- Search bars, Controls (during interaction)

---

## Platform Examples

### iOS 26 - TabBar

```swift
TabView {
    ContentView()
        .tabBarMinimizingBehavior(.automatic)
}
.tabBarAccessory { HStack { Button("Filter") { } } }
```

### macOS 26 - Toolbar

```swift
WindowGroup {
    ContentView()
        .toolbar { ToolbarItem { Button("Action") { } } }
}
.windowStyle(.hiddenTitleBar)
.windowToolbarStyle(.unified)
```

### iPadOS 26 - Split View

```swift
NavigationSplitView {
    Sidebar().glassEffect(.regular)
} detail: {
    DetailView()
}
```

### visionOS 26 - Spatial

```swift
WindowGroup {
    ContentView()
        .glassBackgroundEffect()  // visionOS-specific
}
```

### watchOS & tvOS 26

```swift
// watchOS: NavigationStack automatically applies glass
NavigationStack { List { } }

// tvOS: Focus-aware buttons
Button("Play") { }
    .buttonStyle(.bordered)
    .glassEffect(.regular)
```

---

## Best Practices

- ✅ Let system apply automatically
- ✅ Use `.prominent` sparingly
- ✅ Test light/dark modes
- ✅ Ensure text contrast
- ❌ Don't stack glass layers
- ❌ Don't overuse (performance)
