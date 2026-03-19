---
name: contrast-ratios
description: WCAG contrast ratio requirements and OKLCH-based checking methods
when-to-use: Verifying color accessibility, choosing foreground colors, auditing contrast
keywords: contrast, wcag, aa, aaa, accessibility, foreground, background, ratio
priority: high
related: oklch-system.md, palette-template.md
---

# Contrast Ratios

## WCAG Requirements

### Level AA (Minimum - MANDATORY)

| Element | Ratio | Example |
|---------|-------|---------|
| Normal text (< 24px) | 4.5:1 | Body text, labels, links |
| Large text (>= 24px or >= 18.67px bold) | 3:1 | Headings, display text |
| UI components | 3:1 | Borders, icons, focus indicators |
| Non-text contrast | 3:1 | Charts, graphs, data viz |

### Level AAA (Enhanced - Recommended)

| Element | Ratio |
|---------|-------|
| Normal text | 7:1 |
| Large text | 4.5:1 |

## OKLCH Lightness Rules of Thumb

Because OKLCH is perceptually uniform, lightness difference directly correlates with contrast.

### Quick Check with Lightness

| Lightness Difference | Approximate Ratio | Passes |
|---------------------|-------------------|--------|
| >= 50% | > 7:1 | AAA normal text |
| >= 40% | > 4.5:1 | AA normal text |
| >= 30% | > 3:1 | AA large text / UI |
| < 25% | < 3:1 | Fails all |

### Examples

```
Background: oklch(97% 0.01 245)  (L=97%)
Foreground: oklch(15% 0.01 245)  (L=15%)
Difference: 82% -> well above 7:1 (AAA)

Background: oklch(55% 0.18 245)  (L=55%)
Foreground: oklch(98% 0.005 245) (L=98%)
Difference: 43% -> above 4.5:1 (AA)
```

## Auto-Foreground Algorithm

Automatically determine text color based on background lightness:

```typescript
function getForeground(bgLightness: number): string {
  if (bgLightness > 60) {
    return "oklch(15% 0.01 0)"; // Dark text
  }
  return "oklch(98% 0.005 0)"; // Light text
}
```

### Threshold: 60% Lightness

- Background L > 60% -> Use dark foreground (L: 10-20%)
- Background L <= 60% -> Use light foreground (L: 95-100%)

## Common Pitfalls

### Low Contrast Pairs to Avoid

| Pair | Issue |
|------|-------|
| Light gray text on white | L difference < 20% |
| Medium blue on dark blue | Same hue, low L difference |
| Colored text on colored bg | Chroma can reduce perceived contrast |
| Placeholder text (too light) | Often fails 4.5:1 |

### Muted/Secondary Text

For secondary text (muted-foreground):
- Light mode: minimum L=45% on white background (L=100%)
- Dark mode: minimum L=65% on dark background (L=15%)

## Testing Tools

| Tool | Usage |
|------|-------|
| Chrome DevTools | Inspect element -> color picker shows ratio |
| OKLCH Color Picker | oklch.com - visual scale builder |
| Contrast checker | webaim.org/resources/contrastchecker |

## Focus Indicators

Focus rings must have 3:1 contrast against both the element AND the background:

```css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

Use the primary color for focus rings (already validated for contrast).

## Color-Blind Considerations

- Never use color alone to convey information
- Add icons, patterns, or text labels alongside color
- Test with deuteranopia (red-green) simulation
- Success/error should differ in lightness, not just hue

## Checklist

- [ ] All normal text passes 4.5:1 ratio
- [ ] All large text passes 3:1 ratio
- [ ] UI components pass 3:1 ratio
- [ ] Focus indicators pass 3:1 ratio
- [ ] Placeholder text meets contrast minimum
- [ ] Color is not sole indicator of state
- [ ] Tested with color-blindness simulation
