# fuse-typescript

Expert **pure TypeScript** development — CLI tools, libraries, scripts, and backends with no UI framework. Targets TypeScript 6.0 on Node 24 LTS ("Krypton") or Bun 1.3, with strict typing, ESM-first packaging, and SOLID principles.

## Agent

| Agent | Description |
|-------|-------------|
| **typescript-expert** | Expert pure-TypeScript developer (TS 6.0, Node 24 LTS / Bun 1.3) |

## Skills

| Skill | Description |
|-------|-------------|
| ts-config | `tsconfig.json`, compiler options, module resolution, TS 6.0 deprecations |
| ts-language-patterns | Type-level patterns — generics, discriminated unions, `satisfies`, const objects |
| ts-runtime-node | Node 24 LTS runtime — native type stripping, ESM, `node:` built-ins |
| ts-runtime-bun | Bun 1.3 runtime — `Bun.*` APIs, native TS execution, bundler, test runner |
| ts-lint-format | Linting and formatting — ESLint flat config, Biome |
| ts-testing | Testing — `node:test`, `bun test`, Vitest, coverage |
| ts-packaging | Packaging and publishing — `exports` map, dual ESM/CJS, npm publish |

SOLID principles are provided by the shared **`fuse-solid:solid-generic`** skill (files < 100 lines, interfaces in `src/interfaces/`, JSDoc mandatory) — no local duplicate.

## Architecture

```
src/
├── interfaces/          # all exported types and contracts
├── lib/                 # library / core logic
├── cli/                 # CLI entry points (when applicable)
└── index.ts             # public entry
tsconfig.json            # strict, ESM, no deprecated options
package.json             # type: "module", exports map
```

## Installation

```bash
/plugin install fuse-typescript
```

## Usage

The agent activates for **pure TypeScript** projects — a `tsconfig.json` is present but **no** framework config:
- no `next.config.*`, `astro.config.*`, or `vite.config.*` with React
- no `artisan` (Laravel) or `Cargo.toml` (Rust)

For React use `react-expert`, for Next.js use `nextjs-expert`, for Astro use `astro-expert`, for TanStack Start use `tanstack-start-expert`.
