---
name: toast-notifications
description: Toast notification system with sonner, auto-dismiss rules, and undo actions
when-to-use: Adding notifications, success/error messages, undo patterns
keywords: toast, notification, sonner, success, error, undo, auto-dismiss
priority: high
related: modal-dialog.md, empty-state.md
---

# Toast Notifications Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Position (desktop) | Bottom-right corner | Fixed |
| Position (mobile) | Top-center | Fixed, full width |
| Stack | Max 3 visible, queue remaining | Stacked with offset |

## Library

**sonner** (recommended) - Lightweight, accessible, well-designed defaults.

## Components

- `Toaster` - Provider component (place in layout root)
- `toast()` - Imperative API for triggering notifications

## Toast Types

| Type | Icon | Auto-dismiss | Use Case |
|------|------|-------------|----------|
| success | Checkmark (green) | 5 seconds | Action completed |
| error | X circle (red) | Persistent | Operation failed |
| warning | Triangle (orange) | 8 seconds | Caution needed |
| info | Info circle (blue) | 5 seconds | Informational |
| loading | Spinner | Until resolved | Async operation |
| action | Custom | 8 seconds | Undo available |

## Auto-Dismiss Rules

| Severity | Duration | Rationale |
|----------|----------|-----------|
| Info/success | 5 seconds | Low urgency, acknowledged quickly |
| Warning | 8 seconds | Needs attention, but not critical |
| Error | Persistent | User must acknowledge and may need to act |
| Action (undo) | 8 seconds | Give time to decide |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --toast-bg | var(--background) | Toast background |
| --toast-border | var(--border) | Toast border |
| --toast-shadow | 0 4px 12px rgba(0,0,0,0.1) | Elevation |
| --toast-radius | var(--radius-lg) | Border radius |
| --toast-padding | 16px | Inner padding |

## Undo Pattern

```typescript
toast("Project deleted", {
  action: {
    label: "Undo",
    onClick: () => restoreProject(id),
  },
  duration: 8000,
});
```

- Show undo button for destructive actions
- 8 second window before permanent execution
- Clicking undo reverses the action immediately

## Animation

- Enter: slide up + fade in (desktop), slide down + fade in (mobile)
- Exit: slide right + fade out
- Stack: smooth reposition when new toast added
- Dismiss: swipe gesture on mobile

## Gemini Design Prompt

```
Add sonner toast notification system. Bottom-right on desktop, top-center on mobile.
4 types: success (5s), error (persistent), warning (8s), info (5s).
Include undo action pattern for destructive operations.
Max 3 visible, queue overflow. Use design-system.md tokens.
```

## Validation Checklist

- [ ] Toaster provider is in layout root
- [ ] Position: bottom-right (desktop), top-center (mobile)
- [ ] Success/info dismiss after 5 seconds
- [ ] Error toasts are persistent
- [ ] Undo button on destructive actions
- [ ] Max 3 toasts visible at once
- [ ] Swipe to dismiss works on mobile
- [ ] Screen readers announce toast content
