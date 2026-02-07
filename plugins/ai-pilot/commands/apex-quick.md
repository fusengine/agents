---
description: Quick Flow for simple fixes - Single expert handles explore, code, review, and validate in one pass. Inspired by BMAD Barry.
argument-hint: "<fix description>"
---

# APEX Quick Flow

Fast-track workflow for simple bug fixes, typos, and minor changes. No multi-agent orchestration.

---

## When to Use

✅ **Use APEX Quick:**
- Typo fixes
- Single-line bug fixes
- Simple refactoring (rename, move)
- Minor UI tweaks
- Config changes
- Documentation updates

❌ **Use Full APEX instead:**
- New features
- Multi-file changes
- Security-related code
- Database migrations
- API changes

---

## Quick Flow Workflow

```
┌─────────────────────────────────────────────────────────┐
│             APEX QUICK (Single Pass)                    │
│                                                         │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌────────┐ │
│  │ LOCATE  │ → │  FIX    │ → │ REVIEW  │ → │ VERIFY │ │
│  └─────────┘   └─────────┘   └─────────┘   └────────┘ │
│      │             │             │             │       │
│      ▼             ▼             ▼             ▼       │
│   Find file     Apply        1 quick      Linter      │
│   + line        minimal      technique    check       │
│                 change                                 │
└─────────────────────────────────────────────────────────┘
```

**Total: 4 steps, 1 expert, no handoffs**

---

## Execution

### Step 1: LOCATE

```
Expert does quick search:
- Grep for relevant code
- Read the file
- Identify exact location
```

### Step 2: FIX

```
Expert applies minimal change:
- Only change what's necessary
- Preserve existing style
- No refactoring scope creep
```

### Step 3: REVIEW (Auto-Elicit)

```
Expert applies 1 quick technique based on fix type:

| Fix Type | Quick Technique |
|----------|-----------------|
| Bug fix  | TEST-01 (Edge cases) |
| Typo     | DOC-03 (Consistency) |
| Style    | MAINT-02 (Convention) |
| Security | SEC-02 (Validation) |
| Config   | DATA-01 (Schema) |
```

### Step 4: VERIFY

```
Quick verification:
- Run linter on changed file(s)
- TypeScript check (if applicable)
- No full test suite
```

---

## Example Usage

```bash
/apex-quick Fix typo in login button text
```

**Expert executes:**
```
1. LOCATE: Grep "login" → Found LoginButton.tsx:23
2. FIX: Change "Logi" → "Login"
3. REVIEW: DOC-03 check → OK
4. VERIFY: eslint LoginButton.tsx → 0 errors

✅ Done in single pass
```

---

## Comparison

| Aspect | APEX Full | APEX Quick |
|--------|-----------|------------|
| Agents | 3+ parallel | 1 expert |
| Phases | 4-5 (A-P-E-L-X) | 4 (Locate-Fix-Review-Verify) |
| TaskCreate | Yes | No |
| Sniper | Full 6-phase | Linter only |
| Use case | Features, refactoring | Fixes, typos |

---

## Quick Flow Rules

### DO:
- ✅ Use for changes <20 lines
- ✅ Single file preferred
- ✅ Quick self-review
- ✅ Immediate verification

### DON'T:
- ❌ Add features while fixing
- ❌ Refactor surrounding code
- ❌ Skip the review step
- ❌ Use for security changes

---

## Output Format

```markdown
## ⚡ APEX Quick Complete

**Task**: {description}
**File**: {file_path}:{line}
**Change**: {summary}

### Quick Review
- Technique: {technique_id}
- Result: ✅ OK

### Verification
- Linter: ✅ 0 errors
- TypeScript: ✅ OK

**Status**: ✅ Fixed
```

---

## Arguments

- `$ARGUMENTS`: Description of the fix to apply

**Examples:**
- `/apex-quick Fix typo in header`
- `/apex-quick Rename getUserData to fetchUser`
- `/apex-quick Update copyright year to 2025`
- `/apex-quick Fix missing null check in handler`
