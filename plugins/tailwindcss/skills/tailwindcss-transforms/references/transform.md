# Transform Utilities - Tailwind CSS v4.1

Complete reference for transform operations: scale, rotate, translate, skew, and transform-origin.

## Scale

Resize elements using the CSS `scale` function.

### Class Reference
```
scale-50      scale(0.5)
scale-75      scale(0.75)
scale-90      scale(0.9)
scale-95      scale(0.95)
scale-100     scale(1)
scale-105     scale(1.05)
scale-110     scale(1.1)
scale-125     scale(1.25)
scale-150     scale(1.5)

scale-x-50    scaleX(0.5)
scale-x-75    scaleX(0.75)
scale-x-90    scaleX(0.9)
scale-x-95    scaleX(0.95)
scale-x-100   scaleX(1)
scale-x-105   scaleX(1.05)
scale-x-110   scaleX(1.1)
scale-x-125   scaleX(1.25)
scale-x-150   scaleX(1.5)

scale-y-50    scaleY(0.5)
scale-y-75    scaleY(0.75)
scale-y-90    scaleY(0.9)
scale-y-95    scaleY(0.95)
scale-y-100   scaleY(1)
scale-y-105   scaleY(1.05)
scale-y-110   scaleY(1.1)
scale-y-125   scaleY(1.25)
scale-y-150   scaleY(1.5)
```

### Usage Examples

```html
<!-- Hover scale -->
<button class="scale-100 hover:scale-110 transition-transform duration-200">
  Click me
</button>

<!-- Responsive scaling -->
<div class="scale-90 sm:scale-100 md:scale-110 lg:scale-125">
  Content
</div>

<!-- X-axis only -->
<div class="scale-x-75">Compressed horizontally</div>

<!-- Y-axis only -->
<div class="scale-y-50">Compressed vertically</div>

<!-- Thumbnail -->
<img src="image.jpg" class="scale-100 hover:scale-110 transition-transform" />

<!-- Card magnification -->
<div class="scale-95 hover:scale-100 shadow-sm hover:shadow-lg transition">
  Card content
</div>
```

### Combining with Origin

```html
<!-- Scale from different origins -->
<div class="origin-center scale-125">From center</div>
<div class="origin-top scale-125">From top (grows down)</div>
<div class="origin-bottom scale-75">From bottom (shrinks up)</div>
<div class="origin-left scale-110">From left (grows right)</div>
<div class="origin-right scale-90">From right (shrinks right)</div>
```

---

## Rotate

Rotate elements using the CSS `rotate` function.

### Class Reference
```
rotate-0      rotate(0deg)
rotate-1      rotate(1deg)
rotate-2      rotate(2deg)
rotate-3      rotate(3deg)
rotate-6      rotate(6deg)
rotate-12     rotate(12deg)
rotate-45     rotate(45deg)
rotate-90     rotate(90deg)
rotate-180    rotate(180deg)

-rotate-1     rotate(-1deg)
-rotate-2     rotate(-2deg)
-rotate-3     rotate(-3deg)
-rotate-6     rotate(-6deg)
-rotate-12    rotate(-12deg)
-rotate-45    rotate(-45deg)
-rotate-90    rotate(-90deg)
-rotate-180   rotate(-180deg)
```

### Usage Examples

```html
<!-- Icon rotation -->
<svg class="rotate-90 transition-transform duration-300"><!-- icon --></svg>

<!-- Active indicator -->
<div class="rotate-0 group-hover:rotate-180 transition-transform">
  <svg><!-- chevron --></svg>
</div>

<!-- Circular loading indicator -->
<div class="animate-spin">
  <div class="rotate-45">
    <!-- spinner -->
  </div>
</div>

<!-- Diagonal text -->
<div class="rotate-45 origin-center">Text at angle</div>

<!-- Flip effect -->
<div class="rotate-180 transition-transform duration-500">Card flip</div>

<!-- Subtle tilt -->
<div class="rotate-3 hover:rotate-0 transition-transform">
  Tilted item
</div>

<!-- Responsive rotation -->
<div class="rotate-0 sm:rotate-12 md:rotate-45 lg:rotate-90">
  Increasing rotation
</div>
```

### Combining with Scale

