---
name: react-effects-audit
description: "Use when auditing React or Next.js components for unnecessary or unsafe useEffect usage -- detects 9 anti-patterns from \"You Might Not Need an Effect\"."
argument-hint: "[file-or-directory]"
user-invocable: true
---

<objective>
React Effects Audit scans a target file or directory for the 9 `useEffect` anti-patterns described in React's official "You Might Not Need an Effect" guidance -- derived state, expensive calculations, state resets, event logic, parent notification, effect chains, missing fetch cleanup, manual store subscriptions, and app-init logic -- each flagged with a severity (CRITICAL/WARNING/INFO), its exact location, and a proposed fix.

When the target is a Next.js or React project, it cross-references the matching SOLID skill (`solid-nextjs` or `solid-react`) to also catch architecture-level violations like data-fetching Effects that should be Server Components or TanStack Query instead. It never auto-fixes without showing the finding first.
</objective>

**Target:** $ARGUMENTS

# React Effects Audit

## Overview

Scan React codebases to detect unnecessary `useEffect` usage based on official React documentation ("You Might Not Need an Effect"). Reports anti-patterns with severity, location, and recommended fixes.

---

## Agent Workflow (MANDATORY)

```
PHASE 1: Scan target files (Glob *.tsx, *.jsx, *.ts, *.js)
PHASE 2: Detect anti-patterns (Grep detection rules)
PHASE 3: Analyze context (Read flagged files)
PHASE 4: Generate report with fixes
```

---

## Anti-Pattern Summary

| # | Anti-Pattern | Severity | Detection |
|---|---|---|---|
| 1 | Derived state in Effect | WARNING | `useEffect` + `setState` from other state/props |
| 2 | Expensive calculation in Effect | WARNING | `useEffect` + `setState` with filter/map/reduce |
| 3 | State reset via Effect | WARNING | `useEffect` resets state when prop changes |
| 4 | Event logic in Effect | CRITICAL | User interaction logic inside `useEffect` |
| 5 | Parent notification via Effect | WARNING | `useEffect` calls parent `onChange`/`onUpdate` |
| 6 | Effect chains | CRITICAL | Multiple `useEffect` triggering each other |
| 7 | Missing cleanup in fetch | CRITICAL | `useEffect` fetch without cleanup/AbortController |
| 8 | Manual store subscription | WARNING | `addEventListener`/`subscribe` in `useEffect` |
| 9 | App init in Effect | INFO | One-time init logic in `useEffect(fn, [])` |

---

## Severity Levels

| Level | Meaning | Action |
|---|---|---|
| CRITICAL | Bugs, race conditions, memory leaks | Fix immediately |
| WARNING | Performance issues, unnecessary re-renders | Fix same session |
| INFO | Readability, minor inefficiency | Fix if time allows |

---

## Reference Guide

### Skill References

| Reference | When to Consult |
|---|---|
| [anti-patterns.md](references/anti-patterns.md) | Understanding each anti-pattern |
| [detection-rules.md](references/detection-rules.md) | Grep patterns for scanning |
| [fix-patterns-core.md](references/fix-patterns-core.md) | Fix examples #1-5 |
| [fix-patterns-advanced.md](references/fix-patterns-advanced.md) | Fix examples #6-9 |
| [report-format.md](references/report-format.md) | Generating audit report |

### SOLID Cross-References (MANDATORY)

This audit complements existing SOLID skills. Always cross-reference:

| Project Type | SOLID Skill | Key Rule |
|---|---|---|
| **Next.js** | `fuse-nextjs:solid-nextjs` | No `useEffect` for data fetching; use Server Components |
| **React** | `fuse-react:solid-react` | No `useEffect` for data fetching; use TanStack Query |

**Integration**: When auditing a Next.js or React project, also load the corresponding SOLID skill to check architecture-level violations (file size, interface separation, business logic in components).

---

## Quick Start

```
1. Glob **/*.{tsx,jsx} in target directory
2. Detect project type (next.config.* → Next.js, package.json → React)
3. Load corresponding SOLID skill references if applicable
4. For each detection rule in detection-rules.md:
   → Grep pattern across all files
   → Read flagged files for context analysis
   → Confirm or dismiss (false positive check)
5. For each confirmed finding:
   → Identify severity from anti-patterns.md
   → Propose fix from fix-patterns-core.md or fix-patterns-advanced.md
   → Cross-check with SOLID rules (SRP, file size, hooks separation)
6. Output report using report-format.md
```

---

## React 19+ Considerations

| Feature | Impact on Audit |
|---|---|
| **React Compiler** | Auto-memoizes; `useMemo` less needed but Effect anti-patterns still apply |
| **useEffectEvent** | Stable in 19.2; solves stale closure in Effects without adding deps |
| **Activity API** | Alternative to conditional rendering; reduces mount/unmount Effects |
| **useSyncExternalStore** | Replaces manual subscription Effects (anti-pattern #8) |
| **Server Components** | Eliminates many data-fetching Effects entirely |

---

## Forbidden Behaviors

- Do NOT auto-fix without showing the finding first
- Do NOT flag Effects that synchronize with external systems (valid use)
- Do NOT flag data fetching Effects that have proper cleanup
- Do NOT ignore context: always Read the file before confirming a finding
