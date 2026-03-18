# Light → Dark OKLCH Color Transformation Rules

## OKLCH Reminder

```
oklch(Lightness% Chroma Hue)
       0-100%    0-0.4  0-360
```

## Transformation Rules

### Rule 1 — Invert Lightness, Preserve Chroma and Hue

For backgrounds and surfaces:

```
Light:  oklch(95% 0.01 260)   →  Dark: oklch(12% 0.01 260)
Light:  oklch(100% 0 0)       →  Dark: oklch(8% 0.01 260)
```

Formula: `dark_L = 100 - light_L × 0.85` (approximate, adjust per visual)

### Rule 2 — Reduce Chroma for Dark Surfaces

High-chroma colors look oversaturated on dark backgrounds:

```
Brand light:  oklch(55% 0.22 260)  →  Brand dark: oklch(65% 0.18 260)
```
- Lightness: +10 to +15 (so color reads on dark bg)
- Chroma: -0.03 to -0.05 (prevent oversaturation)

### Rule 3 — Status Colors Need Independent Light Values in Dark Mode

```css
:root {
  --success: oklch(52% 0.20 145);  /* dark enough for light bg */
}
.dark {
  --success: oklch(68% 0.18 145);  /* lighter for dark bg */
}
```

### Rule 4 — Text Contrast Must Hit WCAG AA

```css
:root {
  --foreground: oklch(12% 0 0);   /* on white: contrast 18:1 ✓ */
}
.dark {
  --foreground: oklch(95% 0 0);   /* on dark bg: contrast 16:1 ✓ */
}

/* Secondary text */
:root  { --muted: oklch(45% 0 0); }   /* on white: 4.6:1 ✓ */
.dark  { --muted: oklch(65% 0 0); }   /* on dark: 4.7:1 ✓ */
```

## Complete Mapping Table

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `oklch(100% 0 0)` | `oklch(9% 0.01 260)` |
| `--surface` | `oklch(97% 0 0)` | `oklch(13% 0.01 260)` |
| `--surface-2` | `oklch(94% 0 0)` | `oklch(17% 0.01 260)` |
| `--foreground` | `oklch(10% 0 0)` | `oklch(95% 0 0)` |
| `--muted` | `oklch(45% 0 0)` | `oklch(65% 0 0)` |
| `--border` | `oklch(88% 0 0)` | `oklch(24% 0.01 260)` |
| `--primary` | `oklch(55% 0.20 260)` | `oklch(68% 0.17 260)` |
| `--ring` | `oklch(55% 0.20 260)` | `oklch(72% 0.17 260)` |

## Validation
- Use browser DevTools color picker to verify contrast ratios
- Check every text/background combination at AA (4.5:1) or AAA (7:1)
- Test with real content — don't rely on color alone for status indicators