```html
<!-- Spinning and scaling -->
<button class="scale-100 rotate-0 hover:scale-110 hover:rotate-12 transition-all duration-300">
  Interactive
</button>

<!-- Rotating spiral -->
<div class="animate-spin scale-75">
  Content
</div>
```

---

## Translate

Move elements along the X and Y axes using the CSS `translate` function.

### Class Reference
```
translate-x-0     translateX(0)
translate-x-1     translateX(0.25rem / 4px)
translate-x-2     translateX(0.5rem / 8px)
translate-x-3     translateX(0.75rem / 12px)
translate-x-4     translateX(1rem / 16px)
translate-x-5     translateX(1.25rem / 20px)
translate-x-6     translateX(1.5rem / 24px)
translate-x-7     translateX(1.75rem / 28px)
translate-x-8     translateX(2rem / 32px)
translate-x-9     translateX(2.25rem / 36px)
translate-x-10    translateX(2.5rem / 40px)
translate-x-11    translateX(2.75rem / 44px)
translate-x-12    translateX(3rem / 48px)

translate-y-0     translateY(0)
translate-y-1     translateY(0.25rem / 4px)
translate-y-2     translateY(0.5rem / 8px)
... (same values as X)

-translate-x-*    Negative X translation
-translate-y-*    Negative Y translation
```

### Usage Examples

```html
<!-- Hover lift effect -->
<div class="translate-y-0 hover:translate-y-2 transition-transform duration-300">
  Hover to lift
</div>

<!-- Slide in from left -->
<div class="animate-slideInLeft">
  <!-- with custom keyframe: translateX(-20px) to translateX(0) -->
</div>

<!-- Push right on hover -->
<button class="translate-x-0 hover:translate-x-4 focus:translate-x-2 transition">
  Hover me
</button>

<!-- Combined translation -->
<div class="translate-x-2 translate-y-4">
  Moved right and down
</div>

<!-- Negative translation -->
<div class="-translate-x-4 -translate-y-2">
  Moved left and up
</div>

<!-- Responsive positioning -->
<div class="translate-x-0 sm:translate-x-2 md:translate-x-4 lg:translate-x-8">
  Increasing offset
</div>

<!-- Animation with translation -->
<div class="animate-bounce">
  <!-- moves up/down via translateY in keyframes -->
</div>

<!-- Tooltip positioning -->
<div class="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
  Tooltip content
</div>
```

### Common Patterns

```html
<!-- Card elevation on hover -->
<div class="shadow-md translate-y-0 hover:shadow-lg hover:-translate-y-2 transition">
  Card
</div>

<!-- Slide drawer -->
<div class="translate-x-full fixed inset-y-0 w-64 bg-white transition-transform duration-300">
  <button class="open-drawer" onclick="element.classList.remove('translate-x-full')">
    Open
  </button>
</div>

<!-- Push content on interaction -->
<div class="flex">
  <input class="focus:translate-x-2 transition-transform" />
  <label class="translate-x-0 group-focus-within:translate-x-2 transition-transform">
    Label
  </label>
</div>
```

---

## Skew

Skew elements using the CSS `skew` function.

### Class Reference
```
skew-x-0      skewX(0deg)
skew-x-1      skewX(1deg)
skew-x-2      skewX(2deg)
skew-x-3      skewX(3deg)
skew-x-6      skewX(6deg)
skew-x-12     skewX(12deg)

skew-y-0      skewY(0deg)
skew-y-1      skewY(1deg)
skew-y-2      skewY(2deg)
skew-y-3      skewY(3deg)
skew-y-6      skewY(6deg)
skew-y-12     skewY(12deg)

-skew-x-*     Negative X skew
-skew-y-*     Negative Y skew
```

### Usage Examples

