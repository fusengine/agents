---
name: typography-pairs
description: 18 validated font pairs organized by sector — display + body, personality descriptors, CSS ready
when-to-use: Selecting display and body fonts for a project identity
keywords: typography, fonts, display, body, pair, google-fonts, personality, sector
priority: high
related: identity-brief.md, spacing-density.md
---

# Typography Pairs

## Selection Criteria

Font pairs must be:
- **Intentional** — match the project personality
- **Contrasting** — display and body should differ in character
- **Available** — Google Fonts or Fontshare (not system fonts)
- **Performant** — variable fonts preferred, max 2 families loaded

## FORBIDDEN Fonts

| Font | Why Forbidden |
|------|---------------|
| Inter | Overused, signals AI-generated / default |
| Roboto | Android default, no personality |
| Arial | System font, zero character |
| Open Sans | Overused, generic |
| Lato | Overused in templates |
| Poppins | Overused in dashboards |

---

## Fintech / Banking

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 1 | Cabinet Grotesk | Geist | Sharp geometric contrast, authoritative weight | Precise, trustworthy |
| 2 | Neue Haas Grotesk | DM Sans | Swiss precision, clean neutrality | Institutional, rigorous |
| 3 | Plus Jakarta Sans | Source Sans 3 | Modern editorial weight, neutral readability | Progressive, reliable |

CSS — Pair 1:
```css
--font-display: "Cabinet Grotesk", sans-serif;
--font-body: "Geist", sans-serif;
```

---

## E-commerce / Retail

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 4 | Syne | General Sans | Geometric boldness drives attention to CTAs | Energetic, modern |
| 5 | Clash Display | Satoshi | Strong hierarchy, reads well at all sizes | Premium consumer |
| 6 | Bricolage Grotesque | DM Sans | Expressive headlines, approachable body | Friendly, vibrant |

CSS — Pair 4:
```css
--font-display: "Syne", sans-serif;
--font-body: "General Sans", sans-serif;
```

---

## Dev Tools / Technical

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 7 | JetBrains Mono | Geist | Code-native display font, ultra-legible body | Technical, precise |
| 8 | Martian Mono | Geist Mono | Playful mono variant, retains precision | Indie, technical |
| 9 | Space Grotesk | Space Mono | Sister fonts, unified geometric system | Modern, technical |

CSS — Pair 7:
```css
--font-display: "JetBrains Mono", monospace;
--font-body: "Geist", sans-serif;
```

---

## Creative / Agency

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 10 | Switzer | General Sans | Expressive weight axis, smooth body contrast | Bold, editorial |
| 11 | Familjen Grotesk | Literata | Humanist heading, warm serif body | Warm, cultural |

CSS — Pair 10:
```css
--font-display: "Switzer", sans-serif;
--font-body: "General Sans", sans-serif;
```

---

## Luxury / Editorial

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 12 | Fraunces | Literata | Optical size serif pair — editorial warmth | Luxurious, literary |
| 13 | Cormorant Garamond | Source Serif 4 | Classical serif contrast, high legibility | Premium, timeless |

CSS — Pair 12:
```css
--font-display: "Fraunces", serif;
--font-body: "Literata", serif;
```

---

## Healthcare / Wellness

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 14 | Outfit | DM Sans | Rounded geometric, non-threatening | Approachable, calm |
| 15 | Nunito | Plus Jakarta Sans | Soft curves, excellent readability | Friendly, clinical |

CSS — Pair 14:
```css
--font-display: "Outfit", sans-serif;
--font-body: "DM Sans", sans-serif;
```

---

## Education / Learning

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 16 | Nunito | DM Sans | Rounded, playful but readable at small sizes | Motivating, clear |
| 17 | Lexend | Plus Jakarta Sans | Dyslexia-optimized body, modern display | Inclusive, modern |

CSS — Pair 16:
```css
--font-display: "Nunito", sans-serif;
--font-body: "DM Sans", sans-serif;
```

---

## Media / Publishing

| # | Display | Body | Why It Works | Personality |
|---|---------|------|--------------|-------------|
| 18 | Playfair Display | Source Serif 4 | Classic editorial authority, high readability | Authoritative, warm |

CSS — Pair 18:
```css
--font-display: "Playfair Display", serif;
--font-body: "Source Serif 4", serif;
```

---

## Font Scale Reference

### Compact (data-heavy, dev tools)
```
xs: 0.75rem / 1rem     sm: 0.875rem / 1.25rem
base: 1rem / 1.5rem    lg: 1.125rem / 1.75rem
xl: 1.25rem / 1.75rem  2xl: 1.5rem / 2rem
```

### Standard (most apps)
```
xs: 0.75rem / 1rem     sm: 0.875rem / 1.25rem
base: 1rem / 1.5rem    lg: 1.125rem / 1.75rem
xl: 1.25rem / 1.75rem  2xl: 1.5rem / 2rem
3xl: 1.875rem / 2.25rem  4xl: 2.25rem / 2.5rem
```

### Editorial (content, luxury)
```
base: 1.125rem / 1.75rem  lg: 1.25rem / 2rem
xl: 1.5rem / 2rem         2xl: 1.875rem / 2.25rem
3xl: 2.25rem / 2.75rem    4xl: 3rem / 3.5rem
5xl: 3.75rem / 1          6xl: 5rem / 1
```

---

## Loading Strategy

```html
<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Variable fonts for performance — replace with your pair -->
<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
```

-> See [identity-brief.md](identity-brief.md) to determine which personality to use
