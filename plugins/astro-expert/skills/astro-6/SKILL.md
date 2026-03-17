---
name: astro-6
description: Expert Astro 6 framework — routing, output modes, middleware, Vite Environment API, Rust compiler, Content Security Policy, Live Collections, Fonts API. Use when building Astro sites, configuring output, or upgrading from Astro 5.
versions:
  astro: 6
  node: "22+"
  vite: 6
user-invocable: true
references: references/installation.md, references/routing.md, references/output-modes.md, references/middleware.md, references/config.md, references/new-features.md, references/templates/basic-setup.md, references/templates/config-example.md
related-skills: astro-content, astro-actions, astro-islands, astro-integrations, astro-deployment
---

# Astro 6 Expert

Production-ready web framework for content-driven sites with unified dev runtime and Islands Architecture.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing routes, layouts, and config
2. **fuse-ai-pilot:research-expert** - Verify latest Astro 6 docs via Context7/Exa
3. **mcp__context7__query-docs** - Check breaking changes v5→v6

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building new content-driven websites or blogs
- Migrating from Astro 5 to version 6
- Configuring static, server, or hybrid output modes
- Setting up middleware for auth or redirects
- Leveraging the new Rust compiler for large sites
- Implementing Content Security Policy (CSP) headers

### Why Astro 6

| Feature | Benefit |
|---------|---------|
| Unified Dev Runtime | Dev matches production — fewer "works in dev, breaks in prod" bugs |
| Vite Environment API | Exact production runtime during development |
| Rust Compiler | Faster `.astro` file compilation, replaces Go compiler |
| Live Content Collections | Real-time data from external sources |
| Built-in Fonts API | Zero-config font loading with performance optimization |
| CSP Support | Built-in Content Security Policy nonce management |
| Cloudflare Workers | First-class support with workerd runtime in dev |

---

## Core Concepts

### Output Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `static` (default) | All pages prerendered at build | Blogs, docs, marketing |
| `server` | All pages rendered on demand | Apps, dashboards, auth |
| `hybrid` | Mix static + on-demand | Most production sites |

### Routing

- **File-based routing** — `src/pages/` maps directly to URLs
- **Dynamic routes** — `[slug].astro`, `[...all].astro`
- **Per-route prerender** — `export const prerender = false/true`
- **Endpoints** — `.ts`/`.js` files in `src/pages/` for API routes

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Initial setup | [installation.md](references/installation.md) |
| Routing patterns | [routing.md](references/routing.md) |
| Output configuration | [output-modes.md](references/output-modes.md) |
| Middleware setup | [middleware.md](references/middleware.md) |
| astro.config.ts | [config.md](references/config.md) |
| New Astro 6 features | [new-features.md](references/new-features.md) |
| Full project setup | [templates/basic-setup.md](references/templates/basic-setup.md) |
| Config examples | [templates/config-example.md](references/templates/config-example.md) |

---

## Best Practices

1. **Use `output: 'static'` by default** — Add server only when needed
2. **Per-route `prerender`** — Fine-grained control in hybrid mode
3. **Middleware for cross-cutting concerns** — Auth, redirects, headers
4. **Opt into Rust compiler** — Faster builds on large sites
5. **CSP nonces** — Use built-in support instead of custom headers
