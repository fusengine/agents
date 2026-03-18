---
name: gemini-tool-signatures
description: Tool parameter signatures for all Gemini Design MCP tools
when-to-use: When calling create_frontend, snippet_frontend, or modify_frontend
keywords: gemini, mcp, parameters, signatures, typescript
priority: high
related: gemini-design-workflow.md
---

# Gemini Design Tool Signatures

## create_frontend

Creates complete pages or components from scratch.

```typescript
{
  request: string;        // XML-structured prompt (see gemini-design-workflow.md)
  techStack: string;      // "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: string;        // ENTIRE design-system.md content
  scale?: "refined" | "balanced" | "zoomed";
}
```

**When to use:** New component/page files needing full design treatment.

## snippet_frontend

Generates a UI snippet to insert into an existing file.

```typescript
{
  request: string;           // What snippet to generate (XML structure)
  techStack: string;         // Tech stack
  context: string;           // ENTIRE design-system.md content
  insertionContext: string;  // Paste surrounding code where snippet will go
}
```

**When to use:** Adding a new element inside an already-designed file.

## modify_frontend

Redesigns a specific section of existing code.

```typescript
{
  filePath: string;       // File containing code to modify
  codeToModify: string;   // Exact code section to change (copy-paste it)
  modification: string;   // SPECIFIC visual change description (not "improve")
  context?: string;       // design-system.md tokens if needed
}
```

**When to use:** Visual changes to an existing component — NOT logic changes.

## Scale Options

| Value | Description | Best For |
|-------|-------------|----------|
| `refined` | Compact, dense | Apple/Notion-like UIs |
| `balanced` | Standard (default) | Most SaaS products |
| `zoomed` | Large, accessible | Accessibility-first apps |

## Common techStack Values

```
"React + Tailwind CSS + shadcn/ui + Framer Motion"
"Next.js 15 App Router + Tailwind CSS + shadcn/ui"
"Astro 6 + Tailwind CSS v4 + shadcn/ui (React islands)"
"Laravel Blade + Livewire Flux + Tailwind CSS"
```
