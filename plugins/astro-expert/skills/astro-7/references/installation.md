---
name: installation
description: Astro 6 installation, upgrade from v5, Node requirements
when-to-use: new project, upgrading from Astro 5, setting up TypeScript
keywords: setup, init, create, upgrade, node, requirements
priority: high
---

# Astro 6 Installation

## When to Use

- Starting a new Astro 6 project
- Upgrading from Astro 4/5
- Configuring Node 22+ environment

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 22.12+ (odd-numbered Node versions unsupported) |
| TypeScript | 5.1+ |

## TS7 / `tsgo` Warning

Astro 7 build itself passes with the native TypeScript compiler (`tsgo`/TS7), but the typecheck tooling doesn't fully support it yet: `astro check` and lint can fail opaquely under `tsgo` (fixed in 7.0.8 to at least fail early instead of silently). Stay on the classic stable TypeScript compiler line until tooling support catches up.

## New Project

```bash
npm create astro@latest my-site
cd my-site
npm run dev
```

## Upgrade Existing Project

```bash
# Recommended: automated upgrade
npx @astrojs/upgrade

# Manual upgrade
npm install astro@latest
```

## Package Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "sync": "astro sync"
  }
}
```
