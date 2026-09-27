---
name: installation
description: Astro 7 installation, upgrade from v5/v6, Node requirements
when-to-use: new project, upgrading from Astro 5/6, setting up TypeScript
keywords: setup, init, create, upgrade, node, requirements
priority: high
---

# Astro 7 Installation

## When to Use

- Starting a new Astro 7 project (latest stable: 7.3.5)
- Upgrading from Astro 5/6 (see the official v7 upgrade guide)
- Configuring Node 22.12+ environment

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 22.12+ (`engines.node >=22.12.0`; odd-numbered Node versions unsupported) |
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
