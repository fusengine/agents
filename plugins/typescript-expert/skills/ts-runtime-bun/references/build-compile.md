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

Sources: https://bun.com/docs/bundler + https://bun.com/docs/bundler/executables + https://bun.com/blog/bun-v1.4

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
bun build --compile --target=bun-windows-arm64 ./src/cli.ts --outfile myapp
```

Other targets: `bun-darwin-x64`, `bun-linux-x64-musl`, `bun-linux-arm64-musl`. Since Bun 1.4,
x64 ships a single binary (Nehalem/SSE4.2 baseline, AVX2/AVX-512 paths picked at runtime);
the `-baseline` / `-modern` suffixes are still accepted for backward compatibility but resolve
to the same binary. Default arch is x64 when unspecified.

Since 1.3.4, compiled binaries no longer auto-load `tsconfig.json` / `package.json` from the
working directory at runtime — opt back in with `--compile-autoload-tsconfig` /
`--compile-autoload-package-json` (`.env` and `bunfig.toml` still auto-load by default).

→ Wire these into `package.json` scripts in
[templates/bun-project-setup.md](templates/bun-project-setup.md)
