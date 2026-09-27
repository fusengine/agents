---
name: registry-config
description: components.json schema, style options, registry URLs (namespaced, directory, GitHub), registry authoring, and CLI commands
when-to-use: When configuring shadcn/ui registry or running CLI commands
keywords: registry, components.json, style, cli, init, add, config
priority: high
related: ../SKILL.md
---

# Registry Configuration

## Overview

The `components.json` file configures shadcn/ui for the project. It defines the style (Base UI, Radix or React Aria), paths, and Tailwind integration. It is only required when using the CLI.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Style** | `base-*` = Base UI (default), `radix-*` (legacy `new-york`) = Radix, `aria-*` = React Aria |
| **Registry URL** | Source for component downloads |
| **Aliases** | Path aliases for components, utils, hooks |
| **{runner}** | Detected PM runner (bunx/npx/pnpm dlx/yarn dlx) |

---

## components.json Full Schema

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "rtl": false,
  "iconLibrary": "lucide",
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
  },
  "registries": {
    "@acme": "https://registry.acme.com/{name}.json"
  }
}
```

`tailwind.config` stays `""` for Tailwind v4. `style`, `baseColor` and `cssVariables` cannot be changed after init (use `apply --preset`, `migrate base-color`, or delete and re-add components).

| Key | Values (source: /docs/components-json, schema.json) |
|-----|------------------------------------------------------|
| `tailwind.baseColor` | `neutral` \| `stone` \| `zinc` \| `mauve` \| `olive` \| `mist` \| `taupe` (`slate`/`gray` are not documented values) |
| `iconLibrary` | `lucide`, `tabler`, `hugeicons`, `phosphor`, `remixicon` (`migrate icons` also accepts legacy `radix`) |
| `menuColor` | `default` \| `inverted` \| `default-translucent` \| `inverted-translucent` |
| `menuAccent` | `subtle` \| `bold` |
| `rtl` | `true` makes `add` convert physical classes to logical ones (`ml-4` -> `ms-4`, `slide-in-from-left` -> `slide-in-from-start`, icons get `rtl:rotate-180`); set by `init --rtl` or `migrate rtl`. Automatic only for the new `{base}-{style}` styles; Calendar, Pagination, Sidebar need manual changes; add `DirectionProvider` via `add direction` (source: /docs/rtl) |
| `aliases` | `components`, `ui`, `lib`, `hooks`, `utils`; backed by `tsconfig` `paths` or `package.json#imports` |

### package.json#imports aliases (shadcn 4.7.0+)

```json
{
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  }
}
```

Then in components.json: `"aliases": { "components": "#components", "ui": "#components/ui", "lib": "#lib", "hooks": "#hooks", "utils": "#lib/utils" }`. Requires TypeScript `moduleResolution: "bundler"` + `resolvePackageJsonImports: true`. A target with the extension (`*.tsx`) generates extension-less imports. In monorepos keep shared imports as workspace `exports` (`@workspace/ui/components`), local ones as `#...` (source: /docs/package-imports, /docs/monorepo).

## Style Options

| Style | Primitive | Description |
|-------|-----------|-------------|
| `default` | Radix UI | Deprecated — use `new-york` or a `radix-*` style |
| `new-york` | Radix UI | Legacy Radix style |
| `radix-{vega,nova,maia,lyra,mira,luma,sera,rhea}` | Radix UI | Current Radix styles |
| `base-{vega,nova,maia,lyra,mira,luma,sera,rhea}` | Base UI | Current Base UI styles (`base-nova` = `init --defaults`) |
| `aria-{vega,nova,maia,lyra,mira,luma,sera,rhea}` | React Aria | Current React Aria styles |

Style suffixes: Vega (classic), Nova (compact padding), Maia (soft, rounded), Lyra (boxy, sharp), Mira (dense) — Dec 2025; Luma (rounded, soft elevation) — Mar 2026; Sera (editorial, serif headings, underline controls) — Apr 2026; Rhea (compact Luma) — May 2026.

`init --defaults` precisely: CLI 4.21.0 sets `template=next`, `base=base` (unless `-b` is given) and applies the built-in `nova` preset on that base, so the result is `base-nova`; `-d -b radix` gives `radix-nova`. The docs wording `--preset=nova` and the `--help` wording `--preset=base-nova` describe the same behavior (verified in the 4.21.0 source).

## Registry URLs

