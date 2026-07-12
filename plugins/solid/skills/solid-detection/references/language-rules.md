# Language Rules

## Next.js / TypeScript

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `modules/[feature]/src/interfaces/` |
| Shared interfaces | `modules/cores/interfaces/` |
| Forbidden | Interfaces in `components/`, `app/` |
| SOLID skill | `solid-nextjs` |

**Pattern detection**:
```regex
^(export )?(interface|type) \w+
```

## React / TypeScript

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `modules/[feature]/src/interfaces/` |
| Shared interfaces | `modules/cores/interfaces/` |
| Forbidden | Interfaces in `components/` files |
| SOLID skill | `solid-react` |

**Pattern detection**:
```regex
^(export )?(interface|type) \w+
```

## Generic TypeScript / Bun / Node.js

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `modules/[feature]/src/interfaces/` |
| Shared interfaces | `modules/cores/interfaces/` |
| Structure | **Modular MANDATORY** |
| Forbidden | Interfaces in service/lib files |
| SOLID skill | `solid-generic` |

**Pattern detection**:
```regex
^(export )?(interface|type) \w+
```

## Laravel / PHP

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `FuseCore/[Module]/App/Contracts/` |
| Shared interfaces | `FuseCore/Core/App/Contracts/` |
| Structure | **FuseCore Modular MANDATORY** |
| Forbidden | Interfaces outside Contracts/ |
| SOLID skill | `solid-php` |

**Pattern detection**:
```regex
^interface \w+
```

## Swift

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `Features/[Feature]/Protocols/` |
| Shared interfaces | `Core/Protocols/` |
| Structure | **Features Modular MANDATORY** |
| Forbidden | Protocols outside Protocols/ |
| SOLID skill | `solid-swift` |

**Pattern detection**:
```regex
^protocol \w+
```

## Java

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `modules/[feature]/interfaces/` |
| Shared interfaces | `modules/core/interfaces/` |
| Structure | **Modular MANDATORY** |
| Forbidden | Interfaces in impl files |
| SOLID skill | `solid-java` |

**Pattern detection**:
```regex
^(public )?(interface) \w+
```

## Go

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `internal/modules/[feature]/ports/` |
| Shared interfaces | `internal/core/ports/` |
| Structure | **Modular MANDATORY** |
| Forbidden | Interfaces in impl files |
| SOLID skill | `solid-go` |

**Pattern detection**:
```regex
^type \w+ interface \{
```

## Ruby

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `app/modules/[feature]/contracts/` |
| Shared interfaces | `app/modules/core/contracts/` |
| Structure | **Modular MANDATORY** |
| Forbidden | Contracts in model files |
| SOLID skill | `solid-ruby` |

**Pattern detection**:
```regex
^module \w+Contract
```

## Rust

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `src/modules/[feature]/traits.rs` |
| Shared interfaces | `src/core/traits.rs` |
| Structure | **Modular MANDATORY** |
| Forbidden | Traits in impl files |
| SOLID skill | `solid-rust` |

**Pattern detection**:
```regex
^pub trait \w+
```

## Python

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `src/interfaces/` |
| Forbidden | ABC outside interfaces/ |

**Pattern detection**:
```regex
class \w+\(.*ABC.*\)
```

## Line Counting

Exclude from count:
- Blank lines
- Comments (`//`, `/* */`, `#`, `"""`)
- Import statements (optional)

```bash
# TypeScript/Go/Rust/Swift
grep -v '^\s*$\|^\s*//\|^\s*/\*\|^\s*\*' file

# PHP
grep -v '^\s*$\|^\s*//\|^\s*#\|^\s*/\*\|^\s*\*' file

# Python
grep -v '^\s*$\|^\s*#\|^\s*"""' file
```
