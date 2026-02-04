# Design Rules (STRICT - NO EXCEPTIONS)

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
Touch target: 44x44px minimum (a11y)
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

### Corner Radius (CONSISTENT)
```css
/* Pick ONE and use everywhere */
--button-radius: 8px;  /* OR 12px OR 9999px (pill) */
```

## FORMS - MANDATORY (from UI+UX Guide)

### Layout Rules
```
ALWAYS: Single column layout
NEVER: Multi-column (disrupts vertical momentum)
```

### Field States (ALL REQUIRED)
```
Normal → Active (focus) → Completed (✓) → Error (red) → Disabled
```

### Validation
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

## VALIDATION CHECKLIST

Before ANY UI code:
- [ ] Font imports present (Clash/Satoshi)
- [ ] CSS variables defined in :root
- [ ] No hard-coded colors
- [ ] Framer Motion imported
- [ ] Glassmorphism or depth effects
- [ ] Chart colors use CSS variables
- [ ] Button states (hover, pressed, disabled)
- [ ] Form single-column layout
- [ ] Icons same stroke width
- [ ] 60-30-10 color ratio
- [ ] Touch targets 44x44px minimum
