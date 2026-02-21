# fuse-shadcn-ui

Expert shadcn/ui with Radix UI and Base UI primitive detection, component patterns, registries, theming, and migration.

## Agents

| Agent | Description |
|-------|-------------|
| `shadcn-ui-expert` | shadcn/ui expert with primitive detection |

## Skills

| Skill | Description |
|-------|-------------|
| `shadcn-detection` | Detect Radix UI vs Base UI primitives |
| `shadcn-components` | Component patterns for both primitives |
| `shadcn-registries` | Registry configuration and CLI commands |
| `shadcn-theming` | CSS variables, OKLCH colors, dark mode |
| `shadcn-migration` | Migration guide Radix <-> Base UI |

## Detection

5-step weighted algorithm to identify the primitive library:

| Step | Signal | Weight |
|------|--------|--------|
| 1 | `package.json` deps | 40% |
| 2 | `components.json` style | 20% |
| 3 | Import patterns | 25% |
| 4 | Data attributes | 15% |
| 5 | Package manager (lockfile) | - |

Results: `radix` / `base-ui` / `mixed` / `none` + PM runner (`bunx`/`npx`/`pnpm dlx`/`yarn dlx`).

## MCP Servers

- shadcn (component registry)
- Context7 (documentation)
- Exa (web search)
- Sequential Thinking

## Quick Reference

| Signal | Radix UI | Base UI |
|--------|----------|---------|
| Package | `@radix-ui/react-*` | `@base-ui/react` |
| Composition | `asChild` | `render` prop |
| Data attrs | `data-state="open"` | `data-[open]` |
| Naming | `DialogContent` | `Dialog.Popup` |
