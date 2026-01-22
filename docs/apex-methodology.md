# APEX Methodology Documentation

**Analyze → Plan → Execute → eLicit → eXamine**

A systematic development workflow inspired by BMAD-METHOD for producing clean, maintainable, bug-free code.

---

## Table of Contents

1. [Overview](#overview)
2. [Workflow Phases](#workflow-phases)
3. [Commands](#commands)
4. [Elicitation Skill](#elicitation-skill)
5. [Framework Support](#framework-support)
6. [Configuration](#configuration)
7. [Examples](#examples)

---

## Overview

APEX is a 5-phase methodology that ensures every development task follows a rigorous process:

```
┌─────────────────────────────────────────────────────────────────┐
│                     APEX WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│  A - Analyze    → Understand codebase (explore + research)     │
│  P - Plan       → Break down tasks (TodoWrite)                  │
│  E - Execute    → Write code (expert agent)                     │
│  L - eLicit     → Self-review (75 techniques) ← NEW            │
│  X - eXamine    → Validate (sniper agent)                       │
└─────────────────────────────────────────────────────────────────┘
```

### Key Benefits

- **Zero Hallucination**: Complete exploration + research before coding
- **Zero Linter Errors**: Sniper validation with zero tolerance
- **Zero Bugs**: Expert self-review + rigorous validation
- **Maintainable Code**: SOLID principles + established patterns
- **Self-Corrected**: Expert catches own mistakes before validation

---

## Workflow Phases

### Phase 1: ANALYZE (A)

Deep exploration of the codebase before any changes.

**Agents used** (in parallel):
- `explore-codebase`: Map project structure, find patterns
- `research-expert`: Verify documentation, best practices
- `[framework]-expert`: Framework-specific analysis

**Output**: Exploration summary with affected components

### Phase 2: PLAN (P)

Strategic design of the implementation.

**Tool**: `TodoWrite`

**Output**: Step-by-step implementation plan with:
- Task breakdown
- File size estimates (<100 lines each)
- Edge cases identified
- Test strategy

### Phase 3: EXECUTE (E)

Implementation following the plan.

**Rules**:
- Files < 100 lines (split at 90)
- Interfaces in `src/interfaces/` or `Contracts/`
- JSDoc/PHPDoc on all exports
- SOLID principles

### Phase 3.5: eLICIT (L) - NEW

Expert self-review using elicitation techniques.

**3 Modes**:
| Mode | Flag | Description |
|------|------|-------------|
| Auto | `--auto` (default) | Auto-select techniques based on code type |
| Manual | `--manual` | Present 5 techniques, user chooses |
| Skip | `--skip-elicit` | Skip directly to eXamine |

**75 Techniques** in 12 categories:
- Code Quality (7)
- Security (7)
- Performance (6)
- Architecture (6)
- Testing (6)
- Documentation (6)
- UX/Accessibility (6)
- Data Integrity (6)
- Concurrency (6)
- Integration (7)
- Observability (6)
- Maintainability (6)

### Phase 4: eXAMINE (X)

Rigorous validation with sniper agent.

**6-Phase Validation**:
1. explore-codebase
2. research-expert
3. grep usages
4. run linters
5. apply fixes
6. verify ZERO errors

---

## Commands

### `/apex` - Full Workflow

```bash
# Standard usage (auto elicitation)
/apex Add user authentication

# Manual elicitation mode
/apex --manual Add user authentication

# Skip elicitation
/apex --skip-elicit Fix typo in header

# Examples
/apex Add OAuth login with Google
/apex Refactor payment module
/apex Fix authentication bug
```

### `/apex-quick` - Quick Flow

For simple fixes without full workflow.

```bash
/apex-quick Fix typo in login button
/apex-quick Rename getUserData to fetchUser
/apex-quick Update copyright year
```

**Quick Flow Steps**:
1. Locate → Find file and line
2. Fix → Apply minimal change
3. Review → 1 quick technique
4. Verify → Linter check

---

## Elicitation Skill

The elicitation skill enables expert agents to self-review their code.

### Location

```
plugins/ai-pilot/skills/elicitation/
├── SKILL.md                    # Main skill definition
├── steps/                      # Sequential steps
│   ├── step-00-init.md
│   ├── step-01-analyze-code.md
│   ├── step-02-select-techniques.md
│   ├── step-03-apply-review.md
│   ├── step-04-self-correct.md
│   └── step-05-report.md
└── references/
    └── techniques-catalog.md   # 75 techniques
```

### Auto-Detection Matrix

The expert automatically selects techniques based on code type:

| Code Type | Auto-Selected Techniques |
|-----------|--------------------------|
| Auth/Security | SEC-01 (OWASP), SEC-02 (Input), SEC-03 (Auth) |
| API Endpoints | INT-01 (Contract), DOC-01 (Docs), TEST-01 (Edge) |
| Database | PERF-01 (N+1), DATA-02 (Migration), CONC-06 (Transaction) |
| UI Components | UX-01 (a11y), TEST-01 (Edge), ARCH-04 (Size) |
| Business Logic | ARCH-01 (SOLID), TEST-01 (Edge), CQ-01 (Review) |

### Manual Mode Example

```
Expert: "Code complete. For self-review, I propose:"

1. SEC-01: OWASP Top 10 Check
2. ARCH-01: SOLID Compliance
3. TEST-01: Edge Case Analysis
4. PERF-01: N+1 Query Detection
5. DOC-03: JSDoc Coverage

Choice: [1-5] or "all" or "skip"

User: "1, 3"

Expert applies SEC-01, TEST-01 → Fixes issues → Reports
```

### Elicitation Report

```
## 🟣 Elicitation Report

Mode: auto
Techniques Applied: 3
Issues Found: 2
Issues Fixed: 2

### Applied Techniques
1. SEC-01: OWASP → 1 issue fixed
2. SEC-02: Input → OK
3. SEC-03: Auth → 1 issue fixed

### Corrections Made
- Added CSRF token validation
- Fixed token expiry handling

→ Ready for eXamine (sniper)
```

---

## Framework Support

APEX provides framework-specific references for:

### Next.js
```
plugins/ai-pilot/skills/apex/references/nextjs/
├── 00-init-branch.md
├── 01-analyze-code.md
├── 02-features-plan.md
├── 03-execution.md
├── 03.5-elicit.md      # Server Components, Server Actions
├── 04-validation.md
└── ...
```

**Next.js Elicitation Focus**:
- Server vs Client boundary
- Server Actions security (Zod, CSRF)
- Hydration safety
- Data fetching patterns

### React
```
plugins/ai-pilot/skills/apex/references/react/
```

**React Elicitation Focus**:
- Component architecture
- Hook rules
- State management (Zustand)
- Accessibility (a11y)

### Laravel
```
plugins/ai-pilot/skills/apex/references/laravel/
```

**Laravel Elicitation Focus**:
- Single action controllers
- Eloquent N+1 prevention
- Form Request validation
- Service layer patterns

### Swift
```
plugins/ai-pilot/skills/apex/references/swift/
```

**Swift Elicitation Focus**:
- Swift 6 concurrency (@MainActor, Sendable)
- SwiftUI best practices
- Protocol-oriented design
- Memory management

---

## Configuration

### Global Settings (CLAUDE.md)

```yaml
# In ~/.claude/CLAUDE.md
apex:
  elicit_mode: auto  # auto | manual | skip
```

### Command-Line Flags

| Flag | Description |
|------|-------------|
| `--auto` | Auto-select techniques (default) |
| `--manual` | Present 5 techniques for user choice |
| `--skip-elicit` | Skip elicitation phase |

---

## Examples

### Example 1: Adding Authentication (Full APEX)

```bash
/apex Add OAuth login with Google
```

**Phase A - Analyze**:
```
explore-codebase: Next.js 16, App Router, Prisma
research-expert: Better Auth v2 docs, Google OAuth
nextjs-expert: Existing auth patterns
```

**Phase P - Plan**:
```
1. lib/auth.ts (30 lines) - Better Auth config
2. app/api/auth/[...all]/route.ts (15 lines)
3. components/LoginButton.tsx (25 lines)
4. middleware.ts modification (10 lines)
```

**Phase E - Execute**:
```
nextjs-expert codes all 4 files
```

**Phase L - eLicit (auto)**:
```
Code type detected: Auth

Auto-selected:
- SEC-01: OWASP → Added secure cookies
- SEC-02: Input → Added CSRF token
- SEC-03: Auth → Fixed token expiry

3 corrections made
```

**Phase X - eXamine**:
```
sniper: 0 errors (expert already fixed issues)
```

### Example 2: Quick Fix

```bash
/apex-quick Fix typo in login button
```

```
1. LOCATE: Grep "login" → LoginButton.tsx:23
2. FIX: "Logi" → "Login"
3. REVIEW: MAINT-02 (convention) → OK
4. VERIFY: eslint → 0 errors

✅ Done
```

### Example 3: Manual Elicitation

```bash
/apex --manual Add payment processing
```

```
Expert: "Code complete. For self-review:"

1. SEC-01: OWASP Top 10
2. SEC-05: Secrets Detection
3. DATA-03: Data Consistency
4. INT-01: API Contract
5. OBS-01: Logging Quality

User: "all"

Expert applies all 5 techniques...
```

---

## Best Practices

### DO

✅ Use `--auto` for most tasks (fastest)
✅ Use `--manual` for security-critical code
✅ Use `/apex-quick` for simple fixes
✅ Let expert self-correct before sniper
✅ Review elicitation report

### DON'T

❌ Skip elicitation for new features
❌ Use `--skip-elicit` for security code
❌ Ignore technique recommendations
❌ Override expert corrections

---

## Troubleshooting

### Elicitation Not Running

Check that expert agent has `elicitation` in skills:
```yaml
skills: ..., elicitation
```

### Too Many Techniques Selected

Use `--manual` mode to control selection:
```bash
/apex --manual Add feature
```

### Sniper Still Finding Issues

Increase elicitation thoroughness:
```bash
# Manual mode, select "all"
/apex --manual Add feature
> Choice: all
```

---

## Version History

| Version | Changes |
|---------|---------|
| 1.7.0 | Initial APEX + BMAD integration |
| 1.7.1 | Added elicitation skill with 75 techniques |
| 1.7.2 | Added /apex-quick command |
| 1.7.3 | Framework-specific 03.5-elicit references |
