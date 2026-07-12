---
name: visual-technique-matrix
description: Matrix mapping personality × density to allowed/forbidden visual techniques
keywords: glassmorphism, gradients, shadows, blur, noise, animation, visual-techniques, matrix
priority: high
related: identity-brief.md, motion-personality.md, sector-palettes.md
---

# Visual Technique Matrix

## How to Read

Find your personality column + density row. Green = allowed, Red = forbidden, Yellow = use sparingly.

---

## Personality Definitions

| Personality | Description | Sectors |
|-------------|-------------|---------|
| **playful** | Rounded, colorful, animated | Education, consumer apps |
| **professional** | Clean, structured, restrained | Fintech, enterprise, health |
| **luxury** | Bold, editorial, dramatic | Creative agency, fashion, premium |
| **technical** | Precise, monochrome, dense | Dev tools, data, engineering |

## Density Definitions

| Density | Base unit | Whitespace | Font size |
|---------|-----------|------------|-----------|
| **spacious** | 12px+ | Generous | 18px+ base |
| **comfortable** | 8px | Balanced | 16px base |
| **dense** | 4px | Compact | 14px base |

---

## Glassmorphism

| | spacious | comfortable | dense |
|---|---------|-------------|-------|
| **playful** | OK (light frosted panels) | Use sparingly | Forbidden |
| **professional** | Forbidden | Forbidden | Forbidden |
| **luxury** | OK (hero sections only) | Use sparingly | Forbidden |
| **technical** | Forbidden | Forbidden | Forbidden |

Rule: Glassmorphism only works with generous whitespace and high contrast backgrounds.

---

## Gradients

| | spacious | comfortable | dense |
|---|---------|-------------|-------|
| **playful** | OK (vibrant, radial) | OK (subtle) | Use sparingly |
| **professional** | Use sparingly (monochrome) | Use sparingly | Forbidden |
| **luxury** | OK (dark, cinematic) | OK (muted) | Use sparingly |
| **technical** | Forbidden | Forbidden | Forbidden |

Rule: Professional/technical gradients must be achromatic (L variation only, same hue).

---

## Box Shadows

| | spacious | comfortable | dense |
|---|---------|-------------|-------|
| **playful** | OK (soft, colorful) | OK | OK (minimal) |
| **professional** | OK (elevation system) | OK (subtle) | Use sparingly |
| **luxury** | OK (dramatic, deep) | OK | Use sparingly |
| **technical** | Use sparingly (flat elevated) | Use sparingly | Forbidden (borders only) |

Rule: Technical/dense UIs use border elevation, not shadow elevation.

---

## Blur Effects (backdrop-filter)

| | spacious | comfortable | dense |
|---|---------|-------------|-------|
| **playful** | OK | Use sparingly | Forbidden |
| **professional** | Forbidden | Forbidden | Forbidden |
| **luxury** | OK (navigation, hero) | Use sparingly | Forbidden |
| **technical** | Forbidden | Forbidden | Forbidden |

Rule: Blur requires P3 display support. Always provide fallback (solid background).

---

## Noise / Grain Texture

| | spacious | comfortable | dense |
|---|---------|-------------|-------|
| **playful** | Use sparingly | Use sparingly | Forbidden |
| **professional** | Forbidden | Forbidden | Forbidden |
| **luxury** | OK (subtle, 2-4% opacity) | Use sparingly | Forbidden |
| **technical** | Forbidden | Forbidden | Forbidden |

---

## Geometric Patterns / Decorative

| | spacious | comfortable | dense |
|---|---------|-------------|-------|
| **playful** | OK (background, hero) | OK | Use sparingly |
| **professional** | Forbidden | Forbidden | Forbidden |
| **luxury** | OK (subtle grid, editorial) | Use sparingly | Forbidden |
| **technical** | Forbidden | Forbidden | Forbidden |

---

## Animations (Entrance/Exit)

| | spacious | comfortable | dense |
|---|---------|-------------|-------|
| **playful** | OK (spring, bounce) | OK (spring) | Use sparingly |
| **professional** | OK (fade, slide) | OK (fade) | Use sparingly (fade only) |
| **luxury** | OK (slow, cinematic) | OK (slow) | Use sparingly |
| **technical** | Use sparingly (instant/fade) | Use sparingly | Forbidden (state-change only) |

---

## Quick Decision Table

| Scenario | Allowed |
|----------|---------|
| luxury + spacious | glassmorphism, gradients, blur, noise, animations |
| enterprise + dense | flat elevated cards, borders, fade transitions |
| playful + comfortable | soft shadows, subtle gradients, spring animations |
| technical + dense | borders, no shadows, no gradients, instant transitions |
| fintech + comfortable | elevation shadows, monochrome gradients, fade only |
| ecommerce + comfortable | soft shadows, vibrant gradients, spring animations |
