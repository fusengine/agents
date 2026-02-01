---
name: navigation
description: SwiftUI navigation with NavigationStack, NavigationSplitView, deep linking, programmatic routing
when-to-use: building navigation flows, handling deep links, implementing tabs, creating multi-column layouts
keywords: NavigationStack, NavigationSplitView, NavigationPath, TabView, deep link, routing
priority: high
requires: views-modifiers.md
related: state-management.md
---

# SwiftUI Navigation

## When to Use

- Building stack-based navigation (iPhone)
- Creating multi-column layouts (iPad/Mac)
- Implementing deep linking
- Programmatic navigation control
- Tab-based app structure

## Key Concepts

### NavigationStack (iOS 16+)
Modern stack-based navigation with type-safe routing.

**Key Points:**
- Use `NavigationPath` for programmatic control
- `navigationDestination(for:)` maps types to views
- Supports encoding/decoding for state restoration
- Replaces deprecated NavigationView

### NavigationSplitView (iOS 16+)
Multi-column navigation for iPad and Mac.

**Key Points:**
- Sidebar + Detail (2 columns)
- Sidebar + Content + Detail (3 columns)
- `columnVisibility` controls column display
- Automatic adaptation on iPhone

### Type-Safe Routing
Use enums for compile-time safe navigation.

**Key Points:**
- Define `enum Route: Hashable`
- Switch on route in destination
- Codable for state restoration
- Single source of truth for navigation

### Deep Linking
Handle URLs to navigate to specific content.

**Key Points:**
- `.onOpenURL { url in }` modifier
- Parse URL into Route enum
- Set NavigationPath from parsed routes
- Register URL scheme in Info.plist

### TabView
Top-level tab-based navigation.

**Key Points:**
- Each tab has its own NavigationStack
- Use `@State` for selected tab
- Programmatic tab switching
- Badge support with `.badge()`

---

## Navigation Architecture

| Pattern | Use Case |
|---------|----------|
| NavigationStack | iPhone, simple flows |
| NavigationSplitView | iPad, Mac, complex apps |
| TabView + NavigationStack | Tab-based apps |
| Router class | Complex navigation logic |

---

## Best Practices

- ✅ Use NavigationStack (not NavigationView)
- ✅ Define routes as Hashable enum
- ✅ Keep navigation state in one place
- ✅ Make routes Codable for restoration
- ✅ Test deep links thoroughly
- ❌ Don't nest NavigationStacks
- ❌ Don't use NavigationLink without value
- ❌ Don't hardcode navigation paths

---

## iOS 26 Changes

- `NavigationStack` title uses Liquid Glass
- Tab bar adapts to scroll position
- New transition animations
- Improved deep link handling

---

## Matched Geometry Effect

Animate shared elements between views.

### @Namespace

```swift
struct ContentView: View {
    @Namespace private var animation

    var body: some View {
        CardView()
            .matchedGeometryEffect(id: "card", in: animation)
    }
}
```

### Navigation Transitions (iOS 26)

```swift
NavigationLink {
    DetailView()
        .navigationTransition(.zoom(sourceID: "card", in: animation))
} label: {
    CardView()
        .matchedGeometryEffect(id: "card", in: animation)
}

// Other transitions
.navigationTransition(.slide(axis: .horizontal))
.navigationTransition(.zoom, interactivity: .pan)
```

→ See `templates/navigation-stack.md` for code examples
