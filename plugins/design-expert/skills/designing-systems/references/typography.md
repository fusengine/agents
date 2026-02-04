---
name: typography
description: Complete typography system with font sizing, spacing, and mobile guidelines
when-to-use: Choosing fonts, setting type scale, configuring line-height and letter-spacing
keywords: typography, fonts, font-size, line-height, letter-spacing, mobile, WCAG
priority: critical
related: color-system.md, design-rules.md
---

# Typography System

## FONT CATEGORIES

| Category | Characteristics | Use Cases |
|----------|-----------------|-----------|
| **Serif** | Decorative strokes at ends | Print, books, formal, editorial |
| **Sans-Serif** | Clean, no decorative strokes | Digital, modern, UI |
| **Script** | Cursive, handwritten style | Invitations, branding (sparingly) |
| **Display** | Bold, decorative | Headlines, logos (NOT body) |

## FORBIDDEN FONTS (NEVER USE)

- Inter, Roboto, Arial, Open Sans, Lato
- System fonts, sans-serif defaults
- Helvetica, Verdana, Tahoma
- Google Fonts default stack

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

## MOBILE FONT SIZES (MANDATORY)

| Platform | Minimum Body Size | Recommendation |
|----------|------------------|----------------|
| **WCAG 2.0** | 18pt | Accessibility standard |
| **iOS** | 17pt | San Francisco system font |
| **Android** | 16pt | Roboto (if using Material) |

**RULE**: Never go below 16px for body text. Use smaller sizes ONLY for:
- Labels and metadata
- Descriptions
- Helper text (NOT form inputs)

## LETTER SPACING (TRACKING)

Default: 0% (don't modify unless necessary)

```css
/* Tight for headlines */
.headline { letter-spacing: -0.02em; }

/* Normal for body (leave default) */
.body { letter-spacing: normal; }

/* Wide for caps/labels */
.label-caps { letter-spacing: 0.05em; text-transform: uppercase; }
```

**WARNING**: Excessive letter spacing = poor readability.

## LINE HEIGHT GUIDELINES

```css
/* Headlines: tight */
.headline { line-height: 1.1; }  /* 110% */

/* Body text: comfortable */
.body { line-height: 1.5; }      /* 150% */

/* Long form: spacious */
.article { line-height: 1.7; }   /* 170% */
```

## FONT WEIGHT RECOMMENDATIONS

Use ONLY 3-4 weights per project:
- **Regular (400)**: Body text
- **Medium (500)**: UI elements, buttons
- **Semibold (600)**: Subheadings
- **Bold (700)**: Headlines only

**FORBIDDEN**: Using 6+ different weights.

## TYPEFACE vs FONT

- **Typeface**: The entire family (e.g., "Clash Display")
- **Font**: Specific style within typeface (e.g., "Clash Display Bold 24px")

## FONT PAIRING RULES

1. **Maximum 2 typefaces** per project
2. **High contrast** between display and body
3. **Same x-height** for harmonious pairing
4. **One serif + one sans** works well

### Recommended Pairings

```
Clash Display (headlines) + Satoshi (body)
Playfair Display (headlines) + Bricolage Grotesque (body)
Fraunces (display) + Space Grotesk (body)
```
