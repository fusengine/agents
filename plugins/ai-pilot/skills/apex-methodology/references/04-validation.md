---
name: 04-validation
description: Verify code quality with sniper agent (APEX Phase X)
prev_step: references/03.5-elicit.md
next_step: references/05-review.md
---

# 04 - Validation

**Verify code quality with sniper agent (APEX Phase X).**

## Gate — Required Proof Artefacts

**Validation does NOT start** unless both proof files exist on disk for the current task. A claim made in context ("I already verified/elicited this") is not proof — only the file on disk is:

```bash
TASK_SLUG=$(jq -r '.current_task' .claude/apex/task.json)
if [ ! -f ".claude/apex/docs/elicit-${TASK_SLUG}.json" ]; then
  echo "❌ Missing .claude/apex/docs/elicit-${TASK_SLUG}.json — go back to references/03.5-elicit.md first."
  exit 1
fi
if [ ! -f ".claude/apex/docs/verify-${TASK_SLUG}.md" ]; then
  echo "❌ Missing .claude/apex/docs/verify-${TASK_SLUG}.md — go back to the verification skill (runs between eLicit and eXamine) first."
  exit 1
fi
```

Only once both checks pass does this phase proceed.

---

## When to Use

- After execution phase complete
- Before any code review
- After ANY code modification

---

## Launch sniper Agent

### Mandatory After Every Change

```text
sniper agent performs 6-phase validation:

Phase 1: explore-codebase
→ Verify file structure
→ Check for violations

Phase 2: research-expert
→ Verify patterns match docs

Phase 3: grep usages
→ Find all references
→ Check for breaks

Phase 4: run linters
→ Language-specific linters
→ Type checks
→ Style violations

Phase 5: apply fixes
→ Auto-fix what's possible
→ Manual fixes for complex issues

Phase 6: ZERO errors
→ Must pass completely
→ No warnings ignored
```

---

## Validation Tools (Language-Specific)

| Language | Linter | Formatter | Type Check |
| --- | --- | --- | --- |
| TypeScript | ESLint | Prettier/Biome | tsc |
| PHP | PHPStan/Larastan | Pint/PHP-CS | Psalm |
| Python | Ruff/Pylint | Black/Ruff | mypy |
| Swift | SwiftLint | swift-format | Compiler |
| Go | golangci-lint | gofmt | Compiler |
| Rust | Clippy | rustfmt | Compiler |

---

## Validation Checks

### Code Quality

```text
□ No type errors
□ No linter errors or warnings
□ Formatted correctly
□ No unused imports/variables
□ No unsafe types (any, etc.)
```

### File Structure

```text
□ All files <100 lines
□ Interfaces in correct location
□ No interfaces in components
□ Correct file naming
□ Proper directory structure
```

### Documentation

```text
□ Doc comments on all exports
□ Complex logic commented
□ README updated if needed
□ Types self-documenting
```

---

## Build Verification

### Run Build (Language-Specific)

```text
TypeScript/JS: npm run build / pnpm build
PHP/Laravel:   composer build / php artisan
Python:        python -m py_compile
Swift:         swift build / xcodebuild
Go:            go build ./...
Rust:          cargo build
```

### Expected Output

```text
✅ Build successful
✅ No type errors
✅ No warnings (or documented exceptions)
✅ Output size acceptable
```

---

## Common Issues

### Type Errors

```text
Problem: Property/method does not exist
Fix: Add type guard, optional chaining, or fix type

Problem: Type mismatch
Fix: Cast correctly or fix source type
```

### Linter Errors

```text
Problem: Unused variable/import
Fix: Remove or prefix with underscore

Problem: Missing documentation
Fix: Add doc comment

Problem: File too long
Fix: Split into multiple files
```

### Import/Module Errors

```text
Problem: Cannot find module
Fix: Verify path, check exports, check package installed
```

---

## Fix Workflow

### If Errors Found

```text
1. Read error message carefully
2. Identify root cause
3. Fix in correct file
4. Re-run validation
5. Repeat until ZERO errors
```

### Common Fixes

| Error Type | Fix |
| --- | --- |
| Type error | Add/fix type annotations |
| Unused import | Remove import |
| Missing export | Add export statement |
| Format error | Run formatter |
| File too long | Split file |

### Fix Discipline (Hypothesis-Driven)

**Fix discipline (hypothesis-driven).** One candidate cause documented before any edit → one atomic change → retest immediately. If it still fails, the hypothesis was wrong: the same fix is FORBIDDEN — run a fresh research round (Context7 → Exa) for a new hypothesis. Cap: 3 cycles per error; at the 3rd failure STOP and escalate (`status: fail` + root-cause: what was tried, sources, why each failed). Never stack two unverified corrections. Canonical implementation: sniper's Fix Retry Loop.

---

## Validation Report

### Generate Report

```markdown
## Validation Results

### Linting
- Linter: ✅ Pass (0 errors, 0 warnings)
- Type check: ✅ Pass (0 errors)

### File Checks
- All files <100 lines: ✅
- Interfaces location: ✅
- Documentation: ✅

### Build
- Build status: ✅ Success

### Issues Fixed
- [List any issues fixed during validation]
```

---

## Validation Checklist

```text
□ sniper agent launched
□ All 6 phases completed
□ ZERO linter errors
□ ZERO type errors
□ All files <100 lines verified
□ Build successful
□ No regressions detected
```

---

## Update Task Phase

At the **start** of this phase, record it in `.claude/apex/task.json`:

```bash
jq --arg p "validation" '.tasks[.current_task].phase = $p' .claude/apex/task.json \
  > .claude/apex/task.json.tmp && mv .claude/apex/task.json.tmp .claude/apex/task.json
```

---

## Next Phase

→ Proceed to `05-review.md` (self-review)
→ OR `07-add-test.md` (if tests needed first)
