# Text Utilities - Tailwind CSS v4.1

## Text Color

### Utility Classes

```html
<!-- Using color names -->
<p class="text-red-500">Red text</p>
<p class="text-blue-600">Blue text</p>
<p class="text-gray-700">Dark gray text</p>

<!-- Using opacity -->
<p class="text-red-500/50">Red with 50% opacity</p>
<p class="text-blue-600/75">Blue with 75% opacity</p>

<!-- Dark mode -->
<p class="text-gray-900 dark:text-white">Auto switch in dark mode</p>
```

### All Colors Available

Colors from slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose.

Each color has: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Arbitrary Values

```html
<p class="text-[#1f2937]">Custom hex color</p>
<p class="text-[rgb(31,41,55)]">RGB color</p>
<p class="text-[hsl(217,33%,17%)]">HSL color</p>
```

### Customization

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      textColor: {
        'brand': '#5a67d8',
        'brand-dark': '#3c366b',
      }
    }
  }
}
```

## Text Alignment

### Utilities

```html
<!-- Left align (default) -->
<p class="text-left">Left aligned text</p>

<!-- Center align -->
<p class="text-center">Center aligned text</p>

<!-- Right align -->
<p class="text-right">Right aligned text</p>

<!-- Justify -->
<p class="text-justify">Fully justified text that will distribute evenly across the full width.</p>

<!-- Start (RTL compatible) -->
<p class="text-start">Text aligned to start</p>

<!-- End (RTL compatible) -->
<p class="text-end">Text aligned to end</p>
```

### Responsive

```html
<p class="text-left sm:text-center lg:text-right">
  Responsive alignment
</p>
```

## Text Wrapping

### Wrapping Options

```html
<!-- Default wrapping -->
<p class="text-wrap">
  This text will wrap to multiple lines if needed and is very long.
</p>

<!-- No wrapping -->
<p class="text-nowrap">
  This text will not wrap and might overflow container.
</p>

<!-- Balance wrapping (NEW v4.1) -->
<p class="text-balance">
  Balanced text wrapping looks better for headlines and keeps lines even.
</p>

<!-- Pretty wrapping (NEW v4.1) -->
<p class="text-pretty">
  Pretty text wrapping prevents orphan words from appearing alone on the last line.
</p>
```

### Use Cases

- `text-balance`: Headlines, titles
- `text-pretty`: Articles, body text
- `text-nowrap`: Status badges, inline data
- `text-wrap`: Default paragraph behavior

## Text Shadow (NEW in v4.1)

### Built-in Shadows

```html
<!-- Small shadow -->
<p class="text-shadow-sm">Subtle text shadow</p>

<!-- Base shadow -->
<p class="text-shadow">Default text shadow</p>

<!-- Large shadow -->
<p class="text-shadow-lg">Larger text shadow</p>

<!-- Extra large shadow -->
<p class="text-shadow-xl">Extra large text shadow</p>

<!-- Custom color shadow -->
<p class="text-shadow text-shadow-red">Red shadow</p>
```

### Arbitrary Values

```html
<p class="text-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">Custom shadow</p>

<p class="text-shadow-[5px_5px_10px_#ff0000]">Red colored shadow</p>
```

### Customization

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(59, 130, 246, 0.5)',
        neon: '0 0 10px rgba(34, 197, 94, 0.8)',
      }
    }
  }
}
```

### Practical Examples

```html
<!-- Heading with glow effect -->
<h1 class="text-4xl font-bold text-white text-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
  Glowing Headline
</h1>

<!-- Elevated text effect -->
<p class="text-lg text-shadow-lg">Elevated text</p>

<!-- Dark text on light background -->
<p class="text-white text-shadow-[1px_1px_3px_rgba(0,0,0,0.5)]">
  Readable light text on image
</p>
```

## Text Decoration

### Decoration Line

```html
<!-- Underline -->
<p class="underline">Underlined text</p>

<!-- Overline -->
<p class="overline">Overlined text</p>

<!-- Line-through -->
<p class="line-through">Struck through text</p>

<!-- No decoration -->
<p class="no-underline">Normal text without decoration</p>
```

### Decoration Style

```html
<!-- Solid -->
<a href="#" class="underline decoration-solid">Solid underline</a>

<!-- Double -->
<a href="#" class="underline decoration-double">Double underline</a>

<!-- Dotted -->
<a href="#" class="underline decoration-dotted">Dotted underline</a>

<!-- Dashed -->
<a href="#" class="underline decoration-dashed">Dashed underline</a>

<!-- Wavy -->
<a href="#" class="underline decoration-wavy">Wavy underline</a>
```

### Decoration Thickness

```html
<a href="#" class="underline decoration-1">Thin</a>
<a href="#" class="underline decoration-2">Normal</a>
<a href="#" class="underline decoration-4">Thick</a>
<a href="#" class="underline decoration-8">Extra thick</a>
```

### Decoration Offset

```html
<a href="#" class="underline underline-offset-1">Small offset</a>
<a href="#" class="underline underline-offset-2">Normal offset</a>
<a href="#" class="underline underline-offset-4">Large offset</a>
<a href="#" class="underline underline-offset-8">Extra large offset</a>
```

### Decoration Color

```html
<a href="#" class="underline decoration-red-500">Red underline</a>
<a href="#" class="underline decoration-blue-600">Blue underline</a>
<a href="#" class="underline decoration-current">Current text color</a>
```

## Text Transform

### Case Transformation

```html
<!-- Uppercase -->
<p class="uppercase">this becomes uppercase</p>

<!-- Lowercase -->
<p class="lowercase">THIS BECOMES LOWERCASE</p>

<!-- Capitalize -->
<p class="capitalize">this becomes capitalized</p>

<!-- Normal case -->
<p class="normal-case">NorMal CaSe becomes normal</p>
```

### Responsive

```html
<p class="uppercase sm:normal-case lg:lowercase">
  Changes based on screen size
</p>
```

## Text Indent

```html
<p class="indent-4">This paragraph has indentation</p>
<p class="indent-8">Larger indentation</p>
```

## Word Break

```html
<!-- Break words -->
<p class="break-words">
  This-very-long-word-that-has-no-spaces-will-break
</p>

<!-- Keep normal -->
<p class="break-normal">Normal word breaking behavior</p>

<!-- Break all -->
<p class="break-all">
  This will break even normal words if needed
</p>
```

## Whitespace Handling

```html
<!-- Normal -->
<p class="whitespace-normal">  Multiple  spaces  get  collapsed</p>

<!-- No wrap -->
<p class="whitespace-nowrap">No wrapping and no collapse</p>

<!-- Pre -->
<p class="whitespace-pre">  Spaces and  newlines  are preserved</p>

<!-- Pre wrap -->
<p class="whitespace-pre-wrap">Preserved with wrapping</p>

<!-- Pre line -->
<p class="whitespace-pre-line">  Spaces collapsed  but newlines kept</p>
```
