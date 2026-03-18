# Design Rules (STRICT - NO EXCEPTIONS)

## IDENTITY SYSTEM - MANDATORY (v2.0)

### BEFORE ANY COMPONENT
1. Check for `design-system.md` in project root or docs/
2. If missing → Run identity-system skill FIRST
3. ALL components must reference design-system.md tokens
4. NEVER use default shadcn palette without customization

### Identity Overrides Font Rules
If design-system.md specifies different fonts than Clash Display/Satoshi,
USE the identity fonts. The font rules below are DEFAULTS for when
no identity has been established.

## FONTS - MANDATORY

### NEVER USE (AI Slop)
- Roboto
- Arial
- Open Sans
- Lato
- System default

### ALWAYS USE (Copy these imports)
```css
/* Display headings - Fontshare (MANDATORY) */
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

/* Body text - Fontshare (MANDATORY) */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');

/* Alternative display */
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap');

/* Code/Monospace */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
```

## COLORS - MANDATORY

### NEVER USE
- `text-gray-*` without CSS variables
- `bg-blue-500`, `bg-purple-*` (generic Tailwind)
- Purple-to-pink gradients
- Hard-coded hex values
- Recharts default colors

### ALWAYS USE
```css
/* Define in :root */
--color-primary: oklch(55% 0.20 260);
--color-accent: oklch(75% 0.18 145); /* Sharp green accent */
--color-surface: oklch(98% 0.01 260);
--color-surface-elevated: oklch(100% 0 0);

/* Use via Tailwind */
className="bg-[var(--color-surface)] text-[var(--color-foreground)]"
className="bg-primary text-primary-foreground" /* if @theme mapped */
```

## CHARTS (Recharts) - MANDATORY

### NEVER USE
- Default Recharts colors
- `fill="#8884d8"` or similar hex

### ALWAYS USE
```tsx
const CHART_COLORS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  muted: 'var(--color-muted)',
};

<Bar fill="var(--color-primary)" />
<Pie data={data} dataKey="value">
  {data.map((_, i) => (
    <Cell key={i} fill={`var(--color-chart-${i + 1})`} />
  ))}
</Pie>
```

## VISUAL EFFECTS - MANDATORY

### NEVER USE
- Flat backgrounds
- No shadows
- No animations
- Border-left indicators

### ALWAYS USE
```tsx
/* Glassmorphism */
className="bg-white/80 backdrop-blur-xl border border-white/20"

/* Gradient orbs (background) */
<div className="absolute -z-10 inset-0">
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-2xl" />
</div>

/* Shadows */
className="shadow-lg shadow-primary/10"

/* Motion (REQUIRED for UI components) */
import { motion } from "framer-motion";
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

## COMPONENT PATTERNS - MANDATORY

### Cards
```tsx
/* NEVER: Flat white card */
<div className="bg-white rounded p-4">

/* ALWAYS: Elevated with depth */
<motion.div
  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6
             border border-white/20 shadow-xl shadow-black/5"
  whileHover={{ y: -4, shadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }}
>
```

### KPI Cards
```tsx
/* NEVER: All same visual weight */
<Card><h3>Total</h3><p>26</p></Card>
<Card><h3>Active</h3><p>5</p></Card>

/* ALWAYS: Visual hierarchy */
<motion.div className="col-span-2 bg-gradient-to-br from-primary to-primary/80 text-white">
  <span className="text-5xl font-display font-bold">26</span>
  <span className="text-white/70">Total Cases</span>
</motion.div>
<Card className="bg-white/80">...</Card>
```

## BUTTONS - MANDATORY (from UI+UX Guide)

### Sizing Rules
```
Height: 40-60px (never below 40px)
Padding X: 16-32px (web), full-width (mobile)
Font size: 16pt (never below 13pt, never above 20pt)
Touch target: 44x44px minimum (Apple HIG + WCAG 2.5.5)
```

### States (ALL REQUIRED)
```tsx
/* Default → Hover → Pressed → Disabled → Loading */
<motion.button
  whileHover={{ scale: 1.02 }}   /* 50-100ms */
  whileTap={{ scale: 0.98 }}     /* 100-150ms */
  disabled={isLoading}
  className="disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isLoading ? <Spinner /> : "Label"}
