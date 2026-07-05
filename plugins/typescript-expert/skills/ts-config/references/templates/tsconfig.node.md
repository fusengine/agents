---
name: tsconfig.node
description: Complete pure-Node.js tsconfig.json with native type stripping (Node 24 LTS, TS 6.0)
keywords: tsconfig, node, nodenext, type stripping, template, erasableSyntaxOnly
---

# Complete Pure-Node `tsconfig.json`

For code executed directly by Node (`node file.ts`) or emitted to `.js` for Node.
Mirrors the settings recommended at nodejs.org/api/typescript.html, 6.0-ready.

```jsonc
{
  "compilerOptions": {
    // Environment
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "types": ["node"],

    // Keep tsc's view identical to Node's type stripper
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,

    // Use noEmit ONLY if you run *.ts directly and never ship *.js.
    // Remove it (and add outDir) when you compile to JavaScript.
    "noEmit": true,

    // Best practices
    "strict": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## When you DO emit `.js`

Replace the `noEmit` block with:

```jsonc
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",          // required in 6.0 when sources are nested
    "declaration": true,
    "sourceMap": true
  }
}
```

## `package.json` requirements

```json
{
  "type": "module",
  "imports": { "#/*": "./src/*" }
}
```

- `"type": "module"` makes `.ts` files run as ESM (matches `.mts`).
- Author relative imports with the real extension: `import './x.ts'`
  (`rewriteRelativeImportExtensions` rewrites it to `./x.js` on emit).
- Always write `import type { T }` — `verbatimModuleSyntax` requires it, and a value-position
  type import would crash Node at runtime.
