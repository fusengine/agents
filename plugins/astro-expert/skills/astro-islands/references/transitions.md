---
name: transitions
description: View Transitions API — transition:persist, transition:name, page animations
when-to-use: animated page transitions, persisting state between pages
keywords: transitions, ClientRouter, ViewTransitions (removed in Astro 6), transition:persist, transition:name, animations
priority: medium
---

# View Transitions

## When to Use

- Adding smooth page transitions without a SPA
- Persisting a component (media player, form) between page navigations
- Animating specific elements across pages

## Setup

> **`<ViewTransitions />` was renamed `<ClientRouter />` in Astro 5.0, then removed entirely in Astro 6.0.** Import `ClientRouter` from `astro:transitions` — the old name breaks the build on Astro 6/7.

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---
<html>
  <head>
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```

## transition:persist

Keeps a component alive between page navigations:

```astro
<!-- Persists across navigation — music keeps playing -->
<MusicPlayer client:load transition:persist />

<!-- Persists with a custom identifier -->
<ShoppingCart client:load transition:persist="cart" />
```

## transition:name

Animates a specific element with a matching element on the next page:

```astro
<!-- src/pages/blog/index.astro -->
<img src={post.image} transition:name={`post-image-${post.id}`} />

<!-- src/pages/blog/[slug].astro -->
<img src={post.image} transition:name={`post-image-${post.id}`} />
```

## Built-in Animations

```astro
import { fade, slide, none } from 'astro:transitions';

<div transition:animate={fade({ duration: '0.3s' })}>...</div>
<aside transition:animate={slide({ duration: '0.2s' })}>...</aside>
<div transition:animate={none()}>...</div>
```

## Lifecycle Events

```javascript
document.addEventListener('astro:page-load', () => {
  // Runs after every page navigation
  initAnalytics();
});
```

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
