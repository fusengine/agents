---
name: gemini-design-workflow
description: "Optional workflow for using Gemini Design MCP as an alternate HTML/CSS generation path — the default path is Claude generating HTML/CSS directly."
when-to-use: "Choosing to route generation through Gemini Design MCP instead of generating HTML/CSS directly (e.g. Gemini available and a second opinion or faster first draft is wanted)."
keywords: gemini, design, mcp, create_frontend, snippet_frontend, modify_frontend, workflow, optional
priority: low
related: ../ui-visual-design.md, gemini-feedback-loop.md, gemini-tool-signatures.md
---

# Gemini Design MCP Workflow (Optional Path)

**Default path: generate HTML/CSS directly** (see `design-method` skill). This document
only applies if you choose to route generation through Gemini Design MCP instead —
useful as a fast first draft or a second opinion, never a requirement.

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
<spacing>[grid, padding, margin values — hero top padding ≤ pt-24]</spacing>
<layout>[hard constraints from layout-discipline.md: hero headline ≤2 lines, subtext ≤20 words AND ≤4 lines, max 4 hero-stack elements; eyebrows ≤ ceil(sections/3); max 2 consecutive image+text sections; bento cells = content items exactly; each layout family once per page]</layout>
<states>[ALL: default, hover, loading, empty, error, disabled]</states>
<animations>[Framer Motion: stagger, spring, duration]</animations>
<forbidden>[per-component patterns to avoid + always-on hard bans from layout-discipline.md: em-dash (—/–) anywhere; trust strip / pricing teaser / feature bullets inside the hero; filler bento cells; wrapping CTA labels; raw <ul> for >5 items; bordered row-list spec sheets; quotes over 3 lines]</forbidden>
```

---

## Separation of Concerns (when using this path)

| YOU (Agent) | GEMINI |
|-------------|--------|
| useState, handlers | JSX/HTML structure |
| Data fetching | Visual components |
| Routing, conditions | Tailwind styling + animations |

## Failure Handling

If Gemini Design MCP is unavailable or returns a degraded result, fall back to
generating the HTML/CSS directly — this is not a blocked state, just a routing choice.
