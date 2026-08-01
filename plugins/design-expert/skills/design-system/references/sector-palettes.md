---
name: sector-palettes
description: "Seven OKLCH palettes, all derived from software companies — light and dark CSS variables. Deliberately NOT exhaustive and NOT a sector lookup: no luxury, hospitality or prestige real-estate entry exists, and none is to be invented. See the closing section for where a colour decision actually comes from."
when-to-use: "Building a ramp for a sector this file actually lists. For any other register, read the closing section first — the answer comes from the subject, not from the nearest row."
keywords: oklch, palette, sector, fintech, health, ecommerce, colors, brand, CSS, not-a-lookup
priority: high
related: identity-brief.md, typography-pairs.md, oklch-system.md, color-mapping.md
---

# Sector Palettes (OKLCH)

**Read the closing section, *This file is not exhaustive*, before using anything here.**
Seven palettes, all software-derived. If your sector is not one of the seven, this file
does not hold your answer and must not be made to fake one.

## How to Use

1. Check that your sector is genuinely one of the seven below — if not, go to the closing
   section; do not substitute the nearest row
2. Copy the CSS variables block for that sector
3. Adjust hue ±15° to differentiate from competitors — and check the result against the
   two-level slop test in `design-method/SKILL.md`, since a hue kept as-shipped is the
   category reflex
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

## This file is not exhaustive, and it is not a lookup

**Seven palettes, and all seven are software.** Fintech, health, e-commerce, dev tools,
agency, enterprise SaaS, education — each derived from software companies, each naming the
three it came from. There is **no luxury palette here, no hospitality palette, no prestige
real-estate palette**, and none for artisans, restaurants, cultural institutions or
heritage brands. That is a limit of this file, not a gap to close by picking the
least-wrong row.

**Nothing was invented to close those gaps, deliberately.** A "luxury = charcoal + brass"
entry written here would be the *category reflex* this pipeline bans at first order:
`design-method/SKILL.md` §*The AI-slop test* names "finance → navy + gold" and "healthcare →
white + teal" as failures. Adding "prestige real estate → cream + gold" would install the
slop inside the file meant to prevent it. A palette with no measured source is a guess with
a hex code, and a guess dressed as a reference is worse than an admitted gap.

### What was removed here, and why

Until 2026-07 this section held a twelve-row *Sector Mapping Table* routing any unlisted
industry to one of the seven above. It is gone. The row that decided it:

> `| Immobilier / Real estate | Enterprise SaaS | Pair 3 (Plus Jakarta Sans + Source Sans 3) | Professional, trust-oriented |`

A prestige estate agency sent to the Notion/Salesforce palette and a neutral product sans,
in the file whose whole job is to stop that. The same table routed *Media / Podcast* to a
**Media / Publishing** palette that has never existed in this file. Its typography column
was the sounder half — those pair numbers are real — but it never pointed anyone at the
*Luxury / Editorial* pairs that [typography-pairs.md](typography-pairs.md) has carried all
along. A routing table teaches lookup; lookup is the mechanism being removed.

### Where a colour decision actually comes from

In this order. Not one of these steps is a lookup.

1. **The subject.** What the thing physically is and is made of, where it happens, what the
   client already owns — a material, a light, a location, a document, a livery. That is the
   source, and it sits upstream of everything in this folder
   (`../../design-web/references/refs-design/README.md` §*What this corpus does not give
   you*).
2. **The Design Read and the register**, resolved in `design-method/SKILL.md` before any
   palette is touched. A tone committed to one extreme decides more about colour than a
   sector name ever will.
3. **The corpus, opened and looked at** — `../../design-web/references/refs-design/`, the
   fifteen `index.html` first, markdown second. It hands you no palette for your sector (all
   fifteen are tech) and is not meant to. What it hands you is how far a colour decision has to
   be carried before it holds: `fora` runs an entire page on one 1px rule at white 10%;
   `mainframe` ships with no accent at all.
4. **The mechanics** — [oklch-system.md](oklch-system.md) to build the ramp,
   [contrast-ratios.md](contrast-ratios.md) for the floor,
   [color-mapping.md](color-mapping.md) for role assignment. Those are canonical and they
   work in any register, listed here or not.
5. **The two-level slop test** (`design-method/SKILL.md`) applied to the result: guessable
   from the category alone is the first reflex; guessable from category-plus-anti-reference
   is the second.

### If you still want to start from a block above

Legitimate, under one condition: take it for its **chroma and lightness discipline**, never
for its hue. The chroma guides under each palette — and the quick guide above — are the
transferable part: they encode how saturated a surface can get before it reads cheap. The
hue is not transferable, it belongs to the three companies named at the top of that block.
Change it, and write in `design-system.md` what the new hue was read off **in the subject**.

---

-> See [identity-brief.md](identity-brief.md) for sector selection
-> See [typography-pairs.md](typography-pairs.md) — organised by sector too, and it *does*
   carry **Luxury / Editorial** and **Media / Publishing** sections, plus the serif
   discipline gating them
-> See [visual-technique-matrix.md](visual-technique-matrix.md) for allowed visual effects per sector
