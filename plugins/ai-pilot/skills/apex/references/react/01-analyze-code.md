# 01 - Analyze Code (React/Vite)

**Understand React codebase before making changes (APEX Phase A).**

## When to Use

- After creating feature branch
- Before writing ANY code
- When unfamiliar with affected areas

---

## Dual-Agent Analysis

### Launch in Parallel (ONE message)

```text
Agent 1: explore-codebase
-> Map modules/ structure
-> Identify component patterns
-> Find where changes should go

Agent 2: research-expert
-> Verify React 19 APIs
-> Check TanStack Router/Query patterns
-> Confirm shadcn/ui usage
```

---

## explore-codebase Focus

### React Project Structure

```text
src/
├── modules/
│   ├── cores/           # Shared components, lib, stores
│   │   ├── components/  # Button, Modal, etc.
│   │   ├── lib/         # cn(), utils
│   │   └── stores/      # Global Zustand stores
│   └── [feature]/       # Feature modules
│       ├── components/
│       └── src/
│           ├── interfaces/
│           ├── hooks/
│           ├── services/
│           └── stores/
├── routes/              # TanStack Router files
└── main.tsx
```

### Key Questions

```text
[ ] Where do similar components live?
[ ] What hooks already exist?
[ ] What stores are available?
[ ] What interfaces are defined?
[ ] How is routing structured?
```

---

## research-expert Focus

### React 19 Verification

```text
1. New hooks (use, useActionState, useOptimistic)
2. Form Actions pattern
3. ref as prop (no forwardRef)
4. Context as Provider syntax
```

### TanStack Patterns

```text
1. Router: File-based routing, loaders, search params
2. Query: useQuery, useMutation, queryClient
3. Form: useForm, validators, field state
```

---

## Output Requirements

### From explore-codebase

```markdown
## Codebase Analysis

### Module Structure
- modules/cores/ - Shared components
- modules/[feature]/ - Feature modules

### Existing Patterns
- Component naming: PascalCase
- Hook naming: use[Name]
- Store naming: use[Name]Store

### Change Locations
- New component: modules/[feature]/components/
- New hook: modules/[feature]/src/hooks/
- New interface: modules/[feature]/src/interfaces/
```

### From research-expert

```markdown
## Research Findings

### React 19 APIs
- useActionState for form handling
- useOptimistic for optimistic UI

### TanStack Router
- createFileRoute for routes
- Route.useLoaderData() for data

### Best Practices
- No useEffect for data fetching
- Use loaders or TanStack Query
```

---

## Validation Checklist

```text
[ ] explore-codebase completed
[ ] research-expert completed
[ ] Module structure understood
[ ] Component patterns documented
[ ] APIs verified with docs
[ ] Change locations identified
```

---

## Next Phase

-> Proceed to `02-features-plan.md`
