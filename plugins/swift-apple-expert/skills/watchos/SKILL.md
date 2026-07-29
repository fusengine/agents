---
name: watchos
description: Use when building Apple Watch apps — complications, workouts, HealthKit, or iPhone-Watch connectivity.
versions:
  watchos: 26
user-invocable: false
references: references/complications.md, references/workouts.md, references/watch-connectivity.md
related-skills: swift-core, swiftui-core, ios, mcp-tools
---

<objective>
Covers watchOS-specific development for Apple Watch: watch-face complications for glanceable data, workout sessions and fitness tracking, HealthKit access to health metrics, and Watch Connectivity for iPhone-Watch sync.

Includes design considerations specific to the platform — small display with large touch targets, glanceable information with minimal text, Digital Crown scrolling/input, Force Touch on older watches, swipe/tap gestures, and battery-conscious background work.

Best practices: keep information glanceable, use large tap targets, minimize text input, drive watch-face updates through complications, use efficient background refresh, and always validate on real hardware since the simulator behaves differently.
</objective>

# watchOS Platform

watchOS-specific development for Apple Watch experiences.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing watchOS patterns
2. **fuse-ai-pilot:research-expert** - Verify latest watchOS 26 docs via Context7/Exa
3. **mcp__apple-docs__search_apple_docs** - Check watchOS patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building Apple Watch apps
- Creating watch face complications
- Workout and fitness tracking
- Health data access (HealthKit)
- iPhone-Watch communication

### Why watchOS Skill

| Feature | Benefit |
|---------|---------|
| Complications | Glanceable data on watch face |
| Workouts | Fitness and health tracking |
| HealthKit | Access health metrics |
| Connectivity | Sync with iPhone |

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Watch face complications | [complications.md](references/complications.md) |
| Workout sessions, HealthKit | [workouts.md](references/workouts.md) |
| iPhone ↔ Watch sync | [watch-connectivity.md](references/watch-connectivity.md) |

---

## Design Considerations

### Screen Size
- Small display, large touch targets
- Glanceable information
- Minimal text, clear icons

### Interactions
- Digital Crown for scrolling/input
- Force Touch (older watches)
- Gestures: swipe, tap

### Battery
- Minimize background work
- Use complications for updates
- Efficient data transfer

---

## Best Practices

1. **Glanceable** - Quick information access
2. **Large targets** - Easy tapping
3. **Minimal input** - Reduce typing
4. **Complications** - Update watch face data
5. **Background refresh** - Efficient updates
6. **Test on device** - Simulator differs from hardware
