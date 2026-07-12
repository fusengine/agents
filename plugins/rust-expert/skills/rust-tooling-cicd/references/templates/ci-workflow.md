---
name: ci-workflow
description: Complete GitHub Actions CI pipeline for a Rust workspace
keywords: template, github actions, ci, clippy, nextest, cargo-deny
---

# Complete GitHub Actions CI

## Usage

Copy to `.github/workflows/ci.yml`. Implements the canonical gate: fmt → clippy → deny → audit → nextest → doc-tests → coverage.

---

## `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

env:
  CARGO_TERM_COLOR: always
  RUSTFLAGS: "-D warnings"

jobs:
  quick:
    name: Format & Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy
      - uses: Swatinem/rust-cache@v2
      - run: cargo fmt --all -- --check
      - run: cargo clippy --all-targets --all-features -- -D warnings

  supply-chain:
    name: Supply Chain
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: taiki-e/install-action@v2
        with:
          tool: cargo-deny,cargo-audit
      - run: cargo deny check
      - run: cargo audit

  test:
    name: Test & Coverage
    runs-on: ubuntu-latest
    needs: quick
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: llvm-tools-preview
      - uses: Swatinem/rust-cache@v2
      - uses: taiki-e/install-action@v2
        with:
          tool: cargo-nextest,cargo-llvm-cov
      # nextest does NOT run doc-tests — the two runs are one gate.
      - run: cargo nextest run --all-features --workspace
      - run: cargo test --doc --all-features --workspace
      - run: cargo llvm-cov --all-features --workspace --lcov --output-path lcov.info
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: lcov.info

  msrv:
    name: MSRV & Features
    runs-on: ubuntu-latest
    needs: quick
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: taiki-e/install-action@v2
        with:
          tool: cargo-hack
      - run: cargo hack check --rust-version --workspace
      - run: cargo hack --feature-powerset --depth 2 check --workspace
```

---

## Notes

- `RUSTFLAGS: "-D warnings"` turns every compiler warning into a hard failure across all jobs.
- `Swatinem/rust-cache` caches `~/.cargo` and `target/` keyed on the lockfile.
- `taiki-e/install-action` fetches prebuilt tool binaries — far faster than `cargo install`.
- `supply-chain` runs independently (no `needs`) so a license/CVE issue surfaces even if lint is still running.
- Split `nextest run` and `test --doc` into two steps so a doc-test failure is visible on its own.
