---
name: images
description: Background images reference for Tailwind CSS
---

# Tailwind CSS Background Images Reference

## Overview

Background image utilities control how images are applied, sized, positioned, and repeated behind elements. The `bg-[url(...)]` syntax provides flexibility, while size, position, and repeat utilities complete the control set.

## Background Image Sources

### URL Utilities

```html
<!-- External URL -->
<div class="bg-[url('https://example.com/image.jpg')]"></div>

<!-- Relative path -->
<div class="bg-[url('/images/pattern.png')]"></div>

<!-- Public directory -->
<div class="bg-[url('/bg-hero.jpg')]"></div>

<!-- Data URL -->
<div class="bg-[url('data:image/svg+xml,...')]"></div>
```

### SVG Inline

```html
<!-- Inline SVG with encoding -->
<div class="bg-[url('data:image/svg+xml;base64,...')]"></div>

<!-- Simple SVG pattern -->
<div class="bg-[url('data:image/svg+xml,%3Csvg%20...%3E')]"></div>
```

## Background Size

Control how the background image scales to fit the container.

### Predefined Sizes

```html
<!-- Contain: scales image to fit inside container, preserves aspect ratio -->
<div class="bg-[url('/img/hero.jpg')] bg-contain bg-no-repeat bg-center"></div>

<!-- Cover: scales image to cover entire container, may crop -->
<div class="bg-[url('/img/hero.jpg')] bg-cover bg-center"></div>

<!-- Auto: displays image at original size -->
<div class="bg-[url('/img/icon.png')] bg-auto"></div>
```

### Custom Sizes

```html
<!-- Fixed size -->
<div class="bg-[url('/pattern.png')] bg-[size:100px_100px]"></div>

<!-- Percentage -->
<div class="bg-[url('/pattern.png')] bg-[size:50%]"></div>

<!-- Width and height -->
<div class="bg-[url('/pattern.png')] bg-[size:200px_100px]"></div>

<!-- Single dimension with auto -->
<div class="bg-[url('/pattern.png')] bg-[size:100%_auto]"></div>
```

### Responsive Sizes

```html
<div class="bg-[url('/img/bg.jpg')]
           md:bg-[size:100%]
           lg:bg-[size:150%]
           bg-no-repeat bg-center"></div>
```

## Background Position

Control where the background image appears within the container.

### Predefined Positions

```html
<!-- Corners -->
<div class="bg-[url('/img.jpg')] bg-top-left"></div>
<div class="bg-[url('/img.jpg')] bg-top-right"></div>
<div class="bg-[url('/img.jpg')] bg-bottom-left"></div>
<div class="bg-[url('/img.jpg')] bg-bottom-right"></div>

<!-- Edges -->
<div class="bg-[url('/img.jpg')] bg-top"></div>
<div class="bg-[url('/img.jpg')] bg-left"></div>
<div class="bg-[url('/img.jpg')] bg-right"></div>
<div class="bg-[url('/img.jpg')] bg-bottom"></div>

<!-- Center -->
<div class="bg-[url('/img.jpg')] bg-center"></div>
```

### Custom Positions

```html
<!-- Percentage values -->
<div class="bg-[url('/img.jpg')] bg-[position:25%_75%]"></div>
<div class="bg-[url('/img.jpg')] bg-[position:right_top]"></div>
<div class="bg-[url('/img.jpg')] bg-[position:100%_50%]"></div>

<!-- Pixel values -->
<div class="bg-[url('/img.jpg')] bg-[position:10px_20px]"></div>

<!-- Mixed units -->
<div class="bg-[url('/img.jpg')] bg-[position:50%_100px]"></div>
```

## Background Repeat

Control whether and how the background image tiles.

### Repeat Options

```html
<!-- Default: repeat in both directions -->
<div class="bg-[url('/pattern.png')] bg-repeat"></div>

<!-- No repetition -->
<div class="bg-[url('/img.jpg')] bg-no-repeat"></div>

<!-- Horizontal only -->
<div class="bg-[url('/stripe.png')] bg-repeat-x"></div>

<!-- Vertical only -->
<div class="bg-[url('/stripe.png')] bg-repeat-y"></div>

<!-- Repeat-round: tile and scale to fit exactly -->
<div class="bg-[url('/pattern.png')] bg-[repeat-round]"></div>

<!-- Repeat-space: tile with equal spacing -->
<div class="bg-[url('/pattern.png')] bg-[repeat-space]"></div>
```

### Common Patterns

```html
<!-- Single background image -->
<div class="bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat h-96"></div>

<!-- Repeating pattern -->
<div class="bg-[url('/dots.png')] bg-repeat h-64"></div>

<!-- Horizontal stripe -->
<div class="bg-[url('/stripe.png')] bg-repeat-x h-12"></div>

<!-- Vertical stripe -->
<div class="bg-[url('/line.png')] bg-repeat-y w-12"></div>
```

## Background Blend Modes

Blend a colored background with a background image for creative effects.

### Blend Mode Utilities

