## SOLID Skill per Stack (read before coding)

| Agent | Skill | Interfaces |
|-------|-------|------------|
| nextjs-expert | `solid-nextjs/references/` | `modules/[feature]/src/interfaces/` |
| laravel-expert | `solid-php/references/` | `app/Contracts/` |
| swift-expert | `solid-swift/references/` | `Sources/Interfaces/` |
| react-expert | `solid-react/references/` | `modules/[feature]/src/interfaces/` |

**Split:** `main.ts` + `validators.ts` + `types.ts` + `utils.ts` + `constants.ts`

## DRY (ZERO TOLERANCE)

Before ANY new code: Grep codebase -> check shared locations -> extend/reuse if exists

| Stack | Shared Locations |
|-------|-----------------|
| Next.js/React | `modules/cores/lib/`, `modules/cores/components/`, `modules/cores/hooks/` |
| Laravel | `app/Services/`, `app/Actions/`, `app/Traits/`, `app/Contracts/` |
| Swift | `Core/Extensions/`, `Core/Utilities/`, `Core/Protocols/` |
