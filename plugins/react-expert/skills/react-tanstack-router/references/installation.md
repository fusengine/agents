---
name: installation
description: TanStack Router installation and setup for React with Vite, Webpack, or Rspack
when-to-use: Setting up new project, migrating from React Router, configuring bundler
keywords: install, setup, vite, webpack, rspack, migration, config
priority: high
requires: null
related: file-based-routing.md, devtools.md
template: templates/basic-setup.md
---

# Installation

> **Full code**: See [templates/basic-setup.md](templates/basic-setup.md)

## Required Packages

| Package | Type | Description |
|---------|------|-------------|
| `@tanstack/react-router` | Core | Main router |
| `@tanstack/zod-adapter` | Core | Search params validation |
| `zod` | Core | Schema validation |
| `@tanstack/router-plugin` | Dev | Bundler plugin (generates routeTree) |
| `@tanstack/router-devtools` | Dev | DevTools debugging |

```bash
bun add @tanstack/react-router @tanstack/zod-adapter zod
bun add -D @tanstack/router-plugin @tanstack/router-devtools
```

---

## Bundler Configuration

The plugin automatically generates `routeTree.gen.ts` from the `routes/` folder.

### Vite (Recommended)

Use `TanStackRouterVite` in `vite.config.ts`.

### Webpack

Use `TanStackRouterWebpack` in `webpack.config.js`.

### Rspack

Use `TanStackRouterRspack` in `rspack.config.js`.

> **Full configuration**: [templates/basic-setup.md](templates/basic-setup.md#vite-configuration)

### Plugin Options

| Option | Default | Description |
|--------|---------|-------------|
| `routesDirectory` | `./src/routes` | Routes directory |
| `generatedRouteTree` | `./src/routeTree.gen.ts` | Generated file |
| `routeFileIgnorePattern` | `.css` | Files to ignore |
| `experimental.enableCodeSplitting` | `false` | Auto code splitting |

---

## Project Structure (SOLID)

Follow modular architecture with `modules/cores/` and `modules/[feature]/`.

```text
src/
├── modules/cores/lib/router/   # Router configuration
├── modules/[feature]/          # Feature modules
├── routes/                     # Route definitions only
└── routeTree.gen.ts           # Auto-generated (gitignore)
```

> **Full structure**: [templates/basic-setup.md](templates/basic-setup.md#project-structure-solid)

---

## Key Points

### Type Registration (MANDATORY)

Declare router type to enable TypeScript inference:

```typescript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

### Git Ignore

Add generated file to `.gitignore`:

```gitignore
src/routeTree.gen.ts
```

---

## React Router Migration

| React Router | TanStack Router |
|--------------|-----------------|
| `react-router-dom` | `@tanstack/react-router` |
| `BrowserRouter` | `RouterProvider` |
| `Routes, Route` | File-based routing |
| `useParams()` | `Route.useParams()` |
| `useSearchParams()` | `Route.useSearch()` |
| `useLoaderData()` | `Route.useLoaderData()` |
| `loader` function | `loader` option in route |
| `action` function | TanStack Query mutations |

**Steps**:
1. Install TanStack packages, remove react-router-dom
2. Create `routes/` structure with files
3. Convert routes to file-based routing
4. Convert loaders to `loader` option

> **Conversion examples**: [templates/basic-setup.md](templates/basic-setup.md)
