---
name: empty-state
description: Empty state patterns with illustrations, messaging, and CTAs
when-to-use: Designing no-data views, first-use experiences, empty lists
keywords: empty-state, no-data, illustration, cta, first-use, blank, placeholder
priority: high
related: error-pages.md, data-table.md
---

# Empty State Spec

## Core Rule

**Never show blank pages.** Every data view must have an empty state with context and a clear next action.

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Center | Illustration (optional) | Scale down on mobile |
| Title | Context-specific heading | Centered |
| Description | Helpful explanation (1-2 lines) | Max 40 chars/line |
| CTA | Primary action button | Centered |
| Secondary | Alternative action (optional) | Text link |

## Types

### First Use (No data yet)

```
    [Illustration]
  "No projects yet"
  "Create your first project to get started"
  [+ Create Project]
```

### Filtered Empty (No matching results)

```
    [Search illustration]
  "No results found"
  "Try adjusting your search or filters"
  [Clear filters]
```

### Error State (Failed to load)

```
    [Error illustration]
  "Couldn't load data"
  "Something went wrong. Please try again."
  [Retry]
```

### Permission (No access)

```
    [Lock illustration]
  "No access"
  "You don't have permission to view this content"
  [Request access]
```

## Components (shadcn/ui)

- `Button` - Primary CTA
- `Card` - Container (optional, for inline empty states)

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --empty-max-width | 400px | Content container |
| --empty-illustration-size | 160px | Illustration dimensions |
| --empty-gap | 16px | Element spacing |
| --empty-text-color | var(--muted-foreground) | Description text |

## Illustration Guidelines

- Use brand-consistent illustrations (not generic stock)
- Simple, single-color or duotone
- Match the context (search icon for no results, folder for no files)
- Size: 120-200px depending on importance
- Consider using Lucide icons at large size as fallback

## Content Guidelines

| Element | Rule |
|---------|------|
| Title | Specific to context, not generic |
| Description | One sentence, actionable hint |
| CTA label | Action verb ("Create project", not "OK") |
| Tone | Friendly, encouraging, not apologetic |

## Animation (Framer Motion)

- Illustration: gentle float or pulse animation
- Text: stagger fade-in from bottom
- CTA: subtle scale on hover
- Entrance: delay 200ms after page load (avoid flash)

## Gemini Design Prompt

```
Create an empty state component with centered illustration, title, description,
and primary CTA button. Context-specific messaging.
Variants: first-use, no-results, error, no-access.
Use brand illustration style. Use design-system.md tokens.
Gentle float animation on illustration.
```

## Validation Checklist

- [ ] Every list/table view has an empty state
- [ ] Empty state has context-specific messaging
- [ ] Primary CTA is present and actionable
- [ ] Illustration matches brand identity
- [ ] "No results" state suggests clearing filters
- [ ] Error state has retry action
- [ ] Never shows blank/white space
- [ ] Works for both full-page and inline contexts
