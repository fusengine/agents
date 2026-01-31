---
name: document-metadata
description: React 19 Document Metadata - title, meta, link tags rendered in components
when-to-use: SEO, page titles, meta tags, social sharing, canonical links
keywords: title, meta, link, head, SEO, metadata, og, twitter
priority: high
related: templates/document-metadata.md, resource-loading.md
---

# Document Metadata (React 19)

## What Changed

React 19 supports rendering `<title>`, `<meta>`, and `<link>` directly in components.
They automatically hoist to `<head>`.

---

## Supported Elements

| Element | Purpose |
|---------|---------|
| `<title>` | Page title, hoisted to head |
| `<meta>` | Meta tags (description, og, twitter) |
| `<link>` | Stylesheets, preload, canonical |

---

## How It Works

### Automatic Hoisting

Elements render anywhere in component tree.
React automatically moves them to `<head>`.

### Deduplication

Multiple identical tags are deduplicated.
Last rendered value wins for `<title>`.

---

## Use Cases

### SEO

- Page titles per route
- Meta descriptions
- Canonical URLs

### Social Sharing

- Open Graph tags
- Twitter cards

### Stylesheets

- Component-scoped CSS with precedence
- Automatic loading order

---

## Key Points

- No need for react-helmet or next/head
- Works with SSR and streaming
- Automatic deduplication
- Precedence for stylesheets ordering

---

## Where to Find Code Templates?

→ `templates/document-metadata.md` - Full examples
→ `resource-loading.md` - Preloading APIs
