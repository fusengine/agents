---
name: anti-patterns
description: Common SOLID violations in Swift with quick fixes
when-to-use: reviewing code quality, identifying anti-patterns, refactoring
keywords: anti-patterns, violations, refactoring, SOLID, Swift
priority: high
related: single-responsibility.md, open-closed.md, dependency-inversion.md
---

# Anti-Patterns - Quick Reference

## SRP Violations

| Anti-Pattern | Detection | Fix |
|--------------|-----------|-----|
| View does API calls | `URLSession` in View | Extract to Service + ViewModel |
| View > 80 lines | Line count | Extract subviews |
| ViewModel > 100 lines | Line count | Split into smaller ViewModels |
| Model has business logic | Methods in model | Extract to Service |
| File > 150 lines | Line count | Split into multiple files |

---

## OCP Violations

| Anti-Pattern | Detection | Fix |
|--------------|-----------|-----|
| `if/switch` for provider type | Inline conditionals | Protocol-based extensibility |
| Adding feature modifies existing | Change in 5+ files | Define protocol, add new impl |
| Hard-coded auth logic | `ASAuthorization` in View | `AuthProviderProtocol` |

---

## LSP Violations

| Anti-Pattern | Detection | Fix |
|--------------|-----------|-----|
| Implementation throws wrong error | Generic `Error` | Throw documented error types |
| Mock behaves differently | Test passes, prod fails | Contract tests for all impls |
| Swapping provider breaks app | Runtime crash | Ensure identical contracts |

---

## ISP Violations

| Anti-Pattern | Detection | Fix |
|--------------|-----------|-----|
| Protocol with 6+ methods | Method count | Split by role |
| No-op method implementations | Empty `func` body | Remove protocol conformance |
| Consumer uses 1 of 5 methods | Unused imports | Depend on focused protocol |

---

## DIP Violations

| Anti-Pattern | Detection | Fix |
|--------------|-----------|-----|
| `let service = UserService()` | Direct instantiation | Inject protocol |
| `URLSession.shared` in ViewModel | Direct dependency | Wrap in service protocol |
| Protocol in impl file | Same file location | Move to `Protocols/` directory |
| Singleton pattern | `static shared` | Constructor injection |

---

## Architecture Violations

| Anti-Pattern | Detection | Fix |
|--------------|-----------|-----|
| Protocols mixed with impl | Same file | Separate to `Protocols/` dir |
| Flat `Sources/` structure | No `Features/` dir | Migrate to `Features/[Feature]/` |
| Shared code in feature | Import from another feature | Move to `Core/` |
| Feature-to-feature import | Cross-feature dependency | Extract to `Core/` |

---

## Concurrency Violations

| Anti-Pattern | Detection | Fix |
|--------------|-----------|-----|
| Missing `@MainActor` on VM | No annotation | Add `@MainActor` |
| Non-Sendable in async | Compiler warning | Use `struct` with `let` |
| `DispatchQueue.main.async` | Legacy pattern | Use `@MainActor` |
| Completion handlers | Callback closures | Use `async/await` |
| `ObservableObject` | Legacy pattern | Use `@Observable` |

---

## File Size Violations

| Type | Max | Fix |
|------|-----|-----|
| View | 80 lines | Extract subviews at 30+ body lines |
| ViewModel | 100 lines | Split by responsibility |
| Service | 100 lines | Split by domain |
| Model | 50 lines | Separate nested types |
| Any file | 150 lines | Split at 120 lines |

---

## Detection Commands

```bash
# Find files over limit
find Sources/ -name "*.swift" | xargs wc -l | sort -rn | head -20

# Find protocols in wrong location
grep -rn "^protocol " Sources/Features/*/Services/
grep -rn "^protocol " Sources/Features/*/ViewModels/
grep -rn "^protocol " Sources/Features/*/Views/

# Find direct instantiation in ViewModels
grep -rn "= \w*Service()" Sources/Features/*/ViewModels/

# Find ObservableObject usage
grep -rn "ObservableObject" Sources/
```
