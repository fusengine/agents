---
name: identity-brief
description: Structured questionnaire and decision tree for brand identity discovery
when-to-use: Starting a new project, defining visual identity from scratch
keywords: identity, brand, brief, questionnaire, personality, sector
priority: high
related: sector-palettes.md, typography-pairs.md
---

# Identity Brief

## Purpose

The identity brief captures project context to generate a unique visual identity. Run this BEFORE any design work.

## Questionnaire

### Core Questions

| # | Question | Options |
|---|----------|---------|
| 1 | What sector? | fintech, health, e-commerce, dev-tools, creative, enterprise, education |
| 2 | What personality? | premium, playful, serious, technical, luxury, friendly |
| 3 | Who is the audience? | B2B, B2C, developers, enterprise, mixed |
| 4 | Name 2-3 competitors | Free text (used to differentiate) |
| 5 | Desired user feeling? | trust, excitement, calm, focus, delight |
| 6 | Content density? | dense (data-heavy), standard (balanced), editorial (content-focused) |
| 7 | Brand maturity? | new (no existing brand), evolving (some assets), established (strict guidelines) |

### Optional Deep-Dive

| # | Question | Impact |
|---|----------|--------|
| 8 | Existing brand colors? | Constrains palette generation |
| 9 | Target platforms? | Affects spacing and touch targets |
| 10 | Accessibility level? | AA (default) or AAA (stricter contrast) |

## Decision Tree

```
SECTOR
  -> fintech/enterprise -> SERIOUS personality
     -> Trust blue palette + professional typography
     -> Dense or standard spacing
     -> Corporate motion (150ms, subtle)

  -> health/education -> FRIENDLY personality
     -> Warm teal/green palette + rounded typography
     -> Standard or editorial spacing
     -> Modern SaaS motion (200-300ms, spring)

  -> e-commerce -> PREMIUM or PLAYFUL personality
     -> Brand-specific + conversion orange accent
     -> Standard spacing
     -> Modern SaaS or playful motion

  -> dev-tools -> TECHNICAL personality
     -> Dark base + neon accents
     -> Dense spacing
     -> Corporate motion (150ms, ease-out)

  -> creative/agency -> PREMIUM or PLAYFUL personality
     -> Bold primaries + high contrast
     -> Editorial spacing
     -> Playful or luxury motion
```

## Output

The brief produces a completed `design-system.md` file containing:
- Identity summary (sector, personality, audience)
- Color palette (OKLCH with semantic tokens)
- Typography pair (display + body)
- Spacing profile (base unit + density)
- Motion personality (durations + easing)
- Component token overrides

-> See [design-system-template.md](templates/design-system-template.md) for the output template

## When to Re-run

- Major pivot in product direction
- Rebranding effort
- New product line within same company
- Migration from legacy design system
