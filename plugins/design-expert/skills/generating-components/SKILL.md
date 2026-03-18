---
name: generating-components
description: Use when generating UI components, buttons, forms, cards, hero sections, or using design tools. Covers Gemini Design MCP, shadcn/ui, 21st.dev, and Tailwind CSS.
versions:
  tailwindcss: "4.1"
  framer-motion: "11"
  shadcn-ui: "2.x"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task, mcp__gemini-design__create_frontend, mcp__gemini-design__snippet_frontend, mcp__gemini-design__modify_frontend, mcp__magic__21st_magic_component_builder, mcp__magic__21st_magic_component_inspiration, mcp__magic__21st_magic_component_refiner, mcp__shadcn__search_items_in_registries, mcp__shadcn__view_items_in_registries, mcp__shadcn__get_item_examples_from_registries, mcp__shadcn__get_add_command_for_items, mcp__playwright__browser_navigate, mcp__playwright__browser_take_screenshot
references: references/gemini-design-workflow.md, references/gemini-feedback-loop.md, references/gemini-tool-signatures.md, references/21st-dev.md, references/shadcn.md, references/buttons-guide.md, references/forms-guide.md, references/cards-guide.md, references/icons-guide.md, references/ui-visual-design.md, references/grids-layout.md, references/design-patterns.md, references/component-examples.md, references/photos-images.md, references/templates/hero-section.md, references/templates/feature-grid.md, references/templates/pricing-card.md, references/templates/contact-form.md, references/templates/testimonial-card.md, references/templates/stats-section.md, references/templates/faq-accordion.md, references/templates/hero-glassmorphism.md, references/templates/pricing-cards.md
related-skills: designing-systems, adding-animations, validating-accessibility
---

# Generating Components

## Agent Workflow (MANDATORY)

Before ANY component generation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing UI patterns, colors, typography
2. **fuse-ai-pilot:research-expert** - Verify latest component patterns via Context7
3. **mcp__magic__21st_magic_component_inspiration** - Search 21st.dev for inspiration
4. **[MANDATORY] Playwright browse** — ALWAYS browse real sites matching project sector before generating. New project → 3 sites. New page → 2 sites. New component → 1 site or 21st.dev. Use `mcp__playwright__browser_navigate` + `mcp__playwright__browser_take_screenshot`. Analyze: colors, typography, spacing, layout, animations. Feed insights into Gemini XML `<style_reference>` block. See references/design-inspiration.md for URLs.

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Gemini Design MCP** | AI-powered frontend generation (create, modify, snippet) |
| **Structured Specs** | Layout + component + animation specs (NOT raw code templates) |
| **Multi-Stack** | Adapts to React/Laravel/Swift via visual specs |
| **21st.dev** | Component inspiration and builder |
| **shadcn/ui** | Copy-paste component library |
| **Anti-AI-Slop** | Mandatory identity-driven design |

---

## Pre-Generation Checklist (MANDATORY — 5 checks before ANY Gemini call)

1. **design-system.md exists** — if not, run `identity-system` skill first
2. **OKLCH tokens defined** — no hex, no HSL; tokens must be in CSS variables
3. **Typography pair specified** — font-display + font-body from `typography-pairs.md`
4. **Motion profile set** — spring | cinematic | instant (from design-system.md)
5. **visual-technique-matrix.md consulted** — personality × density checked

If any check fails → STOP. Do not call Gemini until identity is established.

---

## Critical Rules

1. **ALWAYS use Gemini Design** - Never write UI code manually
2. **Search inspiration first** - 21st.dev before coding
3. **Match existing tokens** - Analyze codebase before generating
4. **No forbidden fonts** - Inter, Roboto, Arial are BANNED
5. **Framer Motion required** - Every component needs animations
6. **Full redesign → browse real sites** - For full redesign requests, browse 2-3 real sites via Playwright before generating — see references/design-inspiration.md

---

## Reference Guide

→ See [references/reference-index.md](references/reference-index.md) for all references and templates.

For complete page designs (dashboard, auth, settings), see `page-layouts` skill.
For visual identity (palette, typography, tokens), see `identity-system` skill.

---

## Anti-AI-Slop Table

| FORBIDDEN | USE INSTEAD |
|-----------|-------------|
| Inter, Roboto, Arial | Clash Display, Satoshi, Syne |
| Purple/pink gradients | CSS variables, sharp accents |
| Border-left indicators | Icon + bg-*/10 rounded |
| Flat backgrounds | Glassmorphism, gradient orbs |
| No animations | Framer Motion stagger |
→ For multi-stack delegation rules, see `rules/framework-integration.md`.
