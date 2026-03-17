---
name: astro-starlight
description: Astro Starlight documentation theme — setup, sidebar config, Pagefind search, dark/light mode, plugins (DocSearch, blog, openapi, typedoc, versions), multi-language, Content Layer API, llms.txt, customization. Use for building documentation sites.
versions:
  astro: "6"
  starlight: "0.38+"
user-invocable: true
references: references/setup.md, references/sidebar-config.md, references/search.md, references/plugins.md, references/i18n-multilang.md, references/content-layer.md, references/customization.md, references/templates/starlight-config.md, references/templates/sidebar-example.md
related-skills: astro-6, astro-content, astro-i18n, astro-seo
---

# Astro Starlight

Production-ready documentation theme for Astro with built-in search, dark mode, i18n, and rich plugin ecosystem.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing Starlight config, sidebar, and content structure
2. **fuse-ai-pilot:research-expert** - Verify Starlight plugin APIs via Context7/Exa
3. **mcp__context7__query-docs** - Check Starlight docs for Content Layer and i18n patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building technical documentation sites
- Creating API reference docs (with starlight-openapi)
- Generating docs from TypeScript types (with starlight-typedoc)
- Adding a blog to a documentation site (with starlight-blog)
- Setting up versioned documentation (with starlight-versions)
- Multi-language documentation with hreflang support

### Why Starlight

| Feature | Benefit |
|---------|---------|
| Pagefind built-in | Full-text search, zero config |
| Dark/light mode | Automatic, CSS custom properties |
| Sidebar config | Filesystem-based or manual groups |
| Plugin ecosystem | DocSearch, blog, openapi, typedoc |
| Content Layer API | Astro 6 content collections integration |
| llms.txt support | `starlight-llms-txt` for AI discoverability |

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Setup** | [setup.md](references/setup.md) | Installation, project structure |
| **Sidebar** | [sidebar-config.md](references/sidebar-config.md) | Navigation, groups, auto-gen |
| **Search** | [search.md](references/search.md) | Pagefind, DocSearch, exclude pages |
| **Plugins** | [plugins.md](references/plugins.md) | Blog, openapi, typedoc, versions |
| **i18n** | [i18n-multilang.md](references/i18n-multilang.md) | Locales, translations, hreflang |
| **Content Layer** | [content-layer.md](references/content-layer.md) | docsLoader, schema, collections |
| **Customization** | [customization.md](references/customization.md) | CSS variables, components override |

### Templates

| Template | When to Use |
|----------|-------------|
| [starlight-config.md](references/templates/starlight-config.md) | Full astro.config.mjs with Starlight |
| [sidebar-example.md](references/templates/sidebar-example.md) | Complex sidebar with groups and badges |

---

## Best Practices

1. **Start with filesystem sidebar** - Add manual config only when needed
2. **Keep Pagefind for small sites** - DocSearch for high-traffic or large docs
3. **Use `starlight-llms-txt`** - AI crawlers increasingly important for docs
4. **Content Layer schema** - Type-safe frontmatter prevents runtime errors
5. **CSS custom properties** - Override theme without component slots
