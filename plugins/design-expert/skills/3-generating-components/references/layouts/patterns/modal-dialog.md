---
name: modal-dialog
description: Modal and dialog patterns with sizes, mobile sheets, and focus management
when-to-use: Designing modals, dialogs, confirmation prompts, bottom sheets
keywords: modal, dialog, sheet, focus-trap, overlay, confirmation, sizes
priority: high
related: command-palette.md, toast-notifications.md
---

# Modal / Dialog Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Backdrop | Dimmed overlay (opacity 0.5) | Full screen |
| Dialog | Centered container | Sheet on mobile |
| Header | Title + close button | Sticky |
| Body | Content area (scrollable) | Flex-1 |
| Footer | Action buttons (right-aligned) | Sticky |

## Sizes

| Size | Width | When to Use |
|------|-------|-------------|
| sm | 400px | Confirmations, simple forms |
| md | 500px | Standard forms, content |
| lg | 640px | Complex forms, previews |
| xl | 780px | Data-heavy, multi-column |

## Components (shadcn/ui)

- `Dialog` - Standard modal dialog
- `AlertDialog` - Confirmation prompts (no outside click dismiss)
- `Sheet` - Slide-out panel (mobile modals)
- `Button` - Action buttons

## Mobile Behavior

On screens < 640px, convert Dialog to bottom Sheet:
- Slides up from bottom
- Drag handle at top for dismiss
- Full width, rounded top corners
- Max height: 90vh

## Focus Management

| Rule | Implementation |
|------|---------------|
| Focus trap | Focus stays inside dialog |
| Initial focus | First focusable element or primary action |
| Return focus | Focus returns to trigger element on close |
| ESC to close | Always (except AlertDialog) |
| Outside click | Dialog: closes / AlertDialog: does not close |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --dialog-bg | var(--background) | Dialog background |
| --dialog-border | var(--border) | Dialog border |
| --dialog-shadow | 0 24px 48px rgba(0,0,0,0.15) | Elevation |
| --dialog-radius | var(--radius-lg) | Border radius |
| --backdrop-opacity | 0.5 | Overlay darkness |

## Rules

- **No nested modals** - Use drill-down pattern instead
- **Scrollable body** - Header and footer stay fixed
- **Descriptive titles** - "Delete project?" not "Confirm"
- **Action labels** - "Delete project" not "OK"
- **Destructive actions** - Red button + confirm text input

## Animation (Framer Motion)

- Backdrop: fade-in opacity 0 -> 0.5 (150ms)
- Dialog: scale 0.95 -> 1 + fade-in (200ms, spring)
- Sheet: slide from bottom (300ms, spring)
- Close: reverse animations

## Gemini Design Prompt

```
Create a modal dialog system with 4 sizes (sm/md/lg/xl). Centered on desktop,
bottom sheet on mobile. Focus trap, ESC to close, backdrop click to dismiss.
Header with title + close, scrollable body, footer with cancel + primary action.
Use design-system.md tokens. Spring animation for open/close.
```

## Validation Checklist

- [ ] Focus is trapped inside dialog
- [ ] ESC closes dialog (except AlertDialog)
- [ ] Focus returns to trigger on close
- [ ] Mobile converts to bottom Sheet
- [ ] No nested modals
- [ ] Scrollable body with sticky header/footer
- [ ] Destructive actions use red button
- [ ] Action labels are descriptive (not "OK")
