---
name: generating-components
description: Use when generating UI components, buttons, forms, cards, hero sections, or using design tools. Covers Gemini Design MCP, shadcn/ui, 21st.dev, and Tailwind CSS.
versions:
  tailwindcss: "4.1"
  framer-motion: "11"
  shadcn-ui: "2.x"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task, mcp__gemini-design__create_frontend, mcp__gemini-design__snippet_frontend, mcp__gemini-design__modify_frontend, mcp__magic__21st_magic_component_builder, mcp__magic__21st_magic_component_inspiration, mcp__magic__21st_magic_component_refiner, mcp__shadcn__search_items_in_registries, mcp__shadcn__view_items_in_registries, mcp__shadcn__get_item_examples_from_registries, mcp__shadcn__get_add_command_for_items
references: references/gemini-design-workflow.md, references/21st-dev.md, references/shadcn.md, references/buttons-guide.md, references/forms-guide.md, references/cards-guide.md, references/icons-guide.md, references/ui-visual-design.md, references/grids-layout.md, references/design-patterns.md, references/component-examples.md, references/photos-images.md, references/templates/hero-section.md, references/templates/feature-grid.md, references/templates/pricing-card.md, references/templates/contact-form.md, references/templates/testimonial-card.md, references/templates/stats-section.md, references/templates/faq-accordion.md, references/templates/hero-glassmorphism.md, references/templates/pricing-cards.md
related-skills: designing-systems, adding-animations, validating-accessibility
---

# Generating Components

## Agent Workflow (MANDATORY)

Before ANY component generation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing UI patterns, colors, typography
2. **fuse-ai-pilot:research-expert** - Verify latest component patterns via Context7
3. **mcp__magic__21st_magic_component_inspiration** - Search 21st.dev for inspiration

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Gemini Design MCP** | AI-powered frontend generation (create, modify, snippet) |
| **Structured Specs** | Layout + component + animation specs (NOT raw code templates) |
| **Multi-Stack** | Adapts to React/Laravel/Swift via visual specs |
| **21st.dev** | Component inspiration and builder |
| **shadcn/ui** | Copy-paste component library |
| **Anti-AI-Slop** | Mandatory identity-driven design |

---

## Critical Rules

1. **ALWAYS use Gemini Design** - Never write UI code manually
2. **Search inspiration first** - 21st.dev before coding
3. **Match existing tokens** - Analyze codebase before generating
4. **No forbidden fonts** - Inter, Roboto, Arial are BANNED
5. **Framer Motion required** - Every component needs animations

---

## Architecture

```
components/
├── ui/
│   ├── Button.tsx        (~40 lines)
│   ├── Card.tsx          (~50 lines)
│   └── HeroSection.tsx   (~80 lines)
└── sections/
    ├── HeroBackground.tsx (~30 lines)
    └── FeatureGrid.tsx    (~60 lines)
```

→ See [hero-section.md](references/templates/hero-section.md) for complete example

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Gemini Workflow** | [gemini-design-workflow.md](references/gemini-design-workflow.md) | MANDATORY - Read first |
| **21st.dev** | [21st-dev.md](references/21st-dev.md) | Component inspiration |
| **shadcn/ui** | [shadcn.md](references/shadcn.md) | Component library |
| **Buttons** | [buttons-guide.md](references/buttons-guide.md) | Button states, sizing |
| **Forms** | [forms-guide.md](references/forms-guide.md) | Validation, layout |
| **Cards** | [cards-guide.md](references/cards-guide.md) | Card patterns |
| **Icons** | [icons-guide.md](references/icons-guide.md) | Icon usage |
| **UI Design** | [ui-visual-design.md](references/ui-visual-design.md) | 2026 trends, animations |
| **Grids** | [grids-layout.md](references/grids-layout.md) | Layout system |
| **Patterns** | [design-patterns.md](references/design-patterns.md) | Common patterns |

### Templates

| Template | When to Use |
|----------|-------------|
| [hero-section.md](references/templates/hero-section.md) | Hero section spec + Gemini prompt |
| [hero-glassmorphism.md](references/templates/hero-glassmorphism.md) | Glassmorphism hero spec |
| [feature-grid.md](references/templates/feature-grid.md) | Feature showcase spec + layout |
| [pricing-card.md](references/templates/pricing-card.md) | Pricing tier spec + Gemini prompt |
| [contact-form.md](references/templates/contact-form.md) | Contact form spec + validation |
| [testimonial-card.md](references/templates/testimonial-card.md) | Testimonial/review spec |
| [stats-section.md](references/templates/stats-section.md) | Stats section spec + counters |
| [faq-accordion.md](references/templates/faq-accordion.md) | FAQ section spec |
| [pricing-cards.md](references/templates/pricing-cards.md) | Pricing cards spec + Gemini prompt |

### Full Pages & Identity
For complete page designs (dashboard, auth, settings), see `page-layouts` skill.
For visual identity (palette, typography, tokens), see `identity-system` skill.

---

## Quick Reference

→ See [gemini-design-workflow.md](references/gemini-design-workflow.md) for Gemini Design tool usage.

### Anti-AI-Slop Table

| FORBIDDEN | USE INSTEAD |
|-----------|-------------|
| Inter, Roboto, Arial | Clash Display, Satoshi, Syne |
| Purple/pink gradients | CSS variables, sharp accents |
| Border-left indicators | Icon + bg-*/10 rounded |
| Flat backgrounds | Glassmorphism, gradient orbs |
| No animations | Framer Motion stagger |

→ See [ui-visual-design.md](references/ui-visual-design.md) for 2026 trends

---

## Best Practices

### DO
- Read gemini-design-workflow.md FIRST
- Search 21st.dev for inspiration before coding
- Match existing design tokens exactly
- Use Framer Motion for all animations
- Split components into <100 line files

### DON'T
- Write UI code manually (use Gemini Design)
- Use forbidden fonts (Inter, Roboto, Arial)
- Skip inspiration search phase
- Forget hover/focus states
- Create components without animations

---

→ For multi-stack delegation rules, see `rules/framework-integration.md`.
