---
name: 03-execution
description: Implement code following plan (APEX Phase E)
prev_step: references/02-features-plan.md
next_step: references/03.5-elicit.md
---

# 03 - Execution

**Implement code following plan (APEX Phase E).**

## When to Use

- After plan is complete and approved
- Follow TaskCreate task order
- Update progress as you go

---

## Execution Order

### Strict Sequence

```text
1. Interfaces/Types/Protocols FIRST
2. Constants/Config
3. Utilities/Helpers
4. Main implementation
5. Integration points
```

### Why This Order?

```text
✅ Types catch errors early
✅ Utilities are reusable
✅ Main code has dependencies ready
✅ Easier to test incrementally
```

---

## Code Quality Rules

### File Size (ABSOLUTE)

```text
🚨 STOP at 90 lines → Split immediately
❌ NEVER exceed 100 lines
📊 Target: 50-80 lines per file
```

### Split Triggers

```text
If approaching 90 lines:
1. STOP writing
2. Identify logical boundaries
3. Extract to new file
4. Import and continue
```

---

## Documentation (Language-Specific)

Use your language's documentation standard:

| Language | Standard | Example |
| --- | --- | --- |
| TypeScript/JS | JSDoc | `/** @param name Description */` |
| PHP | PHPDoc | `/** @param string $name */` |
| Python | Docstrings | `"""Description."""` |
| Swift | DocC | `/// Description` |
| Go | GoDoc | `// FunctionName does X` |
| Rust | RustDoc | `/// Description` |

### Documentation Must Include

```text
✅ Brief function purpose
✅ Parameter descriptions
✅ Return value description
✅ Error/exception cases
✅ Usage example (complex functions)
```

---

## Pattern Compliance

### Follow Existing Patterns

```text
✅ Match naming conventions found in 01-analyze
✅ Use existing utilities (don't duplicate)
✅ Follow architectural patterns
✅ Consistent import ordering
```

### Interface Location (Language-Specific)

| Language | Location |
| --- | --- |
| TypeScript/JS | `src/interfaces/` or `src/types/` |
| PHP/Laravel | `app/Contracts/` |
| Swift | `Sources/Protocols/` |
| Go | Same package or `internal/` |
| Python | `interfaces/` or type hints |

---

## Commit Strategy

### Atomic Commits

```text
✅ One logical change per commit
✅ Commit after each task completion
✅ Conventional commit format
```

### Commit Format

```text
<type>(<scope>): <description>

Types: feat, fix, refactor, docs, test, chore
Scope: component/feature name
Description: imperative mood, <50 chars
```

### Examples

```bash
feat(auth): add login validation
refactor(api): extract fetch utilities
test(auth): add login component tests
```

---

## Progress Tracking

### Update tasks via TaskUpdate

```text
After each task:
1. Mark task as completed (TaskUpdate status: completed)
2. Note any deviations
3. Update estimates if needed
4. Flag blockers immediately (addBlockedBy)
```

---

## Error Handling

### During Execution

```text
If you encounter:

1. Unexpected complexity
   → STOP, reassess, update plan

2. Missing dependency
   → Add to plan, implement first

3. File size limit approaching
   → Split immediately, don't push limits

4. Pattern conflict
   → Follow existing pattern, document deviation

5. API discrepancy
   → Re-verify with research-expert
```

---

## Anti-Patterns

```text
❌ Skip interfaces, write inline types
❌ Create files >100 lines
❌ Duplicate existing utilities
❌ Ignore existing patterns
❌ Large commits with multiple features
❌ No documentation/comments
❌ Push without local testing
```

---

## Validation Checklist

```text
□ Interfaces/types created first
□ All files <100 lines
□ Documentation on all functions
□ Existing patterns followed
□ No duplicate utilities
□ Atomic commits made
□ Tasks updated via TaskUpdate
□ Local testing passed
```

---

## Update Task Phase

At the **start** of this phase, record it in `.claude/apex/task.json`:

```bash
jq --arg p "execution" '.tasks[.current_task].phase = $p' .claude/apex/task.json \
  > .claude/apex/task.json.tmp && mv .claude/apex/task.json.tmp .claude/apex/task.json
```

---

## Next Phase

→ Proceed to `04-validation.md`
