---
description: APEX Methodology - The systematic Analyze-Plan-Execute-eLicit-eXamine approach for intelligent development. Eliminates hallucinations, errors, and bugs to produce clean, maintainable code.
argument-hint: "[--auto] [--skip-elicit] <task description>"
---

# APEX: Analyze-Plan-Execute-eLicit-eXamine

Execute the comprehensive APEX methodology for professional-grade development.

**Complete documentation**: `~/.claude/docs/core/apex.md`

---

## Phase 1: ANALYZE (Deep Exploration)

> Use explore-codebase to understand relevant parts of the system

**Goals**:
- Identify where changes need to be made
- Understand existing patterns and conventions
- Map dependencies and impacts
- Locate relevant tests

**Deliverable**: Exploration summary with affected components

---

## Phase 2: PLAN (Strategic Design)

> Use research-expert to validate approach against best practices

**Goals**:
- Design solution following project patterns
- Identify edge cases and error handling
- Plan test strategy
- Estimate impact and complexity

**Deliverable**: Implementation plan with step-by-step approach

**Plan Format**:
```markdown
### Implementation Steps
1. [Component A]: [Required changes]
2. [Component B]: [Required changes]
3. [Tests]: [Test cases to add]

### Edge Cases
- [Case 1]: [Handling approach]
- [Case 2]: [Handling approach]

### Testing Strategy
- Unit tests: [What to test]
- Integration tests: [Scenarios]
- Manual testing: [Steps]
```

---

## Phase 3: EXECUTE (Precise Implementation)

Implement the solution:
1. Follow the plan step-by-step
2. Maintain existing code style and patterns
3. Add inline documentation for complex logic
4. Create/update tests alongside code

**Quality Standards**:
- SOLID principles without exception
- DRY, KISS, YAGNI
- Max 100 lines per file
- Separate types/interfaces
- Security validation (OWASP Top 10)

---

## Phase 3.5: eLICIT (Self-Review) - NEW

> Expert agent self-reviews and self-corrects before sniper validation

**Modes**:
- `--auto`: Auto-select techniques based on code type (default)
- `--manual`: Present 5 techniques, user chooses
- `--skip-elicit`: Skip directly to eXamine

**Workflow**:
```
┌─────────────────────────────────────────────────────────┐
│  ELICIT (6 steps)                                       │
│                                                         │
│  Init → Analyze → Select → Apply → Correct → Report    │
│                                                         │
│  Expert applies elicitation techniques from 12 cats:   │
│  - Security (7)      - Performance (6)                 │
│  - Architecture (6)  - Testing (6)                     │
│  - Documentation (6) - UX/a11y (6)                     │
│  - Data (6)          - Concurrency (6)                 │
│  - Integration (7)   - Observability (6)               │
│  - Code Quality (7)  - Maintainability (6)             │
│                                                         │
│  Total: 75 techniques                                   │
└─────────────────────────────────────────────────────────┘
```

**Auto-Detection Matrix**:
| Code Type | Auto-Selected Techniques |
|-----------|--------------------------|
| Auth/Security | SEC-01, SEC-02, SEC-03 |
| API Endpoints | INT-01, DOC-01, TEST-01 |
| Database | PERF-01, DATA-02, CONC-06 |
| UI Components | UX-01, TEST-01, ARCH-04 |
| Business Logic | ARCH-01, TEST-01, CQ-01 |

**Benefits**:
- Expert catches own mistakes before sniper
- Faster validation (less sniper corrections)
- Knowledge retention (expert learns from self-review)

**Full skill**: `skills/elicitation/SKILL.md`

---

## Phase 4: eXAMINE (Rigorous Validation)

Comprehensive validation:

### 1. **Run Linters** (ZERO TOLERANCE):
   ```bash
   bun run lint
   eslint .
   prettier --check .
   tsc --noEmit
   ```

### 2. **Run Tests**:
   ```bash
   bun test
   bun test:integration
   pytest
   ```

### 3. **Build Verification**:
   ```bash
   bun run build
   npm run build
   ```

### 4. **Security Audit**:
   ```bash
   npm audit fix
   snyk test
   ```

### 5. **Research Validation**:
   > Use research-expert to confirm:
   - Solutions are up-to-date
   - No deprecated APIs used
   - Best practices followed

### 6. **Manual Testing**:
   - Execute test plan scenarios
   - Verify edge cases
   - Check error handling

### 7. **Final Verification**:
   > Use sniper to ensure 0 linter errors

**Deliverable**: Tested, validated code ready for deployment

---

## APEX Guarantees

✅ **Zero Hallucination**: Complete exploration + research
✅ **Zero Linter Errors**: Sniper with zero tolerance
✅ **Zero Bugs**: Exhaustive tests + rigorous validation
✅ **Maintainable Code**: SOLID + established patterns
✅ **Self-Corrected**: Expert auto-review before validation (NEW)

---

## Usage

**Arguments**:
- $ARGUMENTS specifies the feature/task to implement

**Examples**:
- `/apex Add user profile editing` → Full APEX for feature
- `/apex Fix authentication bug` → APEX for bug fix
- `/apex Refactor payment module` → APEX for refactoring

---

## Metrics

- **Production Bugs**: -90%
- **Debug Time**: -70%
- **Development Speed**: +300% (parallel agents)
- **Code Maintainability**: +200%
- **Code Confidence**: 98%

---

**See full documentation**: `~/.claude/docs/core/apex.md`
