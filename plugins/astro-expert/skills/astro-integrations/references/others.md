---
name: others
description: AlpineJS, Lit, Qwik, Angular integrations for Astro
when-to-use: using Alpine for minimal JS, Lit for web components, Qwik for resumability, Angular
keywords: alpinejs, lit, qwik, angular, @astrojs/alpinejs, @astrojs/lit, @qwikdev/astro
priority: low
---

# Other Framework Integrations

## @astrojs/alpinejs

Minimal JS framework — adds `x-data` directives to HTML.

```bash
npx astro add alpinejs
```

```astro
<!-- Usage: no client directive needed -->
<div x-data="{ count: 0 }">
  <button x-on:click="count++">Count: <span x-text="count"></span></button>
</div>
```

## @astrojs/lit

Web components using Lit library.

```bash
npx astro add lit
```

```typescript
// src/components/my-counter.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-counter')
export class MyCounter extends LitElement {
  @property({ type: Number }) count = 0;

  render() {
    return html`<button @click=${() => this.count++}>${this.count}</button>`;
  }
}
```

```astro
---
import '../components/my-counter.ts';
---
<my-counter client:load count={5}></my-counter>
```

## @qwikdev/astro

Qwik framework for resumable applications (zero hydration cost).

```bash
npm install @qwikdev/astro
```

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import qwikdev from '@qwikdev/astro';

export default defineConfig({
  integrations: [qwikdev()],
});
```

## @analogjs/astro-angular

Angular components in Astro (via AnalogJS).

```bash
npm install @analogjs/astro-angular
```

```typescript
integrations: [analogAngular()]
```

Note: Angular integration requires zone.js and has larger overhead — use only when migrating existing Angular components.
