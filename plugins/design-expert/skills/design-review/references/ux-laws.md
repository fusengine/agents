---
name: ux-laws
description: Laws of UX and cognitive psychology principles applied to interface design
when-to-use: Understanding user behavior, applying psychology to UX, optimizing decision flows
keywords: laws of ux, cognitive, fitts, hicks, miller, jakob, peak-end rule
priority: high
related: ux-nielsen.md, ux-wcag.md, ux-patterns.md
---

# Laws of UX (Cognitive Psychology)

## Sources
- [Laws of UX](https://lawsofux.com/)

---

## Fitts's Law

**Time to reach target = f(distance, size)**

> Larger targets + closer position = faster interaction

```tsx
// PRIMARY ACTIONS: Large and prominent
<Button size="lg" className="w-full">Get Started</Button>

// Touch targets: 48x48dp minimum (Material Design)
<button className="min-h-12 min-w-12 p-3 touch-manipulation">
  <Icon className="h-6 w-6" />
</button>

// Position important actions in thumb zone (mobile)
<nav className="fixed bottom-0 left-0 right-0">
  {/* Primary actions HERE - easy thumb reach */}
</nav>
```

---

## Hick's Law

**Decision time = f(number of choices)**

> More options = longer decisions = higher abandonment

```
PRICING PAGES:
✅ 3 options - optimal conversion
⚠️ 4-5 options - acceptable
❌ 6+ options - decision paralysis

NAVIGATION:
✅ 5-7 top-level items maximum
❌ 10+ items in a single menu
```

---

## Miller's Law

**Working memory: 7 ± 2 items**

> Chunk information into digestible groups

```tsx
// WRONG - 16 digits ungrouped
<Input value="4242424242424242" />

// CORRECT - Chunked into 4 groups
<Input value="4242 4242 4242 4242" />

// WRONG - Long form, all fields visible
<form>{allFields.map(f => <Input {...f} />)}</form>

// CORRECT - Multi-step wizard
<Stepper>
  <Step title="Account">...</Step>
  <Step title="Profile">...</Step>
  <Step title="Preferences">...</Step>
</Stepper>
```

---

## Jakob's Law

**Users expect your site to work like other sites they know.**

> Follow established conventions

```
ESTABLISHED PATTERNS:
- Logo top-left → links to home
- Shopping cart icon top-right
- Hamburger menu → mobile navigation
- Footer → legal, sitemap, contact
- Blue underlined text → link
```

---

## Peak-End Rule

**Users judge experiences by peaks and endings, not averages.**

```tsx
// OPTIMIZE: Checkout success (the END)
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  className="text-center py-12"
>
  <CheckCircle className="h-16 w-16 text-success mx-auto" />
  <h1 className="text-2xl font-bold mt-4">Order Confirmed!</h1>
  <p className="text-muted-foreground">
    You'll receive a confirmation email shortly.
  </p>
</motion.div>

// OPTIMIZE: Delight moments (PEAKS)
// - First successful action
// - Milestone achievements
// - Empty state → first content
```

---

## Von Restorff Effect (Isolation Effect)

**Distinctive items are remembered better.**

```tsx
// Make primary CTA stand out
<div className="flex gap-2">
  <Button variant="outline">Learn More</Button>
  <Button variant="default">Get Started</Button> {/* STANDS OUT */}
</div>

// Highlight recommended option
<div className="relative border-2 border-primary rounded-xl">
  <span className="absolute -top-3 left-4 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
    Most Popular
  </span>
  {/* Plan content */}
</div>
```

---

## Goal-Gradient Effect

**Motivation increases as users approach their goal.**

```tsx
// Show progress explicitly
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Profile completion</span>
    <span className="font-medium">75%</span>
  </div>
  <Progress value={75} />
  <p className="text-sm text-muted-foreground">
    Add a profile photo to complete your profile!
  </p>
</div>
```

---

## CHECKLIST: Laws of UX

- [ ] Max 5-7 navigation items
- [ ] Information chunked into groups
- [ ] Progressive disclosure used
- [ ] Primary action visually distinct
- [ ] Optimize for peak and end moments
- [ ] Touch targets ≥ 48×48 dp
- [ ] Show progress toward goals
