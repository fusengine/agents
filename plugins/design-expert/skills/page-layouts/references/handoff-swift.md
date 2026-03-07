---
name: handoff-swift
description: Complete token-to-SwiftUI mapping for design handoff. Use when swift-expert implements a design-system.md identity.
related: framework-integration.md, design-system-template.md
---

## Color Tokens → SwiftUI

| Design Token | SwiftUI Equivalent | Notes |
|---|---|---|
| `--color-primary` | `Color("Primary")` | Asset Catalog, sRGB values |
| `--color-secondary` | `Color("Secondary")` | Asset Catalog |
| `--color-surface` | `Color(.systemBackground)` | Adaptive system color |
| `--color-surface-raised` | `Color(.secondarySystemBackground)` | Cards, sheets |
| `--color-text` | `Color(.label)` | Adaptive system color |
| `--color-text-muted` | `Color(.secondaryLabel)` | Subtitles, hints |
| `--color-border` | `Color(.separator)` | Dividers |
| `--color-accent` | `Color.accentColor` | Tint color |

**OKLCH**: Convert to sRGB at design time. Store hex values in Asset Catalog with Any/Dark appearances.
**Dark mode**: Use Asset Catalog appearances or `.preferredColorScheme(.dark)` for previews.

---

## Spacing Tokens → SwiftUI

| Token | Value | SwiftUI Usage |
|---|---|---|
| `--space-xs` | 4pt | `.padding(4)` / `Spacer().frame(height: 4)` |
| `--space-sm` | 8pt | `.padding(8)` / `.spacing(8)` |
| `--space-md` | 16pt | `.padding(16)` / `.padding(.horizontal, 16)` |
| `--space-lg` | 24pt | `.padding(24)` |
| `--space-xl` | 32pt | `.padding(32)` |
| `--space-xxl` | 48pt | `.padding(48)` |

**Pattern**: Define a namespace enum for type-safe usage:
```swift
enum DS {
    enum Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }
}
```

---

## Typography → SwiftUI

| Design Token | SwiftUI Equivalent | Notes |
|---|---|---|
| `--font-display` | `.font(.custom("FontName", size: 32))` | Custom font, registered in Info.plist |
| `--font-heading` | `.font(.custom("FontName", size: 24))` | |
| `--font-body` | `.font(.custom("FontName", size: 16))` | Fallback: `.font(.body)` |
| `--font-caption` | `.font(.caption)` | System fallback |
| `--font-mono` | `.font(.system(.body, design: .monospaced))` | |
| Fluid scaling | `@ScaledMetric var size: CGFloat = 16` | Respects Dynamic Type |

---

## Motion → SwiftUI

| Framer Motion | SwiftUI Equivalent |
|---|---|
| `transition={{ duration: 0.15 }}` | `withAnimation(.easeOut(duration: 0.15))` |
| `transition={{ duration: 0.25 }}` | `withAnimation(.easeInOut(duration: 0.25))` |
| `transition={{ duration: 0.4 }}` | `withAnimation(.smooth)` |
| `spring={{ stiffness: 200, damping: 20 }}` | `.spring(response: 0.35, dampingFraction: 0.7)` |
| `spring={{ stiffness: 100, damping: 15 }}` | `.spring(response: 0.6, dampingFraction: 0.65)` |
| `whileHover={{ scale: 1.05 }}` | `.scaleEffect(isHovered ? 1.05 : 1).onHover { isHovered = $0 }` |
| `whileTap={{ scale: 0.97 }}` | `.scaleEffect(isPressed ? 0.97 : 1)` via `@GestureState` |
| `AnimatePresence` + `exit` | `if condition { view.transition(.opacity) }` inside `withAnimation` |

**Motion token presets (iOS 17+)**:
- `micro` (0.15s) → `.snappy`
- `fast` (0.25s) → `.smooth` with short duration
- `standard` (0.4s) → `.smooth`
- `dramatic` (0.6s) → `.spring(response: 0.6, dampingFraction: 0.65)`

---

## Component Mapping

| shadcn/ui | SwiftUI Native |
|---|---|
| `Button` | `Button` + `.buttonStyle(.borderedProminent)` |
| `Card` | `GroupBox` or `VStack` with `.background(.secondarySystemBackground).cornerRadius(12)` |
| `Dialog` / `AlertDialog` | `.sheet(isPresented:)` / `.alert(_:isPresented:)` |
| `Input` / `Textarea` | `TextField` / `TextEditor` |
| `Select` | `Picker` + `.pickerStyle(.menu)` |
| `Switch` | `Toggle` |
| `Slider` | `Slider` |
| `Toast` | Custom `.overlay` at ZStack root or third-party |
| `DataTable` | `List` + `ForEach` |
| `Tabs` | `TabView` + `.tabViewStyle(.page)` or custom |
| `Command` palette | `.searchable` + `List` filtered results |
| `Sidebar` | `NavigationSplitView` (iOS 16+) |
| `Badge` | `Text` + `.background(.tint).clipShape(Capsule())` |
| `Separator` | `Divider()` |

---

## Responsive → SwiftUI

| Concept | SwiftUI Equivalent |
|---|---|
| Mobile breakpoint | `@Environment(\.horizontalSizeClass) == .compact` |
| Tablet/desktop | `@Environment(\.horizontalSizeClass) == .regular` |
| Custom breakpoints | `GeometryReader { geo in if geo.size.width > 768 { ... } }` |
| Adaptive layout | `ViewThatFits` (iOS 16+) — prefers first view that fits |
| Safe areas | `.ignoresSafeArea()` / `.safeAreaInset(edge:)` |
