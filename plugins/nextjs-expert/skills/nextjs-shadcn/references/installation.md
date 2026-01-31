---
name: installation
description: Set up shadcn/ui with Next.js 16 and Tailwind CSS v4
when-to-use: Starting a new shadcn/ui project, integrating with Next.js 16
keywords: setup, initialization, tailwind, cli, bunx
priority: high
requires: null
related: configuration.md
---

# shadcn/ui Installation

## Prerequisites

- **Node.js**: 18.17+ or 20+
- **Next.js**: 16.0.0+
- **React**: 19.0+
- **Tailwind CSS**: 4.0+ (no config file needed)

## Step 1: Create Next.js Project

```bash
bunx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
```

## Step 2: Install shadcn/ui CLI

```bash
bunx shadcn-ui@latest init
```

### Configuration Prompts

| Prompt | Answer | Reason |
|--------|--------|--------|
| **Which style?** | `New York` | Modern, minimal design |
| **Which color?** | `slate` | Neutral, accessible |
| **Use TypeScript?** | `yes` | Type safety required |
| **CSS variables?** | `yes` | Theme customization |

## Step 3: Verify Setup

Check that `components.json` was created:

```bash
cat components.json
```

Expected structure:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "aliasPrefix": "@",
  "aliases": {
    "components": "@/modules/cores/shadcn/components",
    "utils": "@/modules/cores/lib/utils"
  }
}
```

## Step 4: Install First Component

```bash
bunx shadcn-ui@latest add button
```

This installs:
- Button component → `@/modules/cores/shadcn/components/ui/button.tsx`
- Button utilities → `@/modules/cores/lib/utils.ts`
- Required dependencies

## Step 5: Verify Installation

Create test file `app/test.tsx`:

```typescript
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export default function Test() {
  return <Button>Click me</Button>
}
```

Run dev server:

```bash
bun dev
```

Visit `http://localhost:3000/test` and verify Button renders.

## Post-Installation Setup

### 1. Create SOLID Alias Structure

```bash
mkdir -p src/modules/cores/shadcn/components/ui
mkdir -p src/modules/cores/lib
```

### 2. Update components.json with SOLID Paths

See [configuration.md](configuration.md) for full example.

### 3. Install Common Components

```bash
bunx shadcn-ui@latest add \
  button \
  input \
  card \
  label \
  form \
  dialog \
  dropdown-menu \
  toast \
  select \
  textarea
```

### 4. Setup Icon Library

```bash
bun add lucide-react
```

Usage:

```typescript
import { ChevronDown, Copy } from 'lucide-react'

export function IconExample() {
  return <ChevronDown className="w-4 h-4" />
}
```

## Troubleshooting

### Components not found?

1. Check `components.json` exists
2. Verify `aliasPrefix` is `@`
3. Run `bunx shadcn-ui@latest add button` to reinstall

### TypeScript errors?

```bash
bunx tsc --noEmit
```

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Tailwind not applying?

Check `app/globals.css`:

```css
@import "tailwindcss";

@layer base {
  * {
    @apply border-border;
  }
}
```

## Step 6: Configure MCP Server (Claude Code)

Create `.mcp.json` at project root for Claude Code integration:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

This enables:
- `mcp__shadcn__search_items_in_registries` - Search components
- `mcp__shadcn__view_items_in_registries` - View component code
- `mcp__shadcn__get_item_examples_from_registries` - Get usage examples
- `mcp__shadcn__get_add_command_for_items` - Get install commands

### Usage in Claude Code

```bash
# Search for a component
mcp__shadcn__search_items_in_registries "button"

# View component details
mcp__shadcn__view_items_in_registries "button"

# Get install command
mcp__shadcn__get_add_command_for_items "button"
```

## Next Steps

- [Configuration Guide](configuration.md)
- [Button Component](button.md)
- [Input Component](input.md)
- [Card Component](card.md)
