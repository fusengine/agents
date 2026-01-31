---
name: interface-segregation
description: ISP Guide - Creating small focused interfaces in modules/[feature]/src/interfaces/
when-to-use: interface too big, unused methods, splitting interfaces
keywords: interface segregation, ISP, interface, splitting, role-based, focused
priority: high
related: single-responsibility.md, templates/interface.md
---

# Interface Segregation Principle (ISP)

**Many small interfaces are better than one large one**

---

## When to Apply ISP?

### Symptoms of Violation

1. **Interface has more than 5-6 methods**
   - Too many responsibilities
   - Hard to implement completely

2. **Implementing empty methods or "Not implemented"**
   - You don't need this method
   - But interface forces you

3. **Different clients use different parts**
   - Component A uses `getUser`
   - Component B uses `updateUser`
   - But interface forces both

---

## Why It Matters?

### Without ISP (Fat Interface)

One big interface in `modules/users/src/interfaces/user.interface.ts`:
```
UserService: getUser, updateUser, deleteUser, resetPassword,
verifyEmail, updateAvatar, getPermissions... (15 methods)
```

Problems:
- Hard to implement
- Hard to understand
- Changes impact everyone

### With ISP (Focused Interfaces)

Multiple focused interfaces in `modules/users/src/interfaces/`:
- `user-reader.interface.ts` → `getById()`, `getAll()`
- `user-writer.interface.ts` → `create()`, `update()`, `delete()`
- `user-auth.interface.ts` → `resetPassword()`, `verifyEmail()`
- `user-profile.interface.ts` → `updateAvatar()`, `getPermissions()`

---

## Interface File Location

ALL interfaces go in: `modules/[feature]/src/interfaces/`

```
modules/[feature]/src/interfaces/
├── [entity].interface.ts        # Entity types
├── [entity]-reader.interface.ts # Read operations
├── [entity]-writer.interface.ts # Write operations
├── props.interface.ts           # Component props
└── index.ts                     # Re-exports
```

---

## How to Split an Interface?

### Strategy 1: By Operation Type

- `UserReader` → Read operations only
- `UserWriter` → Write operations only
- `UserAuth` → Auth operations only

### Strategy 2: By Domain

- `UserProfile` → Profile-related
- `UserSettings` → Settings-related
- `UserPermissions` → Permission-related

### The 5 Methods Rule

**An interface should not exceed 5-6 methods.**

If more → Split into focused interfaces.

---

## Decision Criteria

### Should I Split This Interface?

1. **More than 6 methods?** → Split

2. **Mixing read/write/auth operations?** → Split by operation type

3. **Some methods always used together, others not?** → Group by usage

---

## Interface Composition

If you need all methods somewhere, compose:

```typescript
// modules/users/src/interfaces/user-reader.interface.ts
export interface UserReader {
  getById(id: string): Promise<User>
  getAll(): Promise<User[]>
}

// modules/users/src/interfaces/user-writer.interface.ts
export interface UserWriter {
  create(data: CreateUserInput): Promise<User>
  update(id: string, data: UpdateUserInput): Promise<User>
  delete(id: string): Promise<void>
}

// modules/users/src/interfaces/user-service.interface.ts
export interface UserService extends UserReader, UserWriter {}
```

---

## Component Props

Props should be focused too.

Location: `modules/[feature]/src/interfaces/props.interface.ts`

**Bad:** Component receives entire `User` with 20 fields
**Good:** Component receives only what it displays

```typescript
// modules/users/src/interfaces/props.interface.ts
export interface UserCardProps {
  name: string
  avatar: string
  role: string
}
```

---

## Where to Find Code Templates?

→ `templates/interface.md` - Focused interface examples

---

## ISP Checklist

- [ ] All interfaces in `modules/[feature]/src/interfaces/`
- [ ] Each interface < 6 methods
- [ ] Interfaces named by role (`UserReader`, `UserWriter`)
- [ ] Component props focused (not entire object)
- [ ] One file per interface (or logical group)
