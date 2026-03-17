---
name: transitions
description: View Transitions API — transition:persist, transition:name, page animations
when-to-use: animated page transitions, persisting state between pages
keywords: transitions, ViewTransitions, transition:persist, transition:name, animations
priority: medium
---

# View Transitions

## When to Use

- Adding smooth page transitions without a SPA
- Persisting a component (media player, form) between page navigations
- Animating specific elements across pages

## Setup

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
---
<html>
  <head>
    <ViewTransitions />
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
