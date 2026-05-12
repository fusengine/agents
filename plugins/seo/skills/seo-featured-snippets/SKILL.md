---
name: seo-featured-snippets
description: Use when optimizing for position 0 featured snippets and AI Overviews. Covers paragraph, list, table, and video snippet recipes with format-specific HTML patterns.
user-invocable: false
related-skills: seo, seo-geo, seo-content, seo-sxo
---

# Featured Snippets (Position 0)

## Snippet Types

| Type | Format | Trigger Queries |
|------|--------|-----------------|
| Paragraph | 40-60 words, direct answer | "what is", "how to", "why" |
| List | `<ol>` or `<ul>`, 4-8 items | "steps to", "ways to", "best" |
| Table | `<table>`, comparison data | "X vs Y", "compare" |
| Video | YouTube embed + timestamps | "how to" with visual benefit |

## Paragraph Snippet Recipe

```html
<h2>What is <topic>?</h2>
<p>
  <topic> is a <category> that <main function>.
  It <key benefit> by <method>.
  Common use cases include <list>.
</p>
```
40-60 words, direct answer, no fluff, no marketing speak.

## List Snippet Recipe

```html
<h2>How to <task></h2>
<ol>
  <li><strong>Step 1</strong>: <action></li>
  <li><strong>Step 2</strong>: <action></li>
  ...
</ol>
```

## Table Snippet Recipe

```html
<h2>X vs Y</h2>
<table>
  <thead><tr><th>Feature</th><th>X</th><th>Y</th></tr></thead>
  <tbody>...</tbody>
</table>
```

## AI Overviews Connection

Featured snippets are **primary training data** for AI Overviews. Structured answers ranking in position 0 are 70%+ likely to appear in AI Overview citations.

## Anti-Patterns

- ❌ Hiding answer at bottom of article
- ❌ Vague intro paragraph ("In this article we'll explore...")
- ❌ Marketing in snippet target ("our amazing solution")
