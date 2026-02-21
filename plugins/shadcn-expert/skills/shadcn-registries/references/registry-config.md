---
name: registry-config
description: components.json schema, style options, registry URLs, and CLI commands
when-to-use: When configuring shadcn/ui registry or running CLI commands
keywords: registry, components.json, style, cli, init, add, config
priority: high
related: ../SKILL.md
---

# Registry Configuration

## Overview

The `components.json` file configures shadcn/ui for the project. It defines the style (Radix or Base UI), paths, and Tailwind integration.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Style** | `new-york`/`default` = Radix, `base-vega` = Base UI |
| **Registry URL** | Source for component downloads |
| **Aliases** | Path aliases for components, utils, hooks |
| **{runner}** | Detected PM runner (bunx/npx/pnpm dlx/yarn dlx) |

---

## components.json Full Schema

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

## Style Options

| Style | Primitive | Description |
|-------|-----------|-------------|
| `default` | Radix UI | Original shadcn style |
| `new-york` | Radix UI | Refined variant |
| `base-vega` | Base UI | Base UI primitives |

## Registry URLs

| Registry | URL |
|----------|-----|
| Default | `https://ui.shadcn.com/r` |
| Base UI | `https://ui.shadcn.com/r/basecn` |
| Custom | User-defined URL |

## CLI Reference

`{runner}` = detected PM runner (`bunx`/`npx`/`pnpm dlx`/`yarn dlx`)

```bash
{runner} shadcn@latest init                          # Init
{runner} shadcn@latest init --defaults --style new-york  # Non-interactive
{runner} shadcn@latest add button                    # Single component
{runner} shadcn@latest add button card dialog        # Multiple
{runner} shadcn@latest add --registry=basecn button  # Base UI registry
{runner} shadcn@latest diff                          # Check updates
```

## Aliases Configuration

Maps to `tsconfig.json` paths:

```json
{
  "paths": { "@/*": ["./src/*"] }
}
```

## Tailwind CSS Integration

For Tailwind v4, `tailwind.config` may not be needed:

```css
@import "tailwindcss";
@source "../components/**/*.tsx";
```

For Tailwind v3, standard config applies.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong style for primitive | Match style to detected primitive |
| Hardcoded npx | Use detected {runner} from lockfile |
| Missing aliases | Ensure tsconfig paths match |

---

## Related Templates

- [registry-setup.md](templates/registry-setup.md) - Complete setup example
