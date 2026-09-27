---
name: installation
description: Set up shadcn/ui with React 19 and Tailwind CSS v4 (Vite)
when-to-use: Starting a new shadcn/ui project, integrating with React 19 and Vite
keywords: setup, initialization, tailwind, cli, bunx, vite
priority: high
requires: null
related: configuration.md
---

# shadcn/ui Installation (Vite)

Sources: https://ui.shadcn.com/docs/installation/vite, https://ui.shadcn.com/docs/cli,
https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default (CLI checked: `shadcn@4.21.0 init --help`).

## Prerequisites

- **React**: 19+
- **Tailwind CSS**: 4+ via `@tailwindcss/vite` (no `tailwind.config.*` file)
- **CLI package**: `shadcn` (v4.x). `shadcn-ui` is the old, deprecated package — never use it.

## Pick a Component Base FIRST

`init` asks for a base (`-b, --base <base>`). Every component exists for each base, but the
primitive API differs, so the choice drives all generated code.

| Base | Flag | Primitive package | Composition | Status |
|------|------|-------------------|-------------|--------|
| **Base UI** | `-b base` | `@base-ui/react` | `render={<Button />}` | **Default for new projects since July 2026** |
| Radix UI | `-b radix` | unified `radix-ui` | `asChild` | Fully supported, not deprecated |
| React Aria | `-b aria` | React Aria Components | per React Aria docs | Added July 2026 |

Existing projects keep their base. Detect it from `components.json` `style`
(`base-*`, `radix-*`, `aria-*`; legacy `new-york`/`default` = Radix).

## Option A: New Project (CLI scaffolds Vite)

```bash
# Base UI (default)
bunx --bun shadcn@latest init -t vite
# Radix — pass the flag explicitly in scripts/CI (the default changed to Base UI)
bunx --bun shadcn@latest init -t vite -b radix
# React Aria
bunx --bun shadcn@latest init -t vite -b aria
# Preset from https://ui.shadcn.com/create (packs style, colors, fonts, icons, radius)
bunx --bun shadcn@latest init -t vite --preset <CODE>
```

Useful init flags (4.21.0): `-t, --template` (`next`, `start`, `vite`, `react-router`,
`laravel`, `astro`), `-b, --base`, `-p, --preset`, `-n, --name`, `--monorepo`, `--rtl`,
`--pointer`, `--no-css-variables`, `-d, --defaults` (= `--template=next --preset=base-nova`).
`create` is an alias of `init`. There is no `--base-color` flag in v4 — base colors come from
the preset (or `shadcn migrate base-color` afterwards).

## Option B: Existing Vite Project

```bash
bun create vite@latest my-app   # choose React + TypeScript
cd my-app
bun add tailwindcss @tailwindcss/vite
bun add -d @types/node
```

`src/index.css`:

```css
@import "tailwindcss";
```

`tsconfig.json` **and** `tsconfig.app.json` — add under `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`vite.config.ts`:

```typescript
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Then initialize (add `-b radix` / `-b aria` if you do not want Base UI):

```bash
bunx --bun shadcn@latest init
```

`init` installs dependencies, writes `components.json`, creates `lib/utils.ts`
(`export { cn } from "cn"`), and injects the theme into `src/index.css`
(`@import "shadcn/tailwind.css"`, `@custom-variant dark`, `@theme inline`, `:root`/`.dark`
tokens). See [configuration.md](configuration.md) and [theming.md](theming.md).

## Step: Point Aliases at the SOLID Paths

Edit `components.json` aliases so the CLI writes to `src/modules/cores/...` (see
[configuration.md](configuration.md)); `@/*` already maps to `./src/*`, so
`@/modules/cores/shadcn/components` resolves without extra `paths` entries.

## Add Components

```bash
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add button card dialog field input select textarea
bunx --bun shadcn@latest add button --dry-run   # preview files/deps, write nothing
bunx --bun shadcn@latest add button --diff      # compare local file with registry
```

Toasts depend on the base: Base UI projects use `add toast` (Base UI Toast);
Radix and React Aria projects use `add sonner`. See [toast.md](toast.md).
The old `form` component (React Hook Form wrapper) is not used — forms use `field`
with TanStack Form ([field-patterns.md](field-patterns.md)).

`add` flags (4.21.0): `-y`, `-o, --overwrite`, `-c, --cwd`, `-a, --all`, `-p, --path`,
`-s, --silent`, `--dry-run`, `--diff [path]`, `--view [path]`.

## Verify

```tsx
// src/App.tsx
import { Button } from "@/modules/cores/shadcn/components/ui/button"

/** Smoke-test app rendering a Button. */
export default function App() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Button>Click me</Button>
    </div>
  )
}
```

```bash
bun dev   # http://localhost:5173
```

## Icons

`init` records `iconLibrary` in `components.json` (Lucide by default). Switch later with
`shadcn migrate icons --from lucide --to <tabler|hugeicons|phosphor|remixicon>`.

```typescript
import { ChevronDownIcon } from "lucide-react"

/** Lucide icon sized with Tailwind. */
export function IconExample() {
  return <ChevronDownIcon className="size-4" />
}
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot find module '@/...'` | `@/*` must be in both `tsconfig.json` and `tsconfig.app.json`, plus `resolve.alias` in `vite.config.ts` |
| Utilities not generated | `@tailwindcss/vite` missing from `plugins`, or `@import "tailwindcss"` missing |
| `data-open:` / accordion animations missing | `@import "shadcn/tailwind.css"` removed from the CSS entry (restore it or run `shadcn eject` to inline it) |
| Base UI component receives `asChild` | Project is on Base UI — use `render` (see component references) |
| Legacy project on `@radix-ui/react-*` | `bunx --bun shadcn@latest migrate radix` (moves to the unified `radix-ui` package) |
| Old `lib/utils.ts` with `clsx` + `tailwind-merge` | `bunx --bun shadcn@latest migrate cn` |

## MCP Server (Claude Code)

```bash
bunx --bun shadcn@latest mcp init --client claude
```

Or write `.mcp.json` manually:

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

Tools exposed: `mcp__shadcn__search_items_in_registries`, `mcp__shadcn__view_items_in_registries`,
`mcp__shadcn__get_item_examples_from_registries`, `mcp__shadcn__get_add_command_for_items`.
Also useful for agents: `shadcn info` (framework, base, installed components) and
`shadcn docs <component> -b <base|radix|aria>`.

## Next Steps

- [Configuration Guide](configuration.md)
- [Theming](theming.md)
- [Button Component](button.md)
