---
name: onboarding
description: Onboarding flow with progress bar and stepped wizard pattern
when-to-use: Designing first-time user experience, setup wizards, welcome flows
keywords: onboarding, wizard, steps, progress, welcome, setup, tour
priority: high
related: auth-register.md, profile.md
---

# Onboarding Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Top | Progress bar (full width) | Thinner on mobile |
| Center | Step content card (max-w-lg) | Full width on mobile |
| Bottom | Back / Skip / Next buttons | Sticky on mobile |

**Research:** Progress bars increase form completion by +20-30% (Cialdini). Limit steps to 3-7 for optimal engagement.

## Components (shadcn/ui)

- `Progress` - Step progress indicator
- `Card` - Step content container
- `Button` - Navigation (back, skip, next, finish)
- `Avatar` - Profile photo upload step
- `Select` - Preference selection
- `RadioGroup` - Choice steps
- `Input` - Text input steps

## Step Flow

| Step | Content | Skippable |
|------|---------|-----------|
| 1. Welcome | Greeting + value proposition | No |
| 2. Profile | Avatar + display name | Partial (name required) |
| 3. Preferences | Role, industry, goals | Yes |
| 4. Integrations | Connect tools (optional) | Yes |
| 5. Tour | Interactive product tour | Yes |
| 6. Done | Success + primary CTA | No |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --onboarding-max-width | 512px (max-w-lg) | Step card width |
| --progress-height | 4px | Progress bar height |
| --step-padding | 32px | Step card padding |
| --btn-group-gap | 12px | Button spacing |

## Animation (Framer Motion)

- Step transitions: slide-left (next) / slide-right (back), 300ms
- Progress bar: smooth width animation
- Welcome step: stagger text entrance
- Done step: confetti or celebration animation

```typescript
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};
```

## Gemini Design Prompt

```
Create a multi-step onboarding wizard with progress bar at top, centered content card,
and back/skip/next buttons at bottom. 5 steps: Welcome, Profile, Preferences,
Integrations, Done. Slide transitions between steps. Use design-system.md tokens.
Progress bar animates smoothly. Skip button always visible on optional steps.
```

## Multi-Stack Adaptation

| Stack | State Management | Persistence |
|-------|-----------------|-------------|
| Next.js | URL search params + Zustand | Server Action on complete |
| React SPA | Zustand store | API call on complete |
| Laravel | Session wizard | Database on complete |

## Validation Checklist

- [ ] Progress bar shows current step clearly
- [ ] Skip button visible on optional steps
- [ ] Back button available (except step 1)
- [ ] Step transitions animate smoothly
- [ ] Keyboard navigation works (Enter = next)
- [ ] Final step has clear primary CTA
- [ ] Data persists if user refreshes mid-flow
- [ ] Mobile: buttons are sticky at bottom
