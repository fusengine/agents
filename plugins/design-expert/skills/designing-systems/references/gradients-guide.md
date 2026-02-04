---
name: gradients-guide
description: Gradient types, usage patterns, and implementation guidelines
when-to-use: Creating gradients, adding depth to UI, implementing background effects
keywords: gradients, linear, radial, angular, mesh, depth, visual hierarchy
priority: medium
related: color-system.md, photos-images.md
---

# Gradients Design Guide

## GRADIENT TYPES

### 1. Linear Gradient (Most Common)
Straight-line transition between colors.

```css
/* Tailwind v4 */
.linear-gradient {
  background: linear-gradient(to right, oklch(55% 0.2 260), oklch(65% 0.18 200));
}

/* Tailwind classes */
<div className="bg-gradient-to-r from-primary to-accent" />
<div className="bg-gradient-to-br from-primary via-accent to-secondary" />
```

**Directions:**
- `to-r` → Right
- `to-b` → Bottom
- `to-br` → Bottom-right
- `to-t` → Top

### 2. Radial Gradient
Ellipse shape, color from center to edge.

```css
.radial-gradient {
  background: radial-gradient(circle at center, oklch(65% 0.2 260), oklch(45% 0.15 260));
}
```

```tsx
// Gradient orb background
<div className="absolute inset-0 -z-10">
  <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
  <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/20 blur-2xl" />
</div>
```

### 3. Angular/Conic Gradient
Color stops around a circle.

```css
.conic-gradient {
  background: conic-gradient(from 0deg, oklch(55% 0.2 260), oklch(65% 0.18 145), oklch(55% 0.2 260));
}
```

**Use Case**: Progress indicators, pie charts.

### 4. Mesh Gradient (Advanced)
Multiple colors blended abstractly.

**WARNING**: Use sparingly - still uncommon in production UI.

## VALUE OF GRADIENTS

| Purpose | Example |
|---------|---------|
| **Visual Depth** | 3D button appearance |
| **Hierarchy** | Draw attention to CTAs |
| **Brand Identity** | Consistent color transitions |
| **Emotion** | Set mood/atmosphere |
| **Readability** | Text contrast on images |
| **Modern Look** | Contemporary, dynamic feel |

## GRADIENT PATTERNS (APPROVED)

### Button Gradient
```tsx
<Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
  Get Started
</Button>
```

### Card Background
```tsx
<div className="rounded-xl bg-gradient-to-br from-card to-muted p-6">
  {children}
</div>
```

### Hero Section
```tsx
<section className="relative overflow-hidden">
  {/* Gradient background */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background" />

  {/* Gradient orbs */}
  <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
  <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-2xl" />

  {content}
</section>
```

### Text Gradient
```tsx
<h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
  Gradient Headline
</h1>
```

### Border Gradient
```tsx
<div className="rounded-xl bg-gradient-to-r from-primary to-accent p-[1px]">
  <div className="rounded-[11px] bg-background p-6">
    {children}
  </div>
</div>
```

## FORBIDDEN GRADIENTS

| Pattern | Why | Alternative |
|---------|-----|-------------|
| `from-purple-* to-pink-*` | AI slop, overused | Use brand colors |
| Random color combinations | Clash, unprofessional | Use complementary colors |
| Too many color stops | Busy, distracting | Max 2-3 colors |
| High saturation rainbow | Childish, overwhelming | Subtle, desaturated |

```tsx
// ❌ FORBIDDEN
<div className="bg-gradient-to-r from-purple-500 to-pink-500" />

// ✅ APPROVED - Use CSS variables
<div className="bg-gradient-to-r from-primary to-accent" />
```

## COLOR SELECTION FOR GRADIENTS

### Monochromatic (Safe)
Same hue, different lightness.
```css
from-primary to-primary/60
```

### Analogous (Harmonious)
Adjacent colors on wheel.
```css
from-blue-500 to-cyan-500
from-orange-500 to-amber-500
```

### Complementary (Bold)
Opposite colors - use carefully.
```css
from-blue-500 via-purple-500 to-pink-500
```

## OPACITY IN GRADIENTS

Use for subtle effects:
```tsx
// Background depth
<div className="bg-gradient-to-b from-primary/5 to-transparent" />

// Overlay on image
<div className="bg-gradient-to-t from-black/60 to-transparent" />

// Glass effect
<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur" />
```

## INTERACTIVE GRADIENTS

### Hover State
```tsx
<Button className="
  bg-gradient-to-r from-primary to-accent
  hover:from-primary/90 hover:to-accent/90
  transition-all
">
  Button
</Button>
```

### Animated Gradient
```tsx
<motion.div
  className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
/>
```

## ACCESSIBILITY CONSIDERATIONS

- Ensure text contrast over gradients
- Don't rely on color alone for meaning
- Test with color blindness simulators
- Provide solid fallback for older browsers

```tsx
// Ensure readability
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
  <div className="relative z-10 text-white"> {/* High contrast text */}
    Content
  </div>
</div>
```

## TAILWIND V4 CSS VARIABLES

```css
@theme inline {
  --gradient-primary: linear-gradient(to right, var(--color-primary), var(--color-accent));
  --gradient-subtle: linear-gradient(to bottom, var(--color-background), var(--color-muted));
}
```

## PERFORMANCE TIP

- CSS gradients are more performant than images
- Use for simple patterns instead of background images
- Complex mesh gradients → consider SVG or image

## SUMMARY: DO'S AND DON'TS

### DO
- Use brand colors in gradients
- Apply subtle opacity gradients for depth
- Limit to 2-3 color stops
- Test text contrast
- Use for CTAs and hero sections

### DON'T
- Use purple-to-pink defaults
- Apply rainbow gradients
- Overuse on every element
- Ignore accessibility
- Use mesh gradients in production (yet)
