---
name: astro-starlight
description: Use when building a documentation site with Astro Starlight — sidebar config, Pagefind search, plugins (blog/openapi/typedoc), i18n, llms.txt.
versions:
  astro: "7"
  starlight: "0.41+"
user-invocable: true
references: references/setup.md, references/sidebar-config.md, references/search.md, references/plugins.md, references/i18n-multilang.md, references/content-layer.md, references/customization.md, references/templates/starlight-config.md, references/templates/sidebar-example.md
related-skills: astro-7, astro-content, astro-i18n, astro-seo
---

<objective>
Sets up and customizes Astro Starlight (0.41+), the documentation theme built on Astro 7: filesystem-based or manual sidebar configuration, built-in Pagefind full-text search (or DocSearch for high-traffic/large docs), automatic dark/light mode, and the plugin ecosystem — `starlight-blog`, `starlight-openapi`, `starlight-typedoc`, `starlight-versions`, `starlight-llms-txt` for AI discoverability.

Also covers multi-language documentation with hreflang support and Content Layer API integration (`docsLoader`, schema) specific to Starlight's content model, plus CSS custom property theming. Does not cover generic Astro Content Layer usage outside Starlight (astro-content) or non-Starlight i18n routing (astro-i18n) — those are handled by their own skills.
</objective>

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
| Content Layer API | Astro 7 content collections integration |
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
