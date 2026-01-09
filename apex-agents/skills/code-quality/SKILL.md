---
name: code-quality
description: Code quality validation with linters, SOLID principles, error detection, and architecture compliance across all languages.
---

# Code Quality Skill

## 🚨 MANDATORY 6-PHASE WORKFLOW

```
PHASE 1: Exploration (explore-codebase) → BLOCKER
PHASE 2: Documentation (research-expert) → BLOCKER
PHASE 3: Impact Analysis (Grep usages) → BLOCKER
PHASE 4: Error Detection (linters)
PHASE 5: Precision Correction (with docs + impact)
PHASE 6: Verification (re-run linters, tests)
```

**CRITICAL**: Phases 1-3 are BLOCKERS. Never skip them.

---

## PHASE 1: Architecture Exploration

**Launch explore-codebase agent FIRST**:
```
> Use Task tool with subagent_type="explore-codebase"
```

**Gather**:
1. Programming language(s) detected
2. Existing linter configs (.eslintrc, .prettierrc, pyproject.toml)
3. Package managers and installed linters
4. Project structure and conventions
5. Framework versions (package.json, go.mod, Cargo.toml)
6. Architecture patterns (Clean, Hexagonal, MVC)
7. State management (Zustand, Redux, Context)
8. Interface/types directories location

---

## PHASE 2: Documentation Research

**Launch research-expert agent**:
```
> Use Task tool with subagent_type="research-expert"
> Request: Verify [library/framework] documentation for [error type]
> Request: Find [language] best practices for [specific issue]
```

**Request for each error**:
- Official API documentation
- Current syntax and deprecations
- Best practices for error patterns
- Version-specific breaking changes
- Security advisories
- Language-specific SOLID patterns

---

## PHASE 3: Impact Analysis

**For EACH element to modify**:

### Step 1: Search Usages
```bash
# TypeScript/JavaScript
grep -r "functionName" --include="*.{ts,tsx,js,jsx}"

# Python
grep -r "function_name" --include="*.py"

# Go
grep -r "FunctionName" --include="*.go"
```

### Step 2: Risk Assessment
| Risk | Criteria | Action |
|------|----------|--------|
| 🟢 LOW | Internal, 0-1 usages | Proceed |
| 🟡 MEDIUM | 2-5 usages, compatible | Proceed with care |
| 🔴 HIGH | 5+ usages OR breaking | Flag to user FIRST |

### Step 3: Document Impact
```markdown
| Element | Usages Found | Risk | Files Affected |
|---------|--------------|------|----------------|
| signIn() | 3 files | 🟡 | login.tsx, auth.ts, middleware.ts |
```

---

## Linter Commands by Language

### JavaScript/TypeScript
```bash
# Install
bun install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Run
npx eslint . --fix
npx prettier --write .
npx tsc --noEmit
```

### Python
```bash
# Install
pip install pylint black flake8 mypy ruff isort

# Run
ruff check . --fix
black .
mypy .
isort .
```

### Go
```bash
# Install
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Run
go fmt ./...
go vet ./...
golangci-lint run
staticcheck ./...
```

### PHP
```bash
# Install
composer require --dev phpstan/phpstan squizlabs/php_codesniffer friendsofphp/php-cs-fixer

# Run
./vendor/bin/phpstan analyse -l 8
./vendor/bin/phpcs
./vendor/bin/php-cs-fixer fix
```

### Rust
```bash
cargo fmt
cargo clippy -- -D warnings
```

### Java
```bash
mvn checkstyle:check
mvn spotbugs:check
mvn pmd:check
```

### Ruby
```bash
gem install rubocop
rubocop -a
```

### C/C++
```bash
clang-format -i *.cpp *.h
cppcheck --enable=all .
```

---

## Error Priority Matrix

| Priority | Type | Examples | Action |
|----------|------|----------|--------|
| **Critical** | Security | SQL injection, XSS, CSRF, auth bypass | Fix IMMEDIATELY |
| **High** | Logic | SOLID violations, memory leaks, race conditions | Fix same session |
| **Medium** | Performance | N+1 queries, deprecated APIs, inefficient algorithms | Fix if time |
| **Low** | Style | Formatting, naming, missing docs | Fix if time |

