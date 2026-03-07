---
name: design-system-template
description: Complete copy-paste template for generating a project's design-system.md file
keywords: design-system, template, identity, tokens, colors, typography, spacing, motion
---

# Design System Template

Copy this template, fill in values from the identity brief, and save as `design-system.md` at the project root.

---

```markdown
# Design System

## Identity

| Property | Value |
|----------|-------|
| Project | [PROJECT_NAME] |
| Sector | [SECTOR] |
| Personality | [PERSONALITY] |
| Audience | [AUDIENCE] |
| Density | [dense / standard / editorial] |
| Motion | [corporate / modern-saas / playful / luxury] |

## Colors (OKLCH)

### Brand

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --primary | oklch(55% 0.18 245) | oklch(70% 0.18 245) | Main actions, links |
| --primary-foreground | oklch(98% 0.005 245) | oklch(15% 0.01 245) | Text on primary |
| --secondary | oklch(65% 0.12 160) | oklch(55% 0.12 160) | Secondary actions |
| --secondary-foreground | oklch(98% 0.005 160) | oklch(15% 0.01 160) | Text on secondary |
| --accent | oklch(70% 0.15 200) | oklch(60% 0.15 200) | Highlights, badges |
| --accent-foreground | oklch(15% 0.01 200) | oklch(95% 0.005 200) | Text on accent |

### Surfaces

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --background | oklch(99% 0.003 250) | oklch(15% 0.01 250) | Page background |
| --foreground | oklch(15% 0.01 250) | oklch(95% 0.005 250) | Default text |
| --card | oklch(100% 0 0) | oklch(20% 0.01 250) | Card background |
| --card-foreground | oklch(15% 0.01 250) | oklch(95% 0.005 250) | Card text |
| --muted | oklch(95% 0.01 250) | oklch(25% 0.01 250) | Muted backgrounds |
| --muted-foreground | oklch(55% 0.02 250) | oklch(65% 0.02 250) | Muted text |
| --border | oklch(90% 0.01 250) | oklch(30% 0.01 250) | Borders |
| --input | oklch(90% 0.01 250) | oklch(30% 0.01 250) | Input borders |
| --ring | oklch(55% 0.18 245) | oklch(70% 0.18 245) | Focus rings |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| --success | oklch(60% 0.18 145) | Positive states |
| --warning | oklch(75% 0.16 80) | Caution states |
| --error | oklch(55% 0.22 25) | Error states |
| --info | oklch(60% 0.14 240) | Info states |

## Typography

| Property | Value |
|----------|-------|
| Display font | [DISPLAY_FONT] |
| Body font | [BODY_FONT] |
| Mono font | [MONO_FONT or JetBrains Mono] |
| Base size | [1rem] |
| Scale | [compact / standard / editorial] |

### Font Loading

```html
<link href="https://fonts.googleapis.com/css2?family=[DISPLAY_FONT]:wght@400;500;600;700&family=[BODY_FONT]:wght@400;500;700&display=swap" rel="stylesheet" />
```

### CSS Variables

```css
:root {
  --font-display: "[DISPLAY_FONT]", sans-serif;
  --font-body: "[BODY_FONT]", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

## Spacing

| Property | Value |
|----------|-------|
| Base unit | [4px / 8px / 12px] |
| Border radius | [sharp / balanced / soft / pill] |
| Default radius | [--radius: Xpx] |

## Motion

| Property | Value |
|----------|-------|
| Profile | [corporate / modern-saas / playful / luxury] |
| Quick | [Xms] |
| Standard | [Xms] |
| Emphasis | [Xms] |
| Easing | [ease-out / spring / cubic-bezier] |
| Reduced motion | Always respected |

## Component Tokens

| Component | Radius | Padding | Height |
|-----------|--------|---------|--------|
| Button | var(--radius) | 12px 24px | 40px |
| Input | var(--radius) | 8px 12px | 40px |
| Card | var(--radius-lg) | 24px | auto |
| Badge | var(--radius-full) | 4px 10px | auto |
| Avatar | var(--radius-full) | 0 | 40px |

## Anti-AI-Slop Checklist

- [ ] No Inter, Roboto, or Arial
- [ ] No default purple/pink gradients
- [ ] No hard-coded hex colors
- [ ] Custom palette applied (not default shadcn)
- [ ] Animations use Framer Motion
- [ ] Border radius is intentional
- [ ] Shadow scale is defined
```
