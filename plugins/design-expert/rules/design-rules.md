# Design Rules (STRICT — NO EXCEPTIONS)

> Forbidden fonts, contrast thresholds, and the screenshot/review procedure are defined
> once in `skills/design-system/SKILL.md` and `skills/design-review/SKILL.md` — this file
> does not restate them. This file = **reusable component-pattern snippets only**, for
> stacks that render actual JSX/Tailwind (React/Next.js) on top of the generated HTML/CSS.

## IDENTITY SYSTEM — PREREQUISITE

1. Check for `design-system.md` in project root or `docs/`.
2. If missing → run `skills/design-system/SKILL.md` first.
3. ALL components reference `design-system.md` tokens — never a default shadcn palette
   without customization.

## COMPONENT PATTERNS

### Cards
```tsx
/* NEVER: Flat white card — ALWAYS: Elevated with depth */
<motion.div
  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6
             border border-white/20 shadow-xl shadow-black/5"
  whileHover={{ y: -4, shadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }}
>
```

### KPI Cards
```tsx
/* NEVER same visual weight — ALWAYS hierarchy */
<motion.div className="col-span-2 bg-gradient-to-br from-primary to-primary/80 text-white">
  <span className="text-5xl font-display font-bold">26</span>
  <span className="text-white/70">Total Cases</span>
</motion.div>
```

Card limits: Title max 2 lines (`line-clamp-2`), Description max 3 lines, max 1 primary CTA.

### Charts (Recharts)
```tsx
/* NEVER default colors or hex — ALWAYS CSS variables mapped from design-system.md tokens */
<Bar fill="var(--color-primary)" />
<Cell fill={`var(--color-chart-${i + 1})`} />
```

## BUTTONS

Sizing: height 40-60px, padding-x 16-32px, font 16pt (13-20pt range), touch target 44x44px min.

### States (ALL REQUIRED)
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  disabled={isLoading}
  className="disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isLoading ? <Spinner /> : "Label"}
</motion.button>
```

Corner radius: pick ONE (`8px` / `12px` / `9999px` pill) — use everywhere. Contrast
threshold: see `skills/design-system/references/contrast-ratios.md` (canonical).

## FORMS

Layout: ALWAYS single column. Exception: first+last name row only.
Field states: Normal → Focus → Completed (check) → Error (red) → Disabled.
Validation: inline on blur, specific messages (NOT "Invalid input").

## ICONS

- Same stroke width, same corner style, same pack (Lucide/Heroicons/Tabler).
- Sizes: `h-4 w-4` (16px dense) · `h-5 w-5` (20px buttons) · `h-6 w-6` (24px standard).

## GRIDS

12-column system: `grid grid-cols-12 gap-6`.
Responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.

## COLOR USAGE — 60-30-10 RULE

60% Background/Surface · 30% Text/Content · 10% Primary/Accent (buttons, CTAs).

## PHOTOS

Resolution: Hero 1920x1080, Cards 800x600, Avatars 256x256 minimum.
Background text: ALWAYS add overlay `bg-gradient-to-t from-black/60 to-transparent`.

## LOADING STATES

- ALWAYS skeleton screens (9-12% faster perceived — NNG), NEVER spinner only.
- Skeleton matches content layout shape, shimmer animation on placeholders.

## REDESIGN DETECTION

| User Says | Mode | Behavior |
|---|---|---|
| "refonte", "redesign", "from scratch" | **FULL** | New `design-system.md` + replace ALL |
| "crée une page", "nouvelle page" | **PAGE** | Reuse existing `design-system.md` |
| "ameliorer", "ajuster", "modifier" | **Iteration** | Keep identity, modify targeted |
| "petit composant", "minor" | **COMPONENT** | No browsing, existing tokens only |

> Scope-to-site-count mapping: see `skills/design-method/SKILL.md` routing table.

## VALIDATION CHECKLIST (component-pattern specific)

Before shipping a component built with this file's patterns:
- [ ] CSS variables in BOTH `:root` AND `.dark` (values come from `design-system.md`)
- [ ] Framer Motion imported where motion was gated "in" by `skills/design-motion/SKILL.md`
- [ ] Chart colors use CSS variables, never hex
- [ ] Button states (hover, pressed, disabled) all present
- [ ] Form single-column layout
- [ ] Icons same stroke width, same pack
- [ ] 60-30-10 color ratio respected
- [ ] Touch targets 44x44px minimum
- [ ] NO emojis in UI — use icons
- [ ] Professional testimonials (name, role, company, quote, avatar)
- [ ] Footer: 4 columns, links, social, legal

> Fonts, contrast, OKLCH-only, and the light/dark screenshot pass are validated by
> `skills/design-review/SKILL.md` — not duplicated in this checklist.
