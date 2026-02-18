---
name: anti-patterns
description: 9 React useEffect anti-patterns with explanations and severity from official React documentation
when-to-use: Understanding why a detected pattern is problematic
keywords: useEffect, anti-pattern, derived-state, cleanup, race-condition, event-handler
priority: high
related: detection-rules.md, fix-patterns.md
---

# React Effects Anti-Patterns

## 1. Derived State in Effect

**Severity**: WARNING

`useEffect` + `setState` to compute values from existing state/props. Causes unnecessary double render.

**Why bad**: React renders with stale value, then re-renders with updated value. Wasteful and confusing.

**Rule**: If something can be calculated from props or state, compute it during rendering.

---

## 2. Expensive Calculation in Effect

**Severity**: WARNING

`useEffect` + `setState` to filter, sort, or transform data. Even if calculation is expensive, Effect is wrong tool.

**Why bad**: Same double-render as #1. Also prevents React Compiler optimizations.

**Rule**: Use `useMemo` for expensive derived data. React Compiler (v1.0+) auto-memoizes in many cases.

---

## 3. State Reset via Effect

**Severity**: WARNING

`useEffect` that resets state (sets to `null`, `''`, `[]`, `0`) when a prop changes.

**Why bad**: Component renders with stale state, then flashes to reset state. Visual glitch + wasted render.

**Rule**: Use `key` prop to tell React it is a different component instance.

---

## 4. Event Logic in Effect

**Severity**: CRITICAL

User interaction logic (submit, click, navigation) inside `useEffect` instead of event handler.

**Why bad**: Effect runs on every dependency change, not just user actions. Can trigger unintended side effects (duplicate API calls, wrong notifications). Cannot distinguish which user action caused it.

**Rule**: Code caused by user interaction belongs in event handlers. Code caused by display belongs in Effects.

---

## 5. Parent Notification via Effect

**Severity**: WARNING

`useEffect` that calls parent callback (`onChange`, `onUpdate`, `onSelect`) after local `setState`.

**Why bad**: Extra render cycle. Parent updates lag behind child. Can cause cascading updates.

**Rule**: Call parent callback in the same event handler as `setState`. Or make component fully controlled.

---

## 6. Effect Chains

**Severity**: CRITICAL

Multiple `useEffect` hooks where each one sets state that triggers the next Effect.

**Why bad**: N Effects = N extra renders. Extremely inefficient. Fragile: adding/removing a step breaks the chain. Impossible to reason about execution order.

**Rule**: Calculate derived values during rendering. Consolidate state updates in event handlers.

---

## 7. Missing Cleanup in Data Fetching

**Severity**: CRITICAL

`useEffect` with `fetch`/API call that has no cleanup function or AbortController.

**Why bad**: Race conditions. If user types fast or navigates quickly, stale responses overwrite fresh ones. Memory leaks from updating unmounted component state.

**Rule**: Always return cleanup with `ignore` flag or AbortController. Better: use TanStack Query, SWR, or framework data fetching.

---

## 8. Manual Store Subscription

**Severity**: WARNING

`useEffect` with `addEventListener`, `.subscribe()`, or `.on()` to sync external store.

**Why bad**: Manual subscription is error-prone (missing cleanup, stale values). In Concurrent Mode, can cause "tearing" (UI shows mix of old and new values).

**Rule**: Use `useSyncExternalStore` hook. Designed for this exact purpose with proper concurrent mode support.

---

## 9. App Initialization in Effect

**Severity**: INFO

`useEffect(fn, [])` in root component for one-time app initialization (auth check, config load).

**Why bad**: In Strict Mode (dev), runs twice. Can cause issues like double auth token validation. Not truly "once per app load".

**Rule**: Use module-level initialization (outside component) or a `didInit` flag guard.

---

## SOLID Integration

These anti-patterns overlap with SOLID principles enforced by framework skills:

| SOLID Principle | Related Anti-Patterns |
|---|---|
| **SRP** (Single Responsibility) | #4, #5, #6 - Components doing too much in Effects |
| **DIP** (Dependency Inversion) | #7, #8 - Direct coupling to fetch/DOM APIs |
| **ISP** (Interface Segregation) | #5 - Fat callback props instead of focused ones |

**Cross-reference**: `fuse-nextjs:solid-nextjs`, `fuse-react:solid-react` for architecture rules.
