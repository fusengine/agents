---
name: command-palette
description: Command palette (Cmd+K) with fuzzy search and keyboard navigation
when-to-use: Adding command palette, search overlay, quick navigation
keywords: command-palette, cmdk, cmd-k, search, fuzzy, keyboard, navigation
priority: high
related: navbar.md, data-table.md
---

# Command Palette Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Backdrop | Dimmed overlay | Full screen |
| Dialog | Centered, max-w-lg (512px) | Wider margins on mobile |
| Search | Input with icon at top | Full width |
| Results | Grouped list with sections | Scrollable, max 8 visible |
| Footer | Keyboard shortcuts hint | Hidden on mobile |

## Components

- Library: `cmdk` (recommended) or custom
- `Dialog` - Overlay container
- `Input` - Search field
- `Command.Group` - Section grouping
- `Command.Item` - Individual result items

## Sections

| Section | Content | Example |
|---------|---------|---------|
| Recent | Last 5 visited pages | "Dashboard", "Settings" |
| Actions | App actions | "Create project", "Invite user" |
| Navigation | All routes | "Settings > Profile", "Billing" |
| Settings | Quick toggles | "Toggle dark mode", "Change language" |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Cmd+K / Ctrl+K | Open palette |
| Escape | Close palette |
| Arrow Up/Down | Navigate results |
| Enter | Execute selected item |
| Backspace (empty) | Go to parent group |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --palette-width | 512px | Dialog max-width |
| --palette-bg | var(--background) | Dialog background |
| --palette-border | var(--border) | Dialog border |
| --palette-shadow | 0 24px 48px rgba(0,0,0,0.2) | Elevation shadow |
| --result-height | 44px | Result item height |
| --result-hover-bg | var(--muted) | Hover background |

## Result Item Structure

```
[Icon]  [Label]                    [Shortcut Badge]
  20px    flex-1                      optional
```

## Fuzzy Search

- Match against label, description, and keywords
- Highlight matching characters in results
- Show "No results" with helpful message
- Debounce input: 100ms

## Animation (Framer Motion)

- Open: backdrop fade (150ms) + dialog scale from 0.95 (200ms)
- Close: reverse of open
- Results: fade-in as they filter
- Selection highlight: smooth background transition

## Gemini Design Prompt

```
Create a command palette overlay triggered by Cmd+K. Centered dialog with search input,
grouped results (Recent, Actions, Navigation), keyboard navigation hints in footer.
Fuzzy search with highlighted matches. Max width 512px.
Use cmdk library. Use design-system.md tokens. Smooth open/close animation.
```

## Validation Checklist

- [ ] Cmd+K / Ctrl+K opens palette
- [ ] Escape closes palette
- [ ] Arrow keys navigate results
- [ ] Enter executes selected item
- [ ] Fuzzy search matches partial text
- [ ] Results grouped by section
- [ ] "No results" state is helpful
- [ ] Focus is trapped inside palette
- [ ] Backdrop click closes palette
