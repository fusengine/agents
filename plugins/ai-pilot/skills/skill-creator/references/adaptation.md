---
name: adaptation
description: How to adapt skills between frameworks (Next.js → React, etc.)
when-to-use: Creating skill by copying from similar existing skill
keywords: adaptation, copy, convert, nextjs, react, framework
priority: medium
related: workflow.md, architecture.md
---

# Skill Adaptation

## Overview

When a similar skill exists for another framework, adapt instead of creating from scratch.

---

## When to Adapt

| Scenario | Approach |
|----------|----------|
| Next.js skill exists, need React | Adapt |
| Laravel skill exists, need different Laravel feature | Partially adapt |
| Completely different domain | Create from scratch |

---

## Adaptation Workflow

```bash
# 1. Copy structure
cp -r plugins/<source>/skills/<similar>/ plugins/<target>/skills/<new-skill>/

# 2. Apply sed replacements (e.g., Next.js → React)
for file in references/*.md; do
  sed -i '' "s/Next\.js/React/g" "$file"
  sed -i '' "s/'use client'//g" "$file"
done

# 3. Remove non-applicable files
rm references/hydration.md references/server-actions.md

# 4. Research gaps with research-expert + context7
```

| Step | Action |
|------|--------|
| Identify | Framework-specific → Replace, Shared → Keep |
| Remove | SSR files if SPA, framework-specific files |
| Research | Fill gaps with research-expert |

---

## Common Adaptations

### Next.js → React

| Remove | Replace |
|--------|---------|
| `'use client'` directive | Nothing |
| `hydration.md` | N/A |
| `server-actions.md` | N/A |
| `app/` router refs | `src/` structure |

```bash
sed -i '' "s/Next\.js 16/React 19/g" *.md
sed -i '' "s/Next\.js App Router/React application/g" *.md
sed -i '' "s/'use client'//g" *.md
```

### Next.js → Laravel

Usually **don't adapt** - too different. Create from scratch using Laravel docs.

### React → Vue

| Replace | With |
|---------|------|
| `useState` | `ref()` |
| `useEffect` | `onMounted()` |
| JSX | Template syntax |
| Components | `.vue` files |

---

## Adaptation Checklist

- [ ] Copied source skill structure
- [ ] Identified framework-specific content
- [ ] Applied sed replacements
- [ ] Removed non-applicable files
- [ ] Researched gaps
- [ ] Updated SKILL.md frontmatter
- [ ] Updated version numbers
- [ ] Ran sniper validation

---

## Example: zustand-react from zustand-nextjs

```bash
cp -r plugins/nextjs/skills/nextjs-zustand/ plugins/react/skills/react-state/
cd plugins/react/skills/react-state/
for file in *.md references/*.md; do
  sed -i '' "s/Next\.js/React/g; s/nextjs-zustand/react-state/g" "$file"
done
rm references/hydration.md references/nextjs-integration.md
# Update SKILL.md frontmatter, register, sniper
```

---

## When NOT to Adapt

| Situation | Reason |
|-----------|--------|
| Very different APIs | Too much rewrite |
| Different paradigms | Concepts don't transfer |
| Outdated source | Start fresh |
