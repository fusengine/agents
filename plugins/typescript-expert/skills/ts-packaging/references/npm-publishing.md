---
name: npm-publishing
description: Publishing TypeScript libraries to npm with provenance
when-to-use: Load when publishing to npm (dual ESM/CJS or ESM-pure)
keywords: npm, provenance, dual, esm, cjs, sigstore, trusted publishing, audit
priority: high
related: exports-map.md, validation.md
---

# npm Publishing

## Overview

npm publishes **built** output (`.js` + `.d.ts`). Choose ESM-pure for modern
consumers, or dual ESM/CJS when some consumers still `require()`. npm provenance
adds a verifiable link to source + build environment via Sigstore.

---

## ESM-Pure vs Dual

| Audience | Package shape |
|----------|---------------|
| Internal / Bun / Deno / modern Node ESM | ESM-pure (`"type": "module"`, single build) |
| Broad public with CJS consumers | Dual ESM/CJS (`import`/`require` branches) |

Dual output doubles build artifacts — only pay it when a real consumer needs CJS.
→ See `templates/package-json-dual.md` and `references/exports-map.md`.

---

## Provenance

Provenance = **provenance attestation** (source + build link) + **publish
attestation** (registry-signed), logged in Sigstore's public transparency ledger.

Prerequisites:

| Requirement | Detail |
|-------------|--------|
| npm CLI | `9.5.0+` |
| `repository` in package.json | Public, case-sensitive match |
| CI provider | GitHub Actions or GitLab CI/CD, cloud-hosted runner |
| Permission | `id-token: write` |

```sh
npm publish --provenance --access public
```

With **trusted publishing** (OIDC), provenance is generated automatically —
no `--provenance` flag and no long-lived tokens needed.

Alternatives to the flag: `NPM_CONFIG_PROVENANCE=true`, or
`"publishConfig": { "provenance": true }`, or `provenance=true` in `.npmrc`.

---

## Verifying

```sh
npm audit signatures
```

Reports verified registry signatures and attestation counts for installed
packages. Keep the npm CLI current — verification format evolves.

---

## Versioning

| Change | Bump |
|--------|------|
| Bug fix, no API change | patch |
| Backward-compatible feature | minor |
| Breaking change (incl. new `exports` encapsulation) | major |

Adding `exports` to a previously-open package can break deep imports — treat as
a major bump. → See `exports-map.md`.

---

## Related References

- [exports-map.md](exports-map.md) - Dual/ESM conditions
- [validation.md](validation.md) - attw check before publish
