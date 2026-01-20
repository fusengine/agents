# 05 - Review

**Self-review and prepare for code review.**

## When to Use

- After validation passes
- Before creating PR
- As final quality check

---

## Self-Review Checklist

### Code Quality

```text
□ Code is readable without comments explaining "what"
□ Comments explain "why" for complex logic
□ No magic numbers (use constants)
□ No hardcoded strings (use i18n/constants)
□ Error handling is comprehensive
□ Edge cases are handled
```

### Architecture (SOLID)

```text
□ Single Responsibility: Each file does one thing
□ Open/Closed: Extensible without modification
□ Liskov Substitution: Subtypes are substitutable
□ Interface Segregation: Small, focused interfaces
□ Dependency Inversion: Depend on abstractions
```

### Security

```text
□ No sensitive data in code
□ Input validation present
□ SQL injection prevented (if applicable)
□ XSS prevented (if applicable)
□ Auth checks in place (if applicable)
□ No secrets committed
```

---

## Diff Review

### Review Your Changes

```bash
# See all changes
git diff main...HEAD

# See changed files
git diff main...HEAD --stat

# Review file by file
git diff main...HEAD -- path/to/file
```

### What to Look For

```text
□ Unintended changes?
□ Debug code left in?
□ Print/log statements to remove?
□ TODO comments addressed?
□ Commented-out code removed?
```

---

## Change Summary

### Document Changes

```markdown
## Changes Made

### Added
- [new files/features]

### Modified
- [changed files and why]

### Removed
- [deleted files/code]

### Dependencies
- [new packages added]

## Impact
- [areas affected by changes]

## Testing Done
- [manual testing performed]
- [automated tests added/run]
```

---

## Pre-PR Checklist

### Required

```text
□ All validation checks pass
□ Tests added for new code
□ Tests pass locally
□ Build succeeds
□ Documentation updated
□ CHANGELOG entry (if required)
```

### Recommended

```text
□ Screenshots for UI changes
□ Performance impact assessed
□ Accessibility checked
□ Mobile/responsive tested
□ Browser compatibility verified
```

---

## Review Questions

### Ask Yourself

```text
1. Would I approve this PR if someone else wrote it?
2. Is there anything I'm not proud of?
3. Are there any shortcuts I took?
4. Is this the simplest solution?
5. Will future me understand this?
6. Can this break anything?
```

---

## Common Review Findings

### Code Smells

| Smell | Fix |
| --- | --- |
| Long function | Extract smaller functions |
| Deep nesting | Early returns, extract logic |
| Duplicate code | Extract utility/function |
| Boolean parameters | Use options object |
| Vague naming | Rename for clarity |

### Anti-Patterns

```text
❌ Vague naming
   d = new Date()          → createdAt = new Date()
   x = getData()           → userProfile = getUserProfile()

❌ Deep nesting
   if (a) {
     if (b) {
       if (c) { doThing() }
     }
   }

✅ Early returns
   if (!a) return
   if (!b) return
   if (!c) return
   doThing()
```

---

## Feedback Preparation

### Anticipate Questions

```text
□ Why this approach vs alternatives?
□ Performance implications?
□ Backward compatibility?
□ Migration path for existing users?
□ Error scenarios handled?
```

### Document Decisions

```markdown
## Technical Decisions

### Why [Approach A] over [Approach B]?
[Explanation with trade-offs]

### Known Limitations
[Any intentional limitations]

### Future Improvements
[What could be better with more time]
```

---

## Review Checklist

```text
□ Self-review completed
□ All code smells addressed
□ Security review done
□ Changes documented
□ Pre-PR checklist complete
□ Ready for peer review
```

---

## Next Phase

→ Proceed to `07-add-test.md` (if tests not done)
→ OR `09-create-pr.md` (if ready for PR)
