# fuse-go

Expert **simple, idiomatic Go** development — CLI tools, libraries, concurrent systems, and backend services. Targets Go 1.26+, with a small-interfaces mindset, `golangci-lint`-clean code, and SOLID principles.

## Agent

| Agent | Description |
|-------|-------------|
| **go-expert** | Expert Go developer (Go 1.26+, concurrency, backend services, golangci-lint v2 / govulncheck) |

## Skills

| Skill | Description |
|-------|-------------|
| go-core-idioms | Idioms, error handling (`errors.Is`/`As`/`AsType`), generics, slices/maps, zero values, `defer`, Go 1.26 features |
| go-concurrency | Goroutines, channels, `select`, `sync`, `context` cancellation, `errgroup`, structured concurrency |
| go-architecture | Package/module architecture, `internal/`, dependency boundaries, backend services (net/http, routing, middleware) |
| go-testing-quality | Table-driven tests, `testing`, `go test -race`, fuzzing, benchmarks, coverage |
| go-tooling-security | `go vet`, `golangci-lint` v2, `govulncheck`, `go mod`, build/release, supply-chain hygiene |

SOLID principles are provided by the shared **`fuse-solid:solid-go`** skill (files < 100 lines, interfaces separated, modular architecture) — no local duplicate.

## Architecture

```
cmd/<binary>/main.go     # program entrypoints
internal/                # private packages (not importable externally)
├── <domain>/            # feature packages (one concern per package)
└── ...
pkg/                     # optional exported library packages
go.mod                   # module path + Go version directive
go.sum                   # toolchain-managed — never hand-edit
```

## Installation

```bash
/plugin install fuse-go
```

## Usage

The agent activates for **Go** projects — a `go.mod` is present at the module or workspace root.

For pure TypeScript use `typescript-expert`, for Rust use `rust-expert`, for frontend apps use the respective framework experts.
