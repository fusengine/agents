# Template: Layout Component with Slots

SOLID-compliant layout with named slots and JSDoc (< 80 lines).

## src/layouts/BaseLayout.astro

```astro
---
import type { BaseLayoutProps } from '../interfaces/component.interface';
import '../styles/global.css';

type Props = BaseLayoutProps;

const {
  title,
  description = 'A fast Astro website',
  locale = 'en',
  ogImage
} = Astro.props;

const canonicalUrl = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />

    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />

    <title>{title}</title>
    <slot name="head" />
  </head>
  <body>
    <slot name="header" />
    <main>
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

## src/interfaces/component.interface.ts (extract)

```typescript
/**
 * Props for the BaseLayout component.
 */
export interface BaseLayoutProps {
  /** Page title used in <title> and og:title */
  title: string;

  /** Meta description for SEO */
  description?: string;

  /** BCP 47 locale code for the html[lang] attribute */
  locale?: string;

  /** OpenGraph image URL */
  ogImage?: string;
}
```

## Usage

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About Us" description="Learn about our team" locale="en">
  <header slot="header">
    <nav><!-- nav here --></nav>
  </header>

  <article>
    <h1>About Us</h1>
  </article>

  <footer slot="footer">
    <p>© 2026 Example</p>
  </footer>
</BaseLayout>
```
