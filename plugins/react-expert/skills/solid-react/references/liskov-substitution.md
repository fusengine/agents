---
name: liskov-substitution
description: LSP Guide - Contract compliance and behavioral subtyping
when-to-use: creating interfaces, implementing contracts, testing substitutability
keywords: liskov substitution, LSP, contracts, subtyping, implementations
priority: medium
related: interface-segregation.md, dependency-inversion.md, templates/interface.md
---

# Liskov Substitution Principle (LSP) for React

**Subtypes must be substitutable for their base types**

If `S` is a subtype of `T`, objects of type `T` can be replaced with objects of type `S` without breaking the application.

---

## When to Apply LSP?

### Symptoms of Violation

1. **Type check before using implementation**
   - `if (service instanceof SpecificService)` = violation
   - Should work with any implementation

2. **Different implementations behave inconsistently**
   - One throws, another returns null
   - Contract not respected

3. **Tests pass with mock but fail with real**
   - Mock doesn't respect contract
   - Substitution fails

---

## Why It Matters?

### Without LSP

```
useUsers(apiSource)  ✓ works
useUsers(mockSource) ✗ breaks (different behavior)
```

### With LSP

```
useUsers(apiSource)  ✓ works
useUsers(mockSource) ✓ works (same contract)
```

---

## How to Apply LSP?

### 1. Define Clear Interface Contract

```typescript
interface DataSource<T> {
  fetch(): Promise<T[]>           // Always returns array
  getById(id: string): Promise<T | null>  // Returns null if not found
}
```

→ See `templates/interface.md` for interface patterns

### 2. All Implementations Respect Contract

**API Implementation:**
- `fetch()` → returns `T[]` (empty if none)
- `getById()` → returns `T` or `null`

**Mock Implementation:**
- Same behavior, same return types

→ See `templates/service.md` for implementation patterns

### 3. Consistent Error Handling

All implementations should throw same error types:

```typescript
class ApiDataSource implements DataSource<User> {
  async getById(id: string) {
    // Throws NotFoundError, not random errors
  }
}
```

→ See `templates/error.md` for error patterns

---

## Contract Rules

| Aspect | Rule |
|--------|------|
| Return types | Must be consistent |
| Null handling | `T | null` = can return null |
| Errors | Same error types for same conditions |
| Side effects | Documented and consistent |

---

## Decision Criteria

### Is My Implementation LSP-Compliant?

1. **Does it return the expected type?**
   - `Promise<T[]>` must return array, never undefined

2. **Does it handle missing data consistently?**
   - If interface says `T | null`, return null not throw

3. **Can it replace other implementations?**
   - Should work in same contexts

---

## Testing LSP Compliance

Write tests that work with any implementation:

```typescript
describe.each([
  ['API', apiSource],
  ['Mock', mockSource]
])('%s DataSource', (name, source) => {
  it('returns array from fetch', async () => {
    const result = await source.fetch()
    expect(Array.isArray(result)).toBe(true)
  })
})
```

→ See `templates/test.md` for LSP testing patterns

---

## Where to Find Code Templates?

→ `templates/interface.md` - Contract definitions
→ `templates/service.md` - Service implementations
→ `templates/error.md` - Consistent error handling
→ `templates/test.md` - LSP compliance tests

---

## LSP Checklist

- [ ] Interface contract is clear and documented
- [ ] All implementations return same types
- [ ] Error handling is consistent
- [ ] Implementations are interchangeable
- [ ] Tests verify substitutability
