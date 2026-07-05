---
name: ci-workflow
description: Complete Go CI quality gate (fmt, vet, lint, vuln, test)
keywords: CI, GitHub Actions, gate, gofmt, go vet, golangci-lint, govulncheck, go test, race
---

# Template: Go CI Quality Gate

## Usage

A fail-fast gate ordered cheapest-to-most-expensive: formatting → vet → linters → vulnerability scan → race-enabled tests. Works for a single module or a workspace. Commands are stable Go / tool CLIs; the govulncheck flags are the confirmed set (see references/govulncheck.md).

---

## Local `Makefile` Gate

```makefile
.PHONY: gate fmt vet lint vuln test

gate: fmt vet lint vuln test

fmt:
	@test -z "$$(gofmt -l .)" || (echo "gofmt needed:"; gofmt -l .; exit 1)
	go run golang.org/x/tools/cmd/goimports@latest -l .

vet:
	go vet ./...

lint:
	golangci-lint run ./...

vuln:
	go run golang.org/x/vuln/cmd/govulncheck@latest ./...

test:
	go test -race -cover ./...
```

---

## GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-go@v5
        with:
          go-version: "1.26"
          check-latest: true

      # Do not let a committed go.work force unexpected versions in CI.
      - name: Disable workspace in CI
        run: echo "GOWORK=off" >> "$GITHUB_ENV"

      - name: Formatting
        run: |
          test -z "$(gofmt -l .)" || { echo "Run gofmt:"; gofmt -l .; exit 1; }

      - name: Vet
        run: go vet ./...

      - name: Lint (golangci-lint v2)
        uses: golangci/golangci-lint-action@v6
        with:
          version: v2.1  # pin a v2 release

      - name: Vulnerability scan (reachability)
        run: |
          go install golang.org/x/vuln/cmd/govulncheck@latest
          govulncheck ./...        # plain text → non-zero exit fails the job

      - name: Test (race + coverage)
        run: go test -race -coverprofile=cover.out ./...
```

---

## Multi-Module Workspace Variant

```yaml
      # Replace the single steps above with a per-module loop.
      - name: Gate each module
        run: |
          for dir in $(go work edit -json | jq -r '.Use[].DiskPath'); do
            echo "== $dir =="
            ( cd "$dir" && go vet ./... && golangci-lint run ./... \
              && govulncheck ./... && go test -race ./... )
          done
        env:
          GOWORK: "off"   # scan each module in isolation
```

---

## Gate Order Rationale

| Step | Why this order |
|------|----------------|
| `gofmt` / `goimports` | Cheapest; fail before spending CI minutes |
| `go vet` | Fast correctness analyzers |
| `golangci-lint` | Broader static analysis |
| `govulncheck` | Reachable vulnerabilities in dependencies |
| `go test -race` | Most expensive; run last |

> Keep govulncheck as a plain-text run so its non-zero exit fails the job. `-json`/`-format sarif`/`-format openvex` always exit 0 and must not be used as the gate.
