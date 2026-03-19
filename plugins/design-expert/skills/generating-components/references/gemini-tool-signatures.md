---
name: gemini-tool-signatures
description: Real tool parameter signatures for Gemini Design MCP (from MCP schema, not website docs)
when-to-use: When calling create_frontend, snippet_frontend, or modify_frontend
keywords: gemini, mcp, parameters, signatures, schema
priority: high
related: gemini-design-workflow.md
---

# Gemini Design Tool Signatures

Source: MCP tool schema (runtime introspection — the actual parameters)

## create_frontend

Creates complete pages or components from scratch.

```typescript
{
  request: string;         // What to create (page, component, section)
  techStack: string;       // "HTML5 + CSS3", "React + Tailwind CSS", etc.
  context: string;         // Functional/business context (NOT design info)
  designSystem?: string;   // ENTIRE content of design-system.md (all visual tokens)
  scale?: "refined" | "balanced" | "zoomed";
}
```

- `request` = WHAT to build (describe functionality and content)
- `context` = WHY and HOW (business requirements, user flow, data)
- `designSystem` = VISUAL RULES (colors, typography, spacing — paste full file)
- Output: returns code as text. YOU write it to disk via Write tool.

**First project (no design-system.md):**
1. Call create_frontend 5x with different aesthetics (vibes)
2. User picks one → save as design-system.md
3. Then call normally with designSystem parameter

## snippet_frontend

Generates a UI snippet to insert into an existing file.

```typescript
{
  request: string;           // What snippet to generate
  techStack: string;         // Tech stack
  context: string;           // Business context
  insertionContext?: string; // Surrounding code where snippet goes
}
```

## modify_frontend

Redesigns a specific section of existing code.

```typescript
{
  filePath: string;       // File to modify
  codeToModify: string;   // Exact code section to change
  modification: string;   // SPECIFIC visual change (not "improve")
  context?: string;       // design-system.md tokens if needed
}
```

## Scale Options

| Value | Style | Best For |
|-------|-------|----------|
| `refined` | Compact, dense | Apple/Notion-like UIs |
| `balanced` | Standard (default) | Most projects |
| `zoomed` | Large, accessible | Senior-friendly, a11y-first |

## Common techStack Values

```
"HTML5 + CSS3 vanilla (no framework)"
"React + Tailwind CSS + shadcn/ui + Framer Motion"
"Next.js 16 App Router + Tailwind CSS + shadcn/ui"
"Astro 6 + Tailwind CSS v4"
```

## Output

Gemini returns code as text. The agent writes it to disk via Write tool.
