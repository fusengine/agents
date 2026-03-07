---
name: audit-checklist
description: Comprehensive design audit checklist covering typography, colors, spacing, motion, and accessibility
when-to-use: Running a full design quality audit on a project
keywords: audit, checklist, typography, colors, spacing, motion, accessibility, quality
priority: high
related: consistency-checks.md, anti-ai-slop-audit.md
---

# Audit Checklist

## Typography

| Check | What to Look For | Severity |
|-------|-------------------|----------|
| Font families | Only fonts from design-system.md used | Major |
| Forbidden fonts | No Inter, Roboto, Arial, Open Sans | Major |
| Font loading | Preconnect + display=swap | Minor |
| Type scale | Consistent scale (no arbitrary sizes) | Major |
| Line heights | Proper line-height for readability (1.4-1.6 body) | Minor |
| Font weights | Limited set (400, 500, 600, 700 max) | Minor |
| Heading hierarchy | h1 > h2 > h3 visual hierarchy maintained | Major |

### How to Check

```bash
# Grep for font-family declarations
grep -r "font-family\|fontFamily" src/
# Grep for forbidden fonts
grep -ri "inter\|roboto\|arial\|open.sans" src/ --include="*.css" --include="*.tsx"
```

## Colors

| Check | What to Look For | Severity |
|-------|-------------------|----------|
| OKLCH format | All design tokens use OKLCH | Major |
| No hard-coded hex | No #hex values in components | Major |
| CSS variables | Colors reference var(--token) | Major |
| 60-30-10 ratio | 60% neutral, 30% primary, 10% accent | Minor |
| Dark mode defined | All tokens have dark variants | Critical |
| Semantic colors | success, warning, error, info defined | Major |

### How to Check

```bash
# Find hard-coded hex colors
grep -rn "#[0-9a-fA-F]\{3,8\}" src/ --include="*.css" --include="*.tsx"
# Find hard-coded rgb/hsl
grep -rn "rgb\|hsl" src/ --include="*.css" --include="*.tsx"
```

## Spacing

| Check | What to Look For | Severity |
|-------|-------------------|----------|
| Base unit | Consistent base (4px, 8px, or 12px) | Major |
| No magic numbers | All spacing is multiple of base unit | Minor |
| CSS variables | Spacing uses var(--space-X) or Tailwind | Minor |
| Touch targets | Minimum 44x44px on mobile (WCAG 2.5.5) | Critical |
| Container width | Consistent max-width across pages | Minor |

### How to Check

```bash
# Find magic number spacing (non-standard values)
grep -rn "padding:\|margin:\|gap:" src/ --include="*.css"
```

## Motion

| Check | What to Look For | Severity |
|-------|-------------------|----------|
| Consistent timing | Durations match motion profile | Major |
| Reduced motion | prefers-reduced-motion respected | Critical |
| No infinite loops | Only loaders use infinite animation | Minor |
| Easing consistency | Same easing across similar interactions | Minor |
| Enter/exit pairs | Exit animations defined for modals/toasts | Minor |

### How to Check

```bash
# Find Framer Motion usage
grep -rn "motion\.\|whileHover\|whileTap\|animate=" src/ --include="*.tsx"
# Check for reduced motion support
grep -rn "useReducedMotion\|prefers-reduced-motion" src/
```

## Accessibility

| Check | What to Look For | Severity |
|-------|-------------------|----------|
| Contrast ratios | 4.5:1 normal text, 3:1 large text/UI | Critical |
| Focus indicators | Visible focus ring on all interactive elements | Critical |
| ARIA labels | Labels on icon-only buttons, images | Major |
| Keyboard nav | Tab order logical, no focus traps | Critical |
| Alt text | All images have meaningful alt text | Major |
| Form labels | Every input has associated label | Major |
| Error messages | Form errors are announced to screen readers | Major |

### How to Check

```bash
# Find icon-only buttons without aria-label
grep -rn "<Button" src/ --include="*.tsx" | grep -v "aria-label"
# Find images without alt
grep -rn "<img\|<Image" src/ --include="*.tsx" | grep -v "alt="
```

## Scoring

| Score | Range | Meaning |
|-------|-------|---------|
| A | 0 critical, 0-2 major | Excellent |
| B | 0 critical, 3-5 major | Good, minor fixes needed |
| C | 1-2 critical, any major | Needs attention |
| D | 3+ critical | Significant issues |
