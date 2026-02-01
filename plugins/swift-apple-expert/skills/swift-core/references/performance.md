---
name: performance
description: Swift and SwiftUI performance optimization with Instruments, lazy loading, memory management
when-to-use: diagnosing slow UI, fixing memory leaks, optimizing scroll performance, reducing launch time
keywords: Instruments, profiling, memory, lazy, optimization, cache, Time Profiler
priority: medium
requires: architecture.md, concurrency.md
related: testing.md
---

# Swift Performance Optimization

## When to Use

- App feels slow or laggy
- Memory usage grows over time
- Scroll performance issues
- Slow app launch
- Battery drain concerns

## Key Concepts

### Instruments Profiling
Apple's built-in profiling suite. Always profile Release builds.

**Key Instruments:**
| Instrument | Detects |
|------------|---------|
| Time Profiler | Slow functions, CPU usage |
| Allocations | Memory growth, allocation patterns |
| Leaks | Retain cycles, memory leaks |
| SwiftUI | View body evaluations, layout |
| Core Animation | Offscreen renders, blending |

### SwiftUI View Optimization
Minimize view body evaluations and avoid heavy work.

**Key Points:**
- Extract expensive computations to ViewModel
- Cache formatters as static properties
- Use Equatable views to prevent unnecessary updates
- Split large views into smaller components

### Lazy Loading
Defer initialization until actually needed.

**Key Points:**
- `LazyVStack`/`LazyHStack` for long lists
- `lazy var` for expensive properties
- Defer navigation destination initialization
- Load images on-demand

### Memory Management
Prevent retain cycles and manage object lifecycles.

**Key Points:**
- Use `[weak self]` in closures
- Prefer value types (structs) over reference types
- Use `NSCache` for temporary data
- Clear caches on memory warnings

### Launch Time Optimization
Fast launch improves user perception significantly.

**Key Points:**
- Defer non-essential initialization
- Use lazy properties for services
- Minimize work in `App.init()`
- Profile with Instruments > App Launch

---

## Common Performance Issues

| Issue | Solution |
|-------|----------|
| Heavy computation in body | Move to ViewModel, cache result |
| Formatter recreation | Static cached formatter |
| Large list scroll lag | Use LazyVStack/LazyVGrid |
| State invalidates whole view | Use @Observable with granular properties |
| Retain cycle | Use [weak self] in closures |
| Image loading blocking UI | AsyncImage or background loading |

---

## Best Practices

- ✅ Profile in Release mode (`-O` optimization)
- ✅ Use Instruments for data-driven decisions
- ✅ Lazy load heavy resources
- ✅ Cache expensive computations
- ✅ Use value types when possible
- ✅ Test on oldest supported device
- ❌ Don't optimize without profiling first
- ❌ Don't do heavy work in view body
- ❌ Don't block main thread
- ❌ Don't create objects in tight loops

---

## Quick Wins

1. **Static formatters** - DateFormatter, NumberFormatter
2. **LazyVStack** - Replace VStack in ScrollView
3. **AsyncImage** - Non-blocking image loading
4. **@Observable** - Granular updates vs ObservableObject
5. **Task deferral** - Move init work to `.task {}`
