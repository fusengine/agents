---
name: gemini-design-workflow
description: Complete workflow for using Gemini Design MCP - MANDATORY for all UI generation
when-to-use: Before ANY frontend/UI code creation, generating components with Gemini
keywords: gemini, design, mcp, create_frontend, snippet_frontend, modify_frontend, workflow
priority: critical
related: ui-visual-design.md, design-patterns.md
---

# Gemini Design MCP Workflow

## ABSOLUTE RULE

**NEVER write frontend/UI code yourself. Gemini is your frontend developer.**

## Available Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `create_frontend` | Complete pages/components | New files needing design |
| `snippet_frontend` | UI snippets to insert | Adding elements to existing files |
| `modify_frontend` | Redesign existing code | Visual changes only |

## MANDATORY Workflow (New Project)

### Step 1: Check design-system.md

```
IF design-system.md does NOT exist:
  → Go to Step 2 (Vibe Generation)

IF design-system.md EXISTS:
  → Skip to Step 4 (Create with Design System)
```

### Step 2: Ask User for Scale

**Before any generation, ask:**

| Scale | Description | Example |
|-------|-------------|---------|
| `refined` | Small, elegant (Apple/Notion-like) | Compact, dense UI |
| `balanced` | Standard sizing | Default choice |
| `zoomed` | Large, bold | Accessibility-first |

### Step 3: Generate 5 Vibes

Call `create_frontend` 5 times with different styles:

```typescript
// Vibe 1: Glassmorphism
create_frontend({
  request: "Hero section with glassmorphism cards, gradient orbs background",
  techStack: "Next.js 15 App Router + Tailwind CSS + shadcn/ui",
  context: "Landing page hero for SaaS product",
  scale: "balanced"
})

// Vibe 2: Brutalist
// Vibe 3: Editorial
// Vibe 4: Cyberpunk
// Vibe 5: Luxury
```

**Then:**
1. Assemble into `vibes-selection.tsx`
2. User picks a vibe
3. Save chosen vibe code to `design-system.md`
4. Delete `vibes-selection.tsx`

### Step 4: Create with Design System

```typescript
create_frontend({
  request: "Dashboard with stats cards, chart section, data table",
  techStack: "Next.js 15 App Router + Tailwind CSS + shadcn/ui",
  context: "Admin dashboard showing user metrics and activity",
  designSystem: "<ENTIRE content of design-system.md>"
})
```

## Tool Signatures

### create_frontend

```typescript
{
  request: string;      // What to create (be specific)
  techStack: string;    // "Next.js 15 + Tailwind + shadcn/ui"
  context: string;      // Functional context (NOT design)
  designSystem?: string; // ENTIRE design-system.md content
  scale?: "refined" | "balanced" | "zoomed";
}
```

### snippet_frontend

```typescript
{
  request: string;       // What snippet to generate
  techStack: string;     // Tech stack
  context: string;       // Functional context
  designSystem: string;  // REQUIRED: design-system.md content
  insertionContext: string; // WHERE in file to insert
}
```

### modify_frontend

```typescript
{
  filePath: string;      // File containing code to modify
  codeToModify: string;  // Exact code to change
  modification: string;  // What visual change to make
  context?: string;      // Existing CSS context
}
```

## Effective Prompts

### BAD (vague)

```
"Create a pricing page"
"Add a sidebar"
"Make it look better"
```

### GOOD (specific)

```
"Create a pricing page with 3 tiers (Basic $9, Pro $29, Enterprise custom),
highlighted Pro tier with accent border, feature comparison table,
monthly/yearly toggle, responsive grid layout"

"Add a sidebar with navigation links matching header style,
collapsible sections, user profile at bottom, dark mode toggle"

"Make this card premium with glassmorphism effect (bg-white/10 backdrop-blur-xl),
subtle shadow (shadow-xl shadow-primary/10), rounded-2xl corners"
```

### Reference Real Products

```
"Style like Vercel's dashboard"
"Make it look like Linear's interface"
"Match Stripe's pricing page aesthetic"
```

## Separation of Concerns

| YOU (Agent) | GEMINI |
|-------------|--------|
| Logic: useState, handlers | JSX/HTML with design |
| Data fetching, filtering | Visual components |
| Routing, conditions | Styling, layout |
| Install dependencies | Premium aesthetics |

## FORBIDDEN Without Gemini

- Creating React components with styling
- Writing CSS/Tailwind manually for UI
- "Reusing existing styles" as excuse
- Doing frontend "quickly" yourself

## ALLOWED Without Gemini

- Text/copy changes only
- JavaScript logic without UI
- Data wiring (useQuery, useMutation)
- Non-visual bug fixes

## Checklist

Before any UI task:

- [ ] Check if design-system.md exists
- [ ] If not, generate vibes and let user choose
- [ ] Pass ENTIRE design-system.md content
- [ ] Write specific prompts (not vague)
- [ ] Reference existing styles when modifying
- [ ] YOU handle logic, GEMINI handles JSX
