---
name: interactive-island
description: React component as an interactive island with client:load and client:visible
when-to-use: adding an interactive React/Vue/Svelte component to an Astro page
keywords: interactive, island, React, client:load, client:visible, counter
---

# Interactive Island Template

## src/components/Counter.tsx (React)

```tsx
import { useState } from 'react';

interface Props {
  initialCount?: number;
  label?: string;
}

export function Counter({ initialCount = 0, label = 'Count' }: Props) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>{label}: {count}</p>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

## src/pages/index.astro

```astro
---
import { Counter } from '../components/Counter.tsx';
import LazySection from '../components/LazySection.tsx';
---

<!-- Critical interactive component: loads immediately -->
<Counter client:load initialCount={0} label="Items" />

<!-- Non-critical: loads when visible (saves bandwidth) -->
<LazySection client:visible />

<!-- Below-fold chart: loads only when scrolled to -->
<StatsChart
  data={stats}
  client:visible
/>
```

## src/components/SearchBar.tsx

```tsx
import { useState } from 'react';

interface Props {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search...' }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (q.length > 2) {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(await res.json());
    }
  }

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={handleSearch}
        placeholder={placeholder}
      />
      <ul>
        {results.map((r: any) => <li key={r.id}>{r.title}</li>)}
      </ul>
    </div>
  );
}
```

## Astro Page

```astro
---
import { SearchBar } from '../components/SearchBar.tsx';
---
<!-- Search bar: loads immediately as it's above the fold -->
<SearchBar client:load placeholder="Search articles..." />
```
