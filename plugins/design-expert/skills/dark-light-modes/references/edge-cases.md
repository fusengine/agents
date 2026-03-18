# Dark Mode Edge Cases

## Shadows

In dark mode, box shadows become invisible against dark backgrounds.
Replace with borders or elevation via background lightening.

```css
/* Light mode: drop shadow for elevation */
.card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

/* Dark mode: use lighter background + subtle border instead */
.dark .card {
  box-shadow: none;
  background: oklch(18% 0.01 260);   /* slightly lighter than bg */
  border: 1px solid oklch(25% 0.01 260);
}
```

## Elevation in Dark Mode

Use background lightness to convey depth (not shadows):

```css
:root {
  --surface-0: oklch(10% 0.01 260);  /* base background */
  --surface-1: oklch(14% 0.01 260);  /* cards, panels */
  --surface-2: oklch(18% 0.01 260);  /* dropdowns, popovers */
  --surface-3: oklch(22% 0.01 260);  /* modals, tooltips */
}
```

## Borders

Light mode borders are often very subtle; dark mode needs more contrast:

```css
:root       { --border: oklch(90% 0 0); }
.dark       { --border: oklch(25% 0.01 260); }
```

## Color Saturation

Pure dark (#000000) feels harsh. Desaturated dark feels more natural:

```css
/* Too harsh */
.dark { background: #000000; }

/* Better: slightly warm/cool dark */
.dark { background: oklch(8% 0.01 260); }
```

## Focus Rings

Light focus ring disappears on dark backgrounds:

```css
:root { --ring: oklch(55% 0.20 260); }
.dark { --ring: oklch(70% 0.20 260); } /* lighter for visibility */
```

## Status Colors

Semantic colors need independent dark mode values:

```css
:root {
  --color-success: oklch(55% 0.20 145);
  --color-warning: oklch(75% 0.18 80);
  --color-error:   oklch(55% 0.25 25);
}
.dark {
  --color-success: oklch(70% 0.18 145); /* lighter for dark bg */
  --color-warning: oklch(82% 0.16 80);
  --color-error:   oklch(68% 0.22 25);
}
```

## Checklist
- [ ] Shadows replaced with elevation backgrounds in dark mode
- [ ] Borders have enough contrast on dark surfaces
- [ ] Focus rings visible on dark backgrounds
- [ ] Status colors lightened for dark mode
- [ ] No pure black (#000) backgrounds
