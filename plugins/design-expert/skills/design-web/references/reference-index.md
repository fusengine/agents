---
name: reference-index
description: "Index of all references for the design-web skill (component generation, layouts, premium patterns)."
when-to-use: "Unsure which reference file covers a specific component type or web-generation concern."
keywords: index, reference, web, components, corpus, structure
priority: low
related: design-inspiration.md, refs-design/README.md, layout-discipline.md, gemini/gemini-design-workflow.md
---

# Reference Index — Design Web

## Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Gemini Workflow (optional)** | [gemini/gemini-design-workflow.md](gemini/gemini-design-workflow.md) | If using Gemini Design MCP instead of direct generation |
| **Tool Signatures** | [gemini/gemini-tool-signatures.md](gemini/gemini-tool-signatures.md) | create/modify/snippet params |
| **Feedback Loop** | [gemini/gemini-feedback-loop.md](gemini/gemini-feedback-loop.md) | Retry protocol |
| **21st.dev** | [21st-dev.md](21st-dev.md) | Component inspiration |
| **shadcn/ui** | [shadcn.md](shadcn.md) | Component library |
| **Buttons** | [buttons-guide.md](buttons-guide.md) | Button states, sizing |
| **Forms** | [forms-guide.md](forms-guide.md) | Validation, layout |
| **Cards** | [cards-guide.md](cards-guide.md) | Card patterns |
| **Icons** | [icons-guide.md](icons-guide.md) | Icon usage |
| **UI Design** | [ui-visual-design.md](ui-visual-design.md) | 2026 trends, animations |
| **Grids** | [grids-layout.md](grids-layout.md) | Layout system |
| **Patterns** | [design-patterns.md](design-patterns.md) | Common patterns and anti-patterns |
| **Layout Discipline** | [layout-discipline.md](layout-discipline.md) | Hard numeric caps (hero, eyebrow, zigzag, bento, CTA, measure, focal block) |
| **Reference Corpus** | `refs-design/{reference}-recode/index.html`, then [refs-design/README.md](refs-design/README.md) | Fifteen rebuilt pages — the mandatory first taste source. **Pick by the subject's VERB, before opening the procedure index** (README §*Read this before the table*; gated by pre-flight check 18). **Open the pages in a browser and scroll them BEFORE any markdown here** (`file://`, double-click, no build): they were accepted on the render, and measured values reproduce a procedure without ever choosing one. The README's procedure index (technique → reference → section) says where a procedure is written down, not what it looks like |
| **Inspiration** | [design-inspiration.md](design-inspiration.md) | Taste-sourcing order: corpus first (procedures), then 1-2 sector sites for register only; canonical Lookalike Test |
| **Inspiration URLs** | [design-inspiration-urls.md](design-inspiration-urls.md) | Where to look, in what order — corpus entry points and sector-browsing targets |
| **Composition** | [component-composition-ref.md](component-composition-ref.md) | Slots, compound components, component APIs |
| **Variants** | [component-variants-ref.md](component-variants-ref.md) | Multi-style components, variant props (CVA) |
| **Component Examples** | [component-examples.md](component-examples.md) | Index of production-ready component templates |
| **Photos & Images** | [photos-images.md](photos-images.md) | Overlays, resolution, focal point, consistency |
| **Page Architecture** | [layouts/page-architecture.md](layouts/page-architecture.md) | Page shell, regions, responsive structure |
| **Navigation** | [layouts/navigation/](layouts/navigation/) | navbar.md, sidebar.md, mobile-nav.md, footer.md |
| **Premium Patterns** | [PATTERNS.md](premium-patterns/PATTERNS.md) | 10 section devices with measured CSS — decoration inside one section, never page structure |

## Templates

| Template | When to Use |
|----------|-------------|
| [hero-section.md](templates/hero-section.md) | Hero section spec + Gemini prompt |
| [hero-glassmorphism.md](templates/hero-glassmorphism.md) | Glassmorphism hero spec |
| [feature-grid.md](templates/feature-grid.md) | Feature showcase spec + layout |
| [pricing-card.md](templates/pricing-card.md) | Pricing tier spec + Gemini prompt |
| [pricing-cards.md](templates/pricing-cards.md) | Pricing cards spec + Gemini prompt |
| [contact-form.md](templates/contact-form.md) | Contact form spec + validation |
| [testimonial-card.md](templates/testimonial-card.md) | Testimonial/review spec |
| [stats-section.md](templates/stats-section.md) | Stats section spec + counters |
| [faq-accordion.md](templates/faq-accordion.md) | FAQ section spec |
| [responsive-mobile-nav.md](templates/responsive-mobile-nav.md) | Responsive mobile navigation spec |

## Structure — not in this folder

The page's structure is never picked from the files above. Both banks live in
`design-method`:

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **First screen** | [../../design-method/references/macrostructure-bank.md](../../design-method/references/macrostructure-bank.md) | Eight hero treatments + the forbidden centered default |
| **Body order** | [../../design-method/references/body-sequence-bank.md](../../design-method/references/body-sequence-bank.md) | Fifteen body sequences read off shipped code — the order of everything after the first screen |
