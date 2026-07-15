---
name: view-transitions
description: Astro View Transitions API — cross-page animations, transition directives, custom animations, fallbacks
when-to-use: Adding animated page transitions, persisting state across navigation, MPA cross-page animations
keywords: ClientRouter, ViewTransitions (removed in Astro 6), transition:name, transition:animate, transition:persist, MPA, fallback
priority: high
related: transitions.md
---

# View Transitions (Complete Reference)

## Setup

> **`<ViewTransitions />` was renamed `<ClientRouter />` in Astro 5.0, then removed entirely in Astro 6.0** — the old name breaks the build on 6/7. Import `ClientRouter` from `astro:transitions`.

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head><ClientRouter /></head>
```

Add `<ClientRouter />` to your base layout `<head>`. Enables client-side navigation.

## transition:name Directive

Pairs elements across pages for morphing animations:

```astro
<!-- Page A --> <h2 transition:name={`title-${post.slug}`}>{post.title}</h2>
<!-- Page B --> <h1 transition:name={`title-${post.slug}`}>{post.title}</h1>
```

Names must be unique per page. Matching names trigger shared-element transitions.

## transition:animate Directive

```astro
import { fade, slide } from 'astro:transitions';
<main transition:animate="slide">...</main>
<aside transition:animate={fade({ duration: '0.2s' })}>...</aside>
```

| Animation | Behavior |
|-----------|----------|
| `morph` | Default — morphs matched elements |
| `fade` | Cross-fade old/new |
| `slide` | Slide old out left, new in right |
| `none` | No animation (instant swap) |

## transition:persist for Stateful Islands

```astro
<AudioPlayer client:load transition:persist />
<VideoEmbed client:load transition:persist="media-player" />
```

Component is NOT destroyed/recreated — state, event listeners, and DOM persist.

## MPA Mode (Cross-Page Transitions)

Works in MPA mode by default (no SPA router). Each navigation fetches the new page, swaps content with animation, and updates URL/history.

## Custom Animations

```css
::view-transition-old(panel) { animation: slideOut 0.3s ease; }
::view-transition-new(panel) { animation: slideIn 0.3s ease; }
```

Use `<div transition:name="panel">` to bind the element.

## Back/Forward Navigation

Astro auto-reverses slide direction on back navigation. Key lifecycle events:
- `astro:before-preparation` — access `ev.direction` ('forward' | 'back')
- `astro:after-swap` — DOM updated, re-bind listeners
- `astro:page-load` — re-init scripts after navigation

## Fallback for Non-Supporting Browsers

```astro
<ClientRouter fallback="swap" />
```

| Fallback | Behavior |
|----------|----------|
| `animate` | Default — simulates with CSS (most compatible) |
| `swap` | Instant page swap, no animation |
| `none` | Full page reload |

## Production Pitfalls

### CSS dropped in dev on swap
**Symptom:** styles disappear or flash unstyled after a client-side navigation in `astro dev`, while a production build looks fine.
**Fix:** don't rely on styles injected only into the old page's `<head>`; prefer scoped component styles, and if a shared stylesheet must persist across navigations, load it via a `<link>` tag in the layout `<head>` — `ClientRouter`'s DOM diffing preserves matching persistent `<head>` elements across swaps.

### Video frozen after swap outside Chromium
**Symptom:** a `<video>` element keeps playing visually but is frozen/desynced after a page swap in Firefox or Safari.
**Fix:** mark the player with `transition:persist` so the element itself survives the swap instead of being unmounted and remounted; without it, non-Chromium browsers can leave the old media element's decode pipeline in a stuck state.

### `transition:persist` breaks i18n re-render
**Symptom:** a persisted island keeps showing the previous locale's text after navigating to a different `/en/`, `/fr/` route.
**Fix:** persisted components are NOT recreated, so props computed at first render (like translated strings) never update. Drop `transition:persist` on components whose content depends on locale, or re-derive locale-dependent state from the `astro:after-swap` event (read the new URL and re-render) instead of relying on initial props.
