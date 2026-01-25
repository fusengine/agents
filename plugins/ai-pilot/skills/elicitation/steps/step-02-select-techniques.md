---
name: step-02-select-techniques
description: Select elicitation techniques - present 5 options (manual) or auto-select based on code type
prev_step: steps/step-01-analyze-code.md
next_step: steps/step-03-apply-review.md
---

# Step 2: Select Techniques

## MANDATORY EXECUTION RULES:

- 🔴 NEVER present more than 5 techniques in manual mode
- ✅ ALWAYS base selection on Step 1 analysis
- ✅ ALWAYS respect user's mode choice
- 🔍 FOCUS on most impactful techniques

---

## Context Boundaries

**Input from Step 1:**
- `{elicit_mode}`: manual | auto
- `{code_categories}`: detected categories
- `{risk_areas}`: identified risks
- `{recommended_techniques}`: initial recommendations

**Output for Step 3:**
- `{selected_techniques}`: final list to apply
- `{technique_details}`: how to execute each

---

## YOUR TASK:

### Mode: MANUAL

#### 1. Present 5 Most Relevant Techniques

```markdown
"I analyzed the code. For auto-review, I propose these techniques:"

1. **{technique_1}** ({category})
   → {what_it_checks}

2. **{technique_2}** ({category})
   → {what_it_checks}

3. **{technique_3}** ({category})
   → {what_it_checks}

4. **{technique_4}** ({category})
   → {what_it_checks}

5. **{technique_5}** ({category})
   → {what_it_checks}

Choix: [1-5] ou "all" ou "skip"
```

#### 2. Wait for User Response

```
Parse user input:
- "1, 3, 5" → Select techniques 1, 3, 5
- "all"     → Select all 5 techniques
- "skip"    → End elicitation, go to sniper
- "1"       → Select technique 1 only
```

---

### Mode: AUTO

#### 1. Auto-Select Based on Code Type

| Code Type | Auto-Selected Techniques |
|-----------|--------------------------|
| Auth/Security | Security Audit, OWASP Check, Input Validation |
| API Endpoints | Error Handling, Type Coverage, API Contracts |
| Database | N+1 Detection, Migration Safety, Query Optimization |
| UI Components | Accessibility Audit, Edge Cases, Error States |
| Business Logic | SOLID Check, Edge Cases, Unit Test Coverage |
| Mixed | Top technique from each detected category |

#### 2. Silent Selection

```
No user prompt in auto mode.
Directly select 3-5 techniques based on {code_categories}.
```

---

## Technique Quick Reference

### Security (pick when auth/sensitive)
- `SEC-01`: OWASP Top 10 Check
- `SEC-02`: Input Validation Audit
- `SEC-03`: Authentication Flow Review
- `SEC-04`: Authorization Check
- `SEC-05`: Secrets Detection

### Performance (pick when DB/loops)
- `PERF-01`: N+1 Query Detection
- `PERF-02`: Memory Leak Check
- `PERF-03`: Complexity Analysis
- `PERF-04`: Bundle Size Impact

### Architecture (pick when logic)
- `ARCH-01`: SOLID Compliance
- `ARCH-02`: Dependency Analysis
- `ARCH-03`: Coupling Review
- `ARCH-04`: File Size Check (<100 LoC)

### Testing (pick always)
- `TEST-01`: Edge Case Analysis
- `TEST-02`: Error Path Coverage
- `TEST-03`: Boundary Testing

### UX (pick when UI)
- `UX-01`: Accessibility (a11y) Audit
- `UX-02`: Error Message Quality
- `UX-03`: Loading State Check

---

## Output Format

```markdown
## ✅ Techniques Selected

**Mode**: {elicit_mode}
**User Choice**: {user_input} (manual only)

### Selected Techniques
1. **{technique_id}**: {technique_name}
2. **{technique_id}**: {technique_name}
3. **{technique_id}**: {technique_name}

→ Proceeding to Step 3: Apply Review
```

---

## Next Step

→ `step-03-apply-review.md`: Execute each selected technique
