---
name: sector-palettes
description: Concrete OKLCH color values per sector — copy-paste ready CSS variables for light and dark mode
when-to-use: Choosing brand colors based on sector and personality
keywords: oklch, palette, sector, fintech, health, ecommerce, colors, brand, CSS
priority: high
related: identity-brief.md, typography-pairs.md
---

# Sector Palettes (OKLCH)

## How to Use

1. Identify sector from the identity brief
2. Copy the CSS variables block for your sector
3. Adjust hue ±15° to differentiate from competitors
4. Dark mode: keep hue, increase L +15–20%, reduce C slightly

**OKLCH format:** `oklch(L% C H)` — L=lightness, C=chroma, H=hue angle

---

## Fintech / Banking

Inspired by: Stripe, Wise, Mercury — trust, precision, institutional

```css
/* Light mode */
:root {
  --primary:            oklch(48% 0.16 255);
  --primary-foreground: oklch(98% 0.004 255);
  --secondary:          oklch(68% 0.13 158);
  --secondary-foreground: oklch(15% 0.01 158);
  --accent:             oklch(55% 0.10 220);
  --accent-foreground:  oklch(98% 0.004 220);
  --background:         oklch(98% 0.005 250);
  --foreground:         oklch(16% 0.018 250);
  --card:               oklch(100% 0 0);
  --card-foreground:    oklch(16% 0.018 250);
  --muted:              oklch(95% 0.007 250);
  --muted-foreground:   oklch(52% 0.02 250);
  --border:             oklch(89% 0.007 250);
  --input:              oklch(89% 0.007 250);
  --ring:               oklch(48% 0.16 255);
}

/* Dark mode */
.dark {
  --primary:            oklch(63% 0.16 255);
  --background:         oklch(13% 0.012 250);
  --foreground:         oklch(94% 0.005 250);
  --card:               oklch(19% 0.01 250);
  --muted:              oklch(24% 0.01 250);
  --border:             oklch(29% 0.01 250);
}
```

Chroma guide: 0.06–0.16 (conservative, trust-oriented)

---

## Health / Wellness

Inspired by: Calm, Headspace, Oscar Health — soothing, approachable

```css
/* Light mode */
:root {
  --primary:            oklch(54% 0.12 198);
  --primary-foreground: oklch(98% 0.004 198);
  --secondary:          oklch(67% 0.14 38);
  --secondary-foreground: oklch(15% 0.01 38);
  --accent:             oklch(72% 0.10 155);
  --accent-foreground:  oklch(15% 0.01 155);
  --background:         oklch(98% 0.005 195);
  --foreground:         oklch(19% 0.018 195);
  --card:               oklch(100% 0 0);
  --card-foreground:    oklch(19% 0.018 195);
  --muted:              oklch(95% 0.007 195);
  --muted-foreground:   oklch(53% 0.018 195);
  --border:             oklch(90% 0.007 195);
  --input:              oklch(90% 0.007 195);
  --ring:               oklch(54% 0.12 198);
}

/* Dark mode */
.dark {
  --primary:            oklch(69% 0.12 198);
  --background:         oklch(14% 0.01 200);
  --foreground:         oklch(95% 0.005 200);
  --card:               oklch(20% 0.009 200);
  --muted:              oklch(25% 0.009 200);
  --border:             oklch(30% 0.009 200);
}
```

Chroma guide: 0.09–0.15 (soothing, never aggressive)

---

## E-commerce

Inspired by: Shopify, Etsy, Amazon — warm, conversion-focused

```css
/* Light mode */
:root {
  --primary:            oklch(52% 0.15 145);
  --primary-foreground: oklch(98% 0.003 145);
  --secondary:          oklch(68% 0.17 52);
  --secondary-foreground: oklch(15% 0.01 52);
  --accent:             oklch(72% 0.14 80);
  --accent-foreground:  oklch(15% 0.01 80);
  --background:         oklch(98% 0.004 75);
  --foreground:         oklch(17% 0.012 250);
  --card:               oklch(100% 0 0);
  --card-foreground:    oklch(17% 0.012 250);
  --muted:              oklch(95% 0.006 75);
  --muted-foreground:   oklch(54% 0.018 250);
  --border:             oklch(90% 0.005 75);
  --input:              oklch(90% 0.005 75);
  --ring:               oklch(52% 0.15 145);
}

/* Dark mode */
.dark {
  --primary:            oklch(67% 0.15 145);
  --background:         oklch(14% 0.01 250);
  --foreground:         oklch(95% 0.005 250);
  --card:               oklch(20% 0.008 250);
  --muted:              oklch(25% 0.01 250);
  --border:             oklch(30% 0.01 250);
}
```

