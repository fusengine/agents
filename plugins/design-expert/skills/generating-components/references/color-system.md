---
name: color-system
description: Color system
---

# Color System

## FORBIDDEN

- Purple gradients (from-purple-* to-pink-*)
- Indigo/blue defaults
- Random hex codes without system
- Timid, evenly-distributed palettes

## CSS VARIABLES (MANDATORY)

```css
:root {
  /* Primary palette */
  --color-primary: #1e3a8a;
  --color-accent: #00ff41; /* Sharp, distinctive */

  /* Text */
  --color-text: #0a0a0a;
  --color-text-muted: #525252;

  /* Surfaces */
  --color-surface: #fafafa;
  --color-surface-elevated: #ffffff;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error: #ef4444;
}

[data-theme="dark"] {
  --color-primary: #3b82f6;
  --color-accent: #00ff41;
  --color-text: #fafafa;
  --color-text-muted: #a3a3a3;
  --color-surface: #0a0a0a;
  --color-surface-elevated: #171717;
}
```

## INSPIRATION SOURCES

### IDE Themes

- VSCode One Dark
- Monokai Pro
- Dracula
- Nord

### Cultural Aesthetics

- Solarpunk (greens, golds, earth tones)
- Brutalism (monochrome + neon accent)
- Swiss Design (clean, geometric)

## PALETTE EXAMPLES

### Cyberpunk

```css
--bg: #0a0a0a;
--accent-1: #00ff41; /* Matrix green */
--accent-2: #ff00ff; /* Magenta */
--accent-3: #00ffff; /* Cyan */
```

### Solarpunk

```css
--bg: #fefce8;
--primary: #166534;
--accent: #eab308;
--earth: #78716c;
```

### Luxury

```css
--bg: #0a0a0a;
--gold: #d4af37;
--cream: #f5f5dc;
--charcoal: #36454f;
```

## TAILWIND USAGE

```tsx
// Use CSS variables with Tailwind
<div className="bg-[var(--color-surface)] text-[var(--color-text)]">
  <span className="text-[var(--color-accent)]">Accent</span>
</div>

// Or semantic tokens
<div className="bg-background text-foreground">
  <span className="text-primary">Primary</span>
</div>
```
