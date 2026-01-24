---
name: code-quality
description: Code quality validation with linters, SOLID principles, error detection, and architecture compliance across all languages.
argument-hint: "[file-or-directory]"
user-invocable: false
---

# Code Quality Skill

## 🚨 MANDATORY 6-PHASE WORKFLOW

```
PHASE 1: Exploration (explore-codebase) → BLOCKER
PHASE 2: Documentation (research-expert) → BLOCKER
PHASE 3: Impact Analysis (Grep usages) → BLOCKER
PHASE 4: Error Detection (linters)
PHASE 5: Precision Correction (with docs + impact)
PHASE 6: Verification (re-run linters, tests)
```

**CRITICAL**: Phases 1-3 are BLOCKERS. Never skip them.

---

## PHASE 1: Architecture Exploration

**Launch explore-codebase agent FIRST**:
```
> Use Task tool with subagent_type="explore-codebase"
```

**Gather**:
1. Programming language(s) detected
2. Existing linter configs (.eslintrc, .prettierrc, pyproject.toml)
3. Package managers and installed linters
4. Project structure and conventions
5. Framework versions (package.json, go.mod, Cargo.toml)
6. Architecture patterns (Clean, Hexagonal, MVC)
7. State management (Zustand, Redux, Context)
8. Interface/types directories location

---

## PHASE 2: Documentation Research

**Launch research-expert agent**:
```
> Use Task tool with subagent_type="research-expert"
> Request: Verify [library/framework] documentation for [error type]
> Request: Find [language] best practices for [specific issue]
```

**Request for each error**:
- Official API documentation
- Current syntax and deprecations
- Best practices for error patterns
- Version-specific breaking changes
- Security advisories
- Language-specific SOLID patterns

---

## PHASE 3: Impact Analysis

**For EACH element to modify**:

### Step 1: Search Usages
```bash
# TypeScript/JavaScript
grep -r "functionName" --include="*.{ts,tsx,js,jsx}"

# Python
grep -r "function_name" --include="*.py"

# Go
grep -r "FunctionName" --include="*.go"
```

### Step 2: Risk Assessment
| Risk | Criteria | Action |
|------|----------|--------|
| 🟢 LOW | Internal, 0-1 usages | Proceed |
| 🟡 MEDIUM | 2-5 usages, compatible | Proceed with care |
| 🔴 HIGH | 5+ usages OR breaking | Flag to user FIRST |

### Step 3: Document Impact
```markdown
| Element | Usages Found | Risk | Files Affected |
|---------|--------------|------|----------------|
| signIn() | 3 files | 🟡 | login.tsx, auth.ts, middleware.ts |
```

---

## Linter Commands
See [references/linter-commands.md](references/linter-commands.md) for language-specific commands.

---

## Error Priority Matrix

| Priority | Type | Examples | Action |
|----------|------|----------|--------|
| **Critical** | Security | SQL injection, XSS, CSRF, auth bypass | Fix IMMEDIATELY |
| **High** | Logic | SOLID violations, memory leaks, race conditions | Fix same session |
| **Medium** | Performance | N+1 queries, deprecated APIs, inefficient algorithms | Fix if time |
| **Low** | Style | Formatting, naming, missing docs | Fix if time |

---

## SOLID Validation

### S - Single Responsibility
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

### O - Open/Closed
- ✅ Extensible via interfaces/abstractions
- ❌ Modifying existing code for new features

### L - Liskov Substitution
- ✅ Subtypes work as drop-in replacements
- ❌ Subclass throws where parent doesn't

### I - Interface Segregation
- ✅ Small, focused interfaces
- ❌ One huge interface with 20 methods

### D - Dependency Inversion
- ✅ Depend on abstractions (interfaces)
- ❌ Import concrete implementations directly

---

## File Size Rules

### Limits
| Metric | Limit | Action |
|--------|-------|--------|
| **LoC** (code only) | < 100 | ✅ OK |
| **LoC** >= 100, **Total** < 200 | | ✅ OK (well-documented) |
| **Total** >= 200 | | ❌ SPLIT required |

### Calculation
```
LoC = Total lines - Comment lines - Blank lines

Comment patterns:
- JS/TS: //, /* */, /** */
- Python: #, """ """, ''' '''
- Go: //, /* */
- PHP: //, #, /* */
- Rust: //, /* */, ///
```

### Split Strategy
```
component.tsx (150 lines) → SPLIT INTO:
├── Component.tsx (40 lines) - orchestrator
├── ComponentHeader.tsx (30 lines)
├── ComponentContent.tsx (35 lines)
├── useComponentLogic.ts (45 lines) - hook
└── index.ts (5 lines) - barrel export
```

---

## Architecture Rules
See [references/architecture-patterns.md](references/architecture-patterns.md) for project structures and patterns.

---

## Validation Report Format

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

### SOLID Compliance
- ✅ S: One purpose per file
- ✅ O: Extensible via interfaces
- ✅ L: Subtypes replaceable
- ✅ I: Small interfaces
- ✅ D: Depends on abstractions
```

---

## Complete Workflow Example
See [references/examples.md](references/examples.md) for detailed walkthrough.

---

## Forbidden Behaviors

### Workflow Violations
- ❌ Skip PHASE 1 (explore-codebase)
- ❌ Skip PHASE 2 (research-expert)
- ❌ Skip PHASE 3 (impact analysis)
- ❌ Jump to corrections without completing Phases 1-3
- ❌ Proceed when BLOCKER is active

### Code Quality Violations
- ❌ Leave ANY linter errors unfixed
- ❌ Apply fixes that introduce new errors
- ❌ Ignore SOLID violations
- ❌ Create tests if project has none

### Architecture Violations
- ❌ Interfaces in component files (ZERO TOLERANCE)
- ❌ Business logic in components (must be in hooks)
- ❌ Monolithic components (must section)
- ❌ Files >100 LoC without split
- ❌ Local state for global data (use stores)

### Safety Violations
- ❌ High-risk changes without user approval
- ❌ Breaking backwards compatibility silently
- ❌ Modifying public APIs without deprecation
