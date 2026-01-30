# Next.js Expert Skills

Documentation and conventions for nextjs-expert plugin skills.

## Skill Structure

### 3 Patterns by Size

| Pattern | Size | Structure |
|---------|------|-----------|
| **Standalone** | < 150 lines | Everything in SKILL.md |
| **Light Hub** | 150-500 lines | SKILL.md + references/ |
| **Full Hub** | > 500 lines | SKILL.md index + tree |

### Standard Structure (Light Hub)

```
skill-name/
├── SKILL.md                    # Index + Quick Start (< 150 lines)
└── references/
    ├── patterns.md             # Code patterns
    ├── examples.md             # Advanced examples
    └── api.md                  # API reference (optional)
```

### Full Hub Structure

```
skill-name/
├── SKILL.md                    # Index only
├── getting-started/
├── concepts/
├── api-reference/
└── examples/
```

---

## Available Skills

### Standalone Skills (< 150 lines)
- `nextjs-stack` - Stack orchestrator

### Light Hub Skills (150-500 lines)
- `nextjs-shadcn` - shadcn/ui components
- `nextjs-zustand` - State management
- `nextjs-tanstack-form` - Forms with Server Actions
- `nextjs-i18n` - Internationalization
- `solid-nextjs` - SOLID architecture

### Full Hub Skills (> 500 lines)
- `better-auth` - Authentication (145 files)
- `nextjs-16` - Next.js documentation (376 files)
- `prisma-7` - Prisma ORM (415 files)

---

## Naming Convention

### Skill names
- Lowercase only
- `kebab-case` format
- Max 64 characters
- Examples: `nextjs-shadcn`, `better-auth`, `prisma-7`

### Files
- `SKILL.md` - Main file (UPPERCASE)
- `references/` - References folder (lowercase)
- Markdown files in `kebab-case.md`

---

## SKILL.md Frontmatter

```yaml
---
name: skill-name
description: Clear description for auto-invocation
version: 1.0.0
user-invocable: false
references:
  - path: references/patterns.md
    title: Code Patterns
  - path: references/examples.md
    title: Advanced Examples
---
```

### Required fields
- `name` - Unique identifier
- `description` - Description for Claude

### Recommended fields
- `version` - Semantic versioning
- `user-invocable` - `false` for knowledge-only
- `references` - List of reference files

---

## Best Practices

### SKILL.md
1. **< 150 lines** - Keep it concise
2. **Quick Start first** - Installation, basic config
3. **Essential examples** - One complete example
4. **Links to references/** - For details

### References
1. **patterns.md** - Reusable code patterns
2. **examples.md** - Advanced examples and use cases
3. **api.md** - Complete API reference (if needed)

### Large documentation
1. **Split by theme** - One file per concept
2. **Max 500 lines/file** - Respect SOLID
3. **Clear index** - Easy navigation in SKILL.md

---

## Creation Workflow

1. Identify skill type (standalone/light hub/full hub)
2. Create appropriate folder structure
3. Write SKILL.md with complete frontmatter
4. Extract patterns to references/ if > 150 lines
5. Add references in frontmatter