```html
<!-- multiply: darkens, increases saturation -->
<div class="bg-blue-500 bg-[url('/img.jpg')] bg-blend-multiply"></div>

<!-- screen: lightens, useful for dark images -->
<div class="bg-white bg-[url('/img.jpg')] bg-blend-screen"></div>

<!-- overlay: combines multiply and screen -->
<div class="bg-purple-500 bg-[url('/img.jpg')] bg-blend-overlay"></div>

<!-- darken: shows darkest of both -->
<div class="bg-slate-700 bg-[url('/img.jpg')] bg-blend-darken"></div>

<!-- lighten: shows lightest of both -->
<div class="bg-yellow-300 bg-[url('/img.jpg')] bg-blend-lighten"></div>

<!-- color-dodge: brightens, high contrast -->
<div class="bg-blue-400 bg-[url('/img.jpg')] bg-blend-color-dodge"></div>

<!-- color-burn: darkens, high contrast -->
<div class="bg-slate-900 bg-[url('/img.jpg')] bg-blend-color-burn"></div>

<!-- hard-light: strong overlay effect -->
<div class="bg-indigo-600 bg-[url('/img.jpg')] bg-blend-hard-light"></div>

<!-- soft-light: gentle overlay effect -->
<div class="bg-amber-400 bg-[url('/img.jpg')] bg-blend-soft-light"></div>

<!-- difference: creates contrast effect -->
<div class="bg-slate-600 bg-[url('/img.jpg')] bg-blend-difference"></div>

<!-- exclusion: similar to difference, lower contrast -->
<div class="bg-slate-600 bg-[url('/img.jpg')] bg-blend-exclusion"></div>

<!-- hue: uses hue of blend color -->
<div class="bg-red-500 bg-[url('/img.jpg')] bg-blend-hue"></div>

<!-- saturation: uses saturation of blend color -->
<div class="bg-purple-500 bg-[url('/img.jpg')] bg-blend-saturation"></div>

<!-- color: uses hue and saturation of blend color -->
<div class="bg-blue-600 bg-[url('/img.jpg')] bg-blend-color"></div>

<!-- luminosity: uses luminance of image -->
<div class="bg-slate-400 bg-[url('/img.jpg')] bg-blend-luminosity"></div>
```

## Practical Examples

### Hero Section with Overlay

```html
<div class="h-96 bg-[url('/hero-banner.jpg')] bg-cover bg-center
           bg-linear-to-br from-black/40 to-transparent
           flex items-center justify-center">
  <div class="text-center text-white">
    <h1 class="text-5xl font-bold mb-4">Welcome</h1>
    <p class="text-xl">Your tagline here</p>
  </div>
</div>
```

### Repeating Texture Pattern

```html
<div class="bg-[url('/texture.png')] bg-repeat bg-[size:100px_100px]
           p-8 rounded-lg">
  <p class="text-white">Content on textured background</p>
</div>
```

### Decorative Corner Image

```html
<div class="relative h-64 bg-white">
  <div class="absolute top-0 right-0
             w-32 h-32
             bg-[url('/corner-decoration.svg')] bg-no-repeat
             bg-contain"></div>
  <div class="p-8">Content here</div>
</div>
```

### Striped Background

```html
<div class="bg-[url('data:image/svg+xml,%3Csvg%20width=%2710%27%20height=%2710%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Crect%20width=%275%27%20height=%2710%27%20fill=%27%23e5e7eb%27/%3E%3C/svg%3E')] bg-repeat">
  <div class="bg-white/80 p-8">Content</div>
</div>
```

### Image with Multiply Blend

```html
<div class="h-80 bg-blue-600 bg-[url('/photo.jpg')]
           bg-cover bg-center bg-blend-multiply
           rounded-xl shadow-lg"></div>
```

### Centered Single Image

```html
<div class="w-96 h-96
           bg-[url('/centered-image.png')] bg-contain
           bg-no-repeat bg-center bg-slate-100
           rounded-lg border border-gray-200"></div>
```

### Responsive Background

```html
<div class="h-64 md:h-80 lg:h-96
           bg-[url('/img-mobile.jpg')] md:bg-[url('/img-desktop.jpg')]
           bg-cover bg-center"></div>
```

### Tiled Icon Pattern

```html
<div class="bg-[url('/icon.svg')] bg-repeat bg-[size:40px_40px]
           p-6 rounded-lg bg-blue-50">
  <p class="text-sm">Icon pattern background</p>
</div>
```

## Performance Optimization

### Image Optimization Tips

1. **Use appropriately sized images**
   - Mobile: 800px width
   - Tablet: 1200px width
   - Desktop: 1920px width

2. **Optimize formats**
   - Use WebP for modern browsers with fallback
   - Use SVG for icons and patterns
   - Use PNG for graphics with transparency

3. **Compress images**
   - Use tools like TinyPNG, ImageOptim
   - Aim for <100KB for background images

### CSS Performance

```html
<!-- Efficient: specific size and no-repeat -->
<div class="bg-[url('/icon.png')] bg-no-repeat bg-contain
           w-8 h-8"></div>

<!-- Less efficient: relies on browser to handle repeated small image -->
<div class="bg-[url('/icon.png')] w-full h-full"></div>
```

## Accessibility

1. **Always provide alt content**
   ```html
   <div class="h-96 bg-[url('/hero.jpg')] bg-cover" role="img" aria-label="Hero banner showing mountains">
     <!-- Fallback content -->
   </div>
   ```

2. **Ensure sufficient contrast**
   - Use `bg-blend-*` with care in high-contrast designs
   - Test with color blindness simulators

3. **Don't rely on background images for critical content**
   - Always provide HTML text alternatives
   - Use `::before` or `::after` with content property for decorative elements

## Custom Background Images

Define custom background images in your Tailwind config:

```javascript
export default {
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': 'url(\'/images/hero-pattern.png\')',
        'dot-pattern': 'url(\'data:image/svg+xml,%3Csvg%20...\');',
        'gradient-custom': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
}
```

Then use: `bg-hero-pattern`, `bg-dot-pattern`, `bg-gradient-custom`
