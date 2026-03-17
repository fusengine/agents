# Template: Locale-Aware Page

Complete page component with locale detection, translations, and hreflang.

## src/pages/[locale]/about.astro

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations } from '../../lib/i18n/translations';

export function getStaticPaths() {
  return [
    { params: { locale: 'fr' } },
    { params: { locale: 'es' } }
  ];
}

const { locale } = Astro.params;
const t = useTranslations(locale);
const currentLocale = Astro.currentLocale ?? 'en';
---

<BaseLayout title={t.pages.about.title} locale={currentLocale}>
  <main>
    <h1>{t.pages.about.heading}</h1>
    <p>{t.pages.about.description}</p>
    <a href={getRelativeLocaleUrl(currentLocale, 'blog')}>
      {t.nav.blog}
    </a>
  </main>
</BaseLayout>
```

## src/pages/about.astro (Default locale — English)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { useTranslations } from '../lib/i18n/translations';

const t = useTranslations('en');
---

<BaseLayout title={t.pages.about.title} locale="en">
  <main>
    <h1>{t.pages.about.heading}</h1>
    <p>{t.pages.about.description}</p>
  </main>
</BaseLayout>
```

## src/layouts/BaseLayout.astro (with hreflang)

```astro
---
import { getAbsoluteLocaleUrl } from 'astro:i18n';

interface Props {
  title: string;
  locale: string;
  path?: string;
}

const { title, locale, path = Astro.url.pathname } = Astro.props;
const locales = ['en', 'fr', 'es'];
const localeMap: Record<string, string> = {
  en: 'en-US', fr: 'fr-FR', es: 'es-ES'
};
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    {locales.map(l => (
      <link rel="alternate" hreflang={localeMap[l]}
            href={getAbsoluteLocaleUrl(l, path)} />
    ))}
    <link rel="alternate" hreflang="x-default"
          href={getAbsoluteLocaleUrl('en', path)} />
  </head>
  <body>
    <slot />
  </body>
</html>
```
