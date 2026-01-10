# Opacity Reference - Tailwind CSS v4.1

Complete guide for opacity and transparency utilities.

## Opacity Utilities

Apply opacity/transparency to entire elements.

### Opacity Scale

| Class | Value | Use |
|-------|-------|-----|
| `opacity-0` | `0%` | Invisible, hidden |
| `opacity-5` | `5%` | Nearly invisible |
| `opacity-10` | `10%` | Very faint |
| `opacity-20` | `20%` | Subtle transparency |
| `opacity-25` | `25%` | Quarter transparent |
| `opacity-30` | `30%` | Light transparency |
| `opacity-40` | `40%` | Medium-light transparent |
| `opacity-50` | `50%` | Half transparent |
| `opacity-60` | `60%` | Medium transparent |
| `opacity-70` | `70%` | More transparent |
| `opacity-75` | `75%` | Three-quarter transparent |
| `opacity-80` | `80%` | Mostly visible |
| `opacity-90` | `90%` | Slightly transparent |
| `opacity-95` | `95%` | Almost opaque |
| `opacity-100` | `100%` | Fully opaque |

### Basic Examples

```html
<!-- Complete transparency -->
<div class="opacity-0">Invisible</div>

<!-- Subtle fade -->
<div class="opacity-50">Half visible</div>

<!-- Fully opaque (default) -->
<div class="opacity-100">Normal</div>

<!-- Disabled state -->
<button class="disabled:opacity-50">
  Click me
</button>

<!-- Hover state -->
<div class="opacity-75 hover:opacity-100 transition-opacity">
  Hover to reveal
</div>
```

## Color Opacity (Shorthand)

Apply opacity directly to color values using `/` syntax.

### Syntax
```html
<div class="{property}-{color}/{opacity}">
```

### Background Opacity

```html
<!-- Opaque background -->
<div class="bg-red-500">Red background</div>

<!-- Transparent variations -->
<div class="bg-red-500/10">10% opacity</div>
<div class="bg-red-500/20">20% opacity</div>
<div class="bg-red-500/30">30% opacity</div>
<div class="bg-red-500/40">40% opacity</div>
<div class="bg-red-500/50">50% opacity</div>
<div class="bg-red-500/60">60% opacity</div>
<div class="bg-red-500/70">70% opacity</div>
<div class="bg-red-500/75">75% opacity</div>
<div class="bg-red-500/80">80% opacity</div>
<div class="bg-red-500/90">90% opacity</div>
```

### Text Opacity

```html
<!-- Text color with transparency -->
<p class="text-gray-900/50">Gray text at 50% opacity</p>
<p class="text-blue-600/75">Blue text at 75% opacity</p>
<p class="dark:text-white/80">White text 80% in dark mode</p>

<!-- Disabled text -->
<p class="text-gray-600/40">Disabled appearance</p>

<!-- Nested opacity -->
<p class="text-gray-900">
  Normal text
  <span class="text-gray-900/60">with faded span</span>
</p>
```

### Border Opacity

```html
<!-- Transparent borders -->
<div class="border-2 border-gray-300/50">
  Subtle border
</div>

<div class="border border-blue-500/25">
  Very light border
</div>

<div class="border-4 border-red-600/75">
  Strong red border
</div>
```

### Fill Opacity

```html
<!-- SVG fill with opacity -->
<svg>
  <rect class="fill-purple-500/30" />
  <circle class="fill-blue-400/60" />
</svg>
```

### Stroke Opacity

```html
<!-- SVG stroke with opacity -->
<svg>
  <path class="stroke-red-500/50" />
  <line class="stroke-green-400/75" />
</svg>
```

### Divide Opacity

```html
<!-- Divider line with opacity -->
<div class="divide-y divide-gray-300/50">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Outline Opacity

```html
<!-- Outline with opacity -->
<div class="outline outline-offset-2 outline-blue-500/50">
  Element with transparent outline
</div>
```

### Ring Opacity

```html
<!-- Focus ring with opacity -->
<input class="ring-2 ring-blue-500/50" />

<!-- Colored ring -->
<button class="ring-4 ring-cyan-400/75">
  Button with colored ring
</button>
```

### Shadow Opacity

```html
<!-- Shadow color opacity -->
<div class="shadow-lg shadow-black/30">
  Shadow at 30% opacity
</div>

<div class="inset-shadow-md inset-shadow-blue-500/40">
  Inset shadow with color
</div>
```

## Opacity Examples by Use Case

### Disabled States

```html
<!-- Disabled button -->
<button disabled class="opacity-50 cursor-not-allowed">
  Disabled
</button>

<!-- Disabled text -->
<p class="text-gray-500/50">Disabled text</p>

<!-- Disabled input -->
<input disabled class="bg-gray-100 opacity-60" />
```

### Hover Effects

```html
<!-- Fade on hover -->
<div class="opacity-100 hover:opacity-75 transition-opacity">
  Hover to fade
</div>

<!-- Reveal on hover -->
<div class="opacity-0 hover:opacity-100">
  Hidden by default
</div>

<!-- Color fade -->
<div class="bg-blue-500 hover:bg-blue-500/75">
  Lighter on hover
</div>
```

### Loading/Skeleton States

```html
<!-- Loading skeleton -->
<div class="bg-gray-200/50 animate-pulse">
  <div class="h-4 rounded"></div>
