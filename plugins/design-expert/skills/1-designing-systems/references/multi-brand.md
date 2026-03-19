# Multi-Brand Theming — White-Label Pattern

## Concept

Same components, different tokens per brand.
Components never reference brand-specific values — only semantic tokens.

## File Structure

```
tokens/
├── base.css          # Primitives + defaults
├── brands/
│   ├── brand-a.css   # Brand A semantic overrides
│   ├── brand-b.css   # Brand B semantic overrides
│   └── brand-c.css   # Brand C semantic overrides
└── components/
    └── *.css         # Component tokens (consume semantic only)
```

## Base Tokens (primitives — never override)

```css
/* tokens/base.css */
:root {
  --radius-sm:  0.375rem;
  --radius-md:  0.5rem;
  --radius-lg:  0.75rem;
  --radius-xl:  1rem;
  --radius-2xl: 1.5rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
}
```

## Brand-Specific Overrides (semantic layer)

```css
/* tokens/brands/brand-a.css — Finance, conservative */
[data-brand="brand-a"] {
  --color-primary:       oklch(40% 0.15 240);   /* deep blue */
  --color-primary-hover: oklch(35% 0.15 240);
  --color-accent:        oklch(55% 0.18 200);
  --font-display:        'Inter', sans-serif;
  --radius-default:      var(--radius-sm);       /* sharp corners */
  --brand-logo-url:      url('/brands/a/logo.svg');
}

/* tokens/brands/brand-b.css — Consumer, friendly */
[data-brand="brand-b"] {
  --color-primary:       oklch(60% 0.22 160);   /* green */
  --color-primary-hover: oklch(55% 0.22 160);
  --color-accent:        oklch(75% 0.20 85);    /* yellow */
  --font-display:        'Nunito', sans-serif;
  --radius-default:      var(--radius-2xl);      /* very rounded */
}
```

## Component Tokens (brand-agnostic)

```css
/* tokens/components/button.css */
:root {
  --button-primary-bg:    var(--color-primary);
  --button-primary-hover: var(--color-primary-hover);
  --button-radius:        var(--radius-default, var(--radius-lg));
}
```

## Next.js Implementation

```tsx
// app/layout.tsx
export default function RootLayout({ children, params: { brand } }) {
  return (
    <html data-brand={brand}>
      <body>{children}</body>
    </html>
  );
}

// middleware.ts — detect brand from subdomain
export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  const brand = host?.split('.')[0] ?? 'default';
  req.headers.set('x-brand', brand);
}
```

## Tailwind v4 Multi-Brand

```css
/* tailwind.css */
@import "tailwindcss";
@import "./tokens/base.css";
@import "./tokens/brands/brand-a.css";
@import "./tokens/brands/brand-b.css";

@theme {
  --color-primary: var(--color-primary);  /* resolves per brand */
}
```

## Rules
- Never hard-code brand colors in components — only semantic tokens
- Each brand overrides only semantic layer, never primitives
- Component tokens remain identical across brands
- Test every component in every brand theme before release
