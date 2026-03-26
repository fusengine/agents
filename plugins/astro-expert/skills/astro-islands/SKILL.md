---
name: astro-islands
description: Expert Astro Islands Architecture — client:load, client:idle, client:visible, client:media, client:only, server:defer (Server Islands), fallback slots, transition:persist, prop serialization. Use when adding interactivity to Astro pages or rendering dynamic server content.
versions:
  astro: 6
user-invocable: true
references: references/overview.md, references/client-directives.md, references/server-islands.md, references/transitions.md, references/view-transitions.md, references/prop-serialization.md, references/templates/interactive-island.md, references/templates/server-island.md
related-skills: astro-6, astro-integrations, astro-actions
---

# Astro Islands Expert

Partial hydration architecture: zero JS by default, selective interactivity via directives.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing components and hydration patterns
2. **fuse-ai-pilot:research-expert** - Verify latest Islands docs via Context7/Exa
3. **mcp__context7__query-docs** - Get client directive and server:defer examples

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Adding interactive React/Vue/Svelte/Solid components to Astro pages
- Deferring dynamic server content without blocking page load
- Persisting component state during View Transitions
- Optimizing Time to Interactive with lazy hydration

### Why Islands Architecture

| Concept | Benefit |
|---------|---------|
| Zero JS by default | Maximum performance, minimal payload |
| Selective hydration | Only interactive components ship JS |
| `server:defer` | Dynamic server content without SSR blocking |
| `client:visible` | Lazy-load below-fold components |
| `transition:persist` | State survives page navigation |

---

## Client Directives

| Directive | When JS Loads | Use Case |
|-----------|--------------|----------|
| `client:load` | Immediately on page load | Critical interactive UI |
| `client:idle` | After `requestIdleCallback` | Non-critical UI |
| `client:visible` | When component enters viewport | Below-fold components |
| `client:media="(query)"` | When media query matches | Responsive components |
| `client:only="framework"` | Client-only, no SSR | Components using browser APIs |

## Server Islands

`server:defer` renders the component on the server after the page loads:

- Uses `slot="fallback"` for placeholder content
- Ideal for personalized or auth-gated content
- Does not block initial page render
- Requires a server adapter

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Architecture overview | [overview.md](references/overview.md) |
| Client directive details | [client-directives.md](references/client-directives.md) |
| server:defer patterns | [server-islands.md](references/server-islands.md) |
| transition:persist | [transitions.md](references/transitions.md) |
| View Transitions (complete) | [view-transitions.md](references/view-transitions.md) |
| Prop serialization rules | [prop-serialization.md](references/prop-serialization.md) |
| Interactive component | [templates/interactive-island.md](references/templates/interactive-island.md) |
| Server island with fallback | [templates/server-island.md](references/templates/server-island.md) |

---

## Best Practices

1. **Default to no directive** — Ship zero JS unless interactivity is required
2. **Prefer `client:visible`** — Defer below-fold components automatically
3. **`client:only` for browser APIs** — localStorage, window, canvas
4. **`server:defer` for personalized content** — Avatars, prices, auth state
5. **`transition:persist`** — Preserve media players or forms during navigation
