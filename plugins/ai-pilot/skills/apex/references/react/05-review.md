---
name: 05-review
description: Self-review React code before PR
prev_step: references/react/04-validation.md
next_step: references/react/06-fix-issue.md
---

# 05 - Review (React/Vite)

**Self-review React code before PR.**

## When to Use

- After validation passes
- Before creating PR
- As final quality check

---

## React Self-Review Checklist

### Component Quality

```text
[ ] Single responsibility (one UI concern)
[ ] Props are typed with interface
[ ] No inline styles (use Tailwind/cn())
[ ] Accessible (semantic HTML, ARIA)
[ ] No hardcoded strings (i18n ready)
[ ] Error boundaries for async
```

### Hook Quality

```text
[ ] Extracts logic from components
[ ] Returns minimal, focused API
[ ] Dependencies array complete
[ ] No unnecessary re-renders
[ ] Cleanup functions present
```

### State Management

```text
[ ] Local state for UI only
[ ] Zustand for shared state
[ ] TanStack Query for server state
[ ] No prop drilling (use context/store)
[ ] Optimistic updates where appropriate
```

---

## SOLID for React

### Single Responsibility

```typescript
// 1 component = 1 UI concern
function UserAvatar({ user }: Props) { /* avatar only */ }
function UserName({ user }: Props) { /* name only */ }
function UserCard({ user }: Props) {
  return (
    <div>
      <UserAvatar user={user} />
      <UserName user={user} />
    </div>
  )
}
```

### Open/Closed

```typescript
// Extensible via props, not modification
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

### Interface Segregation

```typescript
// Small, focused interfaces
interface Clickable { onClick: () => void }
interface Loadable { loading: boolean }
interface ButtonProps extends Clickable, Loadable {
  children: React.ReactNode
}
```

---

## Code Smells to Fix

| Smell | Fix |
| --- | --- |
| Component >50 lines | Extract hook or split |
| Multiple useState | Combine or use reducer |
| useEffect for fetch | Use TanStack Query |
| Prop drilling | Use context or store |
| Inline types | Move to interfaces/ |
| Logic in JSX | Extract to function |

### Examples

```typescript
// Bad: Logic in JSX
{items.filter(i => i.active).map(i => /* ... */)}

// Good: Extract
const activeItems = items.filter(i => i.active)
{activeItems.map(i => /* ... */)}
```

```typescript
// Bad: Multiple related useState
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [phone, setPhone] = useState('')

// Good: Single state object or form library
const [user, setUser] = useState<User>({ name: '', email: '', phone: '' })
// OR use TanStack Form
```

---

## Performance Review

```text
[ ] React.memo for expensive components
[ ] useMemo for expensive calculations
[ ] useCallback for callback props
[ ] Lazy loading for large components
[ ] No unnecessary re-renders (React DevTools)
```

---

## Accessibility Review

```text
[ ] Semantic HTML elements
[ ] Button for actions, Link for navigation
[ ] Alt text on images
[ ] Form labels present
[ ] Keyboard navigation works
[ ] Focus management correct
```

---

## Pre-PR Checklist

```text
[ ] All validation checks pass
[ ] Tests added for new code
[ ] Tests pass locally
[ ] Build succeeds
[ ] No console.log/debug code
[ ] No TODO comments unaddressed
[ ] Self-review completed
```

---

## Review Questions

```text
1. Would I approve this PR?
2. Is there logic that belongs in a hook?
3. Are components small and focused?
4. Is state managed correctly?
5. Will future me understand this?
```

---

## Next Phase

-> Proceed to `07-add-test.md` (if tests not done)
-> OR `09-create-pr.md` (if ready for PR)
