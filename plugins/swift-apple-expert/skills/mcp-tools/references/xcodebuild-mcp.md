---
name: xcodebuild-mcp
description: XcodeBuildMCP for Xcode project management, building, and automation
when-to-use: building projects, validating code changes, creating projects, running tests, inspecting build errors
keywords: Xcode, build, compile, project, scheme, simulator, device, clean, archive
priority: high
related: apple-docs-mcp.md
---

# XcodeBuildMCP Usage Guide

**MCP Server for Xcode project management and automation.**

Source: [XcodeBuildMCP GitHub](https://github.com/cameroncooke/XcodeBuildMCP)

---

## Installation

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "XcodeBuildMCP": {
      "command": "npx",
      "args": ["-y", "xcodebuildmcp@latest"]
    }
  }
}
```

---

## Available Tools

### 1. Discover Projects

**Purpose**: Find Xcode projects and workspaces in directory

**Use when**:
- Starting work on a project
- Finding all Xcode projects in a repository
- Identifying workspace vs project files

**Example**:
```bash
# Find all .xcodeproj and .xcworkspace files
# Returns: List of project paths
```

---

### 2. Build Operations

**Purpose**: Build Xcode project for different platforms

**Platforms**:
- macOS (Mac applications)
- iOS Simulator (testing on simulator)
- iOS Device (release builds)

**Use when**:
- Validating code changes
- Running automated builds
- Testing compilation after modifications

**Example workflow**:
```bash
1. List schemes → Choose appropriate scheme
2. Build for iOS Simulator → Check for errors
3. If errors → Fix code → Build again
```

**Key feature**: Incremental build support for lightning-fast builds (experimental, opt-in)

---

### 3. List Schemes

**Purpose**: Show available build schemes in project

**Use when**:
- Need to know which schemes exist
- Choosing correct scheme for build
- Verifying scheme configuration

**Returns**: List of scheme names (e.g., "MyApp", "MyAppTests")

---

### 4. Show Build Settings

**Purpose**: Display Xcode build configuration

**Use when**:
- Debugging build issues
- Verifying compiler flags
- Checking deployment target
- Inspecting signing configuration

**Returns**: Full build settings for scheme

---

### 5. Clean Build

**Purpose**: Remove build products and derived data

**Use when**:
- Build errors persist after code changes
- Switching between branches
- Before fresh build
- Resolving caching issues

**Equivalent to**: Product → Clean Build Folder in Xcode

---

### 6. Create Project

**Purpose**: Scaffold new iOS/macOS project from modern templates

**Features**:
- Workspace + SPM package architecture
- Customizable bundle identifiers
- Deployment targets configuration
- Device families selection

**Use when**:
- Starting new project from scratch
- Creating demo/sample projects
- Prototyping new features

---

## Best Practices

### 1. Build Validation Workflow

```bash
# MANDATORY after code changes
1. List schemes
2. Build for iOS Simulator
3. If build fails:
   a. Read error messages
   b. Fix issues
   c. Build again
4. If build succeeds:
   a. Run tests (if available)
   b. Commit changes
```

### 2. Before Committing Code

```bash
# Always validate builds before git commit
1. Clean build
2. Build for target platform
3. Check for warnings (treat as errors)
4. Commit only if zero errors
```

### 3. Error Inspection

**XcodeBuildMCP enables autonomous iteration**:
- AI can read build errors
- Identify problematic code
- Apply fixes
- Re-build to validate

---

## Integration with Swift Expert Agent

**Automatic usage when**:
- User asks to "build the project"
- After making code changes (validation)
- Creating new Xcode project
- Debugging build issues

**Priority**: Always build to validate after code modifications.

---

## Troubleshooting

### Build Fails with "Scheme not found"

```bash
1. Use "List Schemes" to see available schemes
2. Verify scheme name matches exactly
3. Check if workspace vs project is being used
```

### Incremental Build Not Working

```bash
# Opt-in required for incremental builds
# Check XcodeBuildMCP version (1.12.3+)
```

### Clean Build Needed

```bash
# Indicators:
- Strange compilation errors
- "Module not found" after adding dependency
- Stale cache warnings

# Solution: Clean build before regular build
```

---

## Version

Latest: **1.12.3** (as of January 2026)

---

## Resources

- [GitHub Repository](https://github.com/cameroncooke/XcodeBuildMCP)
- [npm Package](https://www.npmjs.com/package/xcodebuildmcp)
- [Official Website](https://www.xcodebuildmcp.com/)
