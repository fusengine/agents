---
name: micro-interactions
description: Small interactive animations for buttons, toggles, copy actions, and loading
when-to-use: Adding hover effects, press feedback, toggle animations, loading states
keywords: micro-interaction, hover, press, toggle, copy, skeleton, button, feedback
priority: high
related: motion-principles.md, entrance-patterns.md
---

# Micro-Interactions

## Button States

### Hover + Press

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
>
  Click me
</motion.button>
```

| State | Transform | Duration | Easing |
|-------|-----------|----------|--------|
| Hover | scale: 1.02 | 150ms | spring |
| Press | scale: 0.98 | 100ms | spring |
| Focus | ring animation | 150ms | ease-out |
| Loading | spinner + disabled | - | - |

### Icon Button Hover

```tsx
<motion.button whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
  <SettingsIcon />
</motion.button>
```

## Toggle / Switch

```tsx
<motion.div
  className="toggle-track"
  animate={{ backgroundColor: isOn ? "var(--primary)" : "var(--muted)" }}
>
  <motion.div
    className="toggle-thumb"
    layout
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  />
</motion.div>
```

- Use `layout` for smooth thumb movement
- Spring easing for natural feel
- Color transition on track background

## Copy to Clipboard

```tsx
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.button onClick={() => { copy(text); setCopied(true); }}>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <CheckIcon />
          </motion.div>
        ) : (
          <motion.div key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <CopyIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
```

Sequence: Copy icon -> scale out -> checkmark scale in -> revert after 2s

## Skeleton Loading

```tsx
<motion.div
  className="skeleton"
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
/>
```

| Property | Value |
|----------|-------|
| Background | var(--muted) |
| Animation | opacity pulse (0.5 -> 1 -> 0.5) |
| Duration | 1.5s loop |
| Border radius | Match target element |

## Form Validation

| State | Animation |
|-------|-----------|
| Error shake | `x: [0, -8, 8, -8, 0]` over 300ms |
| Success | Green border fade-in, checkmark scale |
| Focus | Ring expand from center |

```tsx
// Error shake
<motion.div animate={hasError ? { x: [0, -8, 8, -8, 0] } : {}}>
  <Input />
</motion.div>
```

## Rules

- Micro-interactions should be < 200ms
- Never animate on every keystroke
- Always provide visual feedback for user actions
- Keep transforms minimal (max scale 1.05 for hover)
- Use spring easing for interactive elements
