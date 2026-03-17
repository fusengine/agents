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
| Node.js | 22+ (LTS recommended) |
| TypeScript | 5.1+ |

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
