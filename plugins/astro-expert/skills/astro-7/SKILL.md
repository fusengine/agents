---
name: astro-7
description: Expert Astro 7 framework (stable, 7.0.9) — routing, output modes, middleware, Vite Environment API, single Rust compiler, Content Security Policy, Live Collections, Fonts API. Use when building Astro sites, configuring output, or upgrading from Astro 5/6.
versions:
  astro: "7"
  node: "22.12+"
  vite: 8
user-invocable: true
references: references/installation.md, references/routing.md, references/output-modes.md, references/middleware.md, references/config.md, references/new-features.md, references/templates/basic-setup.md, references/templates/config-example.md
related-skills: astro-content, astro-actions, astro-islands, astro-integrations, astro-deployment
---

# Astro 7 Expert

Production-ready web framework for content-driven sites with unified dev runtime and Islands Architecture.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing routes, layouts, and config
2. **fuse-ai-pilot:research-expert** - Verify latest Astro 7 docs via Context7/Exa
3. **mcp__context7__query-docs** - Check breaking changes v6→v7

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building new content-driven websites or blogs
- Migrating from Astro 6 to version 7
- Configuring static, server, or hybrid output modes
- Setting up middleware for auth or redirects
- Leveraging the new Rust compiler for large sites
- Implementing Content Security Policy (CSP) headers

### Why Astro 7

| Feature | Benefit |
|---------|---------|
| Unified Dev Runtime | Dev matches production — fewer "works in dev, breaks in prod" bugs |
| Vite Environment API (Vite 8) | Exact production runtime during development |
| Single Rust Compiler | Go compiler removed — one Rust compiler for `.astro` files, with strict HTML parsing (unclosed tags now error instead of being silently auto-corrected) |
| Live Content Collections | Real-time data from external sources |
| Built-in Fonts API (stable) | Zero-config font loading with performance optimization |
| CSP Support (stable) | Built-in Content Security Policy nonce management |
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
| New Astro 7 features | [new-features.md](references/new-features.md) |
| Full project setup | [templates/basic-setup.md](references/templates/basic-setup.md) |
| Config examples | [templates/config-example.md](references/templates/config-example.md) |

---

## Best Practices

1. **Use `output: 'static'` by default** — Add server only when needed
2. **Per-route `prerender`** — Fine-grained control in hybrid mode
3. **Middleware for cross-cutting concerns** — Auth, redirects, headers
4. **No compiler flag needed** — the Rust compiler is the only compiler now (Go removed); watch for strict HTML parsing errors on unclosed tags
5. **CSP nonces** — Use built-in stable support instead of custom headers
6. **Node 22.12+ required** — odd-numbered Node versions are unsupported; stay on stable TypeScript tooling, the native `tsgo` compiler can make `astro check`/typecheck fail opaquely (see installation.md)
