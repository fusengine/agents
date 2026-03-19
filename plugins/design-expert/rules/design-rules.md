# Design Rules (STRICT — NO EXCEPTIONS)

> Forbidden fonts/colors, visual effects, dual-mode, Playwright browsing
> defined in `agents/design-expert.md`. This file = **component patterns only**.

## IDENTITY SYSTEM — PREREQUISITE

1. Check for `design-system.md` in project root or `docs/`
2. If missing → run identity-system skill FIRST
3. ALL components must reference design-system.md tokens
4. NEVER use default shadcn palette without customization
5. If design-system.md specifies fonts different from Clash Display/Satoshi → USE identity fonts

## FONT VERIFICATION (BLOCKING)

After ANY UI generation:
1. Grep project CSS for font imports — Clash Display/Satoshi or identity fonts
2. If Roboto, Inter, Arial, Open Sans found → BLOCK and fix
3. Verify `@import url()` or `next/font` loads correct fonts

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
/* NEVER default colors or hex — ALWAYS CSS variables */
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

Contrast: dark bg → white text, light bg → dark text. Min 4.5:1 (WCAG AA).
Corner radius: pick ONE (`8px` / `12px` / `9999px` pill) — use everywhere.

## FORMS

Layout: ALWAYS single column. Exception: first+last name row only.
Field states: Normal → Focus → Completed (check) → Error (red) → Disabled.
Validation: inline on blur, specific messages (NOT "Invalid input").

## ICONS

- Same stroke width, same corner style, same pack (Lucide/Heroicons/Tabler)
- Sizes: `h-4 w-4` (16px dense) · `h-5 w-5` (20px buttons) · `h-6 w-6` (24px standard)

## GRIDS

12-column system: `grid grid-cols-12 gap-6`.
Responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.

## COLOR USAGE — 60-30-10 RULE

60% Background/Surface · 30% Text/Content · 10% Primary/Accent (buttons, CTAs).

## PHOTOS

Resolution: Hero 1920x1080, Cards 800x600, Avatars 256x256 minimum.
Background text: ALWAYS add overlay `bg-gradient-to-t from-black/60 to-transparent`.

## LOADING STATES

- ALWAYS skeleton screens (9-12% faster perceived — NNG), NEVER spinner only
- Skeleton matches content layout shape, shimmer animation on placeholders

## MULTI-STACK RULES

| File | Stack | UI Approach |
|------|-------|-------------|
| No framework files | HTML/CSS | Gemini `create_frontend` — NEVER write HTML manually |
| `next.config.*` | Next.js | Gemini Design + shadcn |
| `composer.json` + `artisan` | Laravel | Check Inertia → React or Livewire Flux |
| `Package.swift` | Swift | SwiftUI visual specs |

### HTML/CSS Standalone
1. Create design-system.md with OKLCH tokens
2. Build Gemini XML blocks (all 7 fields)
3. `create_frontend` → output IS the file, do NOT rewrite
4. `modify_frontend` for corrections

## REDESIGN DETECTION

| User Says | Mode | Behavior |
|---|---|---|
| "refonte", "redesign", "from scratch" | **Full Redesign** | New identity-system + replace ALL |
| "crée une page", "nouvelle page" | **New Page** | Respect existing identity-system |
| "ameliorer", "ajuster", "modifier" | **Iteration** | Keep identity, modify targeted |
| "petit composant", "minor" | **Minor** | 21st.dev search sufficient |

> Site count per mode: see `agents/design-expert.md` Phase 1.

## VALIDATION CHECKLIST

Before ANY UI code:
- [ ] Font imports present (identity or Clash/Satoshi)
- [ ] NO forbidden fonts (Roboto, Inter, Arial, Open Sans)
- [ ] CSS variables in BOTH `:root` AND `.dark`
- [ ] No hard-coded hex/rgb colors
- [ ] Framer Motion imported
- [ ] Glassmorphism/depth effects (adapted per mode)
- [ ] Chart colors use CSS variables
- [ ] Button states (hover, pressed, disabled)
- [ ] Form single-column layout
- [ ] Icons same stroke width
- [ ] 60-30-10 color ratio
- [ ] Touch targets 44x44px minimum
- [ ] Playwright screenshot LIGHT + DARK modes
- [ ] NO emojis in UI — use icons
- [ ] Professional testimonials (name, role, company, quote, avatar)
- [ ] Consistent spacing, aligned grids, visual rhythm
- [ ] Footer: 4 columns, links, social, legal
