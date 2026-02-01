---
name: adaptive-layouts
description: iPadOS adaptive layouts with size classes, split views, and responsive design
when-to-use: building responsive iPad UI, adapting to different iPad sizes, supporting multitasking modes
keywords: sizeClass, horizontalSizeClass, NavigationSplitView, adaptive, responsive
priority: high
related: keyboard-shortcuts.md, multitasking.md
---

# iPadOS Adaptive Layouts

## When to Use

- Building iPad-optimized interfaces
- Supporting all iPad sizes
- Adapting to multitasking modes
- Responsive design for Split View

## Key Concepts

### Size Classes
Environment values indicating available space.

**Values:**
- `compact` - Limited space (iPhone, iPad slide-over)
- `regular` - Full space (iPad full screen, Mac)

**Key Points:**
- Use `@Environment(\.horizontalSizeClass)`
- Also `verticalSizeClass` available
- Changes during multitasking

### NavigationSplitView
Multi-column navigation for iPad.

**Key Points:**
- 2 or 3 column layouts
- Automatic adaptation to size class
- `columnVisibility` for control
- Collapses on compact width

### Adaptive Containers

| Container | Behavior |
|-----------|----------|
| NavigationSplitView | Multi-column |
| ViewThatFits | Automatic selection |
| GeometryReader | Size-based logic |
| ContainerRelativeFrame | Proportional sizing |

### Responsive Patterns

**Adaptive Column Count:**
- Regular: 3-4 columns in grid
- Compact: 2 columns or list

**Sidebar Visibility:**
- Regular: Always visible
- Compact: Hidden, slide in

---

## Size Class Detection

```swift
@Environment(\.horizontalSizeClass) var sizeClass

var body: some View {
    if sizeClass == .compact {
        // iPhone / iPad slide-over
        CompactLayout()
    } else {
        // iPad full / Mac
        RegularLayout()
    }
}
```

---

## Best Practices

- ✅ Test all size class combinations
- ✅ Use NavigationSplitView for iPad
- ✅ Provide different layouts per size
- ✅ Consider landscape and portrait
- ✅ Test in Split View modes
- ❌ Don't assume fixed dimensions
- ❌ Don't ignore compact width on iPad
- ❌ Don't hardcode column counts
