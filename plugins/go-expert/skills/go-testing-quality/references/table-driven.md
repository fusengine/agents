# Table-Driven Tests

**Load when:** writing the standard-shape Go unit test.

Table-driven tests are *the* Go idiom: enumerate cases in a slice, iterate, and run
each as a subtest. They minimize duplication and make adding a case a one-line diff.

---

## The shape

```go
func TestSplitHostPort(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        wantHost string
        wantPort string
        wantErr  bool
    }{
        {name: "host and port", input: "example.com:8080",
            wantHost: "example.com", wantPort: "8080"},
        {name: "missing port", input: "example.com", wantErr: true},
        {name: "ipv6", input: "[::1]:80", wantHost: "::1", wantPort: "80"},
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            host, port, err := SplitHostPort(tc.input)
            if (err != nil) != tc.wantErr {
                t.Fatalf("err = %v, wantErr %v", err, tc.wantErr)
            }
            if err != nil {
                return
            }
            if host != tc.wantHost || port != tc.wantPort {
                t.Errorf("got (%q, %q), want (%q, %q)",
                    host, port, tc.wantHost, tc.wantPort)
            }
        })
    }
}
```

---

## Rules that keep it correct

- **Name every case.** The `name` field becomes the subtest path
  (`TestSplitHostPort/ipv6`) — you can target one with `go test -run
  TestSplitHostPort/ipv6`.
- **`t.Run` per case.** Isolation: one failure does not stop the others, and output
  pinpoints which case failed.
- **`t.Fatalf` vs `t.Errorf`.** `Fatalf` stops this subtest (use when later
  assertions are meaningless — e.g. an unexpected error); `Errorf` records and
  continues (use to report multiple field mismatches at once).
- **No shared mutable state between cases.** Each iteration should be independent.
  (Go 1.22+ gives each loop iteration its own variable, so the old
  `tc := tc` copy is no longer required — but harmless if present.)

---

## Parallel subtests

```go
for _, tc := range tests {
    t.Run(tc.name, func(t *testing.T) {
        t.Parallel() // run cases concurrently
        // ... assertions using only tc (no shared state)
    })
}
```

`t.Parallel()` runs subtests concurrently — great for I/O-bound cases and a good
way to surface races (pair with `-race`). Only safe when cases share no mutable
state.

---

## Helpers

- Mark reusable check functions with `t.Helper()` so failures report the caller's
  line, not the helper's.
- Use `t.Cleanup(fn)` to register teardown that runs when the test (or subtest)
  finishes — cleaner than trailing `defer`s, and it composes with `t.Parallel()`.
- Use `t.TempDir()` for filesystem tests; it is auto-removed.

---

## When a plain table is not enough

- **Assertions get verbose** → add `testify/assert` or `require`
  ([testify-mocks.md](testify-mocks.md)).
- **Cases share heavy setup/teardown** → consider `testify/suite`.
- **You want the tool to generate inputs** → fuzzing
  ([fuzzing-benchmarks.md](fuzzing-benchmarks.md)).
