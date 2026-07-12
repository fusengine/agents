---
name: motion-physics
description: Physical correctness rules — never scale(0), origin-aware popovers, asymmetric timing, stagger, blur masking, @starting-style
when-to-use: Building entrances/exits, popovers, tooltips, toasts, buttons, staggered lists
keywords: scale, transform-origin, origin-aware, asymmetric, stagger, blur, starting-style, tooltip, marquee
priority: high
related: motion-tokens.md, motion-performance.md, animation-decision-framework.md
---

# Motion Physics

Adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) (`emil-design-eng/SKILL.md`, `review-animations/STANDARDS.md`). Motion feels right when it obeys how real objects behave.

## Never animate from scale(0)

Nothing in the real world appears from nothing. `scale(0)` looks like the element teleports in. Start from **`scale(0.9)`–`scale(0.97)`** combined with `opacity: 0` — even a barely-visible initial scale reads as natural, like a balloon that keeps its shape when deflated.

```css
/* Bad */  .entering { transform: scale(0); }
/* Good */ .entering { transform: scale(0.95); opacity: 0; }
```

Button press feedback: `transform: scale(0.97)` on `:active` (subtle, 0.95–0.98) with `transition: transform 160ms var(--ease-out)`. Applies to any pressable element.

## Anchor the transform-origin to the trigger

Popovers, dropdowns and tooltips should scale *from their trigger*, not from center — the default `transform-origin: center` is wrong for almost every anchored surface. **Modals are the exception**: they are not anchored to a trigger, they appear centered, so they keep `transform-origin: center`.

```css
.popover { transform-origin: var(--radix-popover-content-transform-origin); } /* Radix */
.popover { transform-origin: var(--transform-origin); }                       /* Base UI */
```

## Tooltips: instant on subsequent hovers

The first tooltip delays before appearing, to prevent accidental activation. Once one is open, hovering an adjacent tooltip should open it **instantly — skip delay and skip animation**. Feels faster without defeating the initial delay's purpose.

```css
.tooltip[data-instant] { transition-duration: 0ms; }
```

## Asymmetric timing

Slow where the user is deciding, fast where the system responds. A press is deliberate; the release is always snappy.

```css
.overlay { transition: clip-path 200ms var(--ease-out); }          /* release: fast */
.button:active .overlay { transition: clip-path 2s linear; }       /* press: slow, deliberate */
```

Exit is generally faster than entrance for the same reason.

## Stagger

Stagger group entrances by **30–80ms** between items — longer feels slow. Stagger is decorative: **never block interaction while it plays**.

```css
.item { opacity: 0; transform: translateY(8px); animation: fadeIn 300ms var(--ease-out) forwards; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
```

**Marquee: max one per page** (Fusengine design decision, not from the source repos — the emilkowalski sources only classify marquee easing as `linear`). More than one continuous scroller competes for attention and cheapens both.

## Blur to mask imperfect crossfades

When a crossfade shows two overlapping states despite tuning easing and duration, add subtle `filter: blur(2px)` during the transition — it blends the two states into one perceived transformation. Keep blur **≤ 20px** (heavy blur is expensive, especially in Safari).

## @starting-style for entry without JS

The modern replacement for the `useEffect(() => setMounted(true), [])` + `data-mounted` pattern:

```css
.toast {
  opacity: 1; transform: translateY(0);
  transition: opacity 400ms var(--ease-out), transform 400ms var(--ease-out);
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```

Percentage translates are relative to the element's own size, so `translateY(100%)` hides a toast/drawer by exactly its height regardless of dimensions. Fall back to the `data-mounted` attribute where browser support requires it.
