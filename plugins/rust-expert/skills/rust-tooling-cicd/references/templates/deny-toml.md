---
name: deny-toml
description: Complete cargo-deny policy plus the matching workspace root manifest
keywords: template, deny.toml, cargo-deny, workspace, Cargo.toml
---

# Supply-Chain Policy & Workspace Root

## Usage

Two committed files: `deny.toml` (supply-chain policy) and the workspace root `Cargo.toml` (version source of truth).

---

## `deny.toml`

```toml
# Supply-chain policy enforced by `cargo deny check`.
# Runs all four checks by default: advisories, licenses, bans, sources.

[graph]
# Only the targets you actually build for — narrows the crate graph.
targets = [
    "x86_64-unknown-linux-gnu",
    "aarch64-apple-darwin",
    "x86_64-pc-windows-msvc",
]
all-features = true

[advisories]
# Fail on RustSec advisories, unmaintained and yanked crates.
unmaintained = "workspace"
yanked = "deny"
ignore = []                       # add "RUSTSEC-XXXX-YYYY" with a reason when justified

[licenses]
# High confidence before inferring a license from text.
confidence-threshold = 0.93
allow = [
    "Apache-2.0",
    "Apache-2.0 WITH LLVM-exception",
    "MIT",
    "ISC",
    "Unicode-3.0",
    "BSD-3-Clause",
]

[bans]
multiple-versions = "warn"        # flag duplicate versions of the same crate
wildcards = "deny"                # forbid "*" version requirements
deny = [
    { crate = "openssl", use-instead = "rustls" },
]

[sources]
unknown-registry = "deny"
unknown-git = "deny"
```

---

## Workspace root `Cargo.toml`

```toml
[workspace]
resolver = "3"                    # required for virtual manifests
members = ["crates/*"]

# Metadata inherited by members via `key.workspace = true`.
[workspace.package]
version = "0.1.0"
edition = "2024"
rust-version = "1.85"             # the MSRV, CI-verified with cargo hack
license = "MIT OR Apache-2.0"
repository = "https://example.com/org/repo"

# Single source of truth for dependency versions.
[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
anyhow = "1"

# Shared lint policy.
[workspace.lints.rust]
unsafe_code = "forbid"

[workspace.lints.clippy]
all = { level = "warn", priority = -1 }
```

---

## Member `crates/core/Cargo.toml`

```toml
[package]
name = "core"
version.workspace = true
edition.workspace = true
rust-version.workspace = true
license.workspace = true

[dependencies]
serde = { workspace = true }
anyhow = { workspace = true }

[lints]
workspace = true
```

---

## Notes

- Version numbers above are illustrative — ALWAYS confirm the current release on crates.io or Context7 before committing; the ecosystem moves faster than any template.
- `cargo deny check` runs every check with defaults if a section is omitted; the explicit config above documents intent.
- `multiple-versions = "warn"` surfaces duplicate transitive versions without blocking; raise to `"deny"` once the graph is clean.
- Members inherit version, edition, MSRV, license, and lints — change them once at the root.
