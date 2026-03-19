---
name: stats-section
description: Stats row with countUp animation on scroll intersection
when-to-use: Social proof sections displaying metrics, achievements, or KPIs
keywords: stats, counter, animated-numbers, metrics, social-proof
priority: medium
related: hero-section.md, feature-grid.md
---

# Stats Section Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>Stats section — 3-4 animated metrics, countUp on scroll, responsive grid</component>
    <aesthetics>Number-forward — the statistic IS the hero of each item. Large display number with small label below. Optional thin separator lines between items on desktop. No cards, no borders — let the numbers breathe on the background</aesthetics>
    <typography>
      - Stat number: var(--font-display), clamp(2.5rem, 5vw, 4rem), font-weight 800, color oklch(var(--primary))
      - Stat suffix (+, %, /7): var(--font-display), 1.5rem, font-weight 600, same color, aligned top-right of number
      - Stat label: var(--font-body), 0.875rem, font-weight 400, color oklch(var(--muted-foreground)), mt-2
      - Optional icon: 1.25rem, above number, same color as number
    </typography>
    <color_system>
      - Section bg: oklch(var(--background)) or oklch(var(--muted) / 0.3) for contrast band
      - Number color: oklch(var(--primary))
      - Label color: oklch(var(--muted-foreground))
      - Separator (optional): oklch(var(--border))
    </color_system>
    <spacing>Section py-16 md:py-24. Grid grid-cols-2 md:grid-cols-4, gap-8 md:gap-12. Each stat: text-center or text-left depending on grid width. Separator: hidden on mobile, visible md+</spacing>
    <states>
      - Before scroll intersection: numbers show 0 (no animated digits, just zero)
      - On scroll intersection (once: true): countUp starts, 2s duration, easeOut
      - CountUp complete: number holds final value (no loop)
      - Loading/SSR: render final value with no-JS fallback (numbers are in DOM)
      - Suffix: visible immediately, does not animate
    </states>
    <animations>Framer Motion: whileInView once true, triggerOnce. AnimatedNumber: useMotionValue(0), animate to target, useTransform with Math.round. Duration 2s with ease [0.25, 0.46, 0.45, 0.94]. Container: staggerChildren 0.1s on view</animations>
    <forbidden>
      - No rounded numbers — use specific values (10,247 not "10K+")
      - No loop animation (counts up once, stays)
      - No more than 4 stats (cognitive overload)
      - No stats without suffix for context
      - No card containers around stats (visual noise)
      - No Inter/Roboto/Arial
      - No hard-coded hex
    </forbidden>
  techStack: "React + Tailwind CSS + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## AnimatedNumber Logic

```tsx
// Pattern to instruct Gemini to implement
const count = useMotionValue(0)
const rounded = useTransform(count, Math.round)
useEffect(() => {
  const controls = animate(count, targetValue, { duration: 2, ease: [0.25, 0.46, 0.45, 0.94] })
  return controls.stop
}, [isInView])
```

## Validation Checklist

- [ ] CountUp triggers on scroll intersection only (once)
- [ ] Specific numbers used (never rounded to K/M)
- [ ] Suffix displayed immediately, not animated
- [ ] Max 4 stats
- [ ] No card/border wrappers around individual stats
- [ ] OKLCH CSS variables only, no hard-coded hex
