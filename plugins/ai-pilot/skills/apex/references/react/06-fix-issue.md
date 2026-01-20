# 06 - Fix Issue (React/Vite)

**Handle React issues found during review or testing.**

## When to Use

- When validation finds errors
- When tests fail
- When reviewer requests changes
- When bugs are discovered

---

## Issue Triage

### Classify Issue

| Type | Priority | Action |
| --- | --- | --- |
| Build failure | P0 | Fix immediately |
| Type error | P1 | Fix before PR |
| Test failure | P1 | Fix before PR |
| Hook rule violation | P1 | Fix before PR |
| Review comment | P2 | Address in order |

---

## Common React Errors

### Hook Rules Violation

```typescript
// Error: React Hook is called conditionally
if (condition) {
  const [state, setState] = useState(0) // Invalid
}

// Fix: Move hook to top level
const [state, setState] = useState(0)
if (condition) {
  // use state here
}
```

### Missing Dependencies

```typescript
// Warning: useEffect has missing dependency
useEffect(() => {
  fetchData(userId)
}, []) // userId missing

// Fix: Add to dependencies
useEffect(() => {
  fetchData(userId)
}, [userId])

// OR: Use useCallback if function
const fetch = useCallback(() => {
  fetchData(userId)
}, [userId])
```

### Stale Closure

```typescript
// Bug: count always 0 in interval
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1) // Stale closure
  }, 1000)
  return () => clearInterval(id)
}, [])

// Fix: Use functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)
  return () => clearInterval(id)
}, [])
```

### Type Errors

```typescript
// Error: Object is possibly undefined
const user = users.find(u => u.id === id)
return <span>{user.name}</span> // Error

// Fix: Guard or optional chaining
if (!user) return null
return <span>{user.name}</span>
// OR
return <span>{user?.name}</span>
```

---

## Fix Workflow

### Step 1: Understand

```text
1. Read error message completely
2. Identify affected component/hook
3. Understand root cause
4. Check React 19 docs if needed
```

### Step 2: Fix

```text
1. Make minimal change to fix
2. Follow same patterns as codebase
3. Keep files <100 lines
4. Add regression test if applicable
```

### Step 3: Verify

```text
1. Run sniper agent again
2. Run affected tests
3. Test in browser
4. Check React DevTools
```

---

## Review Comment Fixes

### Common Requests

| Request | Action |
| --- | --- |
| "Extract hook" | Move logic to src/hooks/ |
| "Add types" | Create interface in src/interfaces/ |
| "Simplify" | Split component or extract logic |
| "Add loading" | Add loading state handling |
| "Add error" | Add error boundary or state |

### Example: Extract Hook

```typescript
// Before: Logic in component
function UserProfile({ id }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchUser(id).then(setUser).finally(() => setLoading(false))
  }, [id])
  return loading ? <Spinner /> : <Profile user={user} />
}

// After: Extracted hook
function UserProfile({ id }: Props) {
  const { user, loading } = useUser(id)
  return loading ? <Spinner /> : <Profile user={user} />
}
```

---

## Commit Fixes

```bash
# For validation fixes
git commit -m "fix(UserCard): resolve missing dependency warning"

# For review fixes
git commit -m "refactor(auth): extract useAuth hook per review"

# For test fixes
git commit -m "test(Button): fix async assertion"
```

---

## Fix Checklist

```text
[ ] Issue understood and reproduced
[ ] Root cause identified
[ ] Minimal fix implemented
[ ] Files still <100 lines
[ ] sniper validation passes
[ ] All tests pass
[ ] Browser testing done
[ ] Ready for re-review
```

---

## Next Phase

-> Return to `04-validation.md` (verify fix)
-> Then `05-review.md` (re-review)
