---
name: motion-personality
description: Four motion profiles that define animation behavior for an entire app
when-to-use: Defining consistent motion language based on brand personality
keywords: motion, animation, personality, easing, duration, spring, corporate, playful
priority: high
related: identity-brief.md, spacing-density.md
---

# Motion Personality

## Why Motion Personality Matters

Motion communicates brand personality. A banking app should feel precise and efficient. A creative tool should feel energetic and delightful. Inconsistent motion breaks user trust.

## Four Profiles

### Corporate (Fintech, Enterprise, B2B)

| Property | Value |
|----------|-------|
| Quick actions | 150ms |
| Standard transitions | 200ms |
| Emphasis | 300ms |
| Easing | ease-out |
| Hover effect | opacity change, subtle lift |
| Entrance | fade-in only |
| Philosophy | Efficient, invisible, never distracting |

```typescript
const corporate = {
  quick: { duration: 0.15, ease: "easeOut" },
  standard: { duration: 0.2, ease: "easeOut" },
  emphasis: { duration: 0.3, ease: "easeOut" },
};
```

### Modern SaaS (Standard apps, B2C, E-commerce)

| Property | Value |
|----------|-------|
| Quick actions | 150ms |
| Standard transitions | 250ms |
| Emphasis | 400ms |
| Easing | spring(stiffness: 500, damping: 30) |
| Hover effect | scale 1.02, lift -4px |
| Entrance | fade + slide-up (20px) |
| Philosophy | Smooth, responsive, polished |

```typescript
const modernSaas = {
  quick: { duration: 0.15, ease: "easeOut" },
  standard: { type: "spring", stiffness: 500, damping: 30 },
  emphasis: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};
```

### Playful (Creative, Education, Consumer)

| Property | Value |
|----------|-------|
| Quick actions | 200ms |
| Standard transitions | 350ms |
| Emphasis | 500ms |
| Easing | spring(stiffness: 300, damping: 20) |
| Hover effect | scale 1.05, rotate 1-2deg |
| Entrance | bounce + stagger |
| Philosophy | Fun, bouncy, delightful |

```typescript
const playful = {
  quick: { duration: 0.2, ease: "easeOut" },
  standard: { type: "spring", stiffness: 300, damping: 20 },
  emphasis: { type: "spring", stiffness: 200, damping: 15 },
};
```

### Luxury (Premium, Fashion, High-end)

| Property | Value |
|----------|-------|
| Quick actions | 250ms |
| Standard transitions | 450ms |
| Emphasis | 700ms |
| Easing | cubic-bezier(0.16, 1, 0.3, 1) |
| Hover effect | slow opacity reveal, underline slide |
| Entrance | slow fade + scale from 0.98 |
| Philosophy | Slow, cinematic, deliberate |

```typescript
const luxury = {
  quick: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  standard: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  emphasis: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};
```

---

## Reduced Motion (MANDATORY)

ALL profiles must respect `prefers-reduced-motion`:

```typescript
const reducedMotion = {
  quick: { duration: 0 },
  standard: { duration: 0 },
  emphasis: { duration: 0 },
};
```

---

## Mapping: Sector to Profile

| Sector | Recommended Profile |
|--------|-------------------|
| Fintech | Corporate |
| Enterprise SaaS | Corporate or Modern SaaS |
| E-commerce | Modern SaaS |
| Dev Tools | Corporate |
| Health | Modern SaaS |
| Education | Playful |
| Creative | Playful or Luxury |

-> See [identity-brief.md](identity-brief.md) to determine which profile to use
