---
name: workflow
description: Simplified 3-step workflow for skill creation (NOT APEX)
when-to-use: When creating new skills or improving existing ones
keywords: workflow, research, create, validate, sniper, simple
priority: high
related: architecture.md, content-rules.md
---

# Skill Creator Workflow

## Overview

**This is a documentation task, NOT code development. No APEX workflow required.**

Simple 3-step process: Research → Create → Validate

---

## Step 1: Research (MANDATORY)

**Launch ALL 3 in parallel BEFORE writing any file:**

| Agent/Tool | Purpose | Required |
|------------|---------|----------|
| **fuse-ai-pilot:explore-codebase** | Check existing skills, analyze structure | ✅ YES |
| **fuse-ai-pilot:research-expert** | Fetch latest official documentation | ✅ YES |
| **mcp__context7__query-docs** | Get code examples from official sources | ✅ YES |

### What to Gather

- Current stable version
- Core features and patterns
- Best practices from official docs
- Code examples to adapt
- Existing similar skills to reference

---

## Step 2: Create

### Order

1. **SKILL.md** - Overview, critical rules, reference guide
2. **References** - Conceptual docs (WHY + WHEN)
3. **Templates** - Complete code examples

### Rules

| File Type | Max Lines | Content |
|-----------|-----------|---------|
| SKILL.md | ~150 | Guides to references |
| References | 150 | Conceptual, minimal code |
| Templates | Unlimited | Complete, copy-paste ready |

---

## Step 3: Validate

Run **fuse-ai-pilot:sniper** to verify:

| Check | Requirement |
|-------|-------------|
| Frontmatter | All files have proper YAML |
| References | All listed in SKILL.md exist |
| Content | English only |
| Size | References < 150 lines |

---

## Example

```
User: "Create skill for TanStack Query"

1. Research
   → research-expert: v5.67.2, queries, mutations, caching
   → context7: Official docs fetched

2. Create
   → SKILL.md (overview, critical rules)
   → 8 references (conceptual)
   → 4 templates (complete code)

3. Validate
   → sniper: All files valid
```

---

## Common Mistakes

| Mistake | Solution |
|---------|----------|
| Skipping research | Always fetch latest docs first |
| Writing in French | ALL content in English |
| Copying raw docs | Rewrite conceptually |
| References too long | Split into multiple files |
| Skipping sniper | Always validate at end |
