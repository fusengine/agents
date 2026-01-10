# Filters Reference - Tailwind CSS v4.1

Complete reference for filter and backdrop-filter utilities.

## Blur Filter

Apply blur effect to elements.

### Blur Utilities

| Class | Value | Effect |
|-------|-------|--------|
| `blur-none` | `0` | No blur |
| `blur-sm` | `4px` | Subtle blur |
| `blur` | `12px` | Default blur |
| `blur-md` | `16px` | Medium blur |
| `blur-lg` | `24px` | Large blur |
| `blur-xl` | `40px` | Extra large blur |
| `blur-2xl` | `64px` | 2XL blur |
| `blur-3xl` | `96px` | 3XL blur |

### Examples

```html
<!-- Gallery with blur on hover -->
<img class="hover:blur-md transition-all" src="image.jpg" />

<!-- Obscure content -->
<div class="blur-xl">
  Sensitive information
</div>

<!-- Blur on input error -->
<input class="focus:blur-none invalid:blur-sm" />

<!-- Progressive disclosure -->
<div class="blur-lg hover:blur-none">
  Hover to reveal
</div>
```

### Arbitrary Blur Values

```html
<div class="blur-[2px]">Very subtle blur</div>
<div class="blur-[100px]">Heavy blur</div>
```

## Brightness Filter

Adjust brightness of elements and their content.

### Brightness Utilities

| Class | Value | Effect |
|-------|-------|--------|
| `brightness-50` | `50%` | Darken to half |
| `brightness-75` | `75%` | Darken to 75% |
| `brightness-100` | `100%` | Normal/no change |
| `brightness-125` | `125%` | Brighten to 125% |
| `brightness-150` | `150%` | Brighten to 150% |
| `brightness-200` | `200%` | Brighten to double |

### Examples

```html
<!-- Hover darkening -->
<img class="hover:brightness-75 transition-all" src="photo.jpg" />

<!-- Disabled state darkening -->
<button class="disabled:brightness-50">Action</button>

<!-- Night mode image adjustment -->
<img class="dark:brightness-110" src="image.jpg" />

<!-- Video overlay -->
<video class="brightness-75">
  <source src="video.mp4" />
</video>

<!-- Lightbox with darkened backdrop -->
<div class="brightness-50">
  Darkened background
</div>
```

### Arbitrary Values

```html
<div class="brightness-[65%]">Custom brightness</div>
<div class="brightness-[1.8]">Ultra bright</div>
```

## Contrast Filter

Enhance or reduce contrast of elements.

### Contrast Utilities

| Class | Value | Effect |
|-------|-------|--------|
| `contrast-50` | `50%` | Low contrast, muted |
| `contrast-75` | `75%` | Reduced contrast |
| `contrast-100` | `100%` | Normal contrast |
| `contrast-125` | `125%` | Enhanced contrast |
| `contrast-150` | `150%` | High contrast |
| `contrast-200` | `200%` | Very high contrast |

### Examples

```html
<!-- Improve readability on dark backgrounds -->
<div class="dark:contrast-125">
  Text on dark background
</div>

<!-- Faded image effect -->
<img class="contrast-75 opacity-75" />

<!-- High contrast mode for accessibility -->
<div class="contrast-200">
  High contrast content
</div>

<!-- Subtle color reduction -->
<img class="hover:contrast-100 contrast-75" />
```

## Grayscale Filter

Convert to grayscale (desaturate colors).

### Grayscale Utilities

| Class | Value | Effect |
|-------|-------|--------|
| `grayscale-0` | `0%` | Full color |
| `grayscale` | `100%` | Full grayscale |

### Examples

```html
<!-- Color on hover, grayscale default -->
<img class="grayscale hover:grayscale-0 transition-all" src="color.jpg" />

<!-- Maintenance mode indicator -->
<div class="grayscale opacity-50">
  Service under maintenance
</div>

<!-- Dark mode desaturation -->
<img class="dark:grayscale" src="image.jpg" />

<!-- Gallery with color reveal -->
<div class="grayscale-0 hover:grayscale">
  Show color on interaction
</div>
```

### Arbitrary Grayscale Values

```html
<div class="grayscale-[40%]">Partial desaturation</div>
<div class="grayscale-[80%]">Mostly grayscale</div>
```

