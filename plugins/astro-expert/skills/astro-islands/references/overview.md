---
name: overview
description: Islands Architecture overview — zero JS default, partial hydration, architecture concepts
when-to-use: understanding how Astro Islands work, choosing hydration strategy
keywords: islands, architecture, hydration, zero JS, partial hydration
priority: high
---

# Islands Architecture Overview

## What Is It?

Islands Architecture means the page is mostly static HTML. Only specific components ("islands") hydrate with JavaScript when needed. Every other component ships zero JS.

## How It Works

```
Page (static HTML)
├── Header.astro          → No JS (static)
├── HeroBanner.astro      → No JS (static)
├── <Counter client:load> → Hydrated island (ships JS)
├── ArticleList.astro     → No JS (static)
└── <Comments client:visible> → Lazy island (loads on scroll)
```

## Why It Matters

| Metric | Traditional SPA | Astro Islands |
|--------|----------------|---------------|
| Default JS | Full framework bundle | Zero |
| Interactive components | All | Only flagged ones |
| Time to Interactive | Slow | Fast |
| SEO | Requires workarounds | Native HTML |

## Component Types

| Type | Renders Where | Ships JS? |
|------|--------------|-----------|
| `.astro` component | Server only | Never |
| Framework component (no directive) | Server only | Never |
| Framework component + `client:*` | Server + client | Yes |
| Framework component + `server:defer` | Deferred server | No |
| Framework component + `client:only` | Client only | Yes |

## Mental Model

Think of your page as an ocean of static HTML. Interactive components are "islands" that rise up from that ocean with their own JavaScript. Keep islands small and purposeful.
