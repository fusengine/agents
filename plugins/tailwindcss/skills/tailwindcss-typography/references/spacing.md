# Spacing Utilities - Tailwind CSS v4.1

## Letter Spacing (Tracking)

### Scale

| Class | Value |
|-------|-------|
| tracking-tighter | -0.05em |
| tracking-tight | -0.025em |
| tracking-normal | 0em |
| tracking-wide | 0.025em |
| tracking-wider | 0.05em |
| tracking-widest | 0.1em |

### Usage

```html
<p class="tracking-tighter">Tighter letter spacing</p>
<p class="tracking-tight">Tight letter spacing</p>
<p class="tracking-normal">Normal letter spacing</p>
<p class="tracking-wide">Wide letter spacing</p>
<p class="tracking-wider">Wider letter spacing</p>
<p class="tracking-widest">Widest letter spacing</p>
```

### Responsive

```html
<p class="tracking-tight sm:tracking-normal lg:tracking-wide">
  Responsive letter spacing
</p>
```

### Arbitrary Values

```html
<p class="tracking-[0.15em]">Custom letter spacing</p>
<p class="tracking-[2px]">Pixel-based tracking</p>
```

### Customization

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
        'extra-wide': '0.15em',
      }
    }
  }
}
```

### Best Practices

```html
<!-- Headings: often use tighter -->
<h1 class="text-4xl font-bold tracking-tight">Headline</h1>

<!-- Body: normal or slightly wide -->
<p class="text-base tracking-normal">Body paragraph</p>

<!-- Small caps: wider for readability -->
<p class="uppercase tracking-wider text-sm">Small caps text</p>
```

## Line Height (Leading)

### Scale

| Class | Value |
|-------|-------|
| leading-none | 1 |
| leading-tight | 1.25 |
| leading-snug | 1.375 |
| leading-normal | 1.5 |
| leading-relaxed | 1.625 |
| leading-loose | 2 |

### Usage

```html
<p class="leading-none">No line height</p>
<p class="leading-tight">Tight line height</p>
<p class="leading-snug">Snug line height</p>
<p class="leading-normal">Normal line height (default)</p>
<p class="leading-relaxed">Relaxed line height</p>
<p class="leading-loose">Loose line height</p>
```

### Responsive

```html
<p class="leading-tight sm:leading-normal lg:leading-relaxed">
  Responsive line height
</p>
```

### Arbitrary Values

```html
<p class="leading-[1.75]">Custom line height 1.75</p>
<p class="leading-[32px]">Pixel-based line height</p>
<p class="leading-[2.5rem]">REM-based line height</p>
```

### Customization

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
        'extra-loose': '2.5',
      }
    }
  }
}
```

### Best Practices

```html
<!-- Headings: tight for compact look -->
<h1 class="text-5xl leading-tight font-bold">Large Headline</h1>

<!-- Body text: relaxed for readability -->
<article class="text-lg leading-relaxed">
  Long form content benefits from increased line height...
</article>

<!-- Code: none for compact display -->
<pre class="leading-none"><code>const x = 42;</code></pre>

<!-- Small text: snug works well -->
<p class="text-sm leading-snug">Fine print text</p>
```

## Combined Typography Examples

### Heading Style

```html
<h1 class="text-5xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white">
  Beautiful Headline
</h1>
```

### Body Text

```html
<p class="text-lg leading-relaxed tracking-normal text-gray-700 dark:text-gray-300">
  This is a well-formatted paragraph with optimal spacing for readability.
  It uses a larger font size, relaxed line height, and appropriate letter spacing.
</p>
```

### Balanced Heading

```html
<h2 class="text-4xl font-semibold tracking-tight leading-tight text-balance">
  Long Headlines Break Better with Text Balance
</h2>
```

### Readable Small Text

```html
<small class="text-sm leading-relaxed tracking-wide text-gray-600 dark:text-gray-400">
  Small text with more spacing for accessibility
</small>
```

### Code Block

```html
<code class="font-mono text-sm leading-none tracking-tight text-red-600 dark:text-red-400">
  const result = compute(data);
</code>
```

## Spacing in Context

### Article Layout

```html
<article class="prose max-w-2xl">
  <h1 class="text-5xl font-bold leading-tight tracking-tight mb-4">
    Article Title
  </h1>

  <p class="text-xl leading-relaxed tracking-wide text-gray-600 mb-8">
    Introductory paragraph with larger size and letter spacing.
  </p>

  <h2 class="text-3xl font-semibold leading-tight tracking-tight mt-8 mb-4">
    Section Heading
  </h2>

  <p class="text-base leading-relaxed tracking-normal text-gray-800 mb-4">
    Body paragraph with standard sizing and spacing.
  </p>
</article>
```

### Card Component

```html
<div class="bg-white rounded-lg shadow p-6">
  <h3 class="text-2xl font-semibold leading-tight tracking-tight text-gray-900">
    Card Title
  </h3>

  <p class="text-sm leading-relaxed tracking-normal text-gray-600 mt-2">
    Card description with balanced typography.
  </p>
</div>
```

### Form Labels

```html
<label class="block text-sm font-medium leading-none tracking-normal text-gray-700 mb-2">
  Email Address
</label>

<input
  type="email"
  class="text-base leading-normal tracking-normal"
  placeholder="Enter your email"
/>
```

## Responsive Typography Scale

```html
<!-- Complete responsive typography system -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
  Responsive Heading
</h1>

<p class="text-sm sm:text-base md:text-lg font-normal leading-relaxed tracking-normal text-gray-700">
  Responsive body text that adapts to screen size
</p>
```

## Accessibility Considerations

### Letter Spacing
```html
<!-- Too wide: hard to read -->
<p class="tracking-widest text-sm">Difficult to read</p>

<!-- Better: wider with larger text -->
<p class="text-lg tracking-wide">Easier to read</p>
```

### Line Height
```html
<!-- Minimum for accessibility: 1.5 -->
<p class="leading-relaxed">WCAG compliant minimum</p>

<!-- Dyslexic-friendly: even wider -->
<p class="leading-loose tracking-wide">Extra accessible</p>
```

### Combined for Readability
```html
<article class="text-lg leading-relaxed tracking-normal max-w-2xl">
  <!-- Optimal for readability:
       - Font size: 18-20px (text-lg)
       - Line height: 1.625 (leading-relaxed)
       - Letter spacing: normal
       - Max width: 65 characters
  -->
  This article is formatted for optimal readability with appropriate
  spacing between lines and letters.
</article>
```
