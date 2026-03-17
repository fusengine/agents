---
name: react-setup
description: Complete React integration setup for Astro — install, config, component, usage
when-to-use: setting up React in a new or existing Astro project
keywords: react, setup, complete, install, config, component
---

# React Integration Full Setup

## 1. Install

```bash
npx astro add react
```

## 2. astro.config.ts

```typescript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

## 3. tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

## 4. Component (src/components/react/Button.tsx)

```tsx
import { useState } from 'react';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ label, variant = 'primary', onClick }: ButtonProps) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(true);
    onClick?.();
  }

  return (
    <button
      className={`btn btn-${variant} ${clicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
```

## 5. Usage in Astro Page

```astro
---
import { Button } from '../components/react/Button.tsx';
---
<!-- No directive = static HTML, no JS -->
<Button label="Read More" />

<!-- With client:load = interactive, ships JS -->
<Button label="Subscribe" client:load onClick={() => console.log('clicked')} />

<!-- Lazy below-fold -->
<Button label="Load More" client:visible />
```
