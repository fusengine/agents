---
name: component-examples
description: Index of production-ready component templates
when-to-use: Finding code examples, copying component patterns
keywords: examples, code, components, templates, index
priority: high
related: design-patterns.md, cards-guide.md
---

# Component Examples

Production-ready component templates. Full code in `templates/` folder.

## Available Templates

| Component | Description | Template |
|-----------|-------------|----------|
| **Hero Section** | Landing page hero with badge, CTA | [hero-section.md](templates/hero-section.md) |
| **Feature Grid** | Icon grid with stagger animation | [feature-grid.md](templates/feature-grid.md) |
| **Pricing Card** | Subscription card with features | [pricing-card.md](templates/pricing-card.md) |
| **Contact Form** | Form with validation states | [contact-form.md](templates/contact-form.md) |
| **Testimonial Card** | Review card with avatar, rating | [testimonial-card.md](templates/testimonial-card.md) |
| **Stats Section** | Animated number counters | [stats-section.md](templates/stats-section.md) |
| **FAQ Accordion** | Collapsible Q&A section | [faq-accordion.md](templates/faq-accordion.md) |

## Dependencies

All templates require:

```bash
bun add framer-motion lucide-react
npx shadcn@latest add button
```

## Usage Pattern

1. Choose template from table above
2. Copy component code
3. Install dependencies
4. Customize with design tokens

## Anti-AI-Slop Checklist

All templates follow these rules:

- [x] Framer Motion animations
- [x] CSS variables for colors
- [x] Lucide icons (not emoji)
- [x] Rounded corners (rounded-2xl)
- [x] Proper hover states
- [x] Accessibility (ARIA, keyboard)
