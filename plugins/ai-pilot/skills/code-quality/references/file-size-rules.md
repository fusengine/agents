---
name: file-size-rules
description: File size limits, LoC calculation, and split strategies for code quality
when-to-use: Checking file sizes, splitting large files
keywords: file size, LoC, lines of code, split, refactor
priority: high
related: solid-validation.md, architecture-patterns.md
---

# File Size Rules

## Limits

| Metric | Limit | Action |
|--------|-------|--------|
| **LoC** (code only) | < 100 | ✅ OK |
| **LoC** >= 100, **Total** < 200 | | ✅ OK (well-documented) |
| **Total** >= 200 | | ❌ SPLIT required |

## LoC Calculation

```
LoC = Total lines - Comment lines - Blank lines

Comment patterns:
- JS/TS: //, /* */, /** */
- Python: #, """ """, ''' '''
- Go: //, /* */
- PHP: //, #, /* */
- Rust: //, /* */, ///
```

## Split Strategy

```
component.tsx (150 lines) → SPLIT INTO:
├── Component.tsx (40 lines) - orchestrator
├── ComponentHeader.tsx (30 lines)
├── ComponentContent.tsx (35 lines)
├── useComponentLogic.ts (45 lines) - hook
└── index.ts (5 lines) - barrel export
```
