---
name: view-transitions
description: Astro View Transitions API — cross-page animations, transition directives, custom animations, fallbacks
when-to-use: Adding animated page transitions, persisting state across navigation, MPA cross-page animations
keywords: ViewTransitions, transition:name, transition:animate, transition:persist, MPA, fallback
priority: high
related: transitions.md
---

# View Transitions (Complete Reference)

## Setup

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head><ViewTransitions /></head>
```

Add `<ViewTransitions />` to your base layout `<head>`. Enables client-side navigation.

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
<ViewTransitions fallback="swap" />
```

| Fallback | Behavior |
|----------|----------|
| `animate` | Default — simulates with CSS (most compatible) |
| `swap` | Instant page swap, no animation |
| `none` | Full page reload |
