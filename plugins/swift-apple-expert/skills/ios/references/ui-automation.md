---
name: ui-automation
description: XcodeBuildMCP UI automation tools - tap, swipe, screenshot, type_text, snapshot_ui
when-to-use: automating user interactions, capturing screenshots, testing UI flows
keywords: tap, swipe, screenshot, type_text, snapshot_ui, gesture, UI automation, AXe
priority: medium
requires: simulator-tools.md
related: debugging.md
---

# iOS UI Automation

## When to Use

- Automating repetitive UI interactions
- Capturing screenshots for documentation
- Testing UI flows programmatically
- Extracting view hierarchy information
- Building automation scripts

## Prerequisites

**AXe Installation Required:**
```bash
brew tap cameroncooke/axe
brew install axe
```

## Available MCP Tools

### tap
Touch element or coordinate.

**Parameters:**
- `x`, `y` - Screen coordinates
- `duration` - Optional hold time
- `udid` - Optional simulator UDID

**Use when:**
- Simulating button taps
- Selecting elements

### long_press
Extended press at coordinates.

**Parameters:**
- `x`, `y` - Screen coordinates
- `duration` - Hold duration

**Use when:**
- Context menu triggers
- Drag initiation

### swipe
Drag between two points.

**Parameters:**
- `fromX`, `fromY` - Start position
- `toX`, `toY` - End position
- `duration` - Swipe speed

**Use when:**
- Scrolling
- Dismissing
- Page navigation

### type_text
Enter text via keyboard.

**Parameters:**
- `text` - String to type

**Use when:**
- Form filling
- Search input

### screenshot
Capture current screen.

**Parameters:**
- `savePath` - Output file path

**Use when:**
- Documenting UI
- Bug reports
- Visual testing

### snapshot_ui
Get complete view hierarchy with coordinates.

**Returns:**
- Element tree with positions
- Accessibility labels
- Frame coordinates

**Use when:**
- Finding tap coordinates
- Understanding UI structure
- Accessibility testing

### gesture
Execute predefined gestures.

**Parameters:**
- `gestureType` - swipeUp, swipeDown, pinch, etc.

**Use when:**
- Standard gestures
- Multi-finger interactions

---

## Workflow: UI Automation

1. `snapshot_ui` - Get view hierarchy
2. Find element coordinates
3. `tap` / `swipe` - Interact
4. `screenshot` - Capture result
5. Repeat as needed

---

## Best Practices

- ✅ Use snapshot_ui to find coordinates
- ✅ Add accessibility identifiers for reliability
- ✅ Screenshot before and after actions
- ✅ Use gestures for standard interactions
- ❌ Don't hardcode coordinates without snapshot_ui
- ❌ Don't assume static coordinates
