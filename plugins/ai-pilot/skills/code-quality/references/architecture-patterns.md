# Architecture Rules

## TypeScript/React/Next.js

### Rule 1: Interfaces Separated
```typescript
// ❌ VIOLATION: Interface in component
// components/UserCard.tsx
interface UserCardProps { name: string; email: string }
export function UserCard({ name, email }: UserCardProps) {}

// ✅ FIXED: Interface in dedicated file
// interfaces/user-card.interface.ts
export interface UserCardProps { name: string; email: string }

// components/UserCard.tsx
import { UserCardProps } from '@/interfaces/user-card.interface'
export function UserCard({ name, email }: UserCardProps) {}
```

### Rule 2: Business Logic in Hooks
```typescript
// ❌ VIOLATION: Logic in component
function ProductList() {
  const [products, setProducts] = useState([])
  const fetchProducts = async () => { /* API call */ }
  const filterByCategory = (cat) => products.filter(p => p.category === cat)
  const calculateTotal = () => products.reduce((a, b) => a + b.price, 0)

  useEffect(() => { fetchProducts() }, [])

  return <div>{products.map(p => <ProductCard key={p.id} {...p} />)}</div>
}

// ✅ FIXED: Logic extracted to hook
// hooks/useProductList.ts
export function useProductList() {
  const [products, setProducts] = useState([])
  const fetchProducts = async () => { /* API call */ }
  const filterByCategory = (cat) => products.filter(p => p.category === cat)
  const calculateTotal = () => products.reduce((a, b) => a + b.price, 0)

  useEffect(() => { fetchProducts() }, [])

  return { products, filterByCategory, calculateTotal }
}

// components/ProductList.tsx
function ProductList() {
  const { products, filterByCategory } = useProductList()
  return <div>{products.map(p => <ProductCard key={p.id} {...p} />)}</div>
}
```

### Rule 3: Global State in Stores
```typescript
// ❌ VIOLATION: Shared state via props drilling
function App() {
  const [user, setUser] = useState(null)
  return <Layout user={user}><Dashboard user={user} setUser={setUser} /></Layout>
}

// ✅ FIXED: Zustand store
// stores/user.store.ts
import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}))

// components/Dashboard.tsx
function Dashboard() {
  const { user, setUser } = useUserStore()
  return <div>{user?.name}</div>
}
```

### Rule 4: Component Sectioning
```typescript
// ❌ VIOLATION: Monolithic component (150+ lines)
function Dashboard() {
  // 50 lines of state/effects
  // 100 lines of JSX with header, sidebar, content, footer
}

// ✅ FIXED: Sectioned architecture
// components/Dashboard/Dashboard.tsx (40 lines)
function Dashboard() {
  const { data, actions } = useDashboardLogic()
  return (
    <div>
      <DashboardHeader user={data.user} />
      <DashboardSidebar nav={data.nav} />
      <DashboardContent data={data} actions={actions} />
      <DashboardFooter />
    </div>
  )
}

// components/Dashboard/DashboardHeader.tsx (25 lines)
// components/Dashboard/DashboardSidebar.tsx (30 lines)
// components/Dashboard/DashboardContent.tsx (35 lines)
// hooks/useDashboardLogic.ts (50 lines)
```

### Project Structure (TypeScript/Next.js)
```
src/
├── app/              # Next.js App Router pages
├── components/       # React components (NO interfaces, NO logic)
│   └── Dashboard/
│       ├── Dashboard.tsx
│       ├── DashboardHeader.tsx
│       └── index.ts
├── interfaces/       # ALL TypeScript interfaces/types
│   └── dashboard.interface.ts
├── hooks/            # Custom hooks (ALL business logic)
│   └── useDashboardLogic.ts
├── stores/           # Zustand stores (global state)
│   └── user.store.ts
├── lib/              # Utilities, helpers
└── services/         # API calls, external services
```

## Python Structure
```
project/
├── src/
│   ├── domain/          # Business logic, entities
│   ├── application/     # Use cases, services
│   ├── infrastructure/  # DB, external APIs
│   └── interfaces/      # Adapters, controllers
├── tests/
└── pyproject.toml
```

**Rules**:
- Type hints: `def func(x: int) -> str:`
- ABC for interfaces: `from abc import ABC, abstractmethod`
- Dependency injection via constructors

## Go Structure
```
project/
├── cmd/                 # Entry points (main.go)
├── internal/            # Private code (not importable)
│   ├── domain/
│   ├── usecase/
│   └── repository/
├── pkg/                 # Public libraries
└── go.mod
```

**Rules**:
- Interfaces in separate files
- `internal/` for private code
- Dependency injection via constructors
- Idiomatic error handling: `if err != nil { return err }`

## PHP Structure
```
src/
├── Domain/              # Entities, value objects
├── Application/         # Use cases, services
├── Infrastructure/      # Repositories, external
└── Presentation/        # Controllers, views
```

**Rules**:
- PSR-4 autoloading
- Type declarations: `public function get(int $id): User`
- PHPStan level 8+

## Java Structure
```
src/main/java/com/company/
├── domain/              # Entities
├── application/         # Services
├── infrastructure/      # Repositories
└── interfaces/          # Controllers, DTOs
```

**Rules**:
- Interfaces separate from implementations
- Spring DI: `@Autowired`, `@Inject`
- Package-by-feature preferred

## Rust Structure
```
src/
├── lib.rs               # Library entry
├── main.rs              # Binary entry
├── domain/
├── application/
└── infrastructure/
```

**Rules**:
- Traits for interfaces
- `pub(crate)` for internal visibility
- `Result<T, E>` for errors
