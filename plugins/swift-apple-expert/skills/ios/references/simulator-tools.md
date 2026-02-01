---
name: simulator-tools
description: XcodeBuildMCP tools for iOS Simulator - build, boot, launch, test, screenshot
when-to-use: building for simulator, running tests, capturing screenshots, iterating quickly
keywords: simulator, build_sim, boot_sim, launch_app_sim, test_sim, XcodeBuildMCP
priority: high
related: device-tools.md, ui-automation.md
---

# iOS Simulator Tools

## When to Use

- Building app for testing
- Running unit and UI tests
- Quick iteration during development
- Capturing screenshots for documentation
- Testing different device sizes

## Available MCP Tools

### build_sim
Build app for iOS Simulator.

**Parameters:**
- `projectPath` - Path to .xcodeproj or .xcworkspace
- `scheme` - Build scheme name
- `simulatorName` - Target simulator (e.g., "iPhone 16 Pro")

**Use when:**
- Validating code changes
- Before running tests
- After pulling changes

### boot_sim
Start an iOS Simulator instance.

**Parameters:**
- `simulatorName` or `udid` - Simulator to boot

**Use when:**
- Starting fresh simulator
- Testing specific device

### launch_app_sim
Run app in simulator.

**Parameters:**
- `bundleId` - App bundle identifier
- `simulatorName` - Target simulator

**Use when:**
- Testing app manually
- Debugging behavior

### launch_app_logs_sim
Run app with log streaming enabled.

**Parameters:**
- Same as launch_app_sim

**Use when:**
- Debugging issues
- Monitoring app behavior

### test_sim
Execute test suite in simulator.

**Parameters:**
- `projectPath` - Project path
- `scheme` - Test scheme
- `simulatorName` - Target simulator

**Use when:**
- Running unit tests
- Running UI tests
- CI/CD validation

### record_sim_video
Capture video of simulator session.

**Parameters:**
- `duration` - Recording length
- `outputPath` - Save location

**Use when:**
- Documenting flows
- Bug reproduction

---

## Workflow: Build & Test

1. `discover_projs` - Find project
2. `list_schemes` - Get available schemes
3. `build_sim` - Build for simulator
4. `boot_sim` - Start simulator
5. `launch_app_sim` - Run app
6. `test_sim` - Execute tests

---

## Best Practices

- ✅ Build before every commit
- ✅ Test on multiple simulator sizes
- ✅ Use launch_app_logs_sim for debugging
- ✅ Record videos for bug reports
- ❌ Don't skip build validation
- ❌ Don't test only on one device size
