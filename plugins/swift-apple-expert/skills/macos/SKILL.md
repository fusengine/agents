---
name: macos
description: Use when building Mac apps — menu bar extras, window management, AppKit integration, or notarized distribution outside the App Store.
versions:
  macos: 26
  xcode: 26
user-invocable: false
references: references/app-structure.md, references/build-tools.md, references/appkit-integration.md, references/notarization.md
related-skills: swift-core, swiftui-core, mcp-tools, build-distribution
---

<objective>
Covers macOS-specific development: menu bar apps via MenuBarExtra, multi-window application management, keyboard shortcuts and menus, AppKit integration (NSViewRepresentable) inside SwiftUI, and notarization for distribution outside the Mac App Store.

Lists the XcodeBuildMCP tools for macOS builds (build_macos, build_run_macos, test_macos, launch_mac_app, stop_mac_app) and references for app structure (MenuBarExtra, Settings, Windows), build tooling, AppKit bridging, and code-signing/notarization.

Best practices: support keyboard shortcuts for power users, use MenuBarExtra for utility apps, use WindowGroup/Window for multi-window apps and Settings for the preferences scene, notarize before distributing outside the App Store, and enable sandboxing for App Store submissions.
</objective>

# macOS Platform

macOS-specific development with window management and distribution tools.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing macOS patterns
2. **fuse-ai-pilot:research-expert** - Verify latest macOS 26 docs via Context7/Exa
3. **mcp__XcodeBuildMCP__build_macos** - Build for macOS validation

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building Mac desktop applications
- Creating menu bar apps (MenuBarExtra)
- Multi-window applications
- Keyboard shortcuts and menus
- Notarization for distribution
- AppKit integration

### Why macOS Skill

| Feature | Benefit |
|---------|---------|
| MenuBarExtra | Background utility apps |
| Window management | Multi-window support |
| Keyboard shortcuts | Power user productivity |
| Notarization | Gatekeeper-safe distribution |

---

## MCP Tools Available

### Build Tools
- `build_macos` - Build for macOS
- `build_run_macos` - Build and launch
- `test_macos` - Run macOS tests
- `launch_mac_app` - Start built app
- `stop_mac_app` - Terminate app

---

## Reference Guide

| Need | Reference |
|------|-----------|
| MenuBarExtra, Settings, Windows | [app-structure.md](references/app-structure.md) |
| XcodeBuildMCP macOS tools | [build-tools.md](references/build-tools.md) |
| NSViewRepresentable, menus | [appkit-integration.md](references/appkit-integration.md) |
| Code signing, notarization | [notarization.md](references/notarization.md) |

---

## Best Practices

1. **Keyboard shortcuts** - Support power users
2. **Menu bar integration** - For utility apps
3. **Multiple windows** - Use WindowGroup/Window
4. **Settings window** - Use Settings scene
5. **Notarization** - Required for distribution
6. **Sandbox** - Enable for App Store