</div>

<!-- Faded placeholder -->
<div class="text-gray-400/60">
  Content loading...
</div>
```

### Layering and Depth

```html
<!-- Stacked cards with progressive opacity -->
<div class="absolute opacity-100">Layer 1 (front)</div>
<div class="absolute opacity-75">Layer 2</div>
<div class="absolute opacity-50">Layer 3 (back)</div>

<!-- Watermark effect -->
<div class="opacity-20">
  Watermark
</div>
```

### Overlays

```html
<!-- Semi-transparent overlay -->
<div class="fixed inset-0 bg-black/30">
  Overlay
</div>

<!-- Modal overlay with backdrop -->
<div class="bg-gray-900/50 backdrop-blur-sm">
  Content over darkened background
</div>

<!-- Color overlay -->
<div class="bg-gradient-to-r from-blue-600/50 to-purple-600/50">
  Gradient overlay
</div>
```

### Glass Morphism

```html
<!-- Frosted glass -->
<div class="backdrop-blur-lg bg-white/30">
  Glassmorphic card
</div>

<!-- Dark glass -->
<div class="bg-gray-900/20 backdrop-blur-md border border-white/10">
  Dark glass effect
</div>

<!-- Colored glass -->
<div class="bg-blue-500/20 backdrop-blur-lg border border-blue-400/20">
  Blue glass effect
</div>
```

### Text Overlays on Images

```html
<!-- Text over image with semi-transparent background -->
<div class="relative">
  <img src="image.jpg" />
  <div class="absolute inset-0 bg-black/40">
    <p class="text-white text-2xl font-bold">
      Title
    </p>
  </div>
</div>

<!-- Gradient overlay -->
<div class="relative">
  <img src="image.jpg" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
</div>
```

### Interactive Transparency

```html
<!-- Tooltip with fade in/out -->
<div class="opacity-0 hover:opacity-100 transition-opacity">
  Tooltip text
</div>

<!-- Dropdown with fade -->
<div class="max-h-0 overflow-hidden opacity-0 transition-all">
  Dropdown content
</div>

<!-- Expandable section -->
<div class="opacity-50 group-hover:opacity-100">
  Hidden details
</div>
```

### Responsive Opacity

```html
<!-- Mobile: more transparent, Desktop: opaque -->
<div class="opacity-75 md:opacity-100">
  Responsive opacity
</div>

<!-- Hide on mobile, show on desktop -->
<div class="opacity-0 md:opacity-100">
  Desktop only
</div>

<!-- Different opacity per breakpoint -->
<div class="opacity-50 sm:opacity-60 md:opacity-75 lg:opacity-90">
  Progressive opacity
</div>
```

### Dark Mode Adjustments

```html
<!-- More opaque in dark mode -->
<div class="opacity-75 dark:opacity-90">
  Element</div>

<!-- Lighter overlay in dark -->
<div class="bg-black/50 dark:bg-black/30">
  Dark-aware overlay
</div>

<!-- Color opacity changes -->
<div class="text-gray-900/80 dark:text-white/80">
  Text that adjusts in dark mode
</div>

<!-- Shadow visibility -->
<div class="shadow-lg shadow-black/20 dark:shadow-black/40">
  Shadow visibility in dark mode
</div>
```

## Opacity Animation

```html
<!-- Fade in animation -->
<div class="opacity-0 animate-fade-in">
  Content
</div>

<!-- Pulse effect -->
<div class="opacity-100 animate-pulse">
  Pulsing element
</div>

<!-- Fade with duration -->
<div class="opacity-0 hover:opacity-100 transition-opacity duration-300">
  Smooth fade
</div>

<!-- Custom animation -->
<style>
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
</style>
<div class="animate-[fadeInOut_2s_infinite]">
  Fading element
</div>
```

## Accessibility Considerations

```html
<!-- Important text always visible -->
<div class="text-sm opacity-75">
  <span class="font-bold opacity-100">Important:</span>
  Secondary information
</div>

<!-- Ensure sufficient contrast -->
<div class="text-gray-600">
  <!-- Good: dark text on light background -->
</div>

<div class="dark:text-gray-400">
  <!-- Adjusted for dark mode -->
</div>

<!-- Focus visible state -->
<button class="opacity-75 focus-visible:opacity-100">
  More visible when focused
</button>
```

## Performance Tips

1. **Use opacity for fades** - More performant than visibility/display
2. **Prefer shorthand** - `bg-red-500/50` faster than `opacity-50`
3. **Animate opacity** - GPU-accelerated, no layout shift
4. **Test transparency** - Can impact readability on some backgrounds
5. **Avoid excessive nesting** - Multiply opacity compounds

## Browser Support

- **Opacity utilities**: All modern browsers (IE9+)
- **Color opacity (shorthand)**: Modern browsers (Chrome 88+, Firefox 87+, Safari 14+)
- **CSS variable opacity**: Modern browsers with CSS variable support
- **Animation**: All modern browsers

## Configuration

### Custom Opacity Scale

```css
@import "tailwindcss";

@theme {
  --opacity-disabled: 0.6;
  --opacity-subtle: 0.85;
}
```

Usage:
```html
<div class="opacity-[var(--opacity-disabled)]">Disabled</div>
<div class="opacity-[var(--opacity-subtle)]">Subtle</div>
```
