---
name: search-filters
description: Search page with type-safe filters and pagination
keywords: search, filters, pagination, sort, zod, url-state
---

# Search Filters Template

Complete search page with URL-synced filters.

## Structure

```text
src/
├── modules/
│   └── products/
│       ├── src/
│       │   ├── interfaces/
│       │   │   ├── product.interface.ts
│       │   │   └── search.interface.ts
│       │   ├── queries/
│       │   │   └── products.queries.ts
│       │   └── components/
│       │       ├── ProductCard.tsx
│       │       ├── ProductGrid.tsx
│       │       ├── SearchFilters.tsx
│       │       └── Pagination.tsx
│       └── index.ts
└── routes/
    └── products/
        └── index.tsx
```

---

## Search Interfaces

```typescript
// src/modules/products/src/interfaces/search.interface.ts

/**
 * Product categories.
 */
export type ProductCategory = 'all' | 'electronics' | 'clothing' | 'books'

/**
 * Sort options.
 */
export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'popular'

/**
 * Search params schema.
 */
export interface ProductSearchParams {
  page: number
  pageSize: number
  sort: SortOption
  category: ProductCategory
  minPrice?: number
  maxPrice?: number
  search?: string
  inStock?: boolean
}

/**
 * Default search params.
 */
export const defaultSearchParams: ProductSearchParams = {
  page: 1,
  pageSize: 24,
  sort: 'newest',
  category: 'all',
}
```

---

## Zod Search Schema

```typescript
// src/modules/products/src/schemas/search.schema.ts
import { z } from 'zod'

/**
 * Zod schema for search params validation.
 */
export const productSearchSchema = z.object({
  // Pagination
  page: z.number().min(1).default(1),
  pageSize: z.number().min(12).max(48).default(24),

  // Sorting
  sort: z
    .enum(['newest', 'oldest', 'price-asc', 'price-desc', 'popular'])
    .default('newest'),

  // Filters
  category: z
    .enum(['all', 'electronics', 'clothing', 'books'])
    .default('all'),

  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),

  search: z.string().min(1).optional(),

  inStock: z.boolean().optional(),
})

export type ProductSearchSchema = z.infer<typeof productSearchSchema>
```

---

## Route with Filters

```typescript
// src/routes/products/index.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { stripSearchParams } from '@tanstack/react-router'
import {
  productSearchSchema,
  productsQueryOptions,
  ProductGrid,
  SearchFilters,
  Pagination,
  defaultSearchParams,
} from '@/modules/products'

export const Route = createFileRoute('/products/')({
  validateSearch: zodValidator(productSearchSchema),
  search: {
    middlewares: [
      // Strip default values from URL
      stripSearchParams({
        page: 1,
        pageSize: 24,
        sort: 'newest',
        category: 'all',
      }),
    ],
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(productsQueryOptions(search)),
  component: ProductsPage,
})

function ProductsPage() {
  const { data: products, meta } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const updateSearch = (updates: Partial<ProductSearchSchema>) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        ...updates,
        // Reset page on filter change
        page: 'page' in updates ? updates.page : 1,
      }),
      replace: true,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="flex gap-8">
        <aside className="w-64">
          <SearchFilters
            values={search}
            onChange={updateSearch}
          />
        </aside>

        <main className="flex-1">
          <ProductGrid products={products} />
          <Pagination
            meta={meta}
            currentPage={search.page}
            onPageChange={(page) => updateSearch({ page })}
          />
        </main>
      </div>
    </div>
  )
}
```

---

## Search Filters Component

```typescript
// src/modules/products/src/components/SearchFilters.tsx
import type { ProductSearchSchema } from '../schemas/search.schema'
import type { ProductCategory, SortOption } from '../interfaces/search.interface'

interface SearchFiltersProps {
  values: ProductSearchSchema
  onChange: (updates: Partial<ProductSearchSchema>) => void
}

/**
 * Search filters sidebar component.
 */
export function SearchFilters({ values, onChange }: SearchFiltersProps) {
  return (
    <div className="space-y-6">
      <SearchInput
        value={values.search}
        onChange={(search) => onChange({ search })}
      />
      <CategoryFilter
        value={values.category}
        onChange={(category) => onChange({ category })}
      />
      <SortFilter
        value={values.sort}
        onChange={(sort) => onChange({ sort })}
      />
      <PriceFilter
        min={values.minPrice}
        max={values.maxPrice}
        onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
      />
      <InStockFilter
        value={values.inStock}
        onChange={(inStock) => onChange({ inStock })}
      />
      <ClearButton onClick={() => onChange({})} />
    </div>
  )
}

function SearchInput({
  value,
  onChange,
}: {
  value?: string
  onChange: (v: string | undefined) => void
}) {
  return (
    <div>
      <label className="block font-medium mb-2">Search</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder="Search products..."
        className="w-full border rounded p-2"
      />
    </div>
  )
}

function CategoryFilter({
  value,
  onChange,
}: {
  value: ProductCategory
  onChange: (v: ProductCategory) => void
}) {
  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
  ]

  return (
    <div>
      <label className="block font-medium mb-2">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductCategory)}
        className="w-full border rounded p-2"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function SortFilter({
  value,
  onChange,
}: {
  value: SortOption
  onChange: (v: SortOption) => void
}) {
  const options: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ]

  return (
    <div>
      <label className="block font-medium mb-2">Sort By</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-full border rounded p-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function PriceFilter({
  min,
  max,
  onChange,
}: {
  min?: number
  max?: number
  onChange: (min?: number, max?: number) => void
}) {
  return (
    <div>
      <label className="block font-medium mb-2">Price Range</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={min || ''}
          onChange={(e) => onChange(
            e.target.value ? Number(e.target.value) : undefined,
            max
          )}
          placeholder="Min"
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          value={max || ''}
          onChange={(e) => onChange(
            min,
            e.target.value ? Number(e.target.value) : undefined
          )}
          placeholder="Max"
          className="w-full border rounded p-2"
        />
      </div>
    </div>
  )
}

function InStockFilter({
  value,
  onChange,
}: {
  value?: boolean
  onChange: (v: boolean | undefined) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked || undefined)}
      />
      <span>In Stock Only</span>
    </label>
  )
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full border rounded p-2 text-gray-600"
    >
      Clear All Filters
    </button>
  )
}
```

---

## Pagination Component

```typescript
// src/modules/products/src/components/Pagination.tsx
import { Link } from '@tanstack/react-router'

interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface PaginationProps {
  meta: PaginationMeta
  currentPage: number
  onPageChange: (page: number) => void
}

/**
 * Pagination component with URL sync.
 */
export function Pagination({ meta, currentPage, onPageChange }: PaginationProps) {
  const pages = generatePageNumbers(currentPage, meta.totalPages)

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={i}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === meta.totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 3) {
    return [1, 2, 3, 4, '...', total]
  }

  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
}
```

---

## Module Exports

```typescript
// src/modules/products/index.ts

// Interfaces
export type { ProductSearchParams, ProductCategory, SortOption } from './src/interfaces/search.interface'
export { defaultSearchParams } from './src/interfaces/search.interface'

// Schema
export { productSearchSchema, type ProductSearchSchema } from './src/schemas/search.schema'

// Queries
export { productsQueryOptions } from './src/queries/products.queries'

// Components
export { ProductGrid } from './src/components/ProductGrid'
export { SearchFilters } from './src/components/SearchFilters'
export { Pagination } from './src/components/Pagination'
```