## Sepia Filter

Apply sepia tone (warm, vintage effect).

### Sepia Utilities

| Class | Value | Effect |
|-------|-------|--------|
| `sepia-0` | `0%` | No sepia |
| `sepia` | `100%` | Full sepia tone |

### Examples

```html
<!-- Vintage photo effect -->
<img class="sepia" src="old-photo.jpg" />

<!-- Warm filter on hover -->
<img class="hover:sepia transition-all" src="image.jpg" />

<!-- Vintage gallery -->
<div class="gallery">
  <img class="sepia-[50%]" src="photo1.jpg" />
  <img class="sepia-[75%]" src="photo2.jpg" />
</div>

<!-- Warm mode for reading -->
<article class="dark:sepia-[20%]">
  Content with warm tone in dark mode
</article>
```

### Arbitrary Sepia Values

```html
<div class="sepia-[30%]">Light sepia tone</div>
<div class="sepia-[70%]">Strong sepia tone</div>
```

## Hue Rotate Filter

Rotate hue in HSL color space.

### Hue Rotate Utilities

| Class | Value | Degrees |
|-------|-------|---------|
| `hue-rotate-0` | `0deg` | Original |
| `hue-rotate-15` | `15deg` | - |
| `hue-rotate-30` | `30deg` | - |
| `hue-rotate-60` | `60deg` | 1/6 rotation |
| `hue-rotate-90` | `90deg` | 1/4 rotation |
| `hue-rotate-180` | `180deg` | Inverse colors |

### Examples

```html
<!-- Color theme switcher -->
<div class="hue-rotate-0 hover:hue-rotate-180">
  Click to invert colors
</div>

<!-- Brand color variations -->
<img class="hue-rotate-0" />
<img class="hue-rotate-90" /> <!-- Different color scheme -->

<!-- Dynamic theming -->
<div class="hue-rotate-30">
  Blue theme
</div>
<div class="hue-rotate-90">
  Green theme
</div>

<!-- Color cycling animation -->
<div class="animate-spin hue-rotate-0">
  Rainbow spinner
</div>
```

### Arbitrary Values

```html
<div class="hue-rotate-[45deg]">Custom rotation</div>
<div class="hue-rotate-[-90deg]">Reverse rotation</div>
```

## Invert Filter

Invert all colors (negative effect).

### Invert Utilities

| Class | Value | Effect |
|-------|-------|--------|
| `invert-0` | `0%` | No inversion |
| `invert` | `100%` | Full inversion |

### Examples

```html
<!-- Night mode inversion -->
<img class="dark:invert" src="light-image.png" />

<!-- Dark theme toggle -->
<div class="invert-0 dark:invert">
  Auto-inverting content
</div>

<!-- Negative space effect -->
<div class="invert opacity-30">
  Ghost effect
</div>
```

### Arbitrary Invert Values

```html
<div class="invert-[50%]">Partial inversion</div>
<div class="invert-[70%]">Strong inversion</div>
```

## Saturate Filter

Adjust saturation (color intensity).

### Saturate Utilities

| Class | Value | Effect |
|-------|-------|--------|
| `saturate-50` | `50%` | Desaturated, muted |
| `saturate-100` | `100%` | Normal saturation |
| `saturate-150` | `150%` | Enhanced saturation |
| `saturate-200` | `200%` | Very vibrant |

### Examples

```html
<!-- Muted hover effect -->
<img class="saturate-75 hover:saturate-100" />

<!-- Vibrant call-to-action -->
<div class="saturate-150 bg-blue-500">
  Highlighted action
</div>

<!-- Fade to muted -->
<div class="saturate-50 opacity-75">
  Subtle background
</div>

<!-- Color boost for weak colors -->
<div class="text-orange-300 saturate-150">
  Vibrant text
</div>
```

### Arbitrary Values

```html
<div class="saturate-[65%]">Custom saturation</div>
<div class="saturate-[175%]">Very saturated</div>
```

## Backdrop Filter Utilities

Apply filters to backdrop (elements behind).

### Backdrop Blur

| Class | Value |
|-------|-------|
| `backdrop-blur-none` | `0` |
| `backdrop-blur-sm` | `4px` |
| `backdrop-blur` | `12px` |
| `backdrop-blur-md` | `16px` |
| `backdrop-blur-lg` | `24px` |
| `backdrop-blur-xl` | `40px` |
| `backdrop-blur-2xl` | `64px` |

