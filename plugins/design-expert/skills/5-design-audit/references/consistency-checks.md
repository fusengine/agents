---
name: consistency-checks
description: Cross-component visual consistency validation for border-radius, shadows, icons, and buttons
when-to-use: Checking visual consistency across components and pages
keywords: consistency, radius, shadow, icon, button, spacing, elevation, visual
priority: high
related: audit-checklist.md, anti-ai-slop-audit.md
---

# Consistency Checks

## Why Consistency Matters

Visual inconsistency signals unprofessional quality and erodes user trust. Users unconsciously detect when border-radius, shadows, or spacing vary between similar components.

## Border Radius

### What to Check

| Component Type | Expected Radius |
|----------------|----------------|
| Buttons | Same across all button variants |
| Cards | Same across all card types |
| Inputs | Same as buttons (usually) |
| Modals | Larger than cards (radius-lg) |
| Badges/chips | Pill (radius-full) or same as buttons |
| Avatars | radius-full (circle) |

### Common Issues

- Cards have different radius than modals
- Primary button radius differs from secondary
- Input radius doesn't match button radius
- Mix of sharp and rounded corners without intention

### How to Audit

```bash
# Find all border-radius values
grep -rn "rounded\|border-radius\|borderRadius" src/ --include="*.tsx" --include="*.css"
# Check for var(--radius) usage
grep -rn "var(--radius" src/
```

## Shadow / Elevation

### Expected Scale

| Level | Usage | Shadow |
|-------|-------|--------|
| 0 | Flat elements | none |
| 1 | Cards, dropdowns | sm |
| 2 | Modals, floating | md |
| 3 | Popovers, tooltips | lg |

### Common Issues

- Different shadow values on similar elevation components
- Mix of custom shadow values and Tailwind shadow classes
- Cards using shadow-lg while dropdowns use shadow-sm
- No shadow system defined

## Icon Consistency

| Property | Rule |
|----------|------|
| Pack | Single icon pack throughout app (Lucide recommended) |
| Size | Consistent sizes: 16px (inline), 20px (default), 24px (large) |
| Stroke width | Same stroke width across all icons (usually 2px) |
| Color | Uses currentColor or semantic token |

### Common Issues

- Mix of Lucide, Heroicons, and custom SVGs
- Icons at inconsistent sizes (18px, 20px, 22px, 24px)
- Some icons filled, some outlined in same context
- Hard-coded colors instead of currentColor

### How to Audit

```bash
# Find icon imports
grep -rn "from.*icon\|Icon\|lucide\|heroicon" src/ --include="*.tsx"
```

## Button Heights

### Expected Consistency

| Variant | Height |
|---------|--------|
| Small | 32px (consistent across all types) |
| Default | 40px (consistent across all types) |
| Large | 48px (consistent across all types) |

Buttons in the same size should have identical height regardless of variant (primary, secondary, ghost, outline).

### Common Issues

- Primary button is 40px but ghost button is 36px
- Icon buttons have different height than text buttons
- Heights change between pages

## Spacing Rhythm

### What to Check

| Relationship | Rule |
|-------------|------|
| Cards in a grid | Same gap everywhere |
| Section spacing | Consistent vertical rhythm |
| Form field gaps | Same gap between all fields |
| Page padding | Same horizontal padding across pages |

### Common Issues

- Dashboard uses gap-4 but settings uses gap-6
- Inconsistent page padding (px-4 vs px-6 vs px-8)
- Form fields have varying gaps
- Sections have random spacing

### How to Audit

```bash
# Find gap values
grep -rn "gap-\|space-x-\|space-y-" src/ --include="*.tsx"
# Find padding values
grep -rn "px-\|py-\|p-" src/ --include="*.tsx" | grep -v "node_modules"
```

## Consistency Report Format

```markdown
### [Component] Consistency Issue

| Location | Value Found | Expected |
|----------|-------------|----------|
| Button.tsx | rounded-lg (12px) | rounded-md (8px) |
| Card.tsx | rounded-md (8px) | rounded-md (8px) OK |
| Input.tsx | rounded-sm (4px) | rounded-md (8px) |

**Fix**: Standardize to rounded-md (var(--radius))
```
