# Tailwind CSS Expert v4.3

Expert plugin for Tailwind CSS v4.3 with CSS-native configuration, @theme, @utility, @variant and Oxide engine.

## Features

- **CSS-first Configuration**: No more tailwind.config.js needed
- **@theme Directive**: Design tokens in native CSS
- **@utility/@variant**: Create custom utilities and variants
- **Oxide Engine**: 5x faster builds
- **OKLCH Colors**: Wide-gamut P3 support
- **Container Queries**: @container, @md:*, etc.
- **16 Specialized Skills**: Complete v4.3 documentation

## Installation

```bash
claude mcp add-json fuse-tailwindcss '{"type":"local","path":"plugins/tailwindcss"}'
```

## Skills

### Core & Configuration

| Skill | Description |
|-------|-------------|
| `tailwindcss-v4` | Core v4.3, @theme, directives, migration guide |
| `tailwindcss-core` | @theme, @import, @source, @utility, @variant, @apply, @config |
| `tailwindcss-utilities` | Complete utility classes reference |
| `tailwindcss-utility-classes` | Layout, spacing, typography, colors, borders, effects |
| `tailwindcss-responsive` | Breakpoints sm: md: lg: xl: 2xl:, container queries |
| `tailwindcss-custom-styles` | @utility, @variant, @apply, custom CSS |

### Layout & Spacing

| Skill | Description |
|-------|-------------|
| `tailwindcss-layout` | Flexbox, Grid, Position, Container queries (@container) |
| `tailwindcss-spacing` | Margin (m-*), Padding (p-*), Space between (space-x/y-*) |
| `tailwindcss-sizing` | Width, Height, h-dvh, logical inline-*/block-* (v4.2), Min/Max, Aspect ratio |

### Styling

| Skill | Description |
|-------|-------------|
| `tailwindcss-typography` | Fonts, font-features-* (v4.2), Text, text-shadow, text-wrap balance/pretty, tab-* (v4.3) |
| `tailwindcss-backgrounds` | Colors OKLCH P3 (+ mauve/olive/mist/taupe, v4.2), Gradients radial/conic, Images |
| `tailwindcss-borders` | Border (+ logical border-bs/be, v4.2), Outline, Ring, Divide |
| `tailwindcss-effects` | shadow-color, inset-shadow, mask-*, Filters |
| `tailwindcss-transforms` | Transform, zoom-* (v4.3), Transition, Animation, @keyframes |
| `tailwindcss-interactivity` | Cursor, Scroll-snap, scrollbar-* (v4.3), Touch-action, Accent-color |

## Agent

The `tailwindcss-expert` agent activates automatically when you mention:
- Tailwind CSS, utility classes
- @theme, @utility, @variant
- Responsive design, dark mode
- Custom styles, configuration

## Recent Features by Version

- **v4.3**: `scrollbar-*` / `scrollbar-thumb-*` / `scrollbar-track-*` / `scrollbar-gutter-*`, `@container-size`, `zoom-*`, `tab-*`, stacked + compound `@variant`, `--default()` in functional `@utility`
- **v4.2**: `mauve`/`olive`/`mist`/`taupe` palettes, `@tailwindcss/webpack`, logical `pbs-*`/`mbs-*`/`border-bs-*`/`inline-*`/`block-*`/`inset-s|e|bs|be-*` (`start-*`/`end-*` deprecated), `font-features-*`
- **v4.1**: `text-shadow-*`, `mask-*`
- **v4.0**: `inset-shadow-*`, `bg-conic-*` / `bg-radial-*`, OKLCH wide-gamut P3 palette
- **Earlier (v3.x, still current)**: `h-dvh`, `text-balance`/`text-pretty` (v3.4), shadow colors (v3.0)

## Compatibility

- Safari 16.4+
- Chrome 111+
- Firefox 128+

## License

MIT - Fusengine
