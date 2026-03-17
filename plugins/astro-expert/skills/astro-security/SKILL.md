---
name: astro-security
description: Use when configuring Content Security Policy (CSP) in Astro 6, setting security headers, managing script/style hashes, using nonces, or implementing experimentalStaticHeaders for adapter deployments.
versions:
  astro: "6"
user-invocable: true
references: references/csp-overview.md, references/csp-config.md, references/script-directive.md, references/style-directive.md, references/nonces.md, references/static-headers.md, references/templates/csp-basic.md, references/templates/csp-advanced.md
related-skills: astro-6, astro-deployment, solid-astro
---

# Astro Security

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing security config, adapters, headers
2. **fuse-ai-pilot:research-expert** - Verify latest Astro 6 CSP docs via Context7/Exa
3. **mcp__context7__query-docs** - Check CSP compatibility with deployment adapter

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Enabling CSP in an Astro 6 project (stable in v6.0.0)
- Configuring `security.csp` in `astro.config.mjs`
- Adding SHA-256/384/512 hashes for external scripts or styles
- Using nonces for dynamic script injection
- Setting up `experimentalStaticHeaders` for adapter-based CSP headers

### CSP in Astro 6

Astro 6 ships Content Security Policy as a **stable** feature (previously experimental). When enabled:
- Astro automatically generates SHA hashes for all bundled scripts and styles
- Injects a `<meta http-equiv="content-security-policy">` in each page's `<head>`
- Supports `script-src` and `style-src` directives by default

**Limitations:**
- Not supported in `dev` mode — test with `build` + `preview`
- External scripts and styles require manual hash configuration
- Incompatible with `<ClientRouter />` view transitions (use native View Transition API)
- Shiki syntax highlighter (inline styles) not currently supported

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| CSP overview | [csp-overview.md](references/csp-overview.md) | Understanding CSP in Astro 6 |
| Configuration | [csp-config.md](references/csp-config.md) | All config options |
| Script directive | [script-directive.md](references/script-directive.md) | script-src configuration |
| Style directive | [style-directive.md](references/style-directive.md) | style-src configuration |
| Nonces | [nonces.md](references/nonces.md) | Dynamic script injection |
| Static headers | [static-headers.md](references/static-headers.md) | Adapter-based CSP headers |

### Templates

| Template | When to Use |
|----------|-------------|
| [csp-basic.md](references/templates/csp-basic.md) | Basic CSP enable with algorithm |
| [csp-advanced.md](references/templates/csp-advanced.md) | Full config with directives + static headers |

---

## Best Practices

1. **Always test with build + preview** — CSP is inactive in dev mode
2. **Start with SHA-512** — strongest hash algorithm
3. **Use `'self'` explicitly** — not included by default in resources
4. **Hash external scripts manually** — compute SHA hashes for CDN resources
5. **Combine with adapter headers** — use `experimentalStaticHeaders` for Vercel/Netlify

---

## Forbidden

- Testing CSP in `dev` mode (doesn't work — always use `build + preview`)
- Using `<ClientRouter />` with CSP enabled
- Forgetting to add `'self'` when using `resources` array
- Adding `unsafe-inline` (defeats purpose of CSP)
