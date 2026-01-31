---
name: mocking-patterns
description: Vitest mocking with vi.fn, vi.mock, vi.spyOn
when-to-use: Mocking functions, modules, timers in tests
keywords: mock, vi.fn, vi.mock, vi.spyOn, timers
priority: medium
related: msw-setup.md, hooks-testing.md
---

# Mocking Patterns

## Mock Types

| Type | Use Case |
|------|----------|
| `vi.fn()` | Mock function |
| `vi.mock()` | Mock module |
| `vi.spyOn()` | Spy on method |

---

## vi.fn() Usage

| Method | Purpose |
|--------|---------|
| `mockReturnValue()` | Return sync value |
| `mockResolvedValue()` | Return Promise |
| `mockImplementation()` | Custom logic |

---

## Assertions

| Assertion | Checks |
|-----------|--------|
| `toHaveBeenCalled()` | Called at least once |
| `toHaveBeenCalledTimes(n)` | Called n times |
| `toHaveBeenCalledWith(args)` | Called with args |

---

## Timer Mocking

| Method | Purpose |
|--------|---------|
| `vi.useFakeTimers()` | Enable fake timers |
| `vi.advanceTimersByTime()` | Fast forward |
| `vi.runAllTimers()` | Run all pending |
| `vi.useRealTimers()` | Restore real timers |

---

## Module Mocking

### When to Use

- External dependencies
- Environment-specific code
- Heavy dependencies

### When NOT to Use

- API calls → Use MSW instead
- Simple functions → Test real code

---

## Best Practices

| Do | Don't |
|----|-------|
| Mock at boundaries | Mock everything |
| Use MSW for APIs | Mock fetch directly |
| Reset mocks in afterEach | Leave stale mocks |

---

## Where to Find Code?

→ `templates/hook-basic.md` - Mock examples in hook tests
→ `templates/api-integration.md` - MSW for API mocking
