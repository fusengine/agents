---
name: detection-rules
description: Grep and regex patterns to detect React useEffect anti-patterns in source code
when-to-use: Phase 2 scanning, automated detection
keywords: grep, regex, detection, scanning, useEffect, pattern-matching
priority: high
related: anti-patterns.md, fix-patterns.md
---

# Detection Rules

## Scanning Strategy

1. **Glob** all `*.tsx`, `*.jsx`, `*.ts`, `*.js` files in target
2. **Grep** each pattern below across matched files
3. **Read** flagged files to confirm (reduce false positives)
4. Context analysis: check if Effect genuinely syncs with external system

---

## Rule 1: Derived State in Effect

**Grep pattern** (multiline):
```
useEffect\(\s*\(\)\s*=>\s*\{[^}]*set[A-Z]\w+\(
```
**Confirm**: Effect body ONLY contains setState calls derived from other state/props. No API calls, no DOM manipulation, no subscriptions.

---

## Rule 2: Expensive Calculation in Effect

**Grep pattern**:
```
useEffect\([^)]*\{[^}]*\.(filter|map|reduce|sort|find)\([^}]*set[A-Z]
```
**Confirm**: Array transformation followed by setState inside useEffect. Should be `useMemo` instead.

---

## Rule 3: State Reset via Effect

**Grep pattern** (multiline):
```
useEffect\(\s*\(\)\s*=>\s*\{[^}]*set\w+\(\s*(null|''|""|0|\[\]|\{\}|undefined|false)
```
**Confirm**: Effect resets state to initial value. Dependencies include a prop that identifies "which item". Solution: `key` prop.

---

## Rule 4: Event Logic in Effect

**Grep pattern**:
```
useEffect\([^)]*\{[^}]*(fetch\(|post\(|navigate|showNotification|alert\(|redirect)
```
**Confirm**: The fetch/navigation/notification is triggered by a user action (form submit, button click), NOT by component display. If triggered by display (analytics), it is valid.

---

## Rule 5: Parent Notification via Effect

**Grep pattern**:
```
useEffect\(\s*\(\)\s*=>\s*\{[^}]*on[A-Z]\w+\(
```
**Confirm**: Effect calls a prop callback like `onChange`, `onUpdate`, `onSelect`. The callback notifies parent of state that was set in a different handler.

---

## Rule 6: Effect Chains

**Detection method**: Count `useEffect` calls per component.

**Step 1** - Find files with 3+ useEffect:
```
useEffect\(
```
Flag files with 3+ matches.

**Step 2** - Read flagged files. Confirm: each Effect sets state that triggers the next Effect. If Effects are independent (different concerns), not a chain.

---

## Rule 7: Missing Cleanup in Data Fetching

**Step 1** - Find fetch in useEffect:
```
useEffect\([^)]*\{[^}]*(fetch\(|axios\.|api\.|\.get\(|\.post\()
```

**Step 2** - Check same Effect for cleanup:
```
return\s*\(\s*\)\s*=>\s*\{|AbortController|ignore\s*=\s*true|cancelled\s*=\s*true
```
If Step 1 matches but Step 2 does not, flag as CRITICAL.

---

## Rule 8: Manual Store Subscription

**Grep pattern**:
```
useEffect\([^)]*\{[^}]*(addEventListener|\.subscribe\(|\.on\()
```
**Confirm**: File does NOT use `useSyncExternalStore`. If it does, the Effect might be a legacy leftover alongside proper implementation.

**Cross-check** (should NOT exist in same file):
```
useSyncExternalStore
```

---

## Rule 9: App Initialization in Effect

**Grep pattern**:
```
useEffect\(\s*\(\)\s*=>\s*\{[^}]*(loadData|checkAuth|initApp|initialize|localStorage)[^}]*\},\s*\[\s*\]\s*\)
```
**Confirm**: Located in root component (App.tsx, main.tsx, index.tsx, layout.tsx). Contains one-time setup logic. Not DOM-related initialization.

---

## False Positive Checklist

Before confirming ANY finding, verify it is NOT:
- Syncing with a non-React widget (jQuery, D3, map library)
- Syncing with browser API (IntersectionObserver, ResizeObserver)
- Managing focus, scroll position, or animations
- A legitimate data fetching Effect WITH proper cleanup
- Inside a custom hook that abstracts the Effect properly