| Registry | URL / address |
|----------|---------------|
| `@shadcn` (default) | resolved as `https://ui.shadcn.com/r/styles/{style}/{name}.json` (`info --json`) |
| Directory registries (`@basecn`, ...) | Built into the CLI from ui.shadcn.com/docs/directory, e.g. `@basecn` -> `https://basecn.dev/r/{name}.json`; no components.json entry needed |
| Custom namespace | `"registries": { "@ns": "https://.../{name}.json" }`; optional `{style}` placeholder; object form `{ "url", "headers", "params" }` with `${ENV_VAR}` expansion |
| GitHub | `owner/repo/item[#ref]`: root `registry.json`, no build/server; private repos via `gh auth login` or `GH_TOKEN`/`GITHUB_TOKEN` (fine-grained, Contents read-only); github.com only |
| URL / local file | `https://example.com/r/item.json`, `./item.json` |

## Registry Authoring (registry.json)

| Feature | Details | Source |
|---------|---------|--------|
| `include` | Root `registry.json` composes nested `registry.json` files (explicit paths, no folder shorthand); included files may omit `name`/`homepage`; paths relative to the declaring file; `build` flattens | /docs/registry/registry-json |
| `registry validate` | Checks root + included files, schema, duplicate names, file paths; no build needed; accepts `owner/repo#ref` | changelog 2026-05-registry-include |
| Loaders | `import { loadRegistry, loadRegistryItem } from "shadcn/registry"` for dynamic route handlers | changelog 2026-05-registry-include |
| Dynamic search | CLI sends `?q=&type=&limit=&offset=` to `registry.json`; return items + `pagination { total, offset, limit, hasMore }` to opt in | /docs/registry/dynamic-search |
| Target placeholders | `files[].target` may start with `@ui/`, `@components/`, `@lib/`, `@hooks/` (not `@utils/`); `~/` = project root | /docs/registry/registry-item-json |
| Item types | `registry:base` (whole design system), `registry:block`, `component`, `font`, `lib`, `hook`, `ui`, `page`, `file`, `style`, `theme`, `item` | /docs/registry/registry-item-json |
| `registryDependencies` | `button`, `@acme/item`, `owner/repo/item#v1.2.0`, URL, `./local.json`; refs are not inherited | /docs/registry/registry-item-json |
| Base pinning | Ship a `registry:base` config to pin a component library; items without one init as Base UI | changelog 2026-07-base-ui-default |

## CLI Reference

`{runner}` = detected PM runner (`bunx`/`npx`/`pnpm dlx`/`yarn dlx`). Full command list in [SKILL.md](../SKILL.md#cli-commands).

```bash
{runner} shadcn@latest init                          # Init (alias: create), default base = base
{runner} shadcn@latest init --base radix             # Pick base: base | radix | aria
{runner} shadcn@latest init --defaults               # Non-interactive: next template + nova preset -> base-nova
{runner} shadcn@latest add button                    # Single component
{runner} shadcn@latest add button card dialog        # Multiple
{runner} shadcn@latest add @basecn/button            # Directory/namespaced registry item
{runner} shadcn@latest add acme/toolkit/item#v1.0.0  # GitHub registry item pinned to a tag
{runner} shadcn@latest add button --diff             # Check updates (`diff` command is deprecated)
{runner} shadcn@latest registry validate acme/toolkit
```

## Aliases Configuration

Maps to `tsconfig.json` paths:

```json
{
  "paths": { "@/*": ["./src/*"] }
}
```

## Tailwind CSS Integration

For Tailwind v4, leave `tailwind.config` blank (`""`) in components.json. `init` writes these imports in the global CSS file:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

`shadcn/tailwind.css` provides the shared variants (`data-open:`, `data-closed:`, `data-checked:`...), accordion keyframes and utilities such as `no-scrollbar`, `scroll-fade`, `shimmer`. `{runner} shadcn@latest eject` inlines it and removes the `shadcn` dependency (irreversible).

For Tailwind v3, standard config applies (and keep `tailwind-merge` v2: the `cn` package targets Tailwind v4).

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong style for primitive | Match style to detected primitive |
| Hardcoded npx | Use detected {runner} from lockfile |
| Missing aliases | Ensure tsconfig paths (or package.json `imports`) match |
| Adding `@basecn` to `registries` | Not needed: directory registries are built into the CLI |
| `baseColor: "slate"` | Use one of the 7 documented base colors |
| CI `init` expecting Radix | Add `-b radix`: the default base is Base UI since July 2026 |

---

## Related Templates

- [registry-setup.md](templates/registry-setup.md) - Complete setup example
