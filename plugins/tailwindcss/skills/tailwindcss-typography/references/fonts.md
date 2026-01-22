---
name: fonts
description: Font utilities for Tailwind CSS v4.1
---

# Font Utilities - Tailwind CSS v4.1

## Font Family

### Available Font Families

```css
/* font-sans (default) */
.font-sans { font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }

/* font-serif */
.font-serif { font-family: ui-serif, Georgia, "Times New Roman", "Times", serif; }

/* font-mono */
.font-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", Courier, monospace; }
```

### Usage

```html
<!-- Sans serif (default) -->
<p class="font-sans">This uses the sans-serif font family.</p>

<!-- Serif -->
<p class="font-serif">This uses the serif font family.</p>

<!-- Monospace -->
<code class="font-mono">const x = 42;</code>
```

### Customization

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        code: ['"Fira Code"', 'monospace'],
      }
    }
  }
}
```

## Font Size

### Scale

| Class | Size | Line Height |
|-------|------|-------------|
| text-xs | 0.75rem | 1rem |
| text-sm | 0.875rem | 1.25rem |
| text-base | 1rem | 1.5rem |
| text-lg | 1.125rem | 1.75rem |
| text-xl | 1.25rem | 1.75rem |
| text-2xl | 1.5rem | 2rem |
| text-3xl | 1.875rem | 2.25rem |
| text-4xl | 2.25rem | 2.5rem |
| text-5xl | 3rem | 1 |
| text-6xl | 3.75rem | 1 |
| text-7xl | 4.5rem | 1 |
| text-8xl | 6rem | 1 |
| text-9xl | 8rem | 1 |

### Usage

```html
<p class="text-xs">Extra small text</p>
<p class="text-sm">Small text</p>
<p class="text-base">Base text (default)</p>
<p class="text-lg">Large text</p>
<p class="text-2xl">2XL text</p>
<h1 class="text-5xl">Large heading</h1>
```

### Arbitrary Values

```html
<p class="text-[32px]">Custom size 32px</p>
<p class="text-[clamp(1rem,5vw,3rem)]">Responsive size</p>
```

### Customization

```javascript
// tailwind.config.js
export default {
  theme: {
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
    }
  }
}
```

## Font Weight

### Scale

| Class | Weight |
|-------|--------|
| font-thin | 100 |
| font-extralight | 200 |
| font-light | 300 |
| font-normal | 400 |
| font-medium | 500 |
| font-semibold | 600 |
| font-bold | 700 |
| font-extrabold | 800 |
| font-black | 900 |

### Usage

```html
<p class="font-thin">100 weight</p>
<p class="font-light">300 weight</p>
<p class="font-normal">400 weight (default)</p>
<p class="font-medium">500 weight</p>
<p class="font-semibold">600 weight</p>
<p class="font-bold">700 weight</p>
<p class="font-black">900 weight</p>
```

### Arbitrary Values

```html
<p class="font-[550]">Custom weight 550</p>
```

### Customization

```javascript
// tailwind.config.js
export default {
  theme: {
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    }
  }
}
```

## Font Style

```html
<!-- Italic -->
<p class="italic">This text is italic</p>

<!-- Normal (non-italic) -->
<p class="not-italic">This text is not italic</p>
```

## Font Variant Numeric

```html
<!-- Tabular numbers -->
<span class="tabular-nums">123 456 789</span>

<!-- Diagonal fractions -->
<span class="diagonal-fractions">1/2 3/4</span>

<!-- Stacked fractions -->
<span class="stacked-fractions">1/2 3/4</span>

<!-- Old style numbers -->
<span class="oldstyle-nums">123 456</span>

<!-- Proportional numbers -->
<span class="proportional-nums">123 456</span>

<!-- Small caps -->
<span class="small-caps">Small Caps Text</span>
```

## Smoothing

```html
<!-- Antialiased -->
<p class="antialiased">Smooth text rendering</p>

<!-- Subpixel antialiased -->
<p class="subpixel-antialiased">Subpixel rendering</p>
```