Chroma guide: 0.07–0.17 (warm, CTA-focused)

---

## Dev Tools

Inspired by: Linear, Vercel, Supabase — dark-first, minimal, precise

```css
/* Light mode */
:root {
  --primary:            oklch(50% 0.15 268);
  --primary-foreground: oklch(98% 0.003 268);
  --secondary:          oklch(68% 0.13 165);
  --secondary-foreground: oklch(15% 0.01 165);
  --accent:             oklch(65% 0.12 45);
  --accent-foreground:  oklch(15% 0.01 45);
  --background:         oklch(97% 0.005 260);
  --foreground:         oklch(14% 0.01 260);
  --card:               oklch(100% 0 0);
  --card-foreground:    oklch(14% 0.01 260);
  --muted:              oklch(94% 0.007 260);
  --muted-foreground:   oklch(50% 0.018 260);
  --border:             oklch(88% 0.007 260);
  --input:              oklch(88% 0.007 260);
  --ring:               oklch(50% 0.15 268);
}

/* Dark mode — primary surface */
.dark {
  --primary:            oklch(65% 0.15 268);
  --background:         oklch(11% 0.008 260);
  --foreground:         oklch(94% 0.005 260);
  --card:               oklch(16% 0.01 260);
  --muted:              oklch(21% 0.009 260);
  --border:             oklch(27% 0.009 260);
}
```

Chroma guide: 0.00–0.16 (dark-first, minimal)

---

## Creative / Agency

Inspired by: Figma, Framer, Dribbble — expressive, bold

```css
/* Light mode */
:root {
  --primary:            oklch(38% 0.19 292);
  --primary-foreground: oklch(97% 0.004 292);
  --secondary:          oklch(56% 0.17 28);
  --secondary-foreground: oklch(97% 0.004 28);
  --accent:             oklch(82% 0.11 85);
  --accent-foreground:  oklch(15% 0.01 85);
  --background:         oklch(97% 0.004 280);
  --foreground:         oklch(13% 0.01 280);
  --card:               oklch(99% 0 0);
  --card-foreground:    oklch(13% 0.01 280);
  --muted:              oklch(94% 0.006 280);
  --muted-foreground:   oklch(50% 0.018 280);
  --border:             oklch(87% 0.007 280);
  --input:              oklch(87% 0.007 280);
  --ring:               oklch(38% 0.19 292);
}

/* Dark mode */
.dark {
  --primary:            oklch(68% 0.20 292);
  --background:         oklch(12% 0.01 280);
  --foreground:         oklch(95% 0.004 280);
  --card:               oklch(18% 0.009 280);
  --muted:              oklch(23% 0.009 280);
  --border:             oklch(28% 0.009 280);
}
```

Chroma guide: 0.15–0.22 (highest saturation — intentionally bold)

---

## Enterprise SaaS

Inspired by: Notion, Salesforce, HubSpot — structured, neutral

```css
/* Light mode */
:root {
  --primary:            oklch(49% 0.14 250);
  --primary-foreground: oklch(98% 0.004 250);
  --secondary:          oklch(64% 0.13 165);
  --secondary-foreground: oklch(15% 0.01 165);
  --accent:             oklch(60% 0.11 220);
  --accent-foreground:  oklch(98% 0.004 220);
  --background:         oklch(97% 0.005 250);
  --foreground:         oklch(17% 0.018 250);
  --card:               oklch(100% 0 0);
  --card-foreground:    oklch(17% 0.018 250);
  --muted:              oklch(95% 0.007 250);
  --muted-foreground:   oklch(53% 0.02 250);
  --border:             oklch(90% 0.008 250);
  --input:              oklch(90% 0.008 250);
  --ring:               oklch(49% 0.14 250);
}

/* Dark mode */
.dark {
  --primary:            oklch(64% 0.14 250);
  --background:         oklch(15% 0.01 250);
  --foreground:         oklch(95% 0.005 250);
  --card:               oklch(20% 0.01 250);
  --muted:              oklch(25% 0.008 250);
  --border:             oklch(30% 0.01 250);
}
```

