# fuse-rust

Expert **safe, idiomatic Rust** development — libraries, CLI tools, async services, and web backends. Targets Rust 1.96+ on the **2024 edition**, with an ownership-first mindset, `clippy`-clean code, and SOLID principles.

## Agent

| Agent | Description |
|-------|-------------|
| **rust-expert** | Expert Rust developer (Rust 1.96+, 2024 edition, tokio / axum) |

## Skills

| Skill | Description |
|-------|-------------|
| rust-core-language | Ownership, borrowing, lifetimes, traits, generics, edition 2024, let chains, pattern matching |
| rust-error-handling | `Result`/`Option`, `?` operator, error types, `thiserror` / `anyhow`, fallible boundaries |
| rust-async-concurrency | `async`/`.await`, tokio, tasks, channels, `Send`/`Sync`, cancellation, structured concurrency |
| rust-web-backend | Web backends — axum, tower middleware, extractors, state, request/response handling |
| rust-testing-quality | Unit/integration tests, `cargo test`, doctests, clippy lint gates, benches |
| rust-tooling-cicd | cargo, workspaces, features, `rustfmt`, `cargo clippy`, release profiles, CI pipelines |
| rust-ecosystem-crates | Crate selection, `serde`, common libraries, dependency boundaries |

SOLID principles are provided by the shared **`fuse-solid:solid-rust`** skill (files < 100 lines, traits separated, modular architecture) — no local duplicate.

## Architecture

```
src/
├── lib.rs / main.rs     # crate root
├── <module>/mod.rs      # feature modules (one contract per module)
└── ...
tests/                   # integration tests
Cargo.toml               # edition = "2024", dependencies
Cargo.lock               # cargo-managed — never hand-edit
```

## Installation

```bash
/plugin install fuse-rust
```

## Usage

The agent activates for **Rust** projects — a `Cargo.toml` is present at the project or workspace root.

For pure TypeScript use `typescript-expert`, for non-Laravel PHP use `php-expert`, for other languages use their respective experts.
