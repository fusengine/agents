---
name: keyboard-shortcuts
description: iPadOS external keyboard support with keyboard shortcuts, focus system, hardware keyboard handling
when-to-use: supporting external keyboards, adding keyboard shortcuts, implementing focus navigation
keywords: keyboardShortcut, keyboard, focus, focusable, shortcuts, hardware keyboard
priority: high
related: adaptive-layouts.md, multitasking.md
---

# iPadOS Keyboard Shortcuts

## When to Use

- Supporting Magic Keyboard
- Adding productivity shortcuts
- Implementing focus navigation
- Power user features

## Key Concepts

### .keyboardShortcut Modifier
Add keyboard shortcuts to actions.

**Key Points:**
- Apply to buttons and controls
- Use standard key combinations
- Show in discoverability overlay (hold ⌘)
- Localized automatically

### Standard Shortcuts

| Shortcut | Action | Modifier |
|----------|--------|----------|
| ⌘N | New | .command |
| ⌘S | Save | .command |
| ⌘F | Find | .command |
| ⌘, | Settings | .command |
| ⌘⇧N | New window | .command + .shift |
| ⌘⌥S | Save as | .command + .option |

### Focus System
Keyboard-driven navigation.

**Key Points:**
- `.focusable()` makes view focusable
- `.focused($focusState)` tracks focus
- Arrow keys navigate
- Enter/Space activates

### Discoverability Overlay
Shows available shortcuts when holding ⌘.

**Key Points:**
- Automatically populated
- Shows custom shortcuts
- Essential for discoverability

---

## Implementation Pattern

```swift
Button("Save") {
    save()
}
.keyboardShortcut("s", modifiers: .command)

// Focus navigation
@FocusState private var focused: Field?

TextField("Name", text: $name)
    .focused($focused, equals: .name)
    .onSubmit { focused = .email }
```

---

## Best Practices

- ✅ Support standard ⌘ shortcuts
- ✅ Use .defaultAction for primary action
- ✅ Implement focus navigation
- ✅ Test with physical keyboard
- ✅ Support Tab key navigation
- ❌ Don't override system shortcuts
- ❌ Don't require mouse/touch only
- ❌ Don't forget escape key handling