```html
<!-- Parallax-like effect -->
<div class="skew-x-6">
  Skewed content
</div>

<!-- 3D-like perspective -->
<div class="skew-x-3 skew-y-3">
  Double skew
</div>

<!-- Diagonal banner -->
<div class="skew-y-12 bg-blue-500 text-white px-6 py-4">
  Skewed banner
</div>

<!-- Interactive skew -->
<button class="skew-x-0 hover:skew-x-6 transition-transform duration-300">
  Hover to skew
</button>

<!-- Negative skew for contrast -->
<div class="skew-x-6 group-hover:skew-x-0 transition">
  Unskew on hover
</div>

<!-- Combined skew -->
<div class="skew-x-2 skew-y-3 hover:-skew-x-2 hover:-skew-y-3 transition">
  Complex skew
</div>

<!-- Responsive skew -->
<div class="skew-x-0 sm:skew-x-3 md:skew-x-6 lg:skew-x-12">
  Increasing skew
</div>
```

### With Rotation

```html
<!-- Skew combined with rotation -->
<div class="rotate-45 skew-x-6">
  Rotated and skewed
</div>

<!-- Subtle perspective tilt -->
<div class="skew-y-1 rotate-2">
  Tilted perspective
</div>
```

---

## Transform Origin

Set the point around which transformations occur.

### Class Reference
```
origin-center           50% 50% (default)
origin-top              50% 0%
origin-top-right        100% 0%
origin-right            100% 50%
origin-bottom-right     100% 100%
origin-bottom           50% 100%
origin-bottom-left      0% 100%
origin-left             0% 50%
origin-top-left         0% 0%
```

### Usage Examples

```html
<!-- Scale from center (default) -->
<div class="origin-center scale-110">
  Default scaling
</div>

<!-- Scale from top (shrink downward) -->
<div class="origin-top scale-75">
  Shrinks downward
</div>

<!-- Scale from bottom (shrink upward) -->
<div class="origin-bottom scale-110">
  Grows downward
</div>

<!-- Rotate from top-left corner -->
<div class="origin-top-left rotate-45">
  Rotates around top-left
</div>

<!-- Rotate from bottom-right -->
<div class="origin-bottom-right -rotate-90">
  Rotates around bottom-right
</div>

<!-- Interactive origin change -->
<button class="origin-center hover:origin-top scale-100 hover:scale-125 transition-all duration-300">
  Hover for top-based scale
</button>

<!-- Responsive origin -->
<div class="origin-center sm:origin-top md:origin-left lg:origin-bottom">
  Changing origin
</div>

<!-- Menu expand from corner -->
<div class="origin-top-right absolute top-0 right-0 scale-0 open:scale-100 transition-transform">
  Dropdown menu
</div>

<!-- Icon flip from right -->
<svg class="origin-right rotate-0 group-hover:rotate-180 transition-transform">
  <!-- icon -->
</svg>

<!-- Expandable card -->
<div class="origin-top scale-100 group-hover:scale-105 transition">
  Card that grows from top
</div>
```

### Advanced Patterns

```html
<!-- Star expansion -->
<div class="space-y-2 space-x-2">
  <div class="origin-bottom-right scale-100 hover:scale-150 transition">Item 1</div>
  <div class="origin-bottom-left scale-100 hover:scale-150 transition">Item 2</div>
  <div class="origin-top-right scale-100 hover:scale-150 transition">Item 3</div>
  <div class="origin-top-left scale-100 hover:scale-150 transition">Item 4</div>
</div>

<!-- Radial menu -->
<div class="relative w-32 h-32 flex items-center justify-center">
  <div class="origin-center absolute animate-spin">
    <!-- items positioned around -->
  </div>
</div>

<!-- Perspective growth -->
<div class="origin-center scale-50 hover:scale-100 transition-transform">
  Grows from center
</div>
```

---

## Performance Considerations

1. **GPU Acceleration**: Transform properties are GPU-accelerated (fast)
2. **Avoid Layout Reflow**: Use `transform` instead of changing dimensions
3. **Combine with Opacity**: Use together for smooth transitions
4. **Origin Optimization**: Predefine origin for consistent behavior

## Browser Support

- **All modern browsers**: Full support for transforms
- **IE 10+**: Partial support (vendor prefixes in older versions)
- **Mobile**: Excellent performance on iOS and Android

## Related Utilities

- **Transition**: `transition-transform`
- **Duration**: `duration-*`
- **Easing**: `ease-in`, `ease-out`, `ease-in-out`
- **Delay**: `delay-*`
- **Opacity**: `opacity-*` (combine for smooth effects)
- **Shadows**: `shadow-*` (complement transforms)
