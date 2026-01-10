# Tailwind CSS Gradients Reference

## Overview

Tailwind CSS v4.1 provides three types of gradients: linear, radial, and conic. Each gradient type combines directional utilities with color stop utilities (`from-*`, `via-*`, `to-*`).

## Linear Gradients

Linear gradients create transitions along a straight line in a specified direction.

### Direction Utilities

```html
<!-- Eight preset directions -->
<div class="bg-linear-to-t from-blue-500 to-purple-500"></div>      <!-- to top -->
<div class="bg-linear-to-tr from-blue-500 to-purple-500"></div>     <!-- to top-right -->
<div class="bg-linear-to-r from-blue-500 to-purple-500"></div>      <!-- to right -->
<div class="bg-linear-to-br from-blue-500 to-purple-500"></div>     <!-- to bottom-right -->
<div class="bg-linear-to-b from-blue-500 to-purple-500"></div>      <!-- to bottom -->
<div class="bg-linear-to-bl from-blue-500 to-purple-500"></div>     <!-- to bottom-left -->
<div class="bg-linear-to-l from-blue-500 to-purple-500"></div>      <!-- to left -->
<div class="bg-linear-to-tl from-blue-500 to-purple-500"></div>     <!-- to top-left -->
```

### Angle Support

Custom angles in degrees:

```html
<!-- 0-360 degree angles -->
<div class="bg-linear-0 from-slate-400 to-slate-600"></div>      <!-- 0deg (right) -->
<div class="bg-linear-45 from-slate-400 to-slate-600"></div>     <!-- 45deg -->
<div class="bg-linear-90 from-slate-400 to-slate-600"></div>     <!-- 90deg (bottom) -->
<div class="bg-linear-180 from-slate-400 to-slate-600"></div>    <!-- 180deg (left) -->
<div class="bg-linear-270 from-slate-400 to-slate-600"></div>    <!-- 270deg (top) -->

<!-- Arbitrary angles with square bracket syntax -->
<div class="bg-linear-[25deg] from-indigo-300 to-purple-700"></div>
<div class="bg-linear-[102deg] from-emerald-400 to-teal-600"></div>
```

### Color Stops

#### Two-Color Gradients

```html
<div class="bg-linear-to-r from-blue-500 to-purple-500"></div>
<div class="bg-linear-90 from-amber-300 to-orange-600"></div>
```

#### Three-Color Gradients (with `via-*`)

```html
<div class="bg-linear-to-r from-green-400 via-blue-500 to-purple-600"></div>
<div class="bg-linear-to-b from-yellow-200 via-red-500 to-black"></div>
<div class="bg-linear-45 from-pink-300 via-purple-300 to-indigo-400"></div>
```

#### Position Control

Specify where color stops occur:

```html
<!-- Control stop position -->
<div class="bg-linear-to-r from-blue-500 from-25% to-purple-500 to-75%"></div>

<!-- Multiple position control -->
<div class="bg-linear-to-r
           from-slate-900 from-0%
           via-red-500 via-50%
           to-yellow-300 to-100%"></div>

<!-- Arbitrary positions -->
<div class="bg-linear-to-r from-blue-600 from-[30%] to-indigo-900 to-[70%]"></div>
```

## Radial Gradients

Radial gradients create transitions radiating from a center point.

### Basic Usage

```html
<!-- Default radial gradient (circle from center) -->
<div class="bg-radial from-yellow-400 to-slate-900"></div>

<!-- With three colors -->
<div class="bg-radial from-purple-200 via-blue-400 to-slate-950"></div>
```

### Shape Control

```html
<!-- Circle (default) -->
<div class="bg-radial from-blue-300 to-blue-900"></div>

<!-- Ellipse -->
<div class="bg-radial-[ellipse] from-cyan-300 to-blue-900"></div>

<!-- Rectangle -->
<div class="bg-radial-[farthest-corner] from-pink-300 to-purple-900"></div>
```

### Position Control

```html
<!-- Center position (default) -->
<div class="bg-radial from-white to-slate-900"></div>

<!-- Custom position -->
<div class="bg-radial-[circle_at_25%_75%] from-blue-300 to-slate-900"></div>
<div class="bg-radial-[ellipse_at_top_right] from-yellow-300 to-purple-900"></div>
```

## Conic Gradients (NEW in v4.1)

Conic gradients rotate around a center point, perfect for color wheels and circular patterns.

### Basic Usage

```html
<!-- Simple conic gradient -->
<div class="bg-conic-0 from-red-500 to-red-500"></div>

<!-- Conic with color transition -->
<div class="w-32 h-32 rounded-full
           bg-conic-0
           from-red-500 via-green-500 via-blue-500 to-red-500"></div>
```

