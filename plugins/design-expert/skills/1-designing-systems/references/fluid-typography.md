# Fluid Typography

## clamp() Formula

```
clamp(MIN, PREFERRED, MAX)
PREFERRED = slope * 100vw + intercept
```

**Calculate slope:**
```
slope = (maxSize - minSize) / (maxVW - minVW)
intercept = minSize - slope * minVW
```

## Ready-to-Use Type Scale

```css
:root {
  /* Display / Hero */
  --text-display: clamp(2.5rem, 5vw + 1rem, 5rem);     /* 40px → 80px */
  --text-h1:      clamp(2rem, 4vw + 0.75rem, 3.5rem);   /* 32px → 56px */
  --text-h2:      clamp(1.5rem, 3vw + 0.5rem, 2.5rem);  /* 24px → 40px */
  --text-h3:      clamp(1.25rem, 2vw + 0.5rem, 1.75rem); /* 20px → 28px */
  --text-body:    clamp(1rem, 1vw + 0.75rem, 1.125rem); /* 16px → 18px */
  --text-small:   clamp(0.875rem, 0.5vw + 0.75rem, 1rem); /* 14px → 16px */
}
```

## Tailwind v4 Integration

```css
@theme {
  --font-size-display: clamp(2.5rem, 5vw + 1rem, 5rem);
  --font-size-h1: clamp(2rem, 4vw + 0.75rem, 3.5rem);
  --font-size-h2: clamp(1.5rem, 3vw + 0.5rem, 2.5rem);
  --font-size-body: clamp(1rem, 1vw + 0.75rem, 1.125rem);
}
```

## Fluid Spacing (same principle)

```css
:root {
  --space-section: clamp(3rem, 8vw, 8rem);   /* section padding */
  --space-gap:     clamp(1rem, 3vw, 2rem);   /* component gap */
}
```

## Usage in Components

```tsx
<h1 className="text-[length:var(--text-h1)] font-bold leading-tight">
  Fluid Heading
</h1>
```

## Rules
- Never use `font-size` below 16px for body text on mobile
- `line-height` should scale with font size: 1.2 for headings, 1.6 for body
- Test readability at 320px (min) and 1920px (max)
- Fluid spacing prevents jarring layout shifts between breakpoints
