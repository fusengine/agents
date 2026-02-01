---
name: focus-system
description: tvOS focus system with @FocusState, focus guides, and focus-aware styling
when-to-use: implementing TV navigation, focus states, focus guides, focusable views
keywords: focus, FocusState, focusable, focus guide, tvOS, navigation
priority: high
related: remote-control.md, media-playback.md
---

# tvOS Focus System

## When to Use

- Navigating with Siri Remote
- Custom focus behaviors
- Focus-aware animations
- Focus guides for layout

## Key Concepts

### @FocusState

Track and control focus programmatically.

```swift
struct ContentView: View {
    @FocusState private var buttonFocused: Bool

    var body: some View {
        Button("Play") { }
            .focused($buttonFocused)
            .onChange(of: buttonFocused) { _, isFocused in
                // React to focus changes
            }
    }
}
```

### Focus-Aware Styling

```swift
Button("Item") { }
    .buttonStyle(.card)  // Automatic focus styling
    .hoverEffect(.lift)  // Lift on focus

// Custom focus style
.focusable()
.onFocusChange { focused in
    withAnimation { scale = focused ? 1.1 : 1.0 }
}
```

### Focus Sections

```swift
VStack {
    FocusSection {
        HStack { /* Top row */ }
    }
    FocusSection {
        HStack { /* Bottom row */ }
    }
}
```

### focusScope

```swift
VStack {
    // Focus stays within scope
}
.focusScope(namespace)
```

---

## Best Practices

- ✅ Use `@FocusState` for programmatic focus
- ✅ Provide clear focus indicators
- ✅ Use `FocusSection` for logical grouping
- ✅ Animate focus transitions
- ❌ Don't make unfocusable interactive elements
- ❌ Don't use small touch targets
