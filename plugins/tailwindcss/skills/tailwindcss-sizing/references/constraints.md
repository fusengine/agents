---
name: constraints
description: Min/Max constraints reference for Tailwind CSS
---

# Min/Max Constraints Reference

## Min-Width Classes

| Class | CSS Property | Use Case |
|-------|--------------|----------|
| `min-w-0` | min-width: 0px | Reset flex minimum |
| `min-w-full` | min-width: 100% | At least full parent width |
| `min-w-min` | min-width: min-content | Minimal content width |
| `min-w-max` | min-width: max-content | Maximal content width |
| `min-w-fit` | min-width: fit-content | Fit content width |

## Max-Width Classes

### Screen-based Max-Width
| Class | CSS Property | Common Use |
|-------|--------------|-----------|
| `max-w-none` | max-width: none | Remove constraint |
| `max-w-full` | max-width: 100% | At most 100% width |
| `max-w-screen-sm` | max-width: 640px | Small screens |
| `max-w-screen-md` | max-width: 768px | Medium screens |
| `max-w-screen-lg` | max-width: 1024px | Large screens |
| `max-w-screen-xl` | max-width: 1280px | Extra large screens |
| `max-w-screen-2xl` | max-width: 1536px | 2XL screens |

### Standard Max-Width
| Class | CSS Property | Common Use |
|-------|--------------|-----------|
| `max-w-xs` | max-width: 20rem | Extra small (320px) |
| `max-w-sm` | max-width: 24rem | Small (384px) |
| `max-w-md` | max-width: 28rem | Medium (448px) |
| `max-w-lg` | max-width: 32rem | Large (512px) |
| `max-w-xl` | max-width: 36rem | Extra large (576px) |
| `max-w-2xl` | max-width: 42rem | 2XL (672px) |
| `max-w-3xl` | max-width: 48rem | 3XL (768px) |
| `max-w-4xl` | max-width: 56rem | 4XL (896px) |
| `max-w-5xl` | max-width: 64rem | 5XL (1024px) |
| `max-w-6xl` | max-width: 72rem | 6XL (1152px) |
| `max-w-7xl` | max-width: 80rem | 7XL (1280px) |

## Min-Height Classes

| Class | CSS Property | Use Case |
|-------|--------------|----------|
| `min-h-0` | min-height: 0px | Reset flex minimum |
| `min-h-full` | min-height: 100% | At least full parent height |
| `min-h-screen` | min-height: 100vh | At least full viewport height |
| `min-h-min` | min-height: min-content | Minimal content height |
| `min-h-max` | min-height: max-content | Maximal content height |
| `min-h-fit` | min-height: fit-content | Fit content height |

## Max-Height Classes

| Class | CSS Property | Use Case |
|-------|--------------|----------|
| `max-h-none` | max-height: none | Remove height constraint |
| `max-h-full` | max-height: 100% | At most parent height |
| `max-h-screen` | max-height: 100vh | At most viewport height |
| `max-h-min` | max-height: min-content | Maximal content height |
| `max-h-max` | max-height: max-content | Fit content height |
| `max-h-fit` | max-height: fit-content | Fit content height |

## Common Constraint Patterns

### Content Wrapper with Max Width
```html
<!-- Centered container with max width -->
<div class="max-w-4xl mx-auto px-4">
  Main content area, constrained to 56rem (896px)
</div>
```

### Sidebar Layout
```html
<div class="flex gap-4">
  <!-- Fixed width sidebar, no shrinking -->
  <aside class="w-64 min-w-64 max-w-64">
    Sidebar content
  </aside>

  <!-- Flexible main content -->
  <main class="flex-1 min-w-0">
    Main content
  </main>
</div>
```

### Responsive Max Width
```html
<!-- Different max widths per breakpoint -->
<div class="max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl">
  Responsive content
</div>
```

### Image with Constraints
```html
<div class="max-w-full max-h-96 overflow-hidden">
  <img src="image.jpg" alt="description" class="w-full h-auto" />
</div>
```

### Modal/Dialog
```html
<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <!-- Modal with constraints -->
  <div class="bg-white max-w-2xl w-full max-h-screen overflow-auto mx-4">
    Modal content
  </div>
</div>
```

### Scrollable Container
```html
<div class="max-h-96 overflow-y-auto">
  Long content that scrolls
</div>
```

## Min-Width Reset for Flex

### Problem: Flex Items Won't Shrink
```html
<!-- ❌ Text won't wrap, breaks layout -->
<div class="flex">
  <div>Very long text that won't wrap...</div>
  <button>Action</button>
</div>

<!-- ✅ Fix: Add min-w-0 to flex child -->
<div class="flex">
  <div class="min-w-0 flex-1">
    <p class="truncate">Very long text...</p>
  </div>
  <button class="flex-shrink-0">Action</button>
</div>
```

## Max-Width for Responsive Typography

```html
<!-- Reading line length constraint -->
<article class="max-w-2xl mx-auto px-4">
  <h1>Article Title</h1>
  <p>Article content with optimal reading width...</p>
</article>
```

## Aspect Ratio with Constraints

```html
<!-- Video container with max size -->
<div class="max-w-2xl aspect-video bg-black">
  <video src="video.mp4" class="w-full h-full"></video>
</div>

<!-- Image with aspect ratio and constraints -->
<div class="max-w-lg aspect-square overflow-hidden rounded-lg">
  <img src="image.jpg" alt="description" class="w-full h-full object-cover" />
</div>
```

## Overflow Handling with Constraints

### Text Overflow
```html
<!-- Truncate text with max width -->
<div class="max-w-xs truncate">
  This very long text will be cut off...
</div>

<!-- Multi-line text clamp -->
<div class="max-w-md line-clamp-3">
  Long text limited to 3 lines with ellipsis...
</div>
```

### Content Overflow
```html
<!-- Horizontal scroll -->
<div class="max-w-full overflow-x-auto">
  <table class="min-w-full">
    <!-- Table content -->
  </table>
</div>

<!-- Vertical scroll -->
<div class="max-h-96 overflow-y-auto">
  Long scrollable content
</div>
```

## Arbitrary Constraint Values

```html
<!-- Custom min-width -->
<div class="min-w-[200px]">Custom minimum</div>

<!-- Custom max-width -->
<div class="max-w-[500px]">Custom maximum</div>

<!-- Custom max-height -->
<div class="max-h-[400px] overflow-auto">Constrained height</div>

<!-- Percentage-based constraints -->
<div class="min-w-[60%] max-w-[80%]">Range constraint</div>
```

## Mobile-First Constraint Strategy

```html
<!-- Mobile: Full width with padding, Desktop: Constrained -->
<div class="w-full md:max-w-4xl md:mx-auto px-4">
  Content that's responsive
</div>

<!-- Mobile: Scrollable, Desktop: Visible -->
<div class="max-h-screen md:max-h-none overflow-y-auto md:overflow-visible">
  Modal content
</div>

<!-- Mobile: Sidebar below, Desktop: Beside -->
<div class="md:flex md:gap-4">
  <aside class="md:w-64 md:min-w-64 md:max-w-64">Sidebar</aside>
  <main class="md:flex-1 md:min-w-0">Content</main>
</div>
```
