---
name: 00-init-branch
description: Create feature branch for Next.js project
prev_step: null
next_step: references/nextjs/01-analyze-code.md
---

# 00 - Init Branch (Next.js)

**Create feature branch for Next.js project.**

## When to Use

- Starting ANY new feature, fix, or task
- Before making any code changes
- After receiving a task/issue assignment

---

## Package Manager Detection

### Check Project Configuration

```bash
# Detect lock file
ls -la | grep -E "(package-lock|pnpm-lock|bun.lock|yarn.lock)"

# pnpm-lock.yaml → pnpm
# bun.lock → bun
# yarn.lock → yarn
# package-lock.json → npm
```

---

## Branch Naming Convention

### Format

```text
<type>/<issue-id>-<short-description>
```

### Next.js Specific Types

| Type | Use Case | Example |
| --- | --- | --- |
| `feature/` | New route, component, API | `feature/123-user-dashboard` |
| `fix/` | Bug fixes | `fix/456-hydration-error` |
| `refactor/` | Server/Client component split | `refactor/321-rsc-migration` |
| `api/` | API routes changes | `api/789-auth-endpoint` |
| `perf/` | Performance optimization | `perf/654-image-lazy-load` |

---

## Workflow

### Step 1: Sync with Remote

```bash
git fetch origin
git checkout main
git pull origin main
```

### Step 2: Verify Dependencies

```bash
# pnpm (recommended for Next.js)
pnpm install

# OR npm
npm install

# OR bun
bun install
```

### Step 3: Create Branch

```bash
git checkout -b feature/ISSUE-123-short-description
```

### Step 4: Verify Setup

```bash
# Check branch
git branch --show-current

# Verify build works
pnpm build  # or npm run build

# Check TypeScript
pnpm tsc --noEmit
```

---

## Next.js 16 Project Checklist

### Verify Configuration

```text
Required files:
[ ] next.config.ts (NOT .js for Next.js 16)
[ ] tsconfig.json (strict mode)
[ ] app/layout.tsx (root layout)
[ ] app/page.tsx (home page)
```

### Check package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

---

## Validation Checklist

```text
[ ] Branch created from latest main
[ ] Branch name follows convention
[ ] Dependencies installed
[ ] Build passes
[ ] TypeScript check passes
[ ] Ready for development
```

---

## Next Phase

Proceed to `01-analyze-code.md`
