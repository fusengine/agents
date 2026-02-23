---
name: liskov-substitution
description: LSP Guide - Interface contracts and behavioral subtyping for TypeScript
when-to-use: implementing interfaces, swapping implementations, testing compliance
keywords: liskov, substitution, LSP, contract, interface, subtype
priority: high
related: interface-segregation.md, dependency-inversion.md, templates/interface.md
applies-to: "**/*.ts, **/*.tsx"
trigger-on-edit: "interfaces/, services/"
level: principle
---

# Liskov Substitution Principle (LSP)

**Any implementation can replace another without breaking behavior**

If code depends on an interface, any implementation of that interface must work correctly.

---

## When to Apply LSP?

### Symptoms of Violation

1. **Implementation throws unexpected errors**
   - Interface says it returns `T | null`, implementation throws
   - Caller must check which implementation is used

2. **Implementation ignores part of the contract**
   - Method exists but is a no-op
   - Returns dummy data instead of real results

3. **Switching implementation breaks callers**
   - Tests pass with mock but fail with real implementation
   - Behavior differs between implementations

---

## Contract Rules

### Return Type Contracts

```typescript
interface Cache {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttl?: number): Promise<void>
}
```

**All implementations MUST:**
- Return `string | null` from `get()` (never `undefined`, never throw)
- Return `void` from `set()` (never return a value)
- Accept optional `ttl` parameter

### Exception Contracts

```typescript
interface FileReader {
  /** @throws FileNotFoundError if path does not exist */
  read(path: string): Promise<string>
}
```

**All implementations MUST:**
- Only throw `FileNotFoundError` for missing paths
- Never throw different error types for the same condition

---

## How to Verify LSP?

### Step 1: Define Clear Contracts

Write JSDoc specifying exact behavior:

```typescript
/**
 * Storage interface for key-value persistence.
 *
 * @method get - Returns value or null. Never throws for missing keys.
 * @method set - Stores value. Overwrites if key exists.
 * @method delete - Removes key. No-op if key does not exist.
 */
export interface Storage {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}
```

### Step 2: Write Contract Tests

```typescript
function testStorageContract(storage: Storage) {
  test('get returns null for missing key', async () => {
    expect(await storage.get('missing')).toBeNull()
  })

  test('set then get returns value', async () => {
    await storage.set('key', 'value')
    expect(await storage.get('key')).toBe('value')
  })

  test('delete is no-op for missing key', async () => {
    await expect(storage.delete('missing')).resolves.not.toThrow()
  })
}
```

### Step 3: Run Tests Against All Implementations

```typescript
describe('MemoryStorage', () => testStorageContract(new MemoryStorage()))
describe('FileStorage', () => testStorageContract(new FileStorage('/tmp')))
describe('RedisStorage', () => testStorageContract(new RedisStorage(client)))
```

---

## Common LSP Violations

| Violation | Fix |
|-----------|-----|
| Throws instead of returning null | Follow return type contract |
| Ignores optional parameters | Handle all interface parameters |
| Returns different shape | Match exact return type |
| Side effects not in contract | Document or remove side effects |
| No-op implementation | Throw `NotImplementedError` explicitly |

---

## Decision Criteria

1. **Can I swap implementations without changing callers?** -> LSP compliant
2. **Do all implementations handle edge cases the same way?** -> LSP compliant
3. **Are contracts documented in JSDoc?** -> Verifiable

---

## Where to Find Code Templates?

-> `templates/interface.md` - Interface with documented contracts
-> `templates/test.md` - Contract test patterns

---

## LSP Checklist

- [ ] Interface contracts documented in JSDoc
- [ ] Return types match exactly across implementations
- [ ] Exception behavior is consistent
- [ ] Contract tests exist for each interface
- [ ] All implementations pass same contract tests
