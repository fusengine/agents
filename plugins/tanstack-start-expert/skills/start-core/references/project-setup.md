---
name: project-setup
applies-to: "**/vite.config.ts, **/rsbuild.config.ts, **/tsconfig.json, **/package.json"
description: Install and configure TanStack Start - dependencies, Vite/Rsbuild plugin, tsconfig, package.json
when-to-use: scaffolding a project, wiring the build tool, fixing tsconfig or plugin config
keywords: setup, install, vite, rsbuild, tanstackStart, plugin, tsconfig, package.json
priority: high
related: project-anatomy.md, common-mistakes.md, templates/minimal-project.md
---

# Project Setup — TanStack Start

Load when installing Start or configuring the build tool. Targets
`@tanstack/react-start` v1.166.2.

## 1. Install Dependencies

```bash
# Runtime
npm i @tanstack/react-start @tanstack/react-router react react-dom

# Build tool + React integration (Vite)
npm i -D vite @vitejs/plugin-react

# TypeScript
npm i -D typescript @types/react @types/react-dom @types/node
```

(`@vitejs/plugin-react-swc` is an accepted alternative to `@vitejs/plugin-react`.)

## 2. package.json

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

## 3a. Vite Config (default)

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart(), // MUST come before react()
    viteReact(),
  ],
})
```

> Order is load-bearing: `tanstackStart()` before `viteReact()`. Reversed, route
> generation and server-function compilation fail.

## 3b. Rsbuild Config (variant)

Start supports Rsbuild as an alternative bundler. The plugin is imported from the
`plugin/rsbuild` entry:

```ts
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'

export default defineConfig({
  plugins: [tanstackStart(), pluginReact()],
})
```

> With Rsbuild, the public env prefix is `PUBLIC_` (not `VITE_`). See the
> `start-execution-model` skill for env-variable rules.

## 4. tsconfig.json

Minimum recommended compiler options:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

> Do NOT enable `verbatimModuleSyntax` — it causes server bundles to leak into
> the client bundle.

---

## Verify

```bash
npm run dev   # → http://localhost:3000
```

On first run the plugin generates `src/routeTree.gen.ts`. If it is missing,
confirm plugin order and that `src/routes/__root.tsx` exists.

Next: `project-anatomy.md` for the file tree, or `templates/minimal-project.md`
for every file ready to paste.
