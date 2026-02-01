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

New design language with translucent materials.

**Key Points:**
- Toolbars automatically adopt glass style
- Use `.liquidGlassEffect()` for custom views
- Navigation bars have new appearance
- Tab bars adapt to scroll position

→ See `templates/view-structure.md` for code examples
