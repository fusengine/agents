---
name: app-structure
description: macOS app structure with MenuBarExtra, Settings, WindowGroup, commands, keyboard shortcuts
when-to-use: building Mac apps, creating menu bar extras, implementing settings windows, adding keyboard shortcuts
keywords: MenuBarExtra, Settings, WindowGroup, commands, keyboard shortcuts, Scene
priority: high
related: build-tools.md, appkit-integration.md
---

# macOS App Structure

## When to Use

- Creating Mac desktop applications
- Building menu bar utilities
- Implementing settings/preferences
- Adding keyboard shortcuts
- Managing multiple windows

## Key Concepts

### Scene Types

| Scene | Purpose |
|-------|---------|
| WindowGroup | Standard document/window |
| Window | Single-instance window |
| Settings | Preferences window |
| MenuBarExtra | Menu bar icon app |
| DocumentGroup | Document-based apps |

### MenuBarExtra
Background utility apps in menu bar.

**Key Points:**
- Lives in menu bar, no dock icon
- `.menuBarExtraStyle(.window)` for popover content
- `.menuBarExtraStyle(.menu)` for simple menu
- Combine with WindowGroup for hybrid apps

### Settings Scene
Standard macOS preferences window.

**Key Points:**
- Opens with ⌘, shortcut
- Automatic window management
- Use TabView for categories
- Persists state automatically

### Commands
Menu bar commands and keyboard shortcuts.

**Key Points:**
- `CommandGroup` to modify existing menus
- `CommandMenu` for new menus
- `.keyboardShortcut()` for hotkeys
- Access via .commands {} modifier

### Window Management

**Modifiers:**
- `.windowStyle(.hiddenTitleBar)` - Borderless
- `.windowToolbarStyle(.unified)` - Modern toolbar
- `.defaultSize(width:height:)` - Initial size
- `.defaultPosition(.center)` - Initial position

---

## App Structure Pattern

```swift
@main
struct MacApp: App {
    var body: some Scene {
        // Main window
        WindowGroup {
            ContentView()
        }
        .commands { AppCommands() }

        // Menu bar
        MenuBarExtra("Status", systemImage: "star") {
            MenuBarContent()
        }
        .menuBarExtraStyle(.window)

        // Settings
        Settings {
            SettingsView()
        }
    }
}
```

---

## Best Practices

- ✅ Support standard keyboard shortcuts
- ✅ Use Settings scene for preferences
- ✅ Add Help menu with documentation
- ✅ Support window state restoration
- ✅ Use appropriate window style
- ❌ Don't require mouse for all actions
- ❌ Don't ignore menu bar conventions
- ❌ Don't forget ⌘Q to quit
