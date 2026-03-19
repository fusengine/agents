---
name: error-pages
description: Error page designs for 404, 500, and 403 with no dead-ends
when-to-use: Designing error pages, not-found pages, access denied pages
keywords: error, 404, 500, 403, not-found, server-error, forbidden
priority: high
related: navbar.md, empty-state.md
---

# Error Pages Spec

## Core Rule

**No dead-ends.** Every error page MUST have at least one actionable CTA.

## 404 - Not Found

### Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Center | Illustration + error code | Scale down on mobile |
| Title | "Page not found" | Centered |
| Description | Helpful explanation | Max 2 lines |
| Search | Search bar (optional) | Full width |
| CTA | "Go to homepage" button | Primary button |
| Links | Popular pages (optional) | 2-col grid |

### Content

- Illustration: brand-consistent, not generic
- Tone: friendly, not technical ("We couldn't find that page")
- Include search bar to help users find what they wanted
- Show popular pages or recent navigation

## 500 - Server Error

### Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Center | Illustration + error code | Scale down on mobile |
| Title | "Something went wrong" | Centered |
| Description | Apologize + reassure | Max 2 lines |
| CTA Primary | "Try again" button | Retry action |
| CTA Secondary | "Check status" link | Status page |
| Support | Contact support link | Text link |

### Content

- Tone: apologetic ("We're sorry, something went wrong")
- Retry button should attempt the failed action
- Link to status page if available
- Provide support contact

## 403 - Forbidden

### Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Center | Lock/shield illustration | Scale down on mobile |
| Title | "Access denied" | Centered |
| Description | Why access was denied | Max 2 lines |
| CTA | "Request access" or "Go back" | Primary button |

### Content

- Explain WHY access was denied (role, permissions)
- Offer "Request access" if applicable
- Always provide "Go back" or "Go home" option

## Components (shadcn/ui)

- `Button` - Primary and secondary CTAs
- `Input` - Search bar (404 page)
- `Card` - Popular pages links (optional)

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --error-max-width | 480px | Content container |
| --error-illustration-size | 200px | Illustration dimensions |
| --error-gap | 24px | Spacing between elements |

## Animation (Framer Motion)

- Illustration: subtle float animation (2s loop, y: [-5, 5])
- Text: stagger fade-in from bottom
- CTA: scale on hover

## Gemini Design Prompt

```
Create a 404 error page with centered illustration, "Page not found" title,
helpful description, search bar, and "Go to homepage" button.
Brand-consistent illustration, friendly tone. Use design-system.md tokens.
Subtle floating animation on illustration. No dead-ends.
```

## Validation Checklist

- [ ] Every error page has at least one CTA
- [ ] 404 has search bar or navigation links
- [ ] 500 has retry action
- [ ] 403 explains why and offers next step
- [ ] Illustrations match brand identity
- [ ] Tone is friendly, not technical
- [ ] Pages work without JavaScript (SSR)
