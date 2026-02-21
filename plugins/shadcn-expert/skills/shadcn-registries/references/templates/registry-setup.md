---
name: registry-setup
description: Complete shadcn/ui project setup with components.json configuration
keywords: setup, init, components.json, registry, configuration
---

# Registry Setup

## Radix UI Setup (Default)

```bash
# Initialize with Radix (new-york style)
{runner} shadcn@latest init --defaults --style new-york
```

### components.json (Radix)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Base UI Setup

```bash
# Initialize with Base UI
{runner} shadcn@latest init --style base-vega
```

### components.json (Base UI)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-vega",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## Adding Components

```bash
# Default registry (Radix)
{runner} shadcn@latest add button dialog select

# Base UI registry
{runner} shadcn@latest add --registry=basecn button dialog

# Check for updates
{runner} shadcn@latest diff
```

## Tailwind v4 Integration

```css
@import "tailwindcss";
@source "../components/**/*.tsx";
```
