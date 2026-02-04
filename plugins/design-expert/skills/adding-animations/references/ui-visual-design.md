---
name: ui-visual-design
description: UI visual design principles 2026 - Typography, color, spacing, layout, modern trends
when-to-use: Understanding visual hierarchy, applying spacing rules, following 2026 design trends
keywords: visual hierarchy, spacing, layout, trends, 2026, typography, color
priority: high
related: ux-principles.md, design-patterns.md
---

# UI Visual Design Principles 2026

## Sources
- [Netwave Interactive](https://www.netwaveinteractive.com/blog/visual-hierarchy-in-ui-ux-design-principles-strategies-and-best-practices/)
- [Promodo](https://www.promodo.com/blog/key-ux-ui-design-trends)
- [WriterDock](https://writerdock.in/blog/bento-grids-and-beyond-7-ui-trends-dominating-web-design-2026)

---

## PART 1: Visual Hierarchy

### Size Hierarchy (MANDATORY)

```
1. Hero headline     → text-5xl/6xl font-bold (48-60px)
2. Section title     → text-3xl/4xl font-semibold (30-36px)
3. Card title        → text-xl/2xl font-medium (20-24px)
4. Body text         → text-base font-normal (16px)
5. Caption/meta      → text-sm text-muted-foreground (14px)
6. Labels/badges     → text-xs uppercase tracking-wide (12px)
```

```tsx
// CORRECT - Clear hierarchy
<article>
  <h1 className="text-5xl font-bold">Main Headline</h1>
  <p className="text-xl text-muted-foreground mt-4">Subtitle or lead</p>
  <div className="mt-8">
    <h2 className="text-2xl font-semibold">Section</h2>
    <p className="text-base mt-2">Body content...</p>
  </div>
</article>

// WRONG - No hierarchy
<article>
  <h1 className="text-lg">Main Headline</h1>
  <p className="text-lg">Subtitle</p>
  <h2 className="text-lg">Section</h2>
  <p className="text-lg">Body</p>
</article>
```

### Color Hierarchy

```tsx
// PRIMARY - Most important (CTAs, key actions)
<Button className="bg-primary text-primary-foreground">Get Started</Button>

// SECONDARY - Supporting actions
<Button variant="outline">Learn More</Button>

// MUTED - De-emphasized content
<p className="text-muted-foreground">Last updated 2 days ago</p>

// DESTRUCTIVE - Dangerous actions
<Button variant="destructive">Delete</Button>
```

### Contrast for Attention

| Element | Contrast Level | Example |
|---------|---------------|---------|
| Primary CTA | High | `bg-primary` on white |
| Secondary CTA | Medium | `border-primary` outline |
| Navigation | Low-Medium | `text-foreground` |
| Metadata | Low | `text-muted-foreground` |

---

## PART 2: Typography System

### Font Pairing (2026 Standards)

```css
/* FORBIDDEN: Inter, Roboto, Arial (AI slop) */

/* RECOMMENDED PAIRINGS */

/* Modern SaaS */
--font-display: 'Clash Display', sans-serif;  /* Headlines */
--font-sans: 'Satoshi', sans-serif;           /* Body */
--font-mono: 'JetBrains Mono', monospace;     /* Code */

/* Editorial */
--font-display: 'Playfair Display', serif;    /* Headlines */
--font-sans: 'Source Serif Pro', serif;       /* Body */

/* Tech/Dev */
--font-display: 'Space Grotesk', sans-serif;  /* Headlines */
--font-sans: 'IBM Plex Sans', sans-serif;     /* Body */
```

### Line Length & Spacing

```
LINE LENGTH:
✅ 70-80 characters optimal
⚠️ 50-70 acceptable for narrow columns
❌ 80+ forces head movement (fatigue)

LINE HEIGHT:
- Headlines: 1.1-1.2 (tight)
- Body text: 1.5-1.7 (comfortable)
- Dense UI: 1.4 (compact but readable)

PARAGRAPH SPACING:
- Between paragraphs: margin-bottom: 1em
- After headings: margin-top: 2em
```

```tsx
// CORRECT - Optimal readability
<article className="max-w-prose">
  <h1 className="text-4xl font-bold leading-tight">Headline</h1>
  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
    Lead paragraph with comfortable line height...
  </p>
  <div className="mt-8 space-y-4">
    <p className="leading-relaxed">Body paragraph...</p>
  </div>
</article>

// max-w-prose = ~65ch (ideal line length)
```

---

## PART 3: Spacing System (8px Grid)

### Base Scale

```
--spacing-0.5: 0.125rem;   /* 2px  - micro adjustments */
--spacing-1:   0.25rem;    /* 4px  - tight spacing */
--spacing-2:   0.5rem;     /* 8px  - base unit */
--spacing-3:   0.75rem;    /* 12px */
--spacing-4:   1rem;       /* 16px - standard gap */
--spacing-6:   1.5rem;     /* 24px - component padding */
--spacing-8:   2rem;       /* 32px - section gap */
--spacing-12:  3rem;       /* 48px - major sections */
--spacing-16:  4rem;       /* 64px - page sections */
--spacing-24:  6rem;       /* 96px - hero spacing */
```

### Usage Patterns

```tsx
// Component internal spacing
<Card className="p-6">                    {/* 24px padding */}
  <CardHeader className="space-y-1.5">   {/* 6px between items */}
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent className="pt-6">          {/* 24px top padding */}
    {content}
  </CardContent>
</Card>

// Grid gaps
<div className="grid gap-4 md:gap-6">    {/* 16px → 24px on desktop */}
  {items.map(item => <Card {...item} />)}
</div>

// Section spacing
<section className="py-16 md:py-24">     {/* Generous vertical rhythm */}
  <div className="container space-y-12"> {/* 48px between sub-sections */}
    ...
  </div>
</section>
```

### Whitespace Rules

```
DENSITY LEVELS:

COMPACT (Data tables, dashboards)
- Gap: 8px (gap-2)
- Padding: 12px (p-3)
- Row height: 40px

COMFORTABLE (Forms, cards)
- Gap: 16px (gap-4)
- Padding: 24px (p-6)
- Row height: 56px

SPACIOUS (Marketing, landing)
- Gap: 32px (gap-8)
- Padding: 48px (p-12)
- Section gap: 96px (py-24)
```

---

## PART 4: Color System (OKLCH 2026)

### Semantic Color Tokens

```css
/* Light mode */
:root {
  --background: oklch(99% 0.005 260);      /* Near white */
  --foreground: oklch(15% 0.02 260);       /* Near black */

  --primary: oklch(45% 0.2 260);           /* Main brand */
  --primary-foreground: oklch(98% 0.01 260);

  --secondary: oklch(95% 0.01 260);        /* Subtle backgrounds */
  --secondary-foreground: oklch(25% 0.02 260);

  --muted: oklch(95% 0.01 260);            /* De-emphasized */
  --muted-foreground: oklch(45% 0.02 260);

  --accent: oklch(70% 0.19 145);           /* Highlight/success */
  --accent-foreground: oklch(20% 0.02 145);

  --destructive: oklch(55% 0.22 25);       /* Danger/error */
  --destructive-foreground: oklch(98% 0.01 25);
}

/* Dark mode - invert lightness, keep hue */
.dark {
  --background: oklch(12% 0.02 260);
  --foreground: oklch(95% 0.01 260);
  --primary: oklch(65% 0.2 260);
  /* ... */
}
```

### Color for Data Visualization

```tsx
// NEVER use default Recharts colors
// ALWAYS use CSS variables

const CHART_COLORS = [
  'var(--color-chart-1)',  // oklch(55% 0.2 260)  - Primary
  'var(--color-chart-2)',  // oklch(65% 0.18 145) - Success green
  'var(--color-chart-3)',  // oklch(70% 0.15 85)  - Warning yellow
  'var(--color-chart-4)',  // oklch(60% 0.2 25)   - Danger red
  'var(--color-chart-5)',  // oklch(55% 0.15 300) - Purple
];

<Bar fill="var(--color-chart-1)" />
<Area fill="var(--color-chart-2)" fillOpacity={0.3} />
```

---

## PART 5: Modern UI Patterns (2026)

### Glassmorphism (Use Sparingly)

```tsx
// CORRECT - Subtle glass effect
<div className="
  bg-white/80 dark:bg-black/40
  backdrop-blur-xl
  border border-white/20
  rounded-2xl
  shadow-xl
">

// CORRECT - Card with glass
<Card className="
  relative overflow-hidden
  bg-gradient-to-br from-white/80 to-white/40
  dark:from-white/10 dark:to-white/5
  backdrop-blur-xl
  border border-white/20
">
  {/* Content */}
</Card>

// ACCESSIBILITY: Ensure text contrast
<div className="bg-white/80 backdrop-blur-xl">
  <p className="text-foreground font-medium">
    {/* High contrast text on glass */}
  </p>
</div>
```

### Bento Grids

```tsx
// Bento layout - varying card sizes
<div className="grid grid-cols-4 gap-4">
  {/* Large featured card */}
  <Card className="col-span-2 row-span-2">
    <span className="text-4xl font-bold">$12.5M</span>
    <span className="text-muted-foreground">Total Revenue</span>
  </Card>

  {/* Standard cards */}
  <Card className="col-span-1">
    <span className="text-2xl font-bold">2,847</span>
    <span className="text-sm text-muted-foreground">Users</span>
  </Card>

  <Card className="col-span-1">
    <span className="text-2xl font-bold">94%</span>
    <span className="text-sm text-muted-foreground">Satisfaction</span>
  </Card>

  {/* Wide card */}
  <Card className="col-span-2">
    <Chart data={weeklyData} />
  </Card>
</div>
```

### Micro-Interactions (Framer Motion)

```tsx
// Button hover - subtle lift
<motion.button
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400 }}
>

// Card hover - elevation change
<motion.div
  whileHover={{
    y: -4,
    boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.15)"
  }}
  transition={{ duration: 0.2 }}
>

// Success celebration
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", bounce: 0.5 }}
>
  <CheckCircle className="h-16 w-16 text-success" />
</motion.div>

// List stagger
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>{i.name}</motion.li>
  ))}
</motion.ul>
```

### Gradient Orbs (Background Depth)

```tsx
// Page background with depth
<div className="relative min-h-screen">
  {/* Gradient orbs */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="
      absolute top-1/4 left-1/4
      w-96 h-96
      bg-primary/20
      rounded-full
      blur-3xl
    " />
    <div className="
      absolute bottom-1/4 right-1/4
      w-64 h-64
      bg-accent/20
      rounded-full
      blur-2xl
    " />
  </div>

  {/* Content */}
  <main className="relative">
    {children}
  </main>
</div>
```

---

## PART 6: Responsive Design

### Breakpoint System

```
sm:  640px   Mobile landscape
md:  768px   Tablet portrait
lg:  1024px  Tablet landscape / Small desktop
xl:  1280px  Desktop
2xl: 1536px  Large desktop
```

### Mobile-First Patterns

```tsx
// Grid that adapts
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card {...item} />)}
</div>

// Typography that scales
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
  Headline
</h1>

// Spacing that adapts
<section className="py-12 md:py-16 lg:py-24">
  <div className="container px-4 md:px-6 lg:px-8">
    {content}
  </div>
</section>

// Stack → Side-by-side
<div className="flex flex-col md:flex-row gap-8">
  <div className="md:w-1/3">Sidebar</div>
  <div className="md:w-2/3">Main content</div>
</div>
```

### Container Queries (2026)

```tsx
// Parent defines the container
<div className="@container">
  {/* Children respond to CONTAINER width, not viewport */}
  <div className="flex flex-col @md:flex-row @lg:grid @lg:grid-cols-3">
    {items.map(item => <Card {...item} />)}
  </div>
</div>
```

---

## PART 7: 2026 Emerging Trends

Sources: [NN/g State of UX 2026](https://www.nngroup.com/articles/state-of-ux-2026/), [UX Collective](https://uxdesign.cc/10-ux-design-shifts-you-cant-ignore-in-2026-8f0da1c6741d), [DEV.to](https://dev.to/pixel_mosaic/top-uiux-design-trends-for-2026-ai-first-context-aware-interfaces-spatial-experiences-166j)

### Liquid Glass (Apple 2025+)

> Evolution of glassmorphism with fluid, dynamic surfaces

```tsx
// Liquid Glass - Dynamic blur that responds to scroll
<motion.div
  className="
    relative overflow-hidden rounded-3xl
    bg-white/60 dark:bg-black/40
    backdrop-blur-2xl
    border border-white/30
    shadow-[0_8px_32px_rgba(0,0,0,0.12)]
  "
  style={{
    backdropFilter: `blur(${scrollProgress * 20 + 12}px)`,
  }}
>
  {/* Content with layered depth */}
  <div className="relative z-10">{children}</div>

  {/* Animated gradient layer */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
    animate={{ opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 3, repeat: Infinity }}
  />
</motion.div>
```

### Digital Texture (Tactile UI)

> Buttons that look like jelly, chrome, or clay - deform on press

```tsx
// Jelly button - squishes on tap
<motion.button
  className="
    bg-gradient-to-b from-primary to-primary/80
    rounded-2xl px-6 py-3
    shadow-[0_4px_0_0_var(--primary-dark)]
  "
  whileHover={{ y: -2 }}
  whileTap={{
    y: 2,
    scale: 0.98,
    boxShadow: "0 0 0 0 var(--primary-dark)",
  }}
  transition={{ type: "spring", stiffness: 500, damping: 15 }}
>
  Press Me
</motion.button>

// Chrome/metallic button
<button className="
  bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300
  dark:from-slate-600 dark:via-slate-500 dark:to-slate-700
  border border-white/50
  shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]
  rounded-xl
">
```

### Generative UI (GenUI)

> AI rebuilds interface in real-time based on user intent

```tsx
// Context-aware dashboard that adapts
function AdaptiveDashboard({ userContext }) {
  // AI determines relevant widgets based on:
  // - Time of day
  // - User's current task
  // - Recent activity
  // - Urgency of items

  const widgets = useGenerativeLayout(userContext);

  return (
    <div className="grid gap-4 auto-rows-min">
      {widgets.map(widget => (
        <motion.div
          key={widget.id}
          layout // Smooth reordering
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={widget.priority === 'high' ? 'col-span-2' : ''}
        >
          <Widget {...widget} />
        </motion.div>
      ))}
    </div>
  );
}
```

### Spatial UI (AR/VR Ready)

> Z-axis hierarchy, 3D depth, prepare for Vision Pro

```tsx
// Z-axis hierarchy - "closer" = more important
<div className="perspective-1000">
  {/* Primary content - closest to user */}
  <motion.div
    className="relative z-30"
    style={{ transform: "translateZ(60px)" }}
    whileHover={{ transform: "translateZ(80px)" }}
  >
    <Card className="shadow-2xl">Primary Action</Card>
  </motion.div>

  {/* Secondary - mid-depth */}
  <motion.div
    className="relative z-20 mt-4"
    style={{ transform: "translateZ(30px)" }}
  >
    <Card className="shadow-lg opacity-90">Supporting Info</Card>
  </motion.div>

  {/* Background - furthest */}
  <div className="relative z-10 mt-4 opacity-60">
    <Card className="shadow-sm">Context</Card>
  </div>
</div>

// Prepare for spatial: use CSS custom properties
:root {
  --depth-surface: 0px;
  --depth-raised: 8px;
  --depth-overlay: 16px;
  --depth-modal: 24px;
}
```

### Multimodal Interfaces

> Voice + touch + gesture combined seamlessly

```tsx
// Voice-aware component
function MultimodalSearch() {
  const { transcript, listening } = useVoiceRecognition();
  const [query, setQuery] = useState('');

  // Combine voice and text input
  useEffect(() => {
    if (transcript) setQuery(prev => prev + ' ' + transcript);
  }, [transcript]);

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type or speak..."
        className={listening ? "ring-2 ring-primary animate-pulse" : ""}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {listening ? <MicOff /> : <Mic />}
      </Button>
      {listening && (
        <p className="text-xs text-muted-foreground mt-1">
          Listening...
        </p>
      )}
    </div>
  );
}
```

### Sustainable Design

> W3C Web Sustainability Guidelines - reduce digital carbon footprint

```tsx
// Lazy load images with blur placeholder
<Image
  src={src}
  alt={alt}
  placeholder="blur"
  blurDataURL={tinyBlurHash}
  loading="lazy"
/>

// Respect user preferences
@media (prefers-reduced-data: reduce) {
  .hero-video { display: none; }
  .hero-image-fallback { display: block; }
}

// Efficient animations - use transform/opacity only
// GOOD: GPU-accelerated
transform: translateY(-4px);
opacity: 0.8;

// BAD: Triggers layout/paint
margin-top: -4px;
background-color: change;
```

### Hyper-Personalization

> Interfaces that adapt to context without being creepy

```tsx
// Time-aware theming
function useAdaptiveTheme() {
  const hour = new Date().getHours();

  // Auto dark mode in evening
  if (hour >= 20 || hour < 6) return 'dark';

  // Warmer tones in evening
  if (hour >= 18) return 'warm';

  return 'light';
}

// Activity-aware density
function useDensity(userActivity: 'browsing' | 'focused' | 'scanning') {
  switch (userActivity) {
    case 'focused': return 'comfortable'; // More whitespace
    case 'scanning': return 'compact';    // Dense data
    default: return 'default';
  }
}
```

---

## CHECKLIST: Visual Design

### Typography
- [ ] Clear size hierarchy (5-6 levels)
- [ ] Line length 70-80 characters
- [ ] Body text 16px minimum
- [ ] Comfortable line height (1.5-1.7)
- [ ] No forbidden fonts (Inter, Roboto, Arial)

### Color
- [ ] OKLCH color system
- [ ] Semantic tokens (primary, muted, destructive)
- [ ] Dark mode variables
- [ ] Chart colors from CSS variables

### Spacing
- [ ] 8px grid system
- [ ] Consistent component padding
- [ ] Generous whitespace on landing pages
- [ ] Tighter spacing for data-dense UIs

### Visual Effects
- [ ] Glassmorphism used sparingly
- [ ] Gradient orbs for depth
- [ ] Micro-interactions on interactive elements
- [ ] Stagger animations on lists

### Responsive
- [ ] Mobile-first approach
- [ ] All breakpoints tested
- [ ] Touch targets 48px on mobile
- [ ] Typography scales smoothly
