---
name: validation
description: Validating type resolution with arethetypeswrong (attw)
when-to-use: Load when verifying a package's types resolve for all consumers
keywords: attw, arethetypeswrong, types, dual, esm, cjs, masquerading, resolution
priority: high
related: exports-map.md, npm-publishing.md
---

# Type Validation (attw)

## Overview

`@arethetypeswrong/cli` (`attw`) checks that a package's type declarations
resolve correctly across module systems and resolution modes (ESM, CJS,
`node16`, `bundler`). It catches broken `exports` maps before consumers do.

Latest: `@arethetypeswrong/cli` 0.18.4 (bin `attw`, requires Node >=20).

---

## Running

```sh
# Check the exact tarball npm would publish
npx @arethetypeswrong/cli --pack

# Check an already-published version
npx @arethetypeswrong/cli @scope/pkg@1.0.0
```

Run `--pack` in the publish pipeline so a broken map fails CI.

---

## Problems It Detects

| Problem | Meaning |
|---------|---------|
| No types | Missing `.d.ts` for an entry point |
| Masquerading as CJS/ESM | `import`/`require` condition points at the wrong module kind |
| Missing `types` condition | A branch lacks its `types` key |
| `.d.ts` / `.d.cts` mismatch | ESM and CJS declarations swapped |
| False ESM | CJS file declared as ESM (or vice versa) |

---

## Fix Loop

```
attw --pack fails?
├── "masquerading" → align import↔ESM, require↔CJS in exports
├── "no types" → add per-condition "types"
└── ".d.cts vs .d.ts" → emit matching declaration extension per branch
```

Re-run until clean, then publish. → See `exports-map.md` for the correct shape.

---

## In CI

```yaml
- run: npx @arethetypeswrong/cli --pack
```

Place before `npm publish` so type regressions never reach the registry.

---

## Related References

- [exports-map.md](exports-map.md) - The map attw validates
- [npm-publishing.md](npm-publishing.md) - Publish step after validation
