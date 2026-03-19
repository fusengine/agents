# Dark Mode Image Handling

## Strategy 1 — CSS Filter (simple, one image)

Apply a subtle filter to reduce harshness of light images on dark backgrounds:

```css
/* Reduce brightness slightly in dark mode */
.dark img:not([data-no-filter]) {
  filter: brightness(0.85) contrast(1.05);
}

/* Opt out for specific images (logos, icons) */
<img src="logo.png" data-no-filter />
```

## Strategy 2 — Swap Source with `<picture>`

Provide separate dark/light variants at the HTML level:

```html
<picture>
  <source
    srcset="/images/hero-dark.webp"
    media="(prefers-color-scheme: dark)"
  />
  <img
    src="/images/hero-light.webp"
    alt="Hero illustration"
    className="w-full"
  />
</picture>
```

## Strategy 3 — CSS `content` Swap (icons/SVG)

```css
.theme-logo {
  content: url('/images/logo-light.svg');
}

.dark .theme-logo {
  content: url('/images/logo-dark.svg');
}
```

## Strategy 4 — CSS Overlay (darkens images in dark mode)

```css
.dark .hero-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: inherit;
}
```

## Strategy 5 — Next.js with `next/image`

```tsx
import { useTheme } from "next-themes";
import Image from "next/image";

function ThemedLogo() {
  const { resolvedTheme } = useTheme();
  return (
    <Image
      src={resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Logo"
      width={120}
      height={40}
    />
  );
}
```

## Which Strategy to Use

| Image Type | Strategy |
|------------|----------|
| Photos / illustrations | CSS filter (brightness 0.85) |
| Logo with dark/light variants | `<picture>` or CSS content swap |
| SVG icons (inline) | Use `currentColor` — inherits text color |
| Hero backgrounds | CSS overlay |
| User-uploaded images | CSS filter (can't control source) |

## Rules
- Never apply `filter: invert(1)` to photos — faces and skin tones look wrong
- `prefers-color-scheme` in `<picture>` works without JS — prefer it for SSR
- Use `suppressHydrationWarning` when using `useTheme` to avoid mismatch