---

## SOLID Validation

### S - Single Responsibility
- ✅ One file = one clear purpose
- ❌ Component with API calls + validation + rendering

**Detection**:
```typescript
// ❌ VIOLATION: Component does too much
function UserDashboard() {
  const [user, setUser] = useState()
  const fetchUser = async () => { /* API call */ }
  const validateForm = (data) => { /* validation */ }
  const calculateMetrics = () => { /* business logic */ }
  return <div>...</div>
}

// ✅ FIXED: Separated concerns
// hooks/useUserDashboard.ts
export function useUserDashboard() {
  const fetchUser = async () => {}
  const validateForm = (data) => {}
  const calculateMetrics = () => {}
  return { fetchUser, validateForm, calculateMetrics }
}

// components/UserDashboard.tsx
function UserDashboard() {
  const { fetchUser, calculateMetrics } = useUserDashboard()
  return <div>...</div>
}
```

### O - Open/Closed
- ✅ Extensible via interfaces/abstractions
- ❌ Modifying existing code for new features

### L - Liskov Substitution
- ✅ Subtypes work as drop-in replacements
- ❌ Subclass throws where parent doesn't

### I - Interface Segregation
- ✅ Small, focused interfaces
- ❌ One huge interface with 20 methods

### D - Dependency Inversion
- ✅ Depend on abstractions (interfaces)
- ❌ Import concrete implementations directly

---

## File Size Rules

### Limits
| Metric | Limit | Action |
|--------|-------|--------|
| **LoC** (code only) | < 100 | ✅ OK |
| **LoC** >= 100, **Total** < 200 | | ✅ OK (well-documented) |
| **Total** >= 200 | | ❌ SPLIT required |

### Calculation
```
LoC = Total lines - Comment lines - Blank lines

Comment patterns:
- JS/TS: //, /* */, /** */
- Python: #, """ """, ''' '''
- Go: //, /* */
- PHP: //, #, /* */
- Rust: //, /* */, ///
```

### Split Strategy
```
component.tsx (150 lines) → SPLIT INTO:
├── Component.tsx (40 lines) - orchestrator
├── ComponentHeader.tsx (30 lines)
├── ComponentContent.tsx (35 lines)
├── useComponentLogic.ts (45 lines) - hook
└── index.ts (5 lines) - barrel export
```

---

## Architecture Rules

### TypeScript/React/Next.js

#### Rule 1: Interfaces Separated
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

#### Rule 2: Business Logic in Hooks
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

#### Rule 3: Global State in Stores
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

#### Rule 4: Component Sectioning
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

### Python Structure
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

### Go Structure
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

### PHP Structure
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

### Java Structure
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

### Rust Structure
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

---

## Validation Report Format

```markdown
## 🎯 Sniper Validation Report

### PHASE 1: Architecture (via explore-codebase)
- **Language**: TypeScript
- **Framework**: Next.js 16 (App Router)
- **Architecture**: Clean Architecture
- **State Management**: Zustand
- **Interface Location**: src/interfaces/
- **File Sizes**: ✅ All <100 LoC

### PHASE 2: Documentation (via research-expert)
- **Research Agent Used**: ✅ YES
- **Libraries Researched**:
  - TypeScript@5.3: Function overload syntax
  - Next.js@16: Server Actions patterns
  - Zustand@4: Store best practices

### PHASE 3: Impact Analysis
| Element | Usages | Risk | Action |
|---------|--------|------|--------|
| signIn() | 3 files | 🟡 MEDIUM | Fix with care |
| useAuth | 5 files | 🔴 HIGH | Flag to user |
| validateToken | 1 file | 🟢 LOW | Fix directly |

### PHASE 4-5: Errors Fixed
- **Critical**: 0
- **High**: 2 (SOLID violations)
- **Medium**: 5 (deprecated APIs)
- **Low**: 3 (formatting)

### Architectural Fixes
- **Interfaces Moved**: 3 files (components → interfaces/)
- **Logic Extracted**: 2 hooks created
- **Stores Created**: 1 Zustand store
- **Files Split**: 2 (>100 LoC → multiple files)

### PHASE 6: Verification
- ✅ Linters: 0 errors
- ✅ TypeScript: tsc --noEmit passed
- ✅ Tests: All passing
- ✅ Architecture: SOLID compliant

### SOLID Compliance
- ✅ S: One purpose per file
- ✅ O: Extensible via interfaces
- ✅ L: Subtypes replaceable
- ✅ I: Small interfaces
- ✅ D: Depends on abstractions
```

