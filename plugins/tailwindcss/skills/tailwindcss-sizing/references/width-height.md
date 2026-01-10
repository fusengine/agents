# Width & Height Reference

## Width Classes

| Class | CSS Property | Use Case |
|-------|--------------|----------|
| `w-0` | width: 0px | Hidden elements |
| `w-1` - `w-96` | width: 0.25rem - 24rem | Fixed widths |
| `w-1/2` | width: 50% | Half width |
| `w-1/3` | width: 33.333333% | Third width |
| `w-1/4` | width: 25% | Quarter width |
| `w-2/3` | width: 66.666667% | Two thirds |
| `w-3/4` | width: 75% | Three quarters |
| `w-full` | width: 100% | Full width |
| `w-screen` | width: 100vw | Full viewport width |
| `w-auto` | width: auto | Auto width (default) |
| `w-min` | width: min-content | Minimal content width |
| `w-max` | width: max-content | Maximal content width |
| `w-fit` | width: fit-content | Fit content width |

## Height Classes

| Class | CSS Property | Use Case |
|-------|--------------|----------|
| `h-0` | height: 0px | Hidden elements |
| `h-1` - `h-96` | height: 0.25rem - 24rem | Fixed heights |
| `h-1/2` | height: 50% | Half height |
| `h-1/3` | height: 33.333333% | Third height |
| `h-1/4` | height: 25% | Quarter height |
| `h-2/3` | height: 66.666667% | Two thirds |
| `h-3/4` | height: 75% | Three quarters |
| `h-full` | height: 100% | Full parent height |
| `h-screen` | height: 100vh | Full viewport height |
| `h-dvh` | height: 100dvh | Dynamic viewport height (mobile-friendly) |
| `h-auto` | height: auto | Auto height (default) |
| `h-min` | height: min-content | Minimal content height |
| `h-max` | height: max-content | Maximal content height |
| `h-fit` | height: fit-content | Fit content height |

## Fractional Sizing

### Width Fractions
```html
<!-- Two column layout -->
<div class="flex">
  <div class="w-1/2">Column 1</div>
  <div class="w-1/2">Column 2</div>
</div>

<!-- Three column layout -->
<div class="flex">
  <div class="w-1/3">Column 1</div>
  <div class="w-1/3">Column 2</div>
  <div class="w-1/3">Column 3</div>
</div>

<!-- Asymmetric layout -->
<div class="flex">
  <div class="w-2/3">Main content</div>
  <div class="w-1/3">Sidebar</div>
</div>
```

### Height Fractions
```html
<!-- Equal height sections -->
<div class="h-screen flex flex-col">
  <div class="h-1/4">Header</div>
  <div class="h-1/2">Content</div>
  <div class="h-1/4">Footer</div>
</div>
```

## Common Width Values

### Spacing Scale
```
w-0:     0px
w-1:     0.25rem (4px)
w-2:     0.5rem (8px)
w-3:     0.75rem (12px)
w-4:     1rem (16px)
w-6:     1.5rem (24px)
w-8:     2rem (32px)
w-12:    3rem (48px)
w-16:    4rem (64px)
w-20:    5rem (80px)
w-24:    6rem (96px)
w-32:    8rem (128px)
w-40:    10rem (160px)
w-48:    12rem (192px)
w-56:    14rem (224px)
w-64:    16rem (256px)
w-80:    20rem (320px)
w-96:    24rem (384px)
```

## Common Height Values

### Spacing Scale
```
h-0:     0px
h-1:     0.25rem (4px)
h-2:     0.5rem (8px)
h-3:     0.75rem (12px)
h-4:     1rem (16px)
h-6:     1.5rem (24px)
h-8:     2rem (32px)
h-12:    3rem (48px)
h-16:    4rem (64px)
h-20:    5rem (80px)
h-24:    6rem (96px)
h-32:    8rem (128px)
h-40:    10rem (160px)
h-48:    12rem (192px)
h-56:    14rem (224px)
h-64:    16rem (256px)
h-80:    20rem (320px)
h-96:    24rem (384px)
```

## Dynamic Viewport Height (NEW)

### h-dvh vs h-screen
```html
<!-- Traditional viewport height (may be hidden by mobile UI) -->
<div class="h-screen">...</div>

<!-- Dynamic viewport height (accounts for mobile UI) -->
<div class="h-dvh">...</div>

<!-- Best practice for mobile-first design -->
<div class="min-h-dvh">...</div>
```

### Use Cases
- Mobile apps: Use `h-dvh` for full-screen layouts
- Desktop: Both `h-screen` and `h-dvh` work similarly
- Responsive: `h-screen` on desktop, `h-dvh` fallback on mobile

## Responsive Width & Height

### Breakpoint Variants
```html
<!-- Mobile first -->
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsive width
</div>

<!-- Height responsiveness -->
<div class="h-48 md:h-64 lg:h-80">
  Responsive height
</div>

<!-- Dynamic viewport on mobile -->
<div class="h-screen md:h-dvh">
  Mobile-first dynamic height
</div>
```

## Percentage-Based Sizing

```html
<!-- Half width and height -->
<div class="w-1/2 h-1/2">Box</div>

<!-- Third width -->
<div class="w-1/3">Box</div>

<!-- Three quarters width and height -->
<div class="w-3/4 h-3/4">Box</div>

<!-- Two thirds width -->
<div class="w-2/3">Box</div>
```

## Arbitrary Values

```html
<!-- Custom width -->
<div class="w-[500px]">Custom width</div>

<!-- Custom height -->
<div class="h-[600px]">Custom height</div>

<!-- Custom fraction -->
<div class="w-[45%]">45% width</div>
```
