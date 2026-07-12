---
name: golangci-lint-v2
description: golangci-lint v2 config structure and v1 to v2 migration
when-to-use: Creating/editing .golangci.yml, migrating from v1, or splitting formatters
keywords: golangci-lint, v2, migrate, formatters, linters, exclusions, .golangci.yml
priority: high
related: go-fix-modernizers.md
---

# golangci-lint v2

**Load when:** creating or migrating a `.golangci.yml`, or reasoning about the v2 `formatters` vs `linters` split.

## Overview

golangci-lint v2 requires an explicit config version and splits formatting tools into a dedicated `formatters` section. Migrate existing v1 configs with the built-in command rather than hand-editing.
Source: https://golangci-lint.run/docs/product/migration-guide/

---

## Migration

```bash
golangci-lint migrate            # rewrites config to v2, backs up the original
```

Flags: `--format json|yml|yaml|toml`, `--skip-validation`, `--config PATH`.
The tool saves the previous config to a backup file before writing the v2 version.

---

## What Changed (v1 → v2)

| v1 | v2 |
|----|----|
| *(no version field)* | `version: "2"` (required, first line) |
| `linters.disable-all` | `linters.default: none` |
| `linters.enable-all` | `linters.default: all` |
| `gofmt`/`goimports`/`gofumpt`/`gci` under `linters` | moved to the new `formatters` section |
| `linters-settings.*` | split into `linters.settings.*` and `formatters.settings.*` |
| `issues.exclude-dirs` | `linters.exclusions.paths` |
| `issues.exclude-rules` | `linters.exclusions.rules` |
| `output.format` | `output.formats.<name>` |

Source: https://golangci-lint.run/docs/product/migration-guide/

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **`version`** | Must be `"2"`; v1-shaped configs are rejected |
| **`formatters`** | gofmt/goimports/gofumpt/gci live here, not in `linters` |
| **`linters.default`** | `none`, `all`, `fast`, or `standard` baseline before `enable`/`disable` |
| **`linters.exclusions`** | Structured excludes: `generated`, `paths`, `rules` |
| **`staticcheck`** | Absorbs former `gosimple` and `stylecheck` in v2 |

---

## Core Pattern

```yaml
version: "2"
linters:
  default: none
  enable:
    - staticcheck
    - govet
formatters:
  enable:
    - gofmt
    - goimports
```

→ See [golangci-v2-config.md](templates/golangci-v2-config.md) for a complete recommended config

---

## Best Practices

### DO
- Run `golangci-lint migrate` and review the backup diff, don't rewrite from scratch
- Keep formatters (`gofmt`, `goimports`) in `formatters`, static analysis in `linters`
- Use `linters.exclusions.generated: strict` to skip generated files predictably

### DON'T
- Omit `version: "2"` — the config will not load
- Re-enable `gosimple`/`stylecheck` — they merged into `staticcheck`
- Put `gofmt` settings under `linters.settings` — they belong in `formatters.settings`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| "unsupported version" error | Add `version: "2"` at the top |
| Formatter runs but isn't reported | Move it into `formatters.enable` |
| `disable-all` ignored | Replace with `linters.default: none` |

## Related Templates

- [golangci-v2-config.md](templates/golangci-v2-config.md) - Full drop-in config
- [ci-workflow.md](templates/ci-workflow.md) - Runs golangci-lint in the gate
