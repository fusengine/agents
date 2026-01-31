---
title: Debounced Search Form
description: Search form with debounced input, async search, loading states, and results display
---

# Debounced Search Form

Real-time search form with debounced input validation, async search-as-you-type, and result handling.

## Basic Debounced Search

Search with debounced async validation for backend queries.

```typescript
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

interface SearchResult {
  id: string
  title: string
  description?: string
}

/**
 * Displays search results with optional description.
 * @param results - Array of search results to display
 */
function SearchResults({ results }: { results: SearchResult[] }) {
  if (results.length === 0) {
    return <div className="text-gray-500">No results found</div>
  }

  return (
    <ul className="mt-4 border rounded-lg divide-y">
      {results.map((result) => (
        <li key={result.id} className="p-3 hover:bg-gray-50">
          <div className="font-medium">{result.title}</div>
          {result.description && (
            <div className="text-sm text-gray-600">{result.description}</div>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * Displays loading indicator during async search.
 */
function LoadingIndicator() {
  return (
    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
      <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full" />
      Searching...
    </div>
  )
}

/**
 * Simulates backend search API call.
 * @param query - Search query string
 * @returns Promise resolving to search results
 */
async function searchAPI(query: string): Promise<SearchResult[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock search results
  const mockResults: Record<string, SearchResult[]> = {
    react: [
      { id: '1', title: 'React Documentation', description: 'Official React docs' },
      { id: '2', title: 'React Router', description: 'Client-side routing library' },
    ],
    form: [
      { id: '3', title: 'Form Validation', description: 'Best practices guide' },
      { id: '4', title: 'TanStack Form', description: 'Headless form library' },
    ],
  }

  const key = query.toLowerCase()
  return mockResults[key] || []
}

function DebouncedSearchForm() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const form = useForm({
    defaultValues: {
      query: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Search submitted:', value.query)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="w-full max-w-md"
    >
      <form.Field
        name="query"
        validators={{
          onChange: ({ value }) =>
            value.length > 0 && value.length < 2
              ? 'Query must be at least 2 characters'
              : undefined,
        }}
        onChangeAsyncDebounceMs={300}
        onChangeAsync={async ({ value }) => {
          if (value.length >= 2) {
            const results = await searchAPI(value)
            setSearchResults(results)
          } else {
            setSearchResults([])
          }
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-2">
              Search
            </label>
            <input
              id={field.name}
              type="text"
              placeholder="Search..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <div className="mt-1 text-sm text-red-500">
                {field.state.meta.errors.join(', ')}
              </div>
            )}

            {field.state.meta.isValidating && <LoadingIndicator />}

            {field.state.value.length >= 2 && !field.state.meta.isValidating && (
              <SearchResults results={searchResults} />
            )}
          </div>
        )}
      />
    </form>
  )
}

export default DebouncedSearchForm
```

## Search with Clear Button

Enhanced search with result clearing functionality.

```typescript
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

/**
 * Search form with clear functionality and result count.
 */
function SearchFormWithClear() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const form = useForm({
    defaultValues: {
      query: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Final search:', value.query)
    },
  })

  /**
   * Clears search input and results.
   */
  const handleClear = () => {
    form.setFieldValue('query', '')
    setSearchResults([])
    setHasSearched(false)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="query"
        onChangeAsyncDebounceMs={300}
        onChangeAsync={async ({ value }) => {
          setHasSearched(value.length >= 2)
          if (value.length >= 2) {
            const results = await searchAPI(value)
            setSearchResults(results)
          } else {
            setSearchResults([])
          }
        }}
        children={(field) => (
          <div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label htmlFor={field.name} className="block text-sm font-medium mb-2">
                  Search Products
                </label>
                <input
                  id={field.name}
                  type="text"
                  placeholder="e.g., React, Form..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {field.state.value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                >
                  Clear
                </button>
              )}
            </div>

            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <div className="mt-1 text-sm text-red-500">
                {field.state.meta.errors.join(', ')}
              </div>
            )}
          </div>
        )}
      />

      <div className="space-y-2">
        {field.state.meta.isValidating && <LoadingIndicator />}

        {hasSearched && searchResults.length > 0 && (
          <div className="text-sm text-gray-600 mb-2">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </div>
        )}

        {hasSearched && <SearchResults results={searchResults} />}
      </div>

      <button
        type="submit"
        disabled={!form.state.canSubmit || !hasSearched}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Search
      </button>
    </form>
  )
}

export default SearchFormWithClear
```

## Advanced: Multi-filter Search

Search with multiple filter fields and combined results.

```typescript
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'

interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
}

/**
 * Displays field validation errors and loading state.
 */
function FieldError({ field }: { field: AnyFieldApi }) {
  if (field.state.meta.isTouched && !field.state.meta.isValid) {
    return <div className="mt-1 text-sm text-red-500">{field.state.meta.errors.join(', ')}</div>
  }
  return null
}

/**
 * Advanced search form with category and price filters.
 */
function AdvancedSearchForm() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const form = useForm({
    defaultValues: {
      query: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000,
    },
    onSubmit: async ({ value }) => {
      console.log('Advanced search:', value)
    },
  })

  /**
   * Fetches results based on query and filters.
   */
  async function performSearch(query: string, filters: FilterOptions) {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Simulate filtered search API call
      await new Promise((resolve) => setTimeout(resolve, 600))
      const results = await searchAPI(query)

      // Apply client-side filters for demo
      const filtered = results.filter((result) => {
        if (filters.category && !result.title.toLowerCase().includes(filters.category)) {
          return false
        }
        return true
      })

      setSearchResults(filtered)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4 w-full max-w-md"
    >
      {/* Query Field */}
      <form.Field
        name="query"
        validators={{
          onChange: ({ value }) =>
            value.length > 0 && value.length < 2
              ? 'Enter at least 2 characters'
              : undefined,
        }}
        onChangeAsyncDebounceMs={400}
        onChangeAsync={async ({ value }) => {
          const formState = form.getFieldValue('category')
          await performSearch(value, { category: formState })
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-2">
              Search Query
            </label>
            <input
              id={field.name}
              type="text"
              placeholder="Search..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError field={field} />
          </div>
        )}
      />

      {/* Category Filter */}
      <form.Field
        name="category"
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="react">React</option>
              <option value="form">Forms</option>
              <option value="validation">Validation</option>
            </select>
          </div>
        )}
      />

      {/* Results Section */}
      {isSearching && <LoadingIndicator />}

      {!isSearching && searchResults.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Results ({searchResults.length})
          </div>
          <SearchResults results={searchResults} />
        </div>
      )}

      {!isSearching && form.getFieldValue('query').length >= 2 && searchResults.length === 0 && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
          No results match your search and filters
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Search
      </button>
    </form>
  )
}

export default AdvancedSearchForm
```

## Best Practices

1. **Debounce Async Operations** - Use `onChangeAsyncDebounceMs` to prevent excessive API calls
2. **Show Loading States** - Display spinner or skeleton while fetching results
3. **Clear Results on Reset** - Clear search state when input is cleared
4. **Minimum Query Length** - Require 2+ characters before searching
5. **Error Handling** - Gracefully handle API failures with user feedback
6. **Accessibility** - Use proper labels and ARIA attributes
7. **Result Limits** - Implement pagination or limit result count for large datasets
8. **Cache Results** - Consider memoizing recent searches to reduce API calls
