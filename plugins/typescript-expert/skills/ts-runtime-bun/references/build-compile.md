---
name: build-compile
description: Bundling with Bun.build / bun build and producing single-file executables
when-to-use: Load when bundling TS/TSX with Bun or compiling a standalone binary
keywords: bun-build, bundler, compile, single-file-executable, cross-compile, target
related: bunfig-test.md, workspaces.md
---

# Bun Bundler + Single-File Executables

## Overview

Bun bundles JS/TS/JSX via the `bun build` CLI or the `Bun.build()` JS API. It runs
default transforms (tree-shaking, dead-code elimination) but **does not down-convert
syntax** and **is not a typechecker or `.d.ts` generator** — keep `tsc` for that.

Sources: https://bun.sh/docs/bundler + https://bun.sh/docs/bundler/executables

## Bundling

```ts
// build.ts
await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./out",
  target: "browser",   // "browser" | "bun" | "node"
  minify: true,
  sourcemap: "external",
});
```

```bash
bun build ./src/index.tsx --outdir ./out --target browser --minify
bun build ./src/index.ts --outdir ./out --watch   # incremental rebuilds
```

| Option | Values |
|--------|--------|
| `target` | `browser` (default), `bun`, `node` |
| `format` | `esm` (default); `cjs`/`iife` experimental |
| `--watch` | Incremental rebuild on change |

Native loaders cover `.ts/.tsx/.js/.jsx/.json/.jsonc/.toml/.yaml/.txt/.css/.html`
plus `.wasm`/`.node` as assets. Unknown extensions become copied file assets.

## Single-file executables (`--compile`)

Bundle app + a copy of the Bun runtime into one binary. All Bun and Node.js APIs
are supported inside it.

```bash
bun build ./src/cli.ts --compile --outfile mycli
./mycli
```

```ts
await Bun.build({
  entrypoints: ["./src/cli.ts"],
  compile: { outfile: "./mycli" },
});
```

## Cross-compile

Use `--target=` to build for another OS/arch from any machine:

```bash
bun build --compile --target=bun-linux-x64     ./src/cli.ts --outfile myapp
bun build --compile --target=bun-linux-arm64   ./src/cli.ts --outfile myapp
bun build --compile --target=bun-windows-x64   ./src/cli.ts --outfile myapp # .exe auto-added
bun build --compile --target=bun-darwin-arm64  ./src/cli.ts --outfile myapp
```

`-baseline` (pre-2013 CPUs) and `-modern` (2013+, faster) variants exist per target,
e.g. `bun-linux-x64-baseline`. Default arch is x64 when unspecified.

→ Wire these into `package.json` scripts in
[templates/bun-project-setup.md](templates/bun-project-setup.md)
