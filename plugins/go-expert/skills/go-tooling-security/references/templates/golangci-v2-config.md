---
name: golangci-v2-config
description: Complete recommended golangci-lint v2 .golangci.yml
keywords: golangci-lint, v2, config, formatters, exclusions, template
---

# Template: `.golangci.yml` (golangci-lint v2)

## Usage

Drop this at the repo root. Requires golangci-lint v2. Adjust the `run.go` line to your module's minimum Go version. Structure and keys follow the official v2 migration guide (https://golangci-lint.run/docs/product/migration-guide/).

---

## Complete Config

```yaml
version: "2"

run:
  # Minimum Go version to target; keep in sync with go.mod.
  go: "1.26"
  timeout: 5m
  concurrency: 4
  # Fail the run if the config itself is invalid.
  allow-parallel-runners: true

linters:
  # Start from no linters, then opt in explicitly for a stable set.
  default: none
  enable:
    - govet          # standard vet analyzers
    - staticcheck    # absorbs former gosimple + stylecheck in v2
    - errcheck       # unchecked errors
    - ineffassign    # ineffective assignments
    - unused         # unused code
    - revive         # configurable style checks
    - gosec          # security-focused analyzers
    - bodyclose      # HTTP response body not closed
    - noctx          # HTTP requests without context
    - misspell       # common misspellings
  settings:
    revive:
      rules:
        - name: exported
          disabled: false
    gosec:
      excludes:
        - G104         # example: duplicate of errcheck; tune to taste
  exclusions:
    # Skip generated files predictably.
    generated: strict
    paths:
      - vendor/
      - third_party/
    rules:
      # Relax noisy linters inside tests.
      - path: '(.+)_test\.go'
        linters:
          - errcheck
          - gosec

formatters:
  # Formatting tools live here in v2, not under `linters`.
  enable:
    - gofmt
    - goimports
  settings:
    gofmt:
      simplify: true
    goimports:
      local-prefixes:
        - example.com/your/module

output:
  formats:
    text:
      path: stdout
      colors: true

issues:
  # Report every finding; do not cap per-linter or per-issue.
  max-issues-per-linter: 0
  max-same-issues: 0
```

---

## Migration Command

```bash
# If you already have a v1 .golangci.yml, migrate instead of hand-writing:
golangci-lint migrate            # writes v2 config, backs up the original
golangci-lint run ./...
```

---

## Notes

| Key | Why |
|-----|-----|
| `version: "2"` | Mandatory; without it the config is rejected |
| `linters.default: none` | Explicit opt-in set; deterministic across versions |
| `formatters` | v2 home for gofmt/goimports/gofumpt/gci |
| `exclusions.generated: strict` | Skips generated files without per-path rules |
| `max-same-issues: 0` | Surfaces every occurrence, not just the first |
