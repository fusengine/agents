---
name: basic-setup
description: Complete Astro 7 project setup with TypeScript, output mode, and layout
when-to-use: starting a new Astro 7 project from scratch
keywords: setup, project, layout, typescript, config
---

# Astro 7 Basic Project Setup

## Project Structure

```
my-site/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       └── [slug].astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   └── content.config.ts
├── public/
├── astro.config.ts
├── tsconfig.json
└── package.json
```

## astro.config.ts

```typescript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mysite.com',
  output: 'static',
});
```

## src/layouts/BaseLayout.astro

```astro
---
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'My Astro site' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## src/pages/index.astro

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <h1>Welcome to Astro 7</h1>
</BaseLayout>
```

## tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict"
}
```
