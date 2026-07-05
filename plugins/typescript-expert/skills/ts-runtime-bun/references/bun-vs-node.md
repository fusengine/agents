---
name: bun-vs-node
description: Choosing between Bun and Node.js for a TypeScript project; transpiler differences
when-to-use: Load when deciding which runtime to adopt, or explaining Bun vs Node behavior
keywords: bun-vs-node, transpiler, runtime-choice, tradeoff, decorators, jsx
related: bunfig-test.md, build-compile.md
---

# Bun vs Node for TypeScript

## Overview

Both run TypeScript without a manual build step, but they differ sharply in *how* and
in *what syntax works at runtime*. Neither type-checks — `tsc --noEmit` stays in CI
either way.

## Transpiler behavior

| Aspect | Node 24 (native) | Bun 1.3 |
|--------|------------------|---------|
| Mechanism | **Type stripping** — erases types only | **Full transpile** via Bun's transpiler |
| `.tsx` / JSX | Unsupported natively | Supported |
| `enum`, `namespace` w/ runtime | `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` | Supported |
| Decorators | Parser error | Supported |
| Reads `tsconfig.json` at runtime | No (ignored) | Yes (`paths`, jsx, etc.) |
| Down-convert syntax | No | No (bundler keeps modern syntax as-is) |
| Extra dependency for full TS | Needs `tsx` | None |

Node's model is deliberately minimal (fast startup, zero deps, no codegen). Bun's
model is a full transpiler that behaves closer to how `tsc` would emit.

## Choose Node when

- You want the **default, LTS-backed** runtime and its ecosystem/compatibility
- Deployment targets or platform policies standardize on Node
- Scripts use only erasable syntax — native stripping suffices, no dependency
- You rely on `node:test` and other stable built-ins

## Choose Bun when

- You want one tool for **runtime + test + bundler + package manager**
- You use `.tsx`, decorators, `enum`, or want `tsconfig` `paths` honored at runtime
- Fast installs and `bun test` throughput matter (monorepos, CI)
- You want `--compile` single-file executables out of the box

## Migration note

Bun aims for Node API compatibility but is not 100% — verify native addons,
niche `node:` APIs, and any C++ bindings before switching a production service.
For the Node path, see [ts-runtime-node](../../ts-runtime-node/SKILL.md).
