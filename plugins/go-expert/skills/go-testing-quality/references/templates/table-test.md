# Template: Complete Test File

**Load when:** scaffolding a test file. Copy-paste ready — table-driven tests,
subtests, testify, a mock, a fuzz target, and a benchmark for one small package.

Assumes the package under test:

```go
package calc

import "errors"

var ErrDivByZero = errors.New("division by zero")

// Divide returns a/b, or ErrDivByZero when b == 0.
func Divide(a, b int) (int, error) {
    if b == 0 {
        return 0, ErrDivByZero
    }
    return a / b, nil
}

// Rater looks up a multiplier by name (an external dependency to mock).
type Rater interface {
    Rate(name string) (int, error)
}

// Total multiplies value by the named rate.
func Total(r Rater, name string, value int) (int, error) {
    rate, err := r.Rate(name)
    if err != nil {
        return 0, err
    }
    return value * rate, nil
}
```

---

## calc_test.go

```go
package calc

import (
    "errors"
    "testing"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/stretchr/testify/require"
)

// TestDivide is the canonical table-driven + subtest pattern.
func TestDivide(t *testing.T) {
    tests := []struct {
        name    string
        a, b    int
        want    int
        wantErr error
    }{
        {name: "exact", a: 10, b: 2, want: 5},
        {name: "truncates", a: 7, b: 2, want: 3},
        {name: "by zero", a: 1, b: 0, wantErr: ErrDivByZero},
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            got, err := Divide(tc.a, tc.b)
            if tc.wantErr != nil {
                require.ErrorIs(t, err, tc.wantErr)
                return
            }
            require.NoError(t, err)
            assert.Equal(t, tc.want, got)
        })
    }
}

// MockRater is a testify mock of the Rater dependency.
type MockRater struct{ mock.Mock }

func (m *MockRater) Rate(name string) (int, error) {
    args := m.Called(name)
    return args.Int(0), args.Error(1)
}

// TestTotal exercises the collaborator through a mock.
func TestTotal(t *testing.T) {
    t.Run("applies rate", func(t *testing.T) {
        r := new(MockRater)
        r.On("Rate", "gold").Return(3, nil)

        got, err := Total(r, "gold", 4)

        require.NoError(t, err)
        assert.Equal(t, 12, got)
        r.AssertExpectations(t)
    })

    t.Run("propagates error", func(t *testing.T) {
        r := new(MockRater)
        r.On("Rate", "bad").Return(0, errors.New("unknown rate"))

        _, err := Total(r, "bad", 4)

        assert.Error(t, err)
        r.AssertExpectations(t)
    })
}

// FuzzDivide asserts an invariant across generated inputs.
func FuzzDivide(f *testing.F) {
    f.Add(10, 2)
    f.Add(-6, 3)
    f.Fuzz(func(t *testing.T, a, b int) {
        got, err := Divide(a, b)
        if b == 0 {
            require.ErrorIs(t, err, ErrDivByZero)
            return
        }
        require.NoError(t, err)
        // Invariant: got*b + (a%b) == a for integer division.
        assert.Equal(t, a, got*b+(a%b))
    })
}

// BenchmarkDivide uses the Go 1.24+ b.Loop idiom.
func BenchmarkDivide(b *testing.B) {
    for b.Loop() {
        _, _ = Divide(1_000_003, 7)
    }
}
```

---

## Run it

```bash
go test ./...                     # unit tests + examples
go test ./... -race -cover        # with race detector + coverage
go test -run=Fuzz -fuzz=FuzzDivide -fuzztime=20s
go test -bench=. -benchmem
```

Notes:
- `require` guards preconditions (abort), `assert` checks expectations (continue).
- The mock's `AssertExpectations` fails the test if `.On(...)` calls never happen.
- The fuzz invariant (`got*b + a%b == a`) is stronger than any single example.
