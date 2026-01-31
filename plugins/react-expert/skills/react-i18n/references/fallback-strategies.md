---
name: fallback-strategies
description: Handle missing translations - language fallback, namespace fallback, default values
when-to-use: missing translations, graceful degradation, development workflow
keywords: fallback, missing, default, graceful, degradation
priority: low
related: namespaces.md, i18next-basics.md
---

# Fallback Strategies

## Language Fallback

**Use alternative language when translation missing.**

### Purpose
- Graceful degradation
- Partial translations
- Development workflow

### When to Use
- Incomplete translations
- New feature rollout
- Regional variants

### Key Points
- `fallbackLng` in config
- Chain of fallbacks
- Regional to base (`en-GB` → `en`)
- Always have complete base language

---

## Namespace Fallback

**Check common namespace for missing keys.**

### Purpose
- Shared translations
- Reduce duplication
- Centralized common strings

### When to Use
- Common actions/labels
- Shared UI elements
- Cross-feature terms

### Key Points
- Set `fallbackNS: 'common'`
- Checked after current namespace
- Reduces translation maintenance
- Keep common namespace complete

---

## Default Values

**Provide fallback in code.**

### Purpose
- Guaranteed display text
- Development without translations
- New feature development

### When to Use
- Critical user-facing text
- Development phase
- Fallback guarantee needed

### Key Points
- Second parameter to `t()`
- Used if key missing
- Works with all features
- Consider for new keys

---

## Missing Key Handling

| Strategy | Use Case |
|----------|----------|
| `fallbackLng` | Incomplete locale |
| `fallbackNS` | Shared common keys |
| Default value | Code-level fallback |
| `saveMissing` | Development detection |
| `parseMissingKeyHandler` | Custom display |

---

## Development Detection

**Identify and report missing keys.**

### Purpose
- Find missing translations
- Development visibility
- QA workflow

### When to Use
- Development mode
- Translation workflow
- CI/CD checks

### Key Points
- Enable `saveMissing` in dev
- Custom handler for logging
- Visual indicator optional
- Report to translation service

---

→ See i18next-basics.md for configuration setup
