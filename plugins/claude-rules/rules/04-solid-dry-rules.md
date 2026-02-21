---
description: "Step 4/6 - Files <100 lines (split at 90), interfaces separated, JSDoc mandatory, research before code, sniper after. DRY: grep before writing, check shared locations, extract 3+ occurrences."
next_step: "05-frontend-rules"
---

## SOLID Rules (All Languages)

1. **Files < 100 lines** - Split at 90 (ts/js/py/go/rs/java/php/cpp/rb/swift)
2. **Interfaces separated** - Location defined in `solid-*/references/` for each stack
3. **Research first** - `research-expert` before ANY code
4. **Validate after** - `sniper` after ANY modification
5. **JSDoc/PHPDoc** - Every exported function documented

**MANDATORY: Read the SOLID skill for your stack before coding:**

| Agent | Skill | Interfaces Location |
|-------|-------|---------------------|
| nextjs-expert | `solid-nextjs/references/` | `modules/[feature]/src/interfaces/` |
| laravel-expert | `solid-php/references/` | `app/Contracts/` |
| swift-expert | `solid-swift/references/` | `Sources/Interfaces/` |
| react-expert | `solid-react/references/` | `modules/[feature]/src/interfaces/` |

**Split Strategy:** `main.ts` + `validators.ts` + `types.ts` + `utils.ts` + `constants.ts`

## DRY - Code Reusability (ZERO TOLERANCE)

**Before writing ANY new code (MANDATORY):**
1. **Grep the codebase** for similar class names, functions, hooks, or logic
2. **Check shared locations** per stack (see table below)
3. If similar code exists -> **extend/reuse** instead of duplicate
4. If code will be used by 2+ features -> **create it in shared location** directly
5. Extract repeated logic (3+ occurrences) into shared helpers/traits/utils
6. **Verify no duplication** introduced after writing

| Stack | Shared Locations to Check |
|-------|--------------------------|
| Next.js/React | `modules/cores/lib/`, `modules/cores/components/`, `modules/cores/hooks/` |
| Laravel | `app/Services/`, `app/Actions/`, `app/Traits/`, `app/Contracts/` |
| Swift | `Core/Extensions/`, `Core/Utilities/`, `Core/Protocols/` |

**FORBIDDEN (DRY violations):**
- Creating new code without Grep search first
- Copy-pasting logic blocks instead of extracting shared function
- Duplicating existing utility/helper/extension
- Same logic in 2+ files without extraction to shared location
- Ignoring existing Services/Traits/Utils that solve the same problem

**Next -> Step 5: Frontend Rules** (`05-frontend-rules.md`)
