# Testify: Assertions & Mocks

**Load when:** adding assertions or mocks to Go tests.

Source: https://pkg.go.dev/github.com/stretchr/testify (maintained at v1; no
breaking v2 — see the repo discussion). Install: `go get github.com/stretchr/testify`.

Packages: `assert`, `require`, `mock`, `suite`.

---

## assert vs require

Both take `*testing.T` as the first argument and read left-to-right
(`Equal(t, want, got)`).

- **`assert`** records a failure and **continues** — returns a `bool` so you can
  guard further checks. Use for independent field checks.
- **`require`** records a failure and **aborts the test** (`t.FailNow`). Use when
  continuing is pointless — e.g. after an unexpected error, or before dereferencing.

```go
import (
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestUser(t *testing.T) {
    u, err := LoadUser(ctx, 42)
    require.NoError(t, err)      // stop here if it errored — u is unusable
    require.NotNil(t, u)

    assert.Equal(t, "ada", u.Name)   // independent checks: report all failures
    assert.Equal(t, 42, u.ID)
    assert.True(t, u.Active)
}
```

Rule of thumb: **`require` for preconditions, `assert` for the actual expectations.**

`require` must be called from the goroutine running the test — not from goroutines
spawned inside it (it calls `FailNow`, which is only safe on the test goroutine).

---

## Common assertions

`Equal` / `NotEqual`, `NoError` / `Error` / `ErrorIs` / `ErrorContains`,
`Nil` / `NotNil`, `True` / `False`, `Len`, `Contains`, `ElementsMatch`
(order-independent slice equality), `Eventually` (poll until a condition holds).
Prefer `ErrorIs`/`ErrorContains` over stringly-typed error checks.

Enable **testifylint** (via golangci-lint) to catch misuse like swapped
want/got or `assert` where `require` is needed.

---

## mock package

`testify/mock` builds hand-written mocks: embed `mock.Mock`, record calls with
`m.Called(...)`, set expectations with `.On(...).Return(...)`, and verify with
`AssertExpectations`.

```go
import "github.com/stretchr/testify/mock"

type MockPostStore struct{ mock.Mock }

func (m *MockPostStore) GetPost(ctx context.Context, id int64) (domain.Post, error) {
    args := m.Called(ctx, id)
    return args.Get(0).(domain.Post), args.Error(1)
}

func TestHandler(t *testing.T) {
    store := new(MockPostStore)
    store.On("GetPost", mock.Anything, int64(42)).
        Return(domain.Post{ID: 42, Title: "hi"}, nil)

    // ... exercise the handler that depends on the PostStore interface ...

    store.AssertExpectations(t) // fails if GetPost was not called as expected
}
```

Use `mock.Anything` for arguments you cannot predict (timestamps, hashes).
`AssertExpectations` fails the test if a mocked call set with `.On` never happened.

---

## suite package

`testify/suite` gives xUnit-style grouping: a struct embedding `suite.Suite`, with
`SetupTest` / `TearDownTest` run around every `Test…` method. Handy when many tests
share expensive setup. **Caveat: the suite package does not support parallel tests**
(`t.Parallel` inside a suite is unsupported) — keep parallel work in plain
table-driven tests.

---

## Generating mocks

For interfaces with many methods, autogenerate instead of hand-writing:

- **mockery** (https://vektra.github.io/mockery) — generates `testify/mock`-style
  mocks from your interfaces; the natural companion to testify.
- **gomock** (`go.uber.org/mock`, the maintained fork of golang/mock) — its own
  `mockgen` + `EXPECT()` API. A solid alternative if your team prefers it.

Mention both as *complements*; testify's own `mock` package remains the standard
baseline.
