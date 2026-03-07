---
name: faq-accordion
description: FAQ accordion section with chevron indicator and Schema.org structured data
when-to-use: FAQ pages, support sections, knowledge base with expandable Q&A
keywords: faq, accordion, questions, collapsible, schema-org
priority: medium
related: contact-form.md
---

# FAQ Accordion Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Header | Section title + subtitle (optional) | Centered |
| Accordion | Collapsible items with chevron indicator | Full width, max-w-3xl centered |
| Each item | Question (trigger) + Answer (content) | Full width |

**Research: 7-10 items maximum. Most-asked questions first. Include Schema.org FAQPage structured data for SEO (+20% SERP visibility).**

## Components (shadcn/ui)

- Accordion: type="single" collapsible
- AccordionItem: container per Q&A pair
- AccordionTrigger: question with chevron rotation
- AccordionContent: answer with muted foreground

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| max-width | max-w-3xl mx-auto | Readable line length |
| trigger-font | font-medium text-left | Question styling |
| content-color | text-muted-foreground | Answer contrast |
| border | Default accordion borders | Separator between items |
| chevron | Rotate 180deg on open | Built into shadcn |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Section | opacity 0->1 on scroll | 0.4s |
| Accordion open | Height auto with spring | Built-in shadcn |
| Chevron | Rotate 0->180deg | 0.2s |

## Gemini Design Prompt

> "Create a FAQ section with centered heading and shadcn Accordion (type='single', collapsible). Max 7-10 items with chevron indicator. Questions left-aligned, answers in muted foreground. Max-w-3xl centered layout. Include Schema.org FAQPage JSON-LD script tag. Use design-system.md tokens. OKLCH colors, no Inter/Roboto."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with shadcn Accordion |
| Laravel Blade | Visual spec -> Livewire Flux accordion |
| Swift/SwiftUI | Visual spec -> DisclosureGroup with animation |

## Validation Checklist

- [ ] Uses shadcn Accordion, not custom implementation
- [ ] type="single" collapsible (one open at a time)
- [ ] Chevron rotates on open/close
- [ ] Max 7-10 items, most asked first
- [ ] Schema.org FAQPage structured data included
