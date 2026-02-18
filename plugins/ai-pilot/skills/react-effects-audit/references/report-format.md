---
name: report-format
description: Audit report template for React Effects findings
when-to-use: Phase 4 output, generating final audit report
keywords: report, template, audit, summary, findings
priority: medium
related: anti-patterns.md, fix-patterns.md
---

# React Effects Audit Report Format

## Report Template

```markdown
# React Effects Audit Report

**Target**: [directory or file path]
**Files scanned**: [count]
**Files with useEffect**: [count]
**Total useEffect calls**: [count]
**Findings**: [count] (CRITICAL: [n], WARNING: [n], INFO: [n])

---

## Findings

### [SEVERITY] #[n]: [Anti-Pattern Name]

**File**: `path/to/file.tsx:42`
**Pattern**: [Which anti-pattern from the 9]

**Current code**:
```tsx
// The problematic code
```

**Problem**: [Why this is an issue - 1-2 sentences]

**Recommended fix**:
```tsx
// The corrected code
```

---

## Summary Table

| # | File | Line | Anti-Pattern | Severity | Status |
|---|------|------|--------------|----------|--------|
| 1 | src/components/Form.tsx | 42 | Derived State | WARNING | Open |
| 2 | src/hooks/useData.ts | 18 | Missing Cleanup | CRITICAL | Open |

---

## Statistics

- **useEffect usage score**: [GOOD/NEEDS WORK/CRITICAL]
  - GOOD: 0-2 findings, no CRITICAL
  - NEEDS WORK: 3-5 findings or 1 CRITICAL
  - CRITICAL: 6+ findings or 2+ CRITICAL

## Valid Effects Found

[List Effects that are correctly used - syncing with external systems,
proper cleanup, etc. This validates the audit is not over-flagging.]
```

---

## Severity Icons

| Level | Icon | Label |
|---|---|---|
| CRITICAL | `[CRITICAL]` | Bugs, race conditions |
| WARNING | `[WARNING]` | Performance, double renders |
| INFO | `[INFO]` | Readability, minor |
