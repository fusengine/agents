---
name: swiftui-core
description: Use when building SwiftUI views, navigation, persistence, or state management — shared across iOS, macOS, watchOS, visionOS.
versions:
  swiftui: 6
  ios: 26
user-invocable: false
references: references/views-modifiers.md, references/navigation.md, references/data-swiftdata.md, references/state-management.md, references/liquid-glass.md, references/app-intents.md
related-skills: swift-core, solid-swift, ios, macos, ipados, watchos, visionos, tvos
---

<objective>
Covers SwiftUI fundamentals shared across all Apple platforms: composable views and modifiers, navigation (NavigationStack for stack-based flows, NavigationSplitView for multi-column layouts), data persistence with SwiftData (@Model, replacing Core Data for most cases), state management (@State for local, @Observable for shared, @Environment for injection), Liquid Glass styling, and App Intents for Siri/Shortcuts integration.

References cover views/modifiers, navigation, SwiftData, state management, Liquid Glass across platforms, and App Intents in depth.

Best practices: extract subviews once a view body exceeds ~30 lines, compose with ViewBuilder and modifiers, always include #Preview, use semantic colors (.primary/.secondary), add accessibility labels to icons, and adapt layout by size class.
</objective>

# SwiftUI Core

SwiftUI fundamentals shared across all Apple platforms.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing SwiftUI patterns
2. **fuse-ai-pilot:research-expert** - Verify latest SwiftUI docs via Context7/Exa
3. **mcp__apple-docs__search_apple_docs** - Check SwiftUI view patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building SwiftUI views and components
- Implementing navigation (NavigationStack, SplitView)
- Data persistence with SwiftData
- State management (@State, @Observable)
- Custom view modifiers and layouts

### Why SwiftUI Core

| Feature | Benefit |
|---------|---------|
| Declarative UI | Less code, automatic updates |
| Cross-platform | Same code for iOS/macOS/watchOS/visionOS |
| @Observable | Simple reactive state |
| SwiftData | Modern persistence with minimal code |

---

## Key Concepts

### Views & Modifiers
Composable UI building blocks. Extract subviews at 30+ lines.

### Navigation
NavigationStack for stack-based, NavigationSplitView for multi-column.

### SwiftData
Modern persistence with @Model. Replaces Core Data for most use cases.

### State Management
@State for local, @Observable for shared, @Environment for injection.

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Views, modifiers, layouts | [views-modifiers.md](references/views-modifiers.md) |
| NavigationStack, deep linking | [navigation.md](references/navigation.md) |
| SwiftData, @Query, CloudKit | [data-swiftdata.md](references/data-swiftdata.md) |
| @State, @Observable, Environment | [state-management.md](references/state-management.md) |
| Liquid Glass all platforms | [liquid-glass.md](references/liquid-glass.md) |
| Siri, Shortcuts, App Intents | [app-intents.md](references/app-intents.md) |

---

## Best Practices

1. **Small views** - Extract at 30+ lines
2. **Composition** - Use ViewBuilder and modifiers
3. **Preview-driven** - Always include #Preview
4. **Semantic colors** - Use .primary, .secondary
5. **Accessibility** - Add labels to icons
6. **Platform adaptation** - Check sizeClass for responsive layouts
