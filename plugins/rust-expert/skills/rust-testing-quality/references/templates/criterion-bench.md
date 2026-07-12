---
name: criterion-bench
description: Complete criterion benchmark with Cargo.toml wiring
keywords: template, criterion, benchmark, black_box, harness false
---

# Complete Criterion Benchmark

## Usage

Copy to add a statistical benchmark to a library crate. Criterion measures timing with confidence intervals and reports regressions across runs.

---

## `Cargo.toml`

```toml
[package]
name = "mycrate"
version = "0.1.0"
edition = "2024"

[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "throughput"     # matches benches/throughput.rs
harness = false          # REQUIRED: disable the built-in bench harness
```

---

## `src/lib.rs`

```rust
/// Marked `#[inline]` so it can be inlined into the benchmark crate.
#[inline]
pub fn fibonacci(n: u64) -> u64 {
    let (mut a, mut b) = (0u64, 1u64);
    for _ in 0..n {
        let c = a + b;
        a = b;
        b = c;
    }
    a
}
```

---

## `benches/throughput.rs`

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use mycrate::fibonacci;

fn bench_fibonacci(c: &mut Criterion) {
    // `black_box` stops the compiler from constant-folding the input away.
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}

fn bench_group(c: &mut Criterion) {
    let mut group = c.benchmark_group("fibonacci-sizes");
    for n in [10u64, 20, 30] {
        group.bench_with_input(format!("fib {n}"), &n, |b, &n| {
            b.iter(|| fibonacci(black_box(n)))
        });
    }
    group.finish();
}

criterion_group!(benches, bench_fibonacci, bench_group);
criterion_main!(benches);
```

---

## Running it

```bash
cargo bench                    # runs all criterion benches
cargo bench -- "fib 20"        # filter by benchmark name
```

Criterion stores each run under `target/criterion/`. A second `cargo bench` after a code change prints a verdict such as `Performance has improved` or `Performance has regressed`, with a p-value.

---

## Notes

- Benchmarks are a **separate crate**, so only `pub` items are benchable — mark hot functions `pub` and `#[inline]`.
- `harness = false` is mandatory; without it the default `libtest` bench harness collides with criterion's `main`.
- Wrap both the input (`black_box(n)`) and, where relevant, the output to defeat dead-code elimination.
