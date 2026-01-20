# 00 - Init Branch (React/Vite)

**Create feature branch for React/Vite projects.**

## When to Use

- Starting ANY new React feature, fix, or task
- Before making any code changes
- After receiving a task/issue assignment

---

## Branch Naming Convention

### Format

```text
<type>/<issue-id>-<short-description>
```

### Types for React Projects

| Type | Use Case | Example |
| --- | --- | --- |
| `feature/` | New component/hook | `feature/123-user-profile` |
| `fix/` | Bug fixes | `fix/456-form-validation` |
| `refactor/` | Code improvement | `refactor/321-extract-hook` |
| `ui/` | UI/styling changes | `ui/789-button-variants` |
| `test/` | Test additions | `test/987-component-tests` |

---

## Workflow

### Step 1: Sync with Remote

```bash
git fetch origin
git checkout main
git pull origin main
```

### Step 2: Create Branch

```bash
git checkout -b feature/ISSUE-123-component-name
```

### Step 3: Verify Branch

```bash
git branch --show-current
git status
```

---

## React/Vite Project Checks

### Verify Environment

```bash
# Check Node version (18+ required)
node --version

# Check package manager
bun --version  # or npm/pnpm

# Verify dependencies
bun install
```

### Verify Build

```bash
# TypeScript check
bun run tsc --noEmit

# Dev server starts
bun run dev
```

---

## Best Practices (2025/2026)

### Short-Lived Branches

```text
- Merge within 1-3 days
- Small, focused changes
- One feature/component per branch
- No long-lived feature branches
```

### Sync Frequently

```bash
git fetch origin main
git rebase origin/main
```

---

## Validation Checklist

```text
[ ] Branch created from latest main
[ ] Branch name follows convention
[ ] Issue/ticket ID included
[ ] Node/bun versions correct
[ ] Dependencies installed
[ ] TypeScript compiles
[ ] Dev server runs
```

---

## Next Phase

-> Proceed to `01-analyze-code.md`
