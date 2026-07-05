---
name: tsconfig.bundler
description: Complete Bun/bundler tsconfig.json for TypeScript 6.0
keywords: tsconfig, bun, bundler, template, preserve
---

# Complete Bundler / Bun `tsconfig.json`

Mirrors what `bun init` generates (bun.sh/docs/typescript), 6.0-ready.
For a non-Bun bundler (Vite/esbuild/webpack) swap `"types": ["bun"]` for the packages
you need (e.g. `["node"]`, `["vite/client"]`) and drop `"jsx"` if there is no JSX.

```jsonc
{
  "compilerOptions": {
    // Environment & latest features
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "types": ["bun"],

    // Bundler mode — the bundler emits, tsc only checks
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    // Best practices
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // Optional stricter flags (off by default)
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false
  }
}
```

## Optional: subpath imports

Add to `package.json` (works under `moduleResolution: bundler`):

```json
{
  "imports": {
    "#/*": "./src/*"
  }
}
```

Then `import { foo } from "#/utils.ts"` instead of `../../utils.ts`.

## Optional: CommonJS migration bridge (TS 6.0)

When moving a CommonJS codebase off deprecated `moduleResolution: node`, TS 6.0 allows
`moduleResolution: bundler` with `module: commonjs` as an intermediate step:

```jsonc
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "bundler"
  }
}
```

Move to `module: "Preserve"` once the code is ESM-ready.
