---
name: test-template
description: Bun test and Vitest templates for generic TypeScript
when-to-use: writing tests, test structure, mocking patterns
keywords: test, spec, mock, fixture, assertion, vitest
priority: medium
related: dependency-inversion.md
applies-to: "**/*.test.ts, **/*.spec.ts"
trigger-on-edit: "__tests__/, tests/"
level: template
---

# Test Templates

## Bun Test - Unit Test

```typescript
// modules/parser/src/__tests__/parser.service.test.ts
import { describe, test, expect } from 'bun:test'
import { createParser } from '../services/parser.service'

describe('createParser', () => {
  const parser = createParser()

  test('parses valid input', () => {
    const result = parser.parse('valid input')
    expect(result.valid).toBe(true)
    expect(result.data).toBe('valid input')
  })

  test('throws on empty input', () => {
    expect(() => parser.parse('')).toThrow('Empty input')
  })

  test('validates correct input', () => {
    expect(parser.validate('valid')).toBe(true)
  })

  test('rejects invalid input', () => {
    expect(parser.validate('')).toBe(false)
  })
})
```

---

## Bun Test - Service with Mock

```typescript
// modules/users/src/__tests__/user.service.test.ts
import { describe, test, expect } from 'bun:test'
import type { HttpClient } from '@/modules/cores/interfaces/http.interface'
import { createUserService } from '../services/user.service'

/** Mock HTTP client for testing. */
const mockClient: HttpClient = {
  get: async <T>() => ({ id: '1', name: 'Test' }) as T,
  post: async <T>(_url: string, data: unknown) => ({ id: '2', ...data as object }) as T,
  patch: async <T>(_url: string, data: unknown) => data as T,
  delete: async () => {}
}

describe('createUserService', () => {
  const service = createUserService(mockClient)

  test('getById returns user', async () => {
    const user = await service.getById('1')
    expect(user).toHaveProperty('id', '1')
  })

  test('create returns new user', async () => {
    const user = await service.create({ name: 'New', email: 'new@test.com' })
    expect(user).toHaveProperty('name', 'New')
  })
})
```

---

## Contract Test Pattern (LSP)

```typescript
// modules/cores/__tests__/storage.contract.test.ts
import { describe, test, expect } from 'bun:test'
import type { Storage } from '../interfaces/storage.interface'
import { createMemoryStorage } from '../lib/memory-storage'
import { createFileStorage } from '../lib/file-storage'
// All imports relative to modules/cores/

/** Reusable contract tests for any Storage implementation. */
function testStorageContract(name: string, factory: () => Storage) {
  describe(`${name} - Storage contract`, () => {
    const storage = factory()

    test('get returns null for missing key', async () => {
      expect(await storage.get('missing')).toBeNull()
    })

    test('set then get returns value', async () => {
      await storage.set('key', 'value')
      expect(await storage.get('key')).toBe('value')
    })

    test('delete removes key', async () => {
      await storage.set('temp', 'data')
      await storage.delete('temp')
      expect(await storage.get('temp')).toBeNull()
    })

    test('has returns correct boolean', async () => {
      await storage.set('exists', 'yes')
      expect(await storage.has('exists')).toBe(true)
      expect(await storage.has('nope')).toBe(false)
    })
  })
}

// Run same tests against all implementations
testStorageContract('MemoryStorage', createMemoryStorage)
testStorageContract('FileStorage', () => createFileStorage('/tmp/test-storage'))
```

---

## Vitest - Alternative

```typescript
// modules/cores/__tests__/config.validator.test.ts
import { describe, test, expect } from 'vitest'
import { parseConfig, configSchema } from '../validators/config.validator'

describe('parseConfig', () => {
  test('parses valid config', () => {
    const config = parseConfig({
      port: 8080,
      host: 'localhost',
      database: { url: 'postgres://localhost/db' }
    })
    expect(config.port).toBe(8080)
  })

  test('applies defaults', () => {
    const config = parseConfig({
      database: { url: 'postgres://localhost/db' }
    })
    expect(config.port).toBe(3000)
    expect(config.debug).toBe(false)
  })

  test('rejects invalid port', () => {
    expect(() => parseConfig({ port: -1 })).toThrow()
  })
})
```

---

## Rules

- Test file mirrors source structure: `modules/[feature]/src/__tests__/`
- One test file per source file
- Use mock implementations via DI (never mock modules)
- Contract tests for all interfaces with multiple implementations
- JSDoc for mock factories
