---
name: build-tools
description: XcodeBuildMCP tools for macOS - build, run, test, launch, stop
when-to-use: building macOS apps, running tests, launching built apps
keywords: build_macos, build_run_macos, test_macos, launch_mac_app, stop_mac_app
priority: high
related: app-structure.md, notarization.md
---

# macOS Build Tools

## When to Use

- Building macOS applications
- Running macOS tests
- Launching and testing built apps
- Validating before distribution

## Available MCP Tools

### build_macos
Build app for macOS.

**Parameters:**
- `projectPath` - Path to project/workspace
- `scheme` - Build scheme name
- `configuration` - Debug/Release

**Use when:**
- Validating code changes
- Preparing for testing
- Pre-distribution build

### build_run_macos
Build and immediately launch.

**Parameters:**
- Same as build_macos

**Use when:**
- Quick iteration
- Testing changes immediately

### test_macos
Execute macOS test suite.

**Parameters:**
- `projectPath` - Project path
- `scheme` - Test scheme

**Use when:**
- Running unit tests
- CI/CD validation

### get_mac_app_path
Get built application path.

**Returns:**
- Path to .app bundle

**Use when:**
- Finding app for distribution
- Manual testing

### get_mac_bundle_id
Get app bundle identifier.

**Returns:**
- Bundle ID string

**Use when:**
- Launching by bundle ID
- Notarization

### launch_mac_app
Start built application.

**Parameters:**
- `appPath` - Path to .app
- OR `bundleId` - Bundle identifier

**Use when:**
- Testing built app
- Manual validation

### stop_mac_app
Terminate running app.

**Parameters:**
- `bundleId` - App bundle ID

**Use when:**
- Stopping test session
- Cleaning up

---

## Workflow: Build & Test

1. `discover_projs` - Find project
2. `list_schemes` - Get schemes
3. `build_macos` - Build app
4. `test_macos` - Run tests
5. `launch_mac_app` - Test manually
6. `stop_mac_app` - Clean up

---

## Best Practices

- ✅ Build in Release for distribution
- ✅ Run tests before committing
- ✅ Test on oldest supported macOS
- ✅ Use build_run_macos for iteration
- ❌ Don't skip macOS-specific tests
- ❌ Don't distribute Debug builds