### Angle Control

```html
<!-- Starting angles -->
<div class="bg-conic-0 from-slate-400 to-slate-600"></div>      <!-- 0deg -->
<div class="bg-conic-45 from-blue-400 via-purple-500 to-pink-400"></div>  <!-- 45deg -->
<div class="bg-conic-90 from-emerald-300 to-emerald-700"></div>   <!-- 90deg -->
<div class="bg-conic-180 from-orange-300 to-red-600"></div>      <!-- 180deg -->

<!-- Arbitrary angles -->
<div class="bg-conic-[from_135deg] from-indigo-400 to-indigo-600"></div>
<div class="bg-conic-[from_200deg] from-teal-300 to-cyan-700"></div>
```

### Position Control

```html
<!-- Center position (default) -->
<div class="bg-conic-0 from-red-500 to-blue-500"></div>

<!-- Custom center -->
<div class="bg-conic-[from_0deg_at_25%_75%] from-purple-400 to-pink-600"></div>
```

## Color Stop Utilities

### `from-*` (Starting Color)

Defines the first color stop of a gradient:

```html
<div class="bg-linear-to-r from-blue-500 to-purple-500"></div>
<div class="bg-linear-to-r from-blue-500/50 to-purple-500"></div>  <!-- with opacity -->
```

### `via-*` (Middle Color)

Adds a middle color stop for three-color gradients:

```html
<div class="bg-linear-to-r from-green-400 via-blue-500 to-purple-600"></div>

<!-- Multiple via stops -->
<div class="bg-linear-to-r
           from-red-500
           via-yellow-500
           via-green-500
           via-blue-500
           to-purple-500"></div>
```

### `to-*` (Ending Color)

Defines the last color stop:

```html
<div class="bg-linear-to-r from-slate-400 to-slate-600"></div>
<div class="bg-linear-to-r from-slate-400 to-slate-600/0"></div>  <!-- fade to transparent -->
```

## Color Stop Positioning

### Percentage Values

```html
<!-- 25% and 75% positions -->
<div class="bg-linear-to-r from-blue-500 from-25% to-purple-500 to-75%"></div>

<!-- All stops at specific positions -->
<div class="bg-linear-to-r
           from-slate-600 from-0%
           via-purple-400 via-50%
           to-pink-300 to-100%"></div>
```

### Arbitrary Values

```html
<div class="bg-linear-to-r from-blue-500 from-[33%] to-purple-500 to-[66%]"></div>
```

## Gradient Composition Examples

### Two-Color Hero Gradient

```html
<div class="h-96 bg-linear-to-br from-slate-900 to-slate-700 rounded-xl"></div>
```

### Multi-Color Spectrum

```html
<div class="h-20 bg-linear-to-r
           from-red-500
           via-yellow-500
           via-green-500
           via-blue-500
           to-purple-500"></div>
```

### Subtle Fade (with opacity)

```html
<div class="h-64 bg-linear-to-b
           from-blue-500
           to-blue-500/0"></div>
```

### Radial Light Effect

```html
<div class="h-80 bg-radial from-white/20 to-slate-900 rounded-lg"></div>
```

### Conic Rainbow

```html
<div class="w-40 h-40 rounded-full bg-conic-0
           from-red-500
           via-yellow-500
           via-green-500
           via-blue-500
           via-purple-500
           to-red-500"></div>
```

### Gradient Overlay on Image

```html
<div class="h-96 bg-[url(/hero.jpg)] bg-cover
           bg-linear-to-t from-black/80 to-transparent"></div>
```

### Diagonal Gradient Border

```html
<div class="p-1 bg-linear-45 from-purple-500 to-pink-500 rounded-lg">
  <div class="bg-white rounded-md p-6">Content</div>
</div>
```

## Performance Tips

1. **Prefer gradients over images** - Smaller file size, faster rendering
2. **Use opacity modifiers** - `to-blue-500/0` for fades instead of multiple color stops
3. **Limit color stops** - 2-3 colors is usually sufficient
4. **Avoid arbitrary angles** - Use preset directions when possible for better optimization
5. **Combine with bg-no-repeat** - If using gradient as background pattern

## Browser Support

All gradient utilities are supported in modern browsers:
- Chrome/Edge 82+
- Firefox 81+
- Safari 16.4+
- Opera 68+

Note: Conic gradients have excellent modern browser support (95%+)

## Custom Gradients

Define custom gradients in your Tailwind config:

```javascript
export default {
  theme: {
    extend: {
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, var(--color-brand-light), var(--color-brand-dark))',
        'gradient-sunset': 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb)',
      },
    },
  },
}
```

Then use: `bg-gradient-brand`, `bg-gradient-sunset`
