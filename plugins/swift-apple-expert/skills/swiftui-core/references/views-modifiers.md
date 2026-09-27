---
name: views-modifiers
description: SwiftUI views, custom components, view modifiers, layouts, @ViewBuilder
when-to-use: creating UI components, implementing layouts, building reusable modifiers, designing view hierarchies
keywords: View, ViewBuilder, ViewModifier, LazyVStack, LazyHStack, Grid, layout
priority: high
related: navigation.md, state-management.md
---

# SwiftUI Views & Modifiers

## When to Use

- Creating new UI components
- Building responsive layouts
- Implementing custom view modifiers
- Designing reusable view hierarchies
- Adapting to different screen sizes

## Key Concepts

### View Protocol
Everything visible is a View. Views are structs (value types).

**Key Points:**
- Implement `var body: some View`
- Views should be lightweight
- Extract subviews at 30+ lines
- Use `@ViewBuilder` for conditional content

### View Structure Pattern
Organize views with clear sections.

**Sections:**
1. **State** - @State, @Binding properties
2. **Environment** - @Environment values
3. **Body** - Main view content
4. **Subviews** - @ViewBuilder computed properties
5. **Actions** - Private methods

### Custom ViewModifier
Reusable styling and behavior bundles.

**Key Points:**
- Implement `ViewModifier` protocol
- Create extension on `View` for fluent API
- Combine multiple modifiers into one
- Good for consistent styling

### Layout Types

| Type | Use Case |
|------|----------|
| VStack/HStack | Simple linear layouts |
| LazyVStack/LazyHStack | Long scrolling lists |
| LazyVGrid/LazyHGrid | Grid layouts |
| GeometryReader | Size-dependent layouts |
| ViewThatFits | Adaptive layouts |

### Responsive Layouts
Adapt to different screen sizes and orientations.

**Key Points:**
- Use `@Environment(\.horizontalSizeClass)` for device adaptation
- `ViewThatFits` for automatic layout selection
- `containerRelativeFrame` for proportional sizing

---

## Best Practices

- ✅ Extract subviews at 30+ lines
- ✅ Use `some View` return type (opaque)
- ✅ Prefer composition over inheritance
- ✅ Use semantic colors (.primary, .secondary)
- ✅ Add `.accessibilityLabel()` to icons
- ✅ Always include `#Preview`
- ❌ Don't use GeometryReader unnecessarily
- ❌ Don't nest ScrollViews
- ❌ Don't do heavy work in body

---

## iOS 26 Liquid Glass

New design language using light lensing (not blur).

### Automatic Application (Xcode 26 recompile)
- NavigationBar, TabBar, Toolbar
- Sheets, Popovers, Menus, Alerts
- Search bars, Controls (during interaction)

### Manual API
```swift
MyView()
    .glassEffect()                          // .regular (default)
    .glassEffect(.clear)                    // Variants: .regular, .clear, .identity
    .glassEffect(.regular.interactive(), in: .capsule) // Custom shape
```

### TabBar iOS 26
```swift
TabView {
    Tab("Home", systemImage: "house") { HomeView() }
    Tab(role: .search) { SearchView() }     // Search tab replaces bar with field
}
.tabBarMinimizeBehavior(.onScrollDown)      // .automatic, .never, .onScrollDown, .onScrollUp
.tabViewBottomAccessory { NowPlayingBar() }
```

### View Transitions
```swift
// Combined transitions
.transition(.move(edge: .bottom).combined(with: .opacity))

// Navigation with zoom
.navigationTransition(.zoom(sourceID: "card", in: animation))
```

### Design Principles
1. **Layering** - Content under glass remains visible
2. **Depth** - Visual hierarchy via translucency
3. **Responsiveness** - Glass reacts to interactions
4. **Adaptivity** - Automatic light/dark mode

---

## iOS 27 Additions (Xcode 27)

| API | Purpose |
|-----|---------|
| `ContentBuilder` | Unified result builder replacing type-specific builders (`ToolbarContentBuilder`, `CommandsBuilder`) |
| `.reorderable()` + `.reorderContainer(for:isEnabled:move:)` | Drag-to-reorder in lists, stacks, grids, custom layouts |
| `.swipeActions(edge:allowsFullSwipe:content:onPresentationChanged:)` + `.swipeActionsContainer()` | Swipe actions outside `List` |
| `.visibilityPriority(_:)` on `ToolbarContent` | Keep key toolbar items visible as space shrinks |
| `ToolbarOverflowMenu` | Send secondary toolbar actions straight to overflow |
| `.topBarPinnedTrailing` placement | Pin a toolbar item to the trailing top-bar edge |
| `.toolbarMinimizationBehavior(_:for:)` | Control toolbar minimization on scroll |
| `.asyncImageURLSession(_:)` | Custom `URLSession` (caching) for `AsyncImage` |
| `Tab(role: .prominent)` | Separate trailing tab in the tab bar |

Source: developer.apple.com/documentation/updates/swiftui (June 2026).

→ See `templates/view-structure.md` for code examples