Chroma guide: 0.04–0.15 (conservative, institutional)

---

## Education

Inspired by: Duolingo, Khan Academy, Coursera — vivid, motivating

```css
/* Light mode */
:root {
  --primary:            oklch(59% 0.17 138);
  --primary-foreground: oklch(15% 0.01 138);
  --secondary:          oklch(64% 0.15 233);
  --secondary-foreground: oklch(98% 0.004 233);
  --accent:             oklch(72% 0.16 55);
  --accent-foreground:  oklch(15% 0.01 55);
  --background:         oklch(98% 0.004 0);
  --foreground:         oklch(17% 0.01 0);
  --card:               oklch(100% 0 0);
  --card-foreground:    oklch(17% 0.01 0);
  --muted:              oklch(95% 0.006 0);
  --muted-foreground:   oklch(53% 0.015 0);
  --border:             oklch(90% 0.006 0);
  --input:              oklch(90% 0.006 0);
  --ring:               oklch(59% 0.17 138);
}

/* Dark mode */
.dark {
  --primary:            oklch(72% 0.17 138);
  --background:         oklch(15% 0.01 260);
  --foreground:         oklch(95% 0.005 0);
  --card:               oklch(20% 0.008 260);
  --muted:              oklch(25% 0.01 260);
  --border:             oklch(30% 0.01 260);
}
```

Chroma guide: 0.13–0.18 (vivid, gamified, engaging)

---

## Semantic Colors (Universal)

```css
:root {
  --success:         oklch(58% 0.16 145);
  --success-fg:      oklch(15% 0.01 145);
  --warning:         oklch(72% 0.15 78);
  --warning-fg:      oklch(15% 0.01 78);
  --error:           oklch(53% 0.20 25);
  --error-fg:        oklch(98% 0.004 25);
  --info:            oklch(56% 0.14 240);
  --info-fg:         oklch(98% 0.004 240);
}
```

---

**Chroma quick guide:**
- 0.00–0.08: minimal / achromatic
- 0.09–0.15: professional / balanced
- 0.16–0.20: vibrant / consumer
- 0.21–0.25: bold / creative only

---

## Sector Mapping Table (for unlisted industries)

If your project's sector is not listed above, use this table to find the closest palette:

| Project Sector | Use Palette | Typography Pair | Why |
|---|---|---|---|
| Auto-ecole / Driving school | **Education** | Pair 16 (Nunito + DM Sans) | Learning-focused, friendly, approachable |
| Immobilier / Real estate | **Enterprise SaaS** | Pair 3 (Plus Jakarta Sans + Source Sans 3) | Professional, trust-oriented |
| Restauration / Food service | **E-commerce** | Pair 6 (Bricolage Grotesque + DM Sans) | Warm, conversion-focused, friendly |
| Juridique / Legal | **Fintech** | Pair 2 (Neue Haas Grotesk + DM Sans) | Institutional, rigorous, trust |
| Sport / Fitness | **Health / Wellness** | Pair 14 (Outfit + DM Sans) | Energetic but approachable |
| Tourisme / Travel | **E-commerce** | Pair 5 (Clash Display + Satoshi) | Aspirational, visual, premium |
| Comptabilite / Accounting | **Fintech** | Pair 1 (Cabinet Grotesk + Geist) | Precise, trustworthy, numbers |
| Association / Non-profit | **Health / Wellness** | Pair 15 (Nunito + Plus Jakarta Sans) | Warm, human, inclusive |
| Logistique / Logistics | **Dev Tools** | Pair 9 (Space Grotesk + Space Mono) | Technical, operational, data-heavy |
| Architecture / Design | **Creative / Agency** | Pair 11 (Familjen Grotesk + Literata) | Editorial, visual, warm |
| Media / Podcast | **Media / Publishing** | Pair 18 (Playfair Display + Source Serif 4) | Editorial authority |
| Gaming / eSport | **Creative / Agency** | Pair 10 (Switzer + General Sans) | Bold, expressive, high-energy |

**Rule:** Adjust the palette hue ±15° to differentiate from the base sector. For example, auto-ecole can shift Education green toward teal (hue +20°) for a road/safety feel.

---

-> See [identity-brief.md](identity-brief.md) for sector selection
-> See [visual-technique-matrix.md](visual-technique-matrix.md) for allowed visual effects per sector
