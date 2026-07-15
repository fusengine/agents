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

## Hydration Mismatch Warning

An island that reads `window.location` (or any browser-only global) at mount time — instead of receiving that value as a **prop passed down from the server** — produces a hydration mismatch: the server-rendered markup won't match what the client computes on first paint, so the framework throws a hydration warning or re-renders incorrectly.

```astro
---
// ❌ Bad — island re-derives the URL itself, mismatched between SSR and client
---
<CurrentPage client:load />
```

```astro
---
// ✅ Good — URL computed server-side, passed in as a prop
---
<CurrentPage client:load currentUrl={Astro.url.pathname} />
```

```tsx
// CurrentPage.tsx
// ❌ Bad
export default function CurrentPage() {
  const path = window.location.pathname; // undefined during SSR, mismatched on hydrate
  return <p>{path}</p>;
}

// ✅ Good
export default function CurrentPage({ currentUrl }: { currentUrl: string }) {
  return <p>{currentUrl}</p>;
}
```

Applies to any directive that hydrates over server-rendered markup (`client:load`, `client:idle`, `client:visible`, `client:media`). `client:only` skips SSR entirely, so it isn't exposed to this specific mismatch — but still prefer server-provided props over re-deriving browser state.

## Decision Matrix

| Component | Directive |
|-----------|-----------|
| Navigation, search | `client:load` |
| Cookie banner, newsletter | `client:idle` |
| Comments, related posts | `client:visible` |
| Mobile nav only | `client:media` |
| Chart, map, canvas | `client:only` |
| User avatar, cart count | `server:defer` |
