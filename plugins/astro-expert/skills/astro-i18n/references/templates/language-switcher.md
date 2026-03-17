# Template: Language Switcher Component

Locale switcher that generates URLs for all available locales.

## src/components/LanguageSwitcher.astro

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

interface Props {
  currentPath?: string;
}

const { currentPath = '/' } = Astro.props;
const currentLocale = Astro.currentLocale ?? 'en';

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
];

// Strip locale prefix from current path for cross-locale linking
const cleanPath = currentPath.replace(/^\/(en|fr|es)\//, '/');
---

<nav aria-label="Language switcher">
  <ul class="lang-switcher">
    {locales.map(({ code, label, flag }) => (
      <li>
        <a
          href={getRelativeLocaleUrl(code, cleanPath.slice(1))}
          aria-current={code === currentLocale ? 'true' : undefined}
          class:list={['lang-link', { 'lang-link--active': code === currentLocale }]}
          hreflang={code}
          lang={code}
        >
          <span aria-hidden="true">{flag}</span>
          <span class="lang-label">{label}</span>
        </a>
      </li>
    ))}
  </ul>
</nav>

<style>
  .lang-switcher {
    list-style: none;
    display: flex;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
  }

  .lang-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    color: var(--color-text-muted, #6b7280);
    font-size: 0.875rem;
    transition: color 0.2s;
  }

  .lang-link--active {
    color: var(--color-primary, #6366f1);
    font-weight: 600;
  }

  .lang-link:hover:not(.lang-link--active) {
    color: var(--color-text, #1a1a1a);
  }
</style>
```

## Usage

```astro
---
import LanguageSwitcher from '../components/LanguageSwitcher.astro';
---

<header>
  <nav><!-- Main nav --></nav>
  <LanguageSwitcher currentPath={Astro.url.pathname} />
</header>
```
