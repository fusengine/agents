---
name: language-detection
description: Auto-detect user language - browser, URL, cookie, localStorage detection and persistence
when-to-use: automatic language selection, persisting user preference, URL-based languages
keywords: detection, language, browser, cookie, localStorage, URL
priority: medium
related: templates/language-switcher.md, i18next-basics.md
---

# Language Detection

## Detection Sources

**Multiple sources for detecting user language.**

### Purpose
- Automatic language selection
- Honor user preferences
- Support URL-based languages

### When to Use
- First-time visitors
- Returning users
- SEO with language paths

### Key Points
- Multiple sources in priority order
- Falls back through chain
- Configurable per source
- Browser language as default

---

## Source Priority

| Source | Description | Best For |
|--------|-------------|----------|
| `querystring` | URL param `?lng=fr` | Testing, sharing |
| `cookie` | Browser cookie | Server sync |
| `localStorage` | Web Storage | SPA persistence |
| `navigator` | Browser language | First visit |
| `path` | URL path `/fr/about` | SEO, URLs |
| `subdomain` | `fr.example.com` | Multi-domain |

---

## Persistence

**Remember user's language choice.**

### Purpose
- Consistent experience on return
- Sync across tabs/sessions
- Server-side awareness

### When to Use
- User-selectable language
- Multi-session apps
- Server-rendered apps

### Key Points
- Configure `caches` option
- localStorage for SPAs
- Cookie for SSR sync
- Auto-persist on change

---

## Language Mapping

**Map browser languages to your supported languages.**

### Purpose
- Handle regional variants
- Reduce supported languages
- Graceful fallbacks

### When to Use
- `en-US` → `en` normalization
- Unsupported variant handling
- Regional preferences

### Key Points
- Use `supportedLngs` whitelist
- Configure `load: 'languageOnly'`
- Custom mapping function
- Fallback chain for variants

---

## Manual Language Change

**Programmatic language switching.**

### Purpose
- User-initiated language change
- Persistence automatic
- UI update triggers

### When to Use
- Language switcher component
- Settings page
- User preferences

### Key Points
- `i18n.changeLanguage()` is async
- Auto-persists to caches
- Triggers re-render
- Loads new translations

---

→ See `templates/language-switcher.md` for switcher component examples
