---
name: tvos
description: Use when building Apple TV apps — focus-based navigation, Siri Remote interactions, or media/video streaming UI.
versions:
  tvos: 26
user-invocable: false
references: references/focus-system.md, references/media-playback.md, references/remote-control.md
related-skills: swift-core, swiftui-core, mcp-tools
---

<objective>
Covers tvOS-specific development for the Apple TV living-room experience: the focus system for large-screen navigation, Liquid Glass styling on TV (tvOS 26), AVKit media playback, Siri Remote gesture handling, multi-user support, and game controller integration.

Includes tvOS 26 code examples for Liquid Glass buttons/tab bars and focus-state-driven scale effects.

Best practices: size UI elements to be readable from 10 feet, give clear visual focus feedback, keep navigation depth minimal, design remote-friendly gestures, optimize for media-first content, and support user switching.
</objective>

# tvOS Platform

tvOS-specific development for Apple TV living room experiences.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing tvOS patterns
2. **fuse-ai-pilot:research-expert** - Verify latest tvOS 26 docs via Context7/Exa
3. **mcp__apple-docs__search_apple_docs** - Check tvOS patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building Apple TV applications
- Video and audio streaming
- Focus-based navigation
- Siri Remote interactions
- Multi-user experiences
- Game controller support

### Why tvOS Skill

| Feature | Benefit |
|---------|---------|
| Focus system | Large screen navigation |
| Liquid Glass | Modern TV UI (tvOS 26) |
| Media playback | AVKit integration |
| Remote control | Siri Remote gestures |

---

## tvOS 26 Features

### Liquid Glass on TV

```swift
Button("Watch Now") { }
    .buttonStyle(.bordered)
    .glassEffect(.regular)  // Glass effect on focus

TabView {
    // Tab bar with Liquid Glass
}
```

### Focus System

```swift
struct ContentView: View {
    @FocusState private var focused: Bool

    var body: some View {
        Button("Play") { }
            .focused($focused)
            .scaleEffect(focused ? 1.1 : 1.0)
    }
}
```

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Focus, selection states | [focus-system.md](references/focus-system.md) |
| AVKit, video playback | [media-playback.md](references/media-playback.md) |
| Siri Remote, gestures | [remote-control.md](references/remote-control.md) |

---

## Best Practices

1. **Large UI elements** - Readable from 10 feet
2. **Focus feedback** - Clear visual indication
3. **Simple navigation** - Minimal depth
4. **Remote-friendly** - Siri Remote gestures
5. **Media-first** - Optimize for video/audio
6. **Multi-user** - Support user switching
