---
name: typography-pairs
description: Curated font pair recommendations by personality and sector
when-to-use: Selecting display and body fonts for a project identity
keywords: typography, fonts, display, body, pair, google-fonts, personality
priority: high
related: identity-brief.md, spacing-density.md
---

# Typography Pairs

## Selection Criteria

Font pairs must be:
- **Intentional** - Match the project personality
- **Contrasting** - Display and body fonts should differ in character
- **Available** - Google Fonts or self-hosted (not system fonts)
- **Performant** - Variable fonts preferred, max 2 families loaded

## FORBIDDEN Fonts

| Font | Why Forbidden |
|------|---------------|
| Inter | Overused, signals AI-generated / default |
| Roboto | Android default, no personality |
| Arial | System font, zero character |
| Open Sans | Overused, generic |
| Lato | Overused in templates |

---

## Recommended Pairs

| Personality | Display Font | Body Font | Why It Works |
|-------------|-------------|-----------|--------------|
| Premium SaaS | Clash Display | Satoshi | Geometric modern, high contrast |
| Fintech | Cabinet Grotesk | Inter Tight | Authoritative, sharp geometry |
| Creative | Switzer | General Sans | Expressive yet readable |
| Dev Tools | JetBrains Mono | Geist | Technical monospace + clean sans |
| Luxury | Playfair Display | Source Sans 3 | Serif elegance + neutral body |
| Health | Outfit | DM Sans | Soft rounded, approachable |
| Enterprise | Plus Jakarta Sans | Geist | Professional, modern |
| Education | Nunito | DM Sans | Friendly rounded, readable |
| E-commerce | Syne | General Sans | Bold personality, clean body |
| Editorial | Fraunces | Literata | Warm serif pair, high readability |

---

## Font Scale

Use a modular type scale based on personality:

### Compact (Data-heavy apps)

```
text-xs:   0.75rem / 1rem
text-sm:   0.875rem / 1.25rem
text-base: 1rem / 1.5rem
text-lg:   1.125rem / 1.75rem
text-xl:   1.25rem / 1.75rem
text-2xl:  1.5rem / 2rem
```

### Standard (Most apps)

```
text-xs:   0.75rem / 1rem
text-sm:   0.875rem / 1.25rem
text-base: 1rem / 1.5rem
text-lg:   1.125rem / 1.75rem
text-xl:   1.25rem / 1.75rem
text-2xl:  1.5rem / 2rem
text-3xl:  1.875rem / 2.25rem
text-4xl:  2.25rem / 2.5rem
```

### Editorial (Content-focused)

```
text-base: 1.125rem / 1.75rem
text-lg:   1.25rem / 2rem
text-xl:   1.5rem / 2rem
text-2xl:  1.875rem / 2.25rem
text-3xl:  2.25rem / 2.75rem
text-4xl:  3rem / 3.5rem
text-5xl:  3.75rem / 1
```

---

## Loading Strategy

```html
<!-- Preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Variable fonts for performance -->
<link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@400;500;700&display=swap" rel="stylesheet" />
```

### CSS Setup

```css
:root {
  --font-display: "Clash Display", sans-serif;
  --font-body: "Satoshi", sans-serif;
}
```

-> See [identity-brief.md](identity-brief.md) to determine which personality to use
