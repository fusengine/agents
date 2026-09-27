---
name: package-json-dual
description: Complete package.json for dual ESM/CJS and ESM-pure libraries
keywords: package.json, exports, dual, esm, cjs, types, tsup, provenance
---

# package.json Templates

## Usage

Two complete manifests: dual ESM/CJS for broad reach, ESM-pure for modern-only.

---

## Dual ESM/CJS

```json
{
  "name": "@scope/pkg",
  "version": "1.0.0",
  "description": "A dual ESM/CJS TypeScript library.",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts",  "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "sideEffects": false,
  "repository": { "type": "git", "url": "git+https://github.com/scope/pkg.git" },
  "publishConfig": { "access": "public", "provenance": true },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean",
    "check:types": "attw --pack",
    "prepublishOnly": "npm run build && npm run check:types"
  },
  "devDependencies": {
    "@arethetypeswrong/cli": "^0.18.5",
    "tsup": "^8.0.0",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

Note: `main`/`module`/`types` are legacy fallbacks; `exports` is authoritative.
`tsup --dts` calls the TypeScript compiler API (`createProgram`), which the TS 7.0 `typescript`
package does not ship — keep `typescript` aliased to `@typescript/typescript6` (the 6.0 API)
until a TS 7 API exists (devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

---

## ESM-Pure

```json
{
  "name": "@scope/pkg",
  "version": "1.0.0",
  "description": "A modern ESM-only TypeScript library.",
  "type": "module",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "sideEffects": false,
  "repository": { "type": "git", "url": "git+https://github.com/scope/pkg.git" },
  "publishConfig": { "access": "public", "provenance": true },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "check:types": "attw --pack",
    "prepublishOnly": "npm run build && npm run check:types"
  },
  "devDependencies": {
    "@arethetypeswrong/cli": "^0.18.5",
    "typescript": "^7.0.2"
  }
}
```

The ESM-pure build only runs the `tsc` CLI, so it can use TS 7.0 directly.

---

## tsconfig.build.json (ESM-pure)

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src"]
}
```
