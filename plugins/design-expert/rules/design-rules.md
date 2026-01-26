# Design Rules (STRICT - NO EXCEPTIONS)

## FONTS - MANDATORY

### NEVER USE (AI Slop)
- Inter
- Roboto
- Arial
- Open Sans
- Lato
- System default

### ALWAYS USE (Copy these imports)
```css
/* Display headings */
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

/* Body text */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');

/* Alternative display */
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap');
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

## VALIDATION CHECKLIST

Before ANY UI code:
- [ ] Font imports present (Clash/Satoshi)
- [ ] CSS variables defined in :root
- [ ] No hard-coded colors
- [ ] Framer Motion imported
- [ ] Glassmorphism or depth effects
- [ ] Chart colors use CSS variables