---

## Complete Workflow Example

**Request**: "Fix all TypeScript errors in auth module"

### PHASE 1: Exploration
```
> Launch explore-codebase agent

Result:
- Language: TypeScript
- Framework: Next.js 16
- Auth module: src/modules/auth/
- Interfaces: src/interfaces/
- State: Zustand in src/stores/
```

### PHASE 2: Documentation
```
> Launch research-expert agent
> Request: "TypeScript 5.x function overload syntax"
> Request: "Next.js 16 Server Actions authentication"

Result:
- TypeScript 5.3 docs: Function overloads
- Next.js 16 docs: useSearchParams is now async
- Best practice: Zod for validation
```

### PHASE 3: Impact Analysis
```
> Grep all files importing auth functions

Files found:
1. src/app/login/page.tsx (imports signIn)
2. src/app/dashboard/layout.tsx (imports useAuth)
3. src/middleware.ts (imports validateToken)

Risk Assessment:
- signIn: 🟡 MEDIUM (2 usages)
- useAuth: 🔴 HIGH (3 usages, refactor needed)
- validateToken: 🟢 LOW (internal only)

⚠️ FLAG TO USER: useAuth needs refactoring (3 files affected)
```

### PHASE 4: Detection
```
Errors found:
- src/modules/auth/signIn.ts:45 - TS2345 type mismatch
- src/hooks/useAuth.ts:12 - Missing dependency
- src/modules/auth/validateToken.ts:23 - TS2322 null safety
```

### PHASE 5: Correction
```
Fix 1: signIn.ts:45
- Error: TS2345
- Research: TypeScript overload docs
- Impact: 2 usages compatible
- Fix: Add type annotation
- ✅ Applied

Fix 2: useAuth.ts:12 (HIGH RISK)
- Error: Missing dependency
- Research: React 19 useEffect docs
- Impact: 🔴 3 files affected
- ⚠️ USER APPROVAL: Approved
- Fix: Extract to useAuthState.ts
- ✅ Applied + updated 3 files

Fix 3: validateToken.ts:23
- Error: TS2322 null
- Impact: Internal only
- Fix: Add null guard
- ✅ Applied
```

### PHASE 6: Verification
```
✅ tsc --noEmit: 0 errors
✅ ESLint: 0 errors, 0 warnings
✅ npm test: All passing
✅ Architecture: Compliant
✅ File sizes: All <100 LoC

🎯 MISSION COMPLETE: 3 errors fixed, 0 code broken
```

---

## Forbidden Behaviors

### Workflow Violations
- ❌ Skip PHASE 1 (explore-codebase)
- ❌ Skip PHASE 2 (research-expert)
- ❌ Skip PHASE 3 (impact analysis)
- ❌ Jump to corrections without completing Phases 1-3
- ❌ Proceed when BLOCKER is active

### Code Quality Violations
- ❌ Leave ANY linter errors unfixed
- ❌ Apply fixes that introduce new errors
- ❌ Ignore SOLID violations
- ❌ Create tests if project has none

### Architecture Violations
- ❌ Interfaces in component files (ZERO TOLERANCE)
- ❌ Business logic in components (must be in hooks)
- ❌ Monolithic components (must section)
- ❌ Files >100 LoC without split
- ❌ Local state for global data (use stores)

### Safety Violations
- ❌ High-risk changes without user approval
- ❌ Breaking backwards compatibility silently
- ❌ Modifying public APIs without deprecation
