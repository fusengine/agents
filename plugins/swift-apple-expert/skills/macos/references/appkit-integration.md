---
name: appkit-integration
description: AppKit integration in SwiftUI with NSViewRepresentable, menus, toolbars
when-to-use: using AppKit views in SwiftUI, accessing macOS-specific features, custom menus
keywords: NSViewRepresentable, NSViewControllerRepresentable, AppKit, NSMenu, NSToolbar
priority: medium
related: app-structure.md
---

# AppKit Integration

## When to Use

- AppKit-only components
- Advanced text editing (NSTextView)
- Custom menu implementations
- Complex toolbar configurations
- Drag and drop operations
- macOS-specific features

## Key Concepts

### NSViewRepresentable
Wrap AppKit views for SwiftUI.

**Required Methods:**
- `makeNSView(context:)` - Create AppKit view
- `updateNSView(_:context:)` - Update from SwiftUI

**Key Points:**
- Similar to UIViewRepresentable
- Context provides coordinator
- Handle AppKit delegate patterns

### NSViewControllerRepresentable
Wrap AppKit view controllers.

**Required Methods:**
- `makeNSViewController(context:)`
- `updateNSViewController(_:context:)`

**Use when:**
- Full view controllers needed
- Complex AppKit features

### Coordinator Pattern
Bridge AppKit delegates to SwiftUI.

**Key Points:**
- Same pattern as UIKit
- Handle NSTextViewDelegate, etc.
- Communicate via bindings

---

## Common AppKit Wrappers

| Component | Purpose |
|-----------|---------|
| NSTextView | Rich text editing |
| NSTableView | Complex tables |
| NSOutlineView | Tree structures |
| NSColorWell | Color picker |
| NSSplitView | Resizable panes |

---

## Menu Customization

SwiftUI commands for most cases. AppKit for advanced:

**SwiftUI Commands:**
- `CommandGroup` - Modify existing
- `CommandMenu` - Add new menu
- `.keyboardShortcut()` - Hotkeys

**AppKit Menus (advanced):**
- `NSMenu` for dynamic menus
- `NSMenuItem` for custom items
- Contextual menus

---

## Best Practices

- ✅ Check SwiftUI equivalent first
- ✅ Use Coordinator for delegates
- ✅ Keep wrappers minimal
- ✅ Handle AppKit memory management
- ❌ Don't mix paradigms unnecessarily
- ❌ Don't ignore SwiftUI alternatives
