---
name: gemini-design-workflow
description: Complete workflow for using Gemini Design MCP — MANDATORY for all UI generation
when-to-use: Before ANY frontend/UI code creation
keywords: gemini, design, mcp, create_frontend, snippet_frontend, modify_frontend, workflow
priority: critical
related: ui-visual-design.md, gemini-feedback-loop.md, gemini-tool-signatures.md
---

# Gemini Design MCP Workflow

## ABSOLUTE RULE

**NEVER write frontend/UI code yourself. Gemini is your frontend developer.**

→ Tool signatures: [gemini-tool-signatures.md](gemini-tool-signatures.md)
→ Output correction: [gemini-feedback-loop.md](gemini-feedback-loop.md)

---

## Pre-Generation Checklist (5 checks — MANDATORY)

- [ ] **1. design-system.md exists** — if not, run vibe generation (Step 2)
- [ ] **2. Aesthetics specific** — "editorial bold" NOT "clean and modern"
- [ ] **3. All states listed** — default, hover, loading, empty, error, disabled
- [ ] **4. Forbidden patterns noted** — what must NOT appear for this component
- [ ] **5. Typography explicit** — font family + size + weight from design-system.md

---

## Workflow

### Step 1: Check design-system.md

```
design-system.md missing? → Step 2 (vibe generation)
design-system.md exists?  → Step 3 (create component)
```

### Step 2: Generate 5 Vibes (no design-system.md)

Call `create_frontend` 5× with DIFFERENT aesthetics — NOT variations of the same style:

```
1. Brutalist — heavy borders, monospaced type, high contrast
2. Glassmorphism — gradient orbs, frosted surfaces
3. Editorial — large display type, asymmetric grid
4. Neo-minimal — extreme whitespace, single accent
5. Cyberpunk — dark base, neon OKLCH accents
```

→ Assemble into `vibes-selection.tsx` → user picks → save to `design-system.md` → delete file.

### Step 3: Create with Design System

```
create_frontend({
  request: "<XML-structured prompt — see template files>",
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion",
  context: "<ENTIRE design-system.md content>",
  scale: "balanced"
})
```

---

## Required XML Prompt Structure

```xml
<component>[name + primary purpose]</component>
<aesthetics>[specific visual style — NOT "clean and modern"]</aesthetics>
<typography>[font family, sizes, weights from design-system.md]</typography>
<color_system>[OKLCH values from design-system.md tokens]</color_system>
<spacing>[grid, padding, margin values]</spacing>
<states>[ALL: default, hover, loading, empty, error, disabled]</states>
<animations>[Framer Motion: stagger, spring, duration]</animations>
<forbidden>[patterns to avoid for this component type]</forbidden>
```

---

## Separation of Concerns

| YOU (Agent) | GEMINI |
|-------------|--------|
| useState, handlers | JSX/HTML structure |
| Data fetching | Visual components |
| Routing, conditions | Tailwind styling + animations |

## FORBIDDEN Without Gemini

- React components with Tailwind styling
- Writing CSS manually for UI
- Doing frontend "quickly" yourself

## ALLOWED Without Gemini

- Text/copy changes only
- JavaScript logic without UI
- Data wiring (useQuery, useMutation)
