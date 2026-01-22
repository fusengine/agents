---
name: step-05-report
description: Generate final elicitation report before sniper validation
prev_step: steps/step-04-self-correct.md
next_step: null
---

# Step 5: Elicitation Report

## MANDATORY EXECUTION RULES:

- 🔴 NEVER skip the report
- ✅ ALWAYS summarize all corrections
- ✅ ALWAYS list deferred issues for sniper
- 🔍 FOCUS on clear handoff to sniper

---

## Context Boundaries

**Input from Step 4:**
- `{corrections_made}`: fixes applied
- `{remaining_issues}`: deferred items
- `{files_modified}`: changed files

**Output:**
- Final report for user
- Handoff context for sniper (Phase X)

---

## YOUR TASK:

### 1. Generate Summary Statistics

```
Calculate:
- Total issues found
- Issues fixed by severity
- Issues deferred
- Files modified
- Techniques applied
```

### 2. Create Handoff for Sniper

```
Sniper needs to know:
- Which files were modified in elicitation
- What issues remain (Low severity)
- What was already verified (skip redundant checks)
```

### 3. Generate Final Report

---

## Report Template

```markdown
## 🟣 Elicitation Report

### Execution Summary
| Metric | Value |
|--------|-------|
| **Mode** | {manual/auto} |
| **Expert Agent** | {expert_name} |
| **Techniques Applied** | {count} |
| **Issues Found** | {count} |
| **Issues Fixed** | {count} |
| **Files Modified** | {count} |

---

### Techniques Applied

| # | Technique | Findings | Status |
|---|-----------|----------|--------|
| 1 | {technique_name} | {count} issues | ✅ Applied |
| 2 | {technique_name} | {count} issues | ✅ Applied |

---

### Issues Fixed (Self-Corrected)

| # | Issue | Severity | File | Fix |
|---|-------|----------|------|-----|
| 1 | {description} | 🔴 | {file} | {fix_summary} |
| 2 | {description} | 🟠 | {file} | {fix_summary} |

---

### Issues Deferred (For Sniper)

| # | Issue | Severity | File | Reason |
|---|-------|----------|------|--------|
| 1 | {description} | 🟢 | {file} | Low priority |

---

### Files Modified

```
{file_1} - {change_summary}
{file_2} - {change_summary}
```

---

### Handoff to Sniper (Phase X)

**Already Verified** (skip in sniper):
- [ ] {technique_1} applied
- [ ] {technique_2} applied

**Remaining Checks** (sniper should verify):
- [ ] Linter compliance
- [ ] TypeScript compilation
- [ ] Deferred low-severity issues
- [ ] Integration with rest of codebase

---

### Elicitation Complete

✅ Self-review finished
✅ Critical/High issues addressed
✅ Ready for sniper validation

→ **Proceeding to Phase X: eXamine (sniper)**
```

---

## Success Criteria

Before marking elicitation complete:

- [ ] All Critical issues fixed
- [ ] All High issues fixed
- [ ] Medium issues fixed or justified deferral
- [ ] Low issues documented for sniper
- [ ] Report generated
- [ ] Handoff context provided

---

## Transition to Sniper

After this step, the workflow continues to **Phase X (eXamine)** with sniper agent.

Sniper will:
1. Run linters (should find minimal issues)
2. Verify TypeScript/compilation
3. Check deferred low-severity items
4. Final architecture compliance

**Expected**: Sniper finds 0-2 issues if elicitation was thorough.

---

## End of Elicitation Skill

```
┌─────────────────────────────────────────────────────────┐
│  ELICITATION COMPLETE                                   │
│                                                         │
│  ✅ Step 0: Init         - Context loaded              │
│  ✅ Step 1: Analyze      - Code categorized            │
│  ✅ Step 2: Select       - Techniques chosen           │
│  ✅ Step 3: Apply        - Review executed             │
│  ✅ Step 4: Self-Correct - Issues fixed                │
│  ✅ Step 5: Report       - Summary generated           │
│                                                         │
│  → HANDOFF TO SNIPER (Phase X)                         │
└─────────────────────────────────────────────────────────┘
```
