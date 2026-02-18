---
name: solid-validation
description: SOLID principles detection patterns and fix examples for code quality validation
when-to-use: Phase 5 corrections, validating SOLID compliance
keywords: SOLID, SRP, OCP, LSP, ISP, DIP, validation, detection
priority: high
related: architecture-patterns.md, file-size-rules.md
---

# SOLID Validation

## S - Single Responsibility
- ✅ One file = one clear purpose
- ❌ Component with API calls + validation + rendering

**Detection**:
```typescript
// ❌ VIOLATION: Component does too much
function UserDashboard() {
  const [user, setUser] = useState()
  const fetchUser = async () => { /* API call */ }
  const validateForm = (data) => { /* validation */ }
  const calculateMetrics = () => { /* business logic */ }
  return <div>...</div>
}

// ✅ FIXED: Separated concerns
// hooks/useUserDashboard.ts
export function useUserDashboard() {
  const fetchUser = async () => {}
  const validateForm = (data) => {}
  const calculateMetrics = () => {}
  return { fetchUser, validateForm, calculateMetrics }
}

// components/UserDashboard.tsx
function UserDashboard() {
  const { fetchUser, calculateMetrics } = useUserDashboard()
  return <div>...</div>
}
```

## O - Open/Closed
- ✅ Extensible via interfaces/abstractions
- ❌ Modifying existing code for new features

## L - Liskov Substitution
- ✅ Subtypes work as drop-in replacements
- ❌ Subclass throws where parent doesn't

## I - Interface Segregation
- ✅ Small, focused interfaces
- ❌ One huge interface with 20 methods

## D - Dependency Inversion
- ✅ Depend on abstractions (interfaces)
- ❌ Import concrete implementations directly
