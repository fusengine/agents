---
name: stats-section
description: Stats row with countUp animation on scroll intersection
when-to-use: Social proof sections displaying metrics, achievements, or KPIs
keywords: stats, counter, animated-numbers, metrics, social-proof
priority: medium
related: hero-section.md, feature-grid.md
---

# Stats Section Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Row | 3-4 stat items evenly distributed | 2-col mobile -> 4-col desktop |
| Each stat | Large number + suffix + label | Centered text |
| Optional | Decorative icon above number | Same icon family |

**Research: Use specific numbers (10,247 not "10K+"). Odd numbers feel more authentic. Include suffix (+, %, /7) for context.**

## Components (shadcn/ui)

- No specific shadcn components needed
- Custom AnimatedNumber using Framer Motion useMotionValue

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| number-size | text-4xl font-bold | Stat prominence |
| number-color | text-primary | Brand color |
| label-color | text-muted-foreground | Secondary text |
| grid-gap | gap-8 | Spacing between stats |
| grid-cols | sm:grid-cols-2 lg:grid-cols-4 | Responsive grid |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Numbers | countUp from 0 to target value | 2s on scroll |
| Trigger | useInView / whileInView, once: true | On intersection |
| Motion value | useMotionValue + useTransform(Math.round) | Smooth counting |

## Gemini Design Prompt

> "Create a stats section with 3-4 metrics in a responsive row (2-col mobile, 4-col desktop). Each stat has a large animated number with suffix (+, %, /7), and a descriptive label below. Numbers count up from 0 on scroll intersection using Framer Motion useMotionValue. Use design-system.md tokens. OKLCH colors, no Inter/Roboto. Use specific numbers, not rounded."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with Framer Motion countUp |
| Laravel Blade | Visual spec -> Alpine.js x-intersect counter |
| Swift/SwiftUI | Visual spec -> TimelineView with number animation |

## Validation Checklist

- [ ] CountUp triggers on scroll, not on page load
- [ ] Specific numbers used (10,247 not "10K+")
- [ ] Suffix displayed correctly (+, %, /7)
- [ ] Responsive: 2-col on mobile, 4-col on desktop
- [ ] OKLCH colors, no hard-coded hex, no Inter/Roboto