### Backdrop Brightness

| Class | Value |
|-------|-------|
| `backdrop-brightness-50` | `50%` |
| `backdrop-brightness-75` | `75%` |
| `backdrop-brightness-100` | `100%` |
| `backdrop-brightness-125` | `125%` |
| `backdrop-brightness-150` | `150%` |
| `backdrop-brightness-200` | `200%` |

### Backdrop Contrast

| Class | Value |
|-------|-------|
| `backdrop-contrast-50` | `50%` |
| `backdrop-contrast-100` | `100%` |
| `backdrop-contrast-150` | `150%` |
| `backdrop-contrast-200` | `200%` |

### Backdrop Grayscale

| Class | Value |
|-------|-------|
| `backdrop-grayscale-0` | `0%` |
| `backdrop-grayscale` | `100%` |

### Backdrop Invert

| Class | Value |
|-------|-------|
| `backdrop-invert-0` | `0%` |
| `backdrop-invert` | `100%` |

### Backdrop Saturate

| Class | Value |
|-------|-------|
| `backdrop-saturate-50` | `50%` |
| `backdrop-saturate-100` | `100%` |
| `backdrop-saturate-150` | `150%` |
| `backdrop-saturate-200` | `200%` |

### Backdrop Sepia

| Class | Value |
|-------|-------|
| `backdrop-sepia-0` | `0%` |
| `backdrop-sepia` | `100%` |

### Backdrop Filter Examples

```html
<!-- Frosted glass modal -->
<div class="fixed inset-0 backdrop-blur-md backdrop-brightness-75">
  <div class="bg-white/30 rounded-lg">
    Modal content
  </div>
</div>

<!-- Menu overlay -->
<nav class="backdrop-blur-lg bg-black/20">
  Navigation items
</nav>

<!-- Glassmorphism card -->
<div class="backdrop-blur-xl bg-white/10 border border-white/20">
  Glass card
</div>

<!-- Dim backdrop -->
<div class="fixed inset-0 backdrop-brightness-50">
  Darkened overlay
</div>

<!-- Blurred background with color -->
<div class="backdrop-blur-lg backdrop-sepia-[30%]">
  Blurred and warm
</div>

<!-- Interactive backdrop -->
<div class="backdrop-brightness-100 hover:backdrop-brightness-75">
  Darken on interaction
</div>
```

## Combining Filters

```html
<!-- Multiple filters on element -->
<img class="blur-md brightness-75 contrast-125">
  Blurred, darkened, and enhanced contrast
</img>

<!-- Filters with opacity -->
<div class="grayscale opacity-50">
  Faded grayscale image
</div>

<!-- Backdrop filters combination -->
<div class="backdrop-blur-lg backdrop-brightness-90 backdrop-contrast-125">
  Blurred, slightly darkened, and contrasty backdrop
</div>

<!-- Responsive filters -->
<img class="blur-none md:blur-sm lg:blur-md" />

<!-- Interactive state changes -->
<div class="hue-rotate-0 hover:hue-rotate-90 transition-all">
  Color shift on hover
</div>
```

## Performance Considerations

1. **Backdrop filters** are heavy - use sparingly
2. **Blur on large elements** impacts performance
3. **Combine filters** rather than applying individually
4. **Use will-change** for animated filters:
   ```html
   <div class="will-change-filter animate-pulse">
     Animated filter effect
   </div>
   ```
5. **Test on low-end devices** - filters can cause jank

## Browser Support

- **Blur**: All modern browsers
- **Brightness, Contrast, Grayscale, Sepia, Hue-rotate, Invert, Saturate**: All modern browsers
- **Backdrop filters**: Chrome 76+, Safari 9+, Firefox 103+
- **All utilities**: Full support in modern browsers (2023+)

## Configuration

### Custom Filter Values

```css
@import "tailwindcss";

@theme {
  --blur-soft: 2px;
  --blur-heavy: 50px;
}
```

Usage:
```html
<div class="blur-[var(--blur-soft)]">Soft blur</div>
<div class="blur-[var(--blur-heavy)]">Heavy blur</div>
```
