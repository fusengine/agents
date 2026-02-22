## State Management (React / Next.js)

| State Type | Solution | Location |
|------------|----------|----------|
| Server (API) | TanStack Query | `modules/[feature]/src/hooks/` |
| Global UI | Zustand store | `modules/cores/stores/` |
| Feature shared | Zustand store | `modules/[feature]/src/stores/` |
| URL state | TanStack Router | Route validators |
| Form state | TanStack Form | `modules/[feature]/src/hooks/` |
| Local only | `useState` | Inside component |

## Zustand Rules
- Feature store: `modules/[feature]/src/stores/` | Global: `modules/cores/stores/`
- Max 40 lines per store, always use selectors, actions inside store

## FORBIDDEN
Prop drilling (3+ levels), `useContext` for global, `useEffect` for fetching, `useState` for shared, store in component file, subscribing to entire store
