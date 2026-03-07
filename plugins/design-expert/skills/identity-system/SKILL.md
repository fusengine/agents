---
name: identity-system
description: Use when starting a new project design. Generates unique visual identity with brand palette, typography, spacing, and motion personality.
versions:
  tailwindcss: "4.1"
  framer-motion: "11"
  shadcn-ui: "2.x"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task
references: references/identity-brief.md, references/sector-palettes.md, references/typography-pairs.md, references/spacing-density.md, references/motion-personality.md, references/templates/design-system-template.md
related-skills: designing-systems, theming-tokens, palette-generator
---

# Identity System

## Agent Workflow (MANDATORY)

Before ANY identity work, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect existing design tokens, fonts, colors
2. **fuse-ai-pilot:research-expert** - Verify sector trends and latest font releases
3. **design-expert:palette-generator** - Generate OKLCH palette from brief

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Identity Brief** | Structured questionnaire to define brand personality |
| **Palette** | Sector-specific OKLCH color system with semantic tokens |
| **Typography** | Intentional font pair (display + body) |
| **Spacing** | Density profile (dense/standard/editorial) |
| **Motion** | Motion personality (corporate/modern/playful/luxury) |

---

## Critical Rules

1. **ALWAYS generate design-system.md** before the first component
2. **NEVER use default shadcn palette** - Every project needs a unique identity
3. **Identity must match sector/audience** - Fintech != creative agency
4. **OKLCH colors mandatory** - No hex, no HSL, no RGB
5. **Typography pair must be intentional** - No Inter, Roboto, Arial

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Identity Brief** | [identity-brief.md](references/identity-brief.md) | MANDATORY - Start here |
| **Sector Palettes** | [sector-palettes.md](references/sector-palettes.md) | Choosing brand colors |
| **Typography** | [typography-pairs.md](references/typography-pairs.md) | Selecting font pairs |
| **Spacing** | [spacing-density.md](references/spacing-density.md) | Layout density profile |
| **Motion** | [motion-personality.md](references/motion-personality.md) | Animation personality |

### Templates

| Template | When to Use |
|----------|-------------|
| [design-system-template.md](references/templates/design-system-template.md) | Generate design-system.md for project root |

---

## Quick Reference

### Identity Brief Questions

```
1. What sector? (fintech / health / e-commerce / dev-tools / creative / enterprise / education)
2. What personality? (premium / playful / serious / technical / luxury / friendly)
3. Who is the audience? (B2B / B2C / developers / enterprise)
4. Name 2-3 competitors to differentiate from
5. What feeling should users have? (trust / excitement / calm / focus)
```

### Workflow

```
Identity Brief -> Sector Palette -> Typography Pair -> Spacing Profile -> Motion Personality -> design-system.md
```

---

## Validation Checklist

- [ ] design-system.md exists at project root
- [ ] All colors use OKLCH format
- [ ] Font pair is intentional (no forbidden fonts)
- [ ] Spacing uses consistent base unit
- [ ] Motion profile defined with durations + easing
- [ ] Dark mode palette defined
- [ ] Contrast ratios meet WCAG AA (4.5:1 text, 3:1 UI)

---

## Best Practices

### DO
- Run identity brief BEFORE any component work
- Generate design-system.md at project root
- Use OKLCH for perceptually uniform colors
- Pick fonts that match sector personality
- Define motion profile for consistency

### DON'T
- Skip the identity brief phase
- Use default shadcn/ui colors
- Use Inter, Roboto, or Arial fonts
- Hard-code hex colors in components
- Mix motion personalities within one project
