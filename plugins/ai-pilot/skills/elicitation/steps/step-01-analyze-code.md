---
name: step-01-analyze-code
description: Deep analysis of code written during Execute phase to determine relevant techniques
prev_step: steps/step-00-init.md
next_step: steps/step-02-select-techniques.md
---

# Step 1: Analyze Written Code

## MANDATORY EXECUTION RULES:

- 🔴 NEVER guess code type without reading files
- ✅ ALWAYS read each modified file
- ✅ ALWAYS categorize code accurately
- 🔍 FOCUS on identifying review-worthy aspects

---

## Context Boundaries

**Input from Step 0:**
- `{elicit_mode}`: manual | auto
- `{code_files}`: list of files to analyze
- `{code_type}`: initial detection
- `{expert_agent}`: coding expert

**Output for Step 2:**
- `{code_categories}`: detailed categorization
- `{risk_areas}`: potential issues detected
- `{recommended_techniques}`: top 5-10 techniques

---

## YOUR TASK:

### 1. Read All Modified Files

```
For each file in {code_files}:
  → Read content
  → Identify patterns
  → Note complexity areas
```

### 2. Categorize Code

| Category | Detection Signals |
|----------|-------------------|
| **Auth/Security** | login, password, token, session, OAuth, JWT |
| **API Endpoints** | route, controller, handler, request, response |
| **Database** | query, model, migration, prisma, eloquent |
| **UI Components** | component, render, JSX, template, view |
| **Business Logic** | service, useCase, calculate, process |
| **Config** | env, config, settings, constants |
| **Tests** | test, spec, describe, it, expect |

### 3. Identify Risk Areas

```
Scan for:
- Hardcoded values (secrets, URLs)
- Missing error handling (try/catch, if err)
- Missing validation (input, params)
- Large functions (>50 lines)
- Complex conditionals (>3 nested)
- Missing types (any, unknown)
- N+1 queries (loops with DB calls)
- Missing accessibility (ARIA, alt)
```

### 4. Map to Technique Categories

```
Based on {code_categories} and {risk_areas}:

Auth/Security → Security techniques (7)
API Endpoints → Integration + Error Handling (13)
Database → Data + Performance (12)
UI Components → UX + Accessibility (12)
Business Logic → Architecture + Testing (12)
```

---

## Output Format

```markdown
## 📊 Code Analysis Complete

### Code Categories Detected
- **Primary**: {main_category}
- **Secondary**: {secondary_categories}

### Risk Areas Identified
| Area | Location | Severity |
|------|----------|----------|
| {risk_1} | {file:line} | 🔴/🟡/🟢 |

### Recommended Technique Categories
1. {category_1} - {reason}
2. {category_2} - {reason}
3. {category_3} - {reason}

→ Proceeding to Step 2: Select Techniques
```

---

## Next Step

→ `step-02-select-techniques.md`: Choose specific techniques (manual) or auto-select
