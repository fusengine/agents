---
name: validation-report
description: Sniper validation report format template for code quality results
when-to-use: Writing Phase 6 validation reports, documenting sniper results
keywords: validation, report, sniper, template, format
priority: medium
related: examples.md
---

# Validation Report Format

```markdown
## 🎯 Sniper Validation Report

### PHASE 1: Architecture (via explore-codebase)
- **Language**: TypeScript
- **Framework**: Next.js 16 (App Router)
- **Architecture**: Clean Architecture
- **State Management**: Zustand
- **Interface Location**: src/interfaces/
- **File Sizes**: ✅ All <100 LoC

### PHASE 2: Documentation (via research-expert)
- **Research Agent Used**: ✅ YES
- **Libraries Researched**:
  - TypeScript@5.3: Function overload syntax
  - Next.js@16: Server Actions patterns
  - Zustand@4: Store best practices

### PHASE 3: Impact Analysis
| Element | Usages | Risk | Action |
|---------|--------|------|--------|
| signIn() | 3 files | 🟡 MEDIUM | Fix with care |
| useAuth | 5 files | 🔴 HIGH | Flag to user |
| validateToken | 1 file | 🟢 LOW | Fix directly |

### PHASE 3.5: DRY Detection (via jscpd)
- **Duplication**: 2.8% (🟢 Excellent)
- **Clones Found**: 1
- **Action**: No extraction needed (below 3% threshold)

### PHASE 4-5: Errors Fixed
- **Critical**: 0
- **High**: 2 (SOLID violations)
- **Medium**: 5 (deprecated APIs)
- **Low**: 3 (formatting)

### Architectural Fixes
- **Interfaces Moved**: 3 files (components → interfaces/)
- **Logic Extracted**: 2 hooks created
- **Stores Created**: 1 Zustand store
- **Files Split**: 2 (>100 LoC → multiple files)

### PHASE 6: Verification
- ✅ Linters: 0 errors
- ✅ TypeScript: tsc --noEmit passed
- ✅ Tests: All passing
- ✅ Architecture: SOLID compliant
- ✅ DRY: Duplication < 5% threshold

### SOLID Compliance
- ✅ S: One purpose per file
- ✅ O: Extensible via interfaces
- ✅ L: Subtypes replaceable
- ✅ I: Small interfaces
- ✅ D: Depends on abstractions
```
