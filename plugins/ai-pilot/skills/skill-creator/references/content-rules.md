---
name: content-rules
description: Rules for writing skill content - language, style, formatting
when-to-use: Writing SKILL.md, references, or templates
keywords: content, rules, language, english, style, formatting
priority: high
related: architecture.md, workflow.md
---

# Content Rules

## Overview

All skill content must follow these rules for consistency and quality.

---

## Language Rule (CRITICAL)

**ALL content MUST be in English.**

| Allowed | Not Allowed |
|---------|-------------|
| English text | French text |
| English comments | French comments |
| English examples | Any other language |

**Exception**: Localized UI strings in code examples (if app requires i18n).

---

## SKILL.md Content

### Required Sections

| Section | Purpose |
|---------|---------|
| **Agent Workflow** | Mandatory agents to run |
| **Overview** | When to use, comparison table |
| **Critical Rules** | Non-negotiable patterns |
| **Architecture** | Directory structure |
| **Reference Guide** | Tables linking to docs |
| **Best Practices** | DO/DON'T |

### Style Guidelines

| Element | Guideline |
|---------|-----------|
| Description | Start with "Use when..." |
| Tables | Use for organization |
| Links | Point to references/templates |
| Code | Minimal, illustrative only |

---

## Reference Content

### Purpose

References explain **concepts** - the WHY and WHEN.

| Include | Exclude |
|---------|---------|
| Explanations | Full implementations |
| Decision guides | Copy-paste code |
| Best practices | Long code blocks |
| Minimal snippets | Complete files |

### Size Limit

**Maximum 150 lines** per reference file.

If larger, split into multiple files:
- `queries.md` → `queries-basic.md` + `queries-advanced.md`

### Required Elements

| Element | Example |
|---------|---------|
| Overview section | "Queries fetch data..." |
| Tables | Compare options |
| Decision guide | When to use what |
| Link to template | "→ See [template.md]" |

---

## Template Content

### Purpose

Templates provide **complete, working code**.

| Include | Exclude |
|---------|---------|
| All imports | Partial code |
| Full implementation | Snippets only |
| Comments | Unexplained code |
| Ready to copy-paste | Pseudo-code |

### No Size Limit

Templates can be as long as needed for complete examples.

### Required Elements

| Element | Purpose |
|---------|---------|
| File path comment | Where to put the file |
| All imports | No missing dependencies |
| Complete code | Works when copied |
| Key comments | Explain important parts |

---

## Formatting Rules

| Element | Format |
|---------|--------|
| Headings | `# Title`, `## Section`, `### Subsection` |
| Tables | `\| Col1 \| Col2 \|` with alignment row |
| Code | Triple backticks with language identifier |
| Links | `[Text](path/file.md)` or `→ See [template.md]` |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Writing in French | Translate to English |
| Copying raw docs | Rewrite conceptually |
| Huge references | Split into parts |
| Missing links | Add template links |
| No frontmatter | Add YAML header |
