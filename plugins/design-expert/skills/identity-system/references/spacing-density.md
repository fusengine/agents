---
name: spacing-density
description: Three density levels with base units, padding, and border-radius profiles
when-to-use: Defining spacing system and density profile for a project
keywords: spacing, density, padding, margin, border-radius, grid, layout
priority: high
related: identity-brief.md, typography-pairs.md
---

# Spacing & Density

## Three Density Profiles

Choose based on content type and audience expectations.

### Enterprise Dense

Best for: dashboards, data tables, admin panels, dev tools

| Property | Value |
|----------|-------|
| Base unit | 4px |
| Component padding | 8px / 12px |
| Card padding | 16px |
| Section gap | 16px |
| Page margin | 16px-24px |
| Input height | 32px |
| Button height | 32px / 36px |
| Table row height | 36px |

### Standard

Best for: SaaS apps, e-commerce, general web apps

| Property | Value |
|----------|-------|
| Base unit | 8px |
| Component padding | 12px / 16px |
| Card padding | 24px |
| Section gap | 24px-32px |
| Page margin | 24px-48px |
| Input height | 40px |
| Button height | 40px / 44px |
| Table row height | 48px |

### Editorial

Best for: blogs, marketing sites, portfolios, creative agencies

| Property | Value |
|----------|-------|
| Base unit | 12px |
| Component padding | 24px / 32px |
| Card padding | 32px-48px |
| Section gap | 48px-64px |
| Page margin | 48px-96px |
| Input height | 48px |
| Button height | 48px / 52px |
| Table row height | 56px |

---

## Border Radius Personality

| Profile | Values | Best For |
|---------|--------|----------|
| Sharp | 4px-6px | Fintech, enterprise, dev tools |
| Balanced | 8px-12px | SaaS, e-commerce, standard apps |
| Soft | 16px-24px | Health, education, friendly apps |
| Pill | 9999px | Buttons, tags, playful designs |

### Radius Scale

```css
:root {
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}
```

---

## Spacing Scale (8px base)

```css
:root {
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

---

## Container Widths

| Size | Width | Usage |
|------|-------|-------|
| sm | 640px | Auth forms, modals |
| md | 768px | Content pages |
| lg | 1024px | Standard layouts |
| xl | 1280px | Wide layouts, dashboards |
| 2xl | 1536px | Full-width dashboards |

---

## Rules

- NEVER use magic numbers - always multiples of base unit
- ALWAYS use CSS variables for spacing
- Component padding should be consistent within a density level
- Touch targets minimum 44x44px on mobile (WCAG 2.5.5)

-> See [identity-brief.md](identity-brief.md) to determine density profile
