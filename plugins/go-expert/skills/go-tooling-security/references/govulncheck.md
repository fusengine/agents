---
name: govulncheck
description: Reachability-based vulnerability scanning with govulncheck
when-to-use: Scanning Go code or binaries for known, reachable vulnerabilities
keywords: govulncheck, vuln.go.dev, reachability, call-graph, source, binary, OSV
priority: high
related: modules-workspaces.md
---

# govulncheck

**Load when:** scanning a Go module or binary for vulnerabilities, or explaining why govulncheck reports fewer issues than a raw dependency audit.

## Overview

govulncheck reports only vulnerabilities that your code can actually reach: it walks the call graph and surfaces a finding when your functions transitively call a vulnerable function. This makes it low-noise compared to listing every vulnerable dependency.
Source: https://go.dev/doc/security/vuln/

---

## Install & Run

```bash
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...                # source mode (default): full call-graph reachability
```

Data comes from the Go vulnerability database `vuln.go.dev` (curated by the Go Security team from NVD, GitHub Advisory DB, and maintainer reports, in OSV format).
Source: https://go.dev/doc/security/vuln/

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Reachability** | A finding requires your code to transitively call the vulnerable symbol |
| **Source mode** | Default; analyzes source for a precise call graph |
| **Binary mode** | `-mode binary`; uses the binary's symbol table (coarser than source) |
| **vuln.go.dev** | Curated OSV database powering the scan |

---

## Confirmed Flags

| Flag | Effect |
|------|--------|
| `-mode source` \| `binary` \| `extract` | Analyze source (default), a compiled binary, or extract binary info |
| `-show traces` | Print the full call stack for each finding |
| `-show verbose` | Progress messages and more detailed findings |
| `-test` | Include test files in the analysis |
| `-tags a,b` | Build tags controlling which files are scanned |
| `-json` / `-format sarif` / `-format openvex` | Machine-readable output |
| `-db URL` | Alternative vulnerability database |

> Verified against https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck. A `-scan module|package|symbol` flag was **not** confirmed there — do not document it without re-checking the current docs.

Exit code is non-zero when vulnerabilities are found, **except** when `-json`/`-format sarif`/`-format openvex` is used (those exit 0). Gate CI on the plain-text run.

---

## Core Pattern

```bash
govulncheck ./...                        # fail CI on reachable vulns
govulncheck -show traces ./...           # inspect the call path to triage
govulncheck -mode binary ./bin/app       # scan a released binary
```

→ See [ci-workflow.md](templates/ci-workflow.md) for the gated run

---

## Best Practices

### DO
- Run in source mode in CI for the most precise reachability
- Use `-show traces` to confirm a finding is genuinely reachable before acting
- Scan released binaries with `-mode binary` when you lack the source

### DON'T
- Treat `-json` output as a pass/fail gate — it always exits 0
- Dismiss a finding without inspecting the trace
- Assume binary mode matches source precision — it lacks a full call graph

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| CI never fails on vulns | Remove `-json`; use plain-text run for the exit code |
| Test-only vuln missed | Add `-test` |
| Too much noise expected | It only reports reachable symbols — that is by design |

## Related Templates

- [ci-workflow.md](templates/ci-workflow.md) - govulncheck step in the quality gate
