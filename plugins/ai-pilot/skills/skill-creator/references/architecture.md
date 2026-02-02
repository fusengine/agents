---
name: architecture
description: Skill directory structure and file organization
when-to-use: Understanding how skills are organized
keywords: architecture, structure, directory, files, organization
priority: high
related: workflow.md, content-rules.md
---

# Skill Architecture

## Overview

Every skill follows a consistent directory structure for predictability and auto-discovery.

---

## Structure & File Types

```
plugins/<agent>/skills/<skill-name>/
├── SKILL.md                    # Entry point (~150 lines)
└── references/                 # Conceptual docs (150 max)
    ├── installation.md
    ├── core-concepts.md
    └── templates/              # Complete code (no limit)
        └── basic-setup.md
```

---

## File Roles

| File | Contains | Key Point |
|------|----------|-----------|
| **SKILL.md** | Overview, rules, links | Points to references/templates |
| **References** | WHY, WHEN, decision guides | Minimal code, conceptual |
| **Templates** | Complete working code | Copy-paste ready |

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Skill folder | kebab-case | `tanstack-query` |
| SKILL.md | Uppercase | `SKILL.md` |
| References | kebab-case | `core-concepts.md` |
| Templates | PascalCase or kebab-case | `BasicSetup.md` |

---

## Frontmatter Requirements

### SKILL.md

```yaml
---
name: skill-name
description: Use when [trigger]. Covers [topics].
versions:
  library: X.Y.Z
user-invocable: true|false
references: references/file1.md, references/file2.md
related-skills: skill-a, skill-b
---
```

### References

```yaml
---
name: reference-name
description: What this covers
when-to-use: Trigger conditions
keywords: keyword1, keyword2
priority: high|medium|low
related: other-ref.md
---
```

### Templates

```yaml
---
name: template-name
description: Complete example of [what]
keywords: keyword1, keyword2
---
```

---

## Linking Strategy

| From | To | Format |
|------|----|--------|
| SKILL.md | Reference | `[name](references/name.md)` |
| SKILL.md | Template | `[name](references/templates/name.md)` |
| Reference | Template | `→ See [template.md](templates/template.md)` |
| Reference | Reference | `[related](related.md)` |

---

## Best Practices

| DO | DON'T |
|----|-------|
| Keep SKILL.md as index/guide | Put all docs in SKILL.md |
| Split topics into references | Mix concepts with code |
| Link references to templates | Forget frontmatter |
| Use consistent naming | Use inconsistent naming |