</motion.button>
```

### Contrast (ZERO TOLERANCE)
```
Dark bg (primary, accent)  → ALWAYS white/light text (text-primary-foreground)
Light bg (white, surface)  → ALWAYS dark text (text-foreground)
NEVER: dark text on dark button, light text on light button
Minimum: 4.5:1 contrast ratio (WCAG AA)
Verify: Playwright screenshot after generation — check BOTH modes
```

### Corner Radius (CONSISTENT)
```css
/* Pick ONE and use everywhere */
--button-radius: 8px;  /* OR 12px OR 9999px (pill) */
```

## FORMS - MANDATORY (from UI+UX Guide)

### Layout Rules
```
ALWAYS: Single column layout
EXCEPTION: First name + Last name may share a row (only paired short fields)
NEVER: Multi-column (disrupts vertical momentum)
```

### Field States (ALL REQUIRED)
```
Normal → Active (focus) → Completed (✓) → Error (red) → Disabled
```

### Validation (Inline on blur +25% completion — Baymard)
```tsx
/* Inline validation on blur (NOT on submit only) */
/* Specific error messages (NOT "Invalid input") */
<p className="text-sm text-destructive">
  Email must include @ symbol  {/* ✅ Specific */}
</p>
```

## ICONS - MANDATORY (from UI+UX Guide)

### Consistency Rules
```
- Same stroke width across ALL icons
- Same corner style (sharp OR rounded, never mix)
- Same icon pack (Lucide, Heroicons, Tabler - pick one)
```

### Sizing
```tsx
<Icon className="h-4 w-4" />  /* 16px - dense UI */
<Icon className="h-5 w-5" />  /* 20px - buttons */
<Icon className="h-6 w-6" />  /* 24px - standard */
```

## GRIDS - MANDATORY (from UI+UX Guide)

### 12-Column System
```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-8">Main</div>
  <div className="col-span-4">Sidebar</div>
</div>
```

### Responsive Pattern
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

## COLOR USAGE - 60-30-10 RULE (from UI+UX Guide)

```
60% → Background/Surface colors
30% → Text/Content colors
10% → Primary/Accent (buttons, CTAs)
```

## CARDS - MANDATORY (from UI+UX Guide)

### Content Limits
```
Title: max 2 lines (line-clamp-2)
Description: max 3 lines (line-clamp-3)
Buttons: max 1 primary CTA
```

## PHOTOS - MANDATORY (from UI+UX Guide)

### Resolution
```
Hero: 1920x1080 minimum
Cards: 800x600 minimum
Avatars: 256x256 minimum
```

### Background Text Readability
```tsx
/* ALWAYS add overlay for text on photos */
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
```

## GRADIENTS - FORBIDDEN COMBINATIONS

```css
/* ❌ NEVER - AI Slop */
from-purple-500 to-pink-500
from-indigo-500 to-purple-500

/* ✅ ALWAYS - Use CSS variables */
from-primary to-accent
from-primary to-primary/60
```

## DUAL-MODE ENFORCEMENT (v2.1) - ZERO TOLERANCE

### NEVER ASSUME
- NEVER assume dark-first or light-first — BOTH modes must work
- NEVER design for one mode only — user controls the toggle
- NEVER skip visual verification of either mode

### BOTH MODES MANDATORY
Every component, every page, every section MUST:
1. Use CSS variables that have BOTH `:root` AND `.dark` values
2. Be visually verified in light AND dark via Playwright
3. Have adequate contrast (4.5:1) in BOTH modes

### GLASSMORPHISM IN LIGHT MODE
Glass effects need different opacities per mode:
```css
/* Light: higher opacity, subtle blur */
bg-white/60 backdrop-blur-xl border-black/5

