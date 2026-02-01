---
name: debugging
description: XcodeBuildMCP debugging tools - LLDB attach, breakpoints, stack traces, variable inspection
when-to-use: debugging app behavior, setting breakpoints, inspecting state, crash investigation
keywords: debug, LLDB, breakpoint, stack, variables, attach, debugging
priority: medium
requires: simulator-tools.md
related: ui-automation.md
---

# iOS Debugging

## When to Use

- Investigating unexpected behavior
- Setting breakpoints programmatically
- Inspecting variables at runtime
- Understanding crash causes
- Complex debugging scenarios

## Available MCP Tools

### debug_attach_sim
Connect LLDB debugger to running app.

**Parameters:**
- `bundleId` - App bundle identifier
- `udid` - Simulator UDID

**Use when:**
- Starting debug session
- Attaching to running app

### debug_breakpoint_add
Set breakpoint at location.

**Parameters:**
- `location` - File:line or function name

**Use when:**
- Pausing at specific code
- Investigating code paths

### debug_breakpoint_remove
Remove existing breakpoint.

**Parameters:**
- `breakpointId` - Breakpoint to remove

**Use when:**
- Cleaning up breakpoints
- Changing debug focus

### debug_continue
Resume execution after breakpoint.

**Use when:**
- Continuing after inspection
- Stepping through code

### debug_stack
Display call stack / backtrace.

**Use when:**
- Understanding call flow
- Crash investigation

### debug_variables
Inspect variables in current frame.

**Use when:**
- Checking state
- Finding unexpected values

### debug_lldb_command
Execute arbitrary LLDB command.

**Parameters:**
- `command` - LLDB command string

**Use when:**
- Advanced debugging
- Custom LLDB commands

### debug_detach
Disconnect debugger.

**Use when:**
- Ending debug session
- Letting app run freely

---

## Workflow: Debug Session

1. `launch_app_sim` - Start app
2. `debug_attach_sim` - Connect debugger
3. `debug_breakpoint_add` - Set breakpoint
4. Trigger breakpoint in app
5. `debug_stack` - Check call stack
6. `debug_variables` - Inspect state
7. `debug_continue` - Resume
8. `debug_detach` - End session

---

## Common LLDB Commands

| Command | Purpose |
|---------|---------|
| `po <expr>` | Print object description |
| `p <var>` | Print variable value |
| `bt` | Backtrace |
| `frame variable` | All local variables |
| `expression <expr>` | Evaluate expression |

---

## Best Practices

- ✅ Attach early in investigation
- ✅ Use descriptive breakpoint locations
- ✅ Check stack trace first
- ✅ Inspect relevant variables
- ❌ Don't leave breakpoints active
- ❌ Don't debug release builds
