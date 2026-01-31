---
name: use-deferred-value-template
description: useDeferredValue patterns with initialValue (React 19)
---

# useDeferredValue Patterns

## Basic with initialValue

```typescript
// modules/search/components/SearchResults.tsx
import { useDeferredValue, useMemo } from 'react'

interface SearchResultsProps {
  query: string
  items: Item[]
}

export function SearchResults({ query, items }: SearchResultsProps) {
  // Start with empty string on initial render
  // Prevents flash of "no results" before first search
  const deferredQuery = useDeferredValue(query, '')

  const filteredItems = useMemo(() => {
    if (!deferredQuery) return items
    return items.filter((item) =>
      item.name.toLowerCase().includes(deferredQuery.toLowerCase())
    )
  }, [items, deferredQuery])

  const isStale = query !== deferredQuery

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
```

---

## Search Input with Deferred Results

```typescript
// modules/search/components/SearchPage.tsx
import { useState, useDeferredValue, Suspense } from 'react'

export function SearchPage() {
  const [query, setQuery] = useState('')

  // Defer the query passed to results
  // Initial value '' prevents loading state on mount
  const deferredQuery = useDeferredValue(query, '')

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      <Suspense fallback={<ResultsSkeleton />}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  )
}

function SearchResults({ query }: { query: string }) {
  // Fetch results - will suspend
  const results = use(fetchResults(query))

  return (
    <ul>
      {results.map((r) => (
        <li key={r.id}>{r.title}</li>
      ))}
    </ul>
  )
}
```

---

## Filter with Default Value

```typescript
// modules/products/components/ProductFilter.tsx
import { useDeferredValue, useMemo } from 'react'

interface ProductFilterProps {
  category: string | null
  products: Product[]
}

export function ProductFilter({ category, products }: ProductFilterProps) {
  // Default to 'all' on initial render
  const deferredCategory = useDeferredValue(category, 'all')

  const filtered = useMemo(() => {
    if (deferredCategory === 'all') return products
    return products.filter((p) => p.category === deferredCategory)
  }, [products, deferredCategory])

  const isPending = category !== deferredCategory

  return (
    <div>
      {isPending && <LoadingIndicator />}
      <ProductGrid products={filtered} />
    </div>
  )
}
```

---

## Expensive List Rendering

```typescript
// modules/data/components/DataTable.tsx
import { useDeferredValue, memo } from 'react'

interface DataTableProps {
  data: Row[]
  sortColumn: string
  sortDirection: 'asc' | 'desc'
}

export function DataTable({ data, sortColumn, sortDirection }: DataTableProps) {
  // Defer sorting to keep UI responsive
  const deferredSort = useDeferredValue(
    { column: sortColumn, direction: sortDirection },
    { column: 'id', direction: 'asc' }
  )

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[deferredSort.column]
      const bVal = b[deferredSort.column]
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return deferredSort.direction === 'asc' ? cmp : -cmp
    })
  }, [data, deferredSort])

  const isStale =
    sortColumn !== deferredSort.column ||
    sortDirection !== deferredSort.direction

  return (
    <table style={{ opacity: isStale ? 0.8 : 1 }}>
      <tbody>
        {sortedData.map((row) => (
          <TableRow key={row.id} row={row} />
        ))}
      </tbody>
    </table>
  )
}

const TableRow = memo(function TableRow({ row }: { row: Row }) {
  return (
    <tr>
      {Object.values(row).map((cell, i) => (
        <td key={i}>{cell}</td>
      ))}
    </tr>
  )
})
```

---

## Typeahead Autocomplete

```typescript
// modules/cores/components/Autocomplete.tsx
import { useState, useDeferredValue, useMemo } from 'react'

interface AutocompleteProps {
  suggestions: string[]
  onSelect: (value: string) => void
}

export function Autocomplete({ suggestions, onSelect }: AutocompleteProps) {
  const [input, setInput] = useState('')

  // Don't show suggestions initially
  const deferredInput = useDeferredValue(input, '')

  const matches = useMemo(() => {
    if (!deferredInput || deferredInput.length < 2) return []
    return suggestions.filter((s) =>
      s.toLowerCase().startsWith(deferredInput.toLowerCase())
    )
  }, [suggestions, deferredInput])

  return (
    <div className="relative">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type to search..."
      />
      {matches.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white shadow">
          {matches.map((match) => (
            <li key={match} onClick={() => onSelect(match)}>
              {match}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## Rules

- Use `initialValue` to prevent flash of loading/empty state on mount
- Combine with `useMemo` for expensive computations
- Check `value !== deferredValue` for pending state
- Works with Suspense for async data
- `initialValue` only affects first render