/* Dark: lower opacity, stronger blur */
dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/[0.06]
```

### GRADIENT ORBS IN LIGHT MODE
Orbs need higher opacity on light backgrounds:
```tsx
/* Light: 10-15% opacity */
className="bg-primary/12 dark:bg-primary/15"
```

### FONT VERIFICATION (BLOCKING)
After ANY UI generation:
1. Grep project CSS for font imports — Clash Display/Satoshi or identity fonts
2. If Roboto, Inter, Arial, Open Sans found in layout/CSS → BLOCK and fix
3. Verify `@import url()` or `next/font` loads the correct fonts

## MULTI-STACK RULES (v2.1)

### Framework Detection
| File | Stack | UI Approach |
|------|-------|-------------|
| No framework files | **HTML/CSS pur** | **Gemini Design `create_frontend`** — NEVER write HTML manually |
| `next.config.*` | Next.js | Gemini Design + shadcn |
| `composer.json` + `artisan` | Laravel | Check for Inertia |
| `Package.swift` | Swift | SwiftUI visual specs |

### HTML/CSS Pur (MANDATORY)
When generating a standalone HTML page:
1. Create design-system.md with OKLCH tokens
2. Build Gemini XML blocks with all 7 fields
3. Call `mcp__gemini-design__create_frontend` with full page description
4. The output IS the HTML file — do NOT rewrite it manually
5. Use `mcp__gemini-design__modify_frontend` for corrections

### Laravel Stack Detection
| Has Inertia? | Has React? | Approach |
|---|---|---|
| Yes | Yes | Gemini Design + shadcn (React frontend) |
| No | No | Visual specs → Livewire Flux |

## REDESIGN DETECTION (v2.1)

### Trigger Keywords → Behavior

| User Says | Mode | Behavior |
|---|---|---|
| "refonte", "repenser", "redesign", "nouveau look", "from scratch", "rethink", OR **no design-system.md exists** | **Full Redesign** | Browse 3 sites via Playwright + generate NEW identity-system + replace ALL components |
| "crée une page", "nouvelle page", "new page", "ajouter une section" | **New Page/Section** | Browse 2 sites via Playwright + respect existing identity-system |
| "ameliorer", "ajuster", "modifier", "tweaker", "update" | **Iteration** | Browse 1 site via Playwright + keep existing identity-system, modify targeted components |
| "ajouter un bouton", "petit composant", "minor" | **Minor Addition** | 21st.dev search sufficient (no Playwright browsing) |

### Playwright Browsing Rules (ALL modes except Minor)
- MANDATORY: Browse real sites via Playwright BEFORE generating (see ../skills/generating-components/references/design-inspiration.md)
- Analyze screenshots: colors, typography, spacing rhythm, section structure, animations
- Feed insights into Gemini XML `<style_reference>` block
- NEVER copy verbatim — extract principles, not pixels

### Full Redesign Rules
- Generate fresh design-system.md (do NOT patch existing)
- Replace components holistically — NOT piecemeal tweaks
- Use `create_frontend` (full view) — NOT `modify_frontend` (surgical)

## LOADING STATES - MANDATORY

- ALWAYS: Skeleton screens (perceived 9-12% faster — NNG)
- NEVER: Spinner only (no context)
- Skeleton matches content layout shape
- Use shimmer animation on skeleton placeholders

## VALIDATION CHECKLIST

Before ANY UI code:
- [ ] Font imports present (identity fonts or Clash/Satoshi)
- [ ] NO forbidden fonts (Roboto, Inter, Arial, Open Sans)
- [ ] CSS variables defined in BOTH :root AND .dark
- [ ] No hard-coded hex/rgb colors in components
- [ ] Framer Motion imported
- [ ] Glassmorphism or depth effects (adapted per mode)
- [ ] Chart colors use CSS variables
- [ ] Button states (hover, pressed, disabled)
- [ ] Form single-column layout
- [ ] Icons same stroke width
- [ ] 60-30-10 color ratio
- [ ] Touch targets 44x44px minimum
- [ ] Playwright screenshot in LIGHT mode
- [ ] Playwright screenshot in DARK mode
- [ ] NO emojis in UI (headings, cards, buttons, sections) — use icons
- [ ] Testimonials look professional (name, role, company, detailed quote, avatar)
- [ ] Sections feel polished — consistent spacing, aligned grids, visual rhythm
- [ ] Footer has real structure (4 columns, links, social, legal)
