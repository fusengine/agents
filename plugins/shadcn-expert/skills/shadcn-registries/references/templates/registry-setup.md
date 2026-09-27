---
name: registry-setup
description: Complete shadcn/ui project setup with components.json configuration
keywords: setup, init, components.json, registry, configuration
---

# Registry Setup

Base UI is the default base since July 2026: plain `init` (and `init --defaults`) produces a `base-*` project. Radix and React Aria need `-b radix` / `-b aria`. `init` installs the `cn` package and writes `lib/utils.ts` as `export { cn } from "cn"`.

## Radix UI Setup

```bash
# Initialize with Radix primitives (radix-* style); keep -b radix in CI scripts
{runner} shadcn@latest init --base radix
```

### components.json (Radix)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
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
# Initialize with Base UI primitives (base-* style, the default)
{runner} shadcn@latest init --base base
# Non-interactive default (Next.js template + nova preset on the base base = base-nova)
{runner} shadcn@latest init --defaults
```

### components.json (Base UI)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## React Aria Setup

```bash
# Initialize with React Aria Components (aria-* style)
{runner} shadcn@latest init --base aria
```

### components.json (React Aria)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "aria-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

`{runner} shadcn@latest info --json` on this config reports `"base": "aria"` and doc links under `/docs/components/aria/`.

## Adding Components

```bash
# @shadcn registry — resolved for the style in components.json
{runner} shadcn@latest add button dialog select

# Directory registry (built into the CLI, no components.json entry), e.g. @basecn (Base UI)
{runner} shadcn@latest add @basecn/button @basecn/dialog

# Custom namespace: writes "registries" in components.json
{runner} shadcn@latest registry add @acme=https://acme.com/r/{name}.json
{runner} shadcn@latest add @acme/button

# GitHub registry (root registry.json), pinned
{runner} shadcn@latest add acme/toolkit/project-conventions#v1.0.0

# Check for updates (`diff` command is deprecated)
{runner} shadcn@latest add button --diff
```

## Switching Design Later

```bash
{runner} shadcn@latest apply --preset b2D0vQ7G4               # reinstalls components, keeps base + RTL
{runner} shadcn@latest apply --preset b2D0vQ7G4 --only theme  # theme and/or font only
{runner} shadcn@latest preset resolve                          # preset code of the current project
```

## Tailwind v4 Integration

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```
