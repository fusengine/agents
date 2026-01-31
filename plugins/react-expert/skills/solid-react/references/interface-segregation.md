---
name: interface-segregation
description: ISP Guide - Many focused interfaces beat one fat interface
when-to-use: designing interfaces, refactoring large interfaces, component props
keywords: interface segregation, ISP, small interfaces, focused, props
priority: medium
related: single-responsibility.md, dependency-inversion.md, templates/interface.md
---

# Interface Segregation Principle (ISP) for React

**Clients should not depend on interfaces they don't use**

Many small, focused interfaces are better than one large interface.

---

## When to Apply ISP?

### Symptoms of Violation

1. **Interface has 10+ methods**
   - Too many responsibilities
   - Implementations forced to implement unused methods

2. **Component receives props it doesn't use**
   - Unnecessary re-renders
   - Tight coupling

3. **Hook returns 10+ values**
   - Components subscribe to more than needed
   - Over-fetching state

---

## How to Apply ISP?

### 1. Split Fat Interfaces

**Before (fat interface):**
```typescript
interface UserService {
  getUser(): Promise<User>
  createUser(): Promise<User>
  login(): Promise<Session>
  sendEmail(): Promise<void>
}
```

**After (segregated):**
```typescript
interface UserReader { getUser(): Promise<User> }
interface UserWriter { createUser(): Promise<User> }
interface Authenticatable { login(): Promise<Session> }
```

→ See `templates/interface.md` for patterns

### 2. Split Component Props

**Before (bloated props):**
```typescript
interface UserCardProps {
  user: User
  onEdit: () => void
  onDelete: () => void
  onMessage: () => void
  isSelected: boolean
  onSelect: () => void
}
```

**After (composable):**
```typescript
interface UserDisplayProps { user: User }
interface UserActionsProps { onEdit?: () => void; onDelete?: () => void }
interface UserSelectableProps { isSelected?: boolean; onSelect?: () => void }

type UserCardProps = UserDisplayProps & UserActionsProps
```

→ See `templates/interface.md` for props patterns

### 3. Split Hooks

**Before (returns everything):**
```typescript
function useUser(id: string) {
  return { user, loading, error, update, delete, refresh, ... }
}
```

**After (focused hooks):**
```typescript
function useUser(id: string) { /* read only */ }
function useUserMutations(id: string) { /* mutations */ }
```

→ See `templates/hook.md` for patterns

### 4. Split Contexts

**Before (one context):**
```typescript
const AuthContext = { user, login, logout, refresh, ... }
```

**After (split by concern):**
```typescript
const AuthStateContext = { user, isAuthenticated }
const AuthActionsContext = { login, logout }
```

Components subscribe only to what they need.

---

## Segregation Patterns

| Pattern | Use Case |
|---------|----------|
| Interface composition | `TypeA & TypeB` for combined needs |
| Optional props | `prop?: type` for optional features |
| Separate hooks | One hook per concern |
| Split contexts | State vs Actions contexts |

---

## Decision Criteria

### Should I Split This Interface?

1. **Does it have > 5 methods/props?**
   - Yes → Consider splitting

2. **Do all clients use all methods?**
   - No → Split by usage patterns

3. **Does hook return > 5 values?**
   - Yes → Split into focused hooks

---

## Where to Find Code Templates?

→ `templates/interface.md` - Segregated interfaces
→ `templates/hook.md` - Focused hooks
→ `templates/component.md` - Composable props

---

## ISP Checklist

- [ ] Interfaces have < 5 methods
- [ ] Props interfaces are composable
- [ ] Hooks return focused data
- [ ] Contexts split by concern
- [ ] Components only receive needed props
