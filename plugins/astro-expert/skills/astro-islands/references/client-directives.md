---
name: client-directives
description: All Astro client directives — client:load, idle, visible, media, only — when and how to use
when-to-use: adding interactivity to framework components
keywords: client:load, client:idle, client:visible, client:media, client:only, hydration
priority: high
---

# Client Directives

## When to Use

- Adding interactivity to React/Vue/Svelte/Solid components
- Controlling when JavaScript loads for performance
- Components that only work in the browser

## Directive Reference

### client:load
Loads and hydrates immediately on page load. Use for critical interactive UI.

```astro
<NavigationMenu client:load />
<SearchBar client:load />
```

### client:idle
Loads after the browser is idle (`requestIdleCallback`). Use for non-critical UI.

```astro
<Newsletter client:idle />
<CookieBanner client:idle />
```

### client:visible
Loads when the component enters the viewport (IntersectionObserver). Use for below-fold components.

```astro
<CommentSection client:visible />
<RelatedPosts client:visible />
```

### client:media
Loads when a CSS media query matches. Use for responsive/mobile-only components.

```astro
<MobileMenu client:media="(max-width: 768px)" />
<DesktopSidebar client:media="(min-width: 1024px)" />
```

### client:only
Renders on client only — skips server rendering. Must specify framework.

```astro
<MapComponent client:only="react" />
<VideoPlayer client:only="svelte" />
<ChartComponent client:only="vue" />
<SignalCounter client:only="solid-js" />
```

## Decision Matrix

| Component | Directive |
|-----------|-----------|
| Navigation, search | `client:load` |
| Cookie banner, newsletter | `client:idle` |
| Comments, related posts | `client:visible` |
| Mobile nav only | `client:media` |
| Chart, map, canvas | `client:only` |
| User avatar, cart count | `server:defer` |
