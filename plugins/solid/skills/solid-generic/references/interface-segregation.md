---
name: interface-segregation
description: ISP Guide - Small focused interfaces for TypeScript
when-to-use: interface too large, clients use only part of interface, refactoring contracts
keywords: interface segregation, ISP, focused, small, composition
priority: high
related: liskov-substitution.md, dependency-inversion.md, templates/interface.md
applies-to: "**/*interface*.ts, **/*contract*.ts"
trigger-on-edit: "interfaces/, contracts/"
level: principle
---

# Interface Segregation Principle (ISP)

**Many focused interfaces beat one fat interface**

No client should depend on methods it does not use.

---

## When to Apply ISP?

### Symptoms of Violation

1. **Interface has 10+ methods** -> Too broad
2. **Implementations leave methods as no-ops** -> Interface too large
3. **Client only uses 2 of 8 methods** -> Forced dependency
4. **Adding method to interface breaks unrelated code** -> Coupled contracts

---

## How to Apply ISP?

### 1. Split by Role

Before (fat interface):
```typescript
interface UserService {
  getById(id: string): Promise<User>
  getAll(): Promise<User[]>
  create(data: CreateUser): Promise<User>
  update(id: string, data: UpdateUser): Promise<User>
  delete(id: string): Promise<void>
  sendEmail(id: string, message: string): Promise<void>
  exportToCsv(): Promise<string>
}
```

After (role-based):
```typescript
interface UserReader {
  getById(id: string): Promise<User>
  getAll(): Promise<User[]>
}

interface UserWriter {
  create(data: CreateUser): Promise<User>
  update(id: string, data: UpdateUser): Promise<User>
  delete(id: string): Promise<void>
}

interface UserNotifier {
  sendEmail(id: string, message: string): Promise<void>
}

interface UserExporter {
  exportToCsv(): Promise<string>
}
```

### 2. Compose When Needed

```typescript
// Full service implements all roles
interface UserService extends UserReader, UserWriter, UserNotifier {}

// Read-only consumer uses only what it needs
function createReport(reader: UserReader) { /* ... */ }

// Admin panel uses reader + writer
function createAdmin(reader: UserReader, writer: UserWriter) { /* ... */ }
```

### 3. Granular Configuration

Before:
```typescript
interface Config {
  database: DatabaseConfig
  cache: CacheConfig
  auth: AuthConfig
  logging: LogConfig
}
```

After:
```typescript
interface DatabaseConfig { host: string; port: number; name: string }
interface CacheConfig { ttl: number; maxSize: number }
interface AuthConfig { secret: string; expiry: number }
interface LogConfig { level: string; output: string }
```

Each consumer receives only its configuration.

---

## Splitting Rules

| Criteria | Action |
|----------|--------|
| Read vs Write operations | Split into Reader/Writer |
| Different consumers | Interface per consumer role |
| Optional methods | Separate interface for optional |
| Domain boundaries | Interface per domain |

---

## Decision Criteria

1. **Do all clients use all methods?** -> No -> Split
2. **Would adding a method break unrelated code?** -> Yes -> Split
3. **Can you name the interface in 3 words?** -> No -> Too broad
4. **Does implementation leave methods empty?** -> Yes -> Split

---

## Where to Find Code Templates?

-> `templates/interface.md` - Segregated interface examples

---

## ISP Checklist

- [ ] Interfaces have < 5 methods each
- [ ] No implementations with no-op methods
- [ ] Clients only depend on methods they use
- [ ] Interfaces composable via extends
- [ ] Each interface has a clear, single role
