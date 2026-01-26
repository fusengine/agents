---
name: typography
description: Typography system
---

# Typography System

## FORBIDDEN FONTS (NEVER USE)

- Inter, Roboto, Arial, Open Sans, Lato
- System fonts, sans-serif defaults
- Helvetica, Verdana, Tahoma

## APPROVED FONTS

### Editorial

- Playfair Display
- Crimson Pro
- Fraunces
- Newsreader

### Code/Tech

- JetBrains Mono
- Fira Code
- Space Grotesk
- IBM Plex Mono

### Startup

- Clash Display
- Satoshi
- Cabinet Grotesk
- General Sans

### Technical

- IBM Plex Sans
- Source Sans 3
- Manrope

### Distinctive

- Bricolage Grotesque
- Obviously
- Syne
- Outfit

## PAIRING PRINCIPLE

High contrast = interesting:

- Display + Monospace (Clash Display + JetBrains Mono)
- Serif + Geometric Sans (Playfair + Bricolage)

## SCALE

Use extremes (100/200 vs 800/900), ratios 3x+ for headings.

## CSS IMPLEMENTATION

```css
/* Fontshare imports (MANDATORY - NOT Google Fonts) */
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');

:root {
  --font-display: 'Clash Display', sans-serif;
  --font-sans: 'Satoshi', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## TAILWIND V4 CONFIG

```css
/* index.css */
@import "tailwindcss";

@theme inline {
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}
```

```tsx
/* Usage */
<h1 className="font-display text-5xl font-bold">Heading</h1>
<p className="font-sans text-base">Body text</p>
<code className="font-mono">Code</code>
```

## TYPOGRAPHY SCALE

```
Hero headline    → text-5xl/6xl font-bold (48-60px)
Section title    → text-3xl/4xl font-semibold (30-36px)
Card title       → text-xl/2xl font-medium (20-24px)
Body text        → text-base font-normal (16px)
Caption/meta     → text-sm text-muted-foreground (14px)
```
