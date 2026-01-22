# Elicitation Techniques Catalog

75 techniques organized in 12 categories. Inspired by BMAD-METHOD Advanced Elicitation.

---

## 1. Code Quality (7 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| CQ-01 | **Code Review** | Line-by-line analysis for issues | Always |
| CQ-02 | **Pattern Detection** | Identify design patterns used/missing | Refactoring |
| CQ-03 | **Complexity Analysis** | Cyclomatic complexity check | Large functions |
| CQ-04 | **Duplication Detection** | Find copy-paste code | Any codebase |
| CQ-05 | **Naming Convention** | Variable/function naming quality | New code |
| CQ-06 | **Comment Quality** | Useful vs outdated comments | Documentation |
| CQ-07 | **Code Smell Detection** | Long methods, god classes, etc. | Maintenance |

---

## 2. Security (7 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| SEC-01 | **OWASP Top 10** | Check all 10 vulnerability categories | Auth, APIs |
| SEC-02 | **Input Validation** | All user inputs sanitized? | Forms, APIs |
| SEC-03 | **Auth Flow Review** | Session/token handling correct? | Login systems |
| SEC-04 | **Authorization Check** | Role/permission verified? | Protected routes |
| SEC-05 | **Secrets Detection** | Hardcoded credentials? | All code |
| SEC-06 | **Dependency Audit** | Known vulnerabilities in packages? | npm/composer |
| SEC-07 | **CSRF/XSS Prevention** | Proper tokens and encoding? | Web apps |

---

## 3. Performance (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| PERF-01 | **N+1 Query Detection** | Database calls in loops? | ORM code |
| PERF-02 | **Memory Leak Check** | Proper cleanup, no dangling refs? | Long-running |
| PERF-03 | **Algorithm Complexity** | O(n²) or worse detected? | Data processing |
| PERF-04 | **Bundle Size Impact** | Large imports, tree-shaking? | Frontend |
| PERF-05 | **Caching Opportunities** | Repeated expensive operations? | APIs, DB |
| PERF-06 | **Lazy Loading** | Load on demand vs upfront? | Large apps |

---

## 4. Architecture (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| ARCH-01 | **SOLID Compliance** | All 5 principles checked | Business logic |
| ARCH-02 | **Dependency Analysis** | Proper DI, no circular deps? | Modules |
| ARCH-03 | **Coupling Review** | Loose coupling maintained? | Refactoring |
| ARCH-04 | **File Size Check** | All files <100 LoC? | Always |
| ARCH-05 | **Layer Separation** | UI/Logic/Data properly split? | Full-stack |
| ARCH-06 | **Interface Location** | Interfaces in dedicated folder? | TypeScript |

---

## 5. Testing (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| TEST-01 | **Edge Case Analysis** | Null, empty, boundary values? | New functions |
| TEST-02 | **Error Path Coverage** | All error scenarios tested? | Try/catch code |
| TEST-03 | **Boundary Testing** | Min/max/zero values tested? | Numeric inputs |
| TEST-04 | **Happy Path Coverage** | Main flow tested? | All features |
| TEST-05 | **Integration Points** | External service mocks? | API calls |
| TEST-06 | **Regression Risk** | Changes break existing tests? | Refactoring |

---

## 6. Documentation (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| DOC-01 | **API Documentation** | Endpoints documented? | REST/GraphQL |
| DOC-02 | **Type Coverage** | All functions typed? | TypeScript |
| DOC-03 | **JSDoc/PHPDoc** | Function docs complete? | Public APIs |
| DOC-04 | **README Update** | Setup instructions current? | New features |
| DOC-05 | **Inline Comments** | Complex logic explained? | Algorithms |
| DOC-06 | **Changelog Entry** | Changes documented? | Releases |

---

## 7. UX/Accessibility (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| UX-01 | **Accessibility (a11y)** | ARIA, keyboard nav, contrast? | UI components |
| UX-02 | **Error Messages** | User-friendly, actionable? | Forms, APIs |
| UX-03 | **Loading States** | Proper feedback during wait? | Async operations |
| UX-04 | **Empty States** | What shows when no data? | Lists, tables |
| UX-05 | **Responsive Design** | Mobile/tablet layouts? | Web UI |
| UX-06 | **Focus Management** | Proper focus on modals/forms? | Interactive UI |

---

## 8. Data Integrity (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| DATA-01 | **Schema Validation** | Input matches expected schema? | API payloads |
| DATA-02 | **Migration Safety** | Reversible, data preserved? | DB migrations |
| DATA-03 | **Data Consistency** | Related data stays in sync? | Multi-table ops |
| DATA-04 | **Unique Constraints** | Duplicates prevented? | User data |
| DATA-05 | **Cascade Effects** | Delete/update cascades correct? | Foreign keys |
| DATA-06 | **Default Values** | Sensible defaults set? | New columns |

---

## 9. Concurrency (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| CONC-01 | **Race Condition Check** | Shared state protected? | Async code |
| CONC-02 | **Deadlock Analysis** | Lock ordering correct? | Multi-lock code |
| CONC-03 | **State Synchronization** | UI reflects current state? | Real-time apps |
| CONC-04 | **Optimistic Locking** | Concurrent edits handled? | Collaborative |
| CONC-05 | **Queue Processing** | Order and retry correct? | Job queues |
| CONC-06 | **Transaction Boundaries** | ACID properties maintained? | DB operations |

---

## 10. Integration (7 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| INT-01 | **API Contract** | Request/response matches spec? | External APIs |
| INT-02 | **Backward Compatibility** | Old clients still work? | API versioning |
| INT-03 | **Breaking Change Detection** | Interface changes flagged? | Public APIs |
| INT-04 | **Error Propagation** | Errors surface correctly? | Service calls |
| INT-05 | **Timeout Handling** | Graceful timeout behavior? | Network calls |
| INT-06 | **Retry Logic** | Proper backoff strategy? | Flaky services |
| INT-07 | **Circuit Breaker** | Failure isolation in place? | Microservices |

---

## 11. Observability (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| OBS-01 | **Logging Quality** | Structured, appropriate level? | All code |
| OBS-02 | **Metrics Collection** | Key metrics tracked? | Performance |
| OBS-03 | **Error Tracking** | Errors reported to service? | Production |
| OBS-04 | **Trace Context** | Request tracing enabled? | Distributed |
| OBS-05 | **Health Checks** | Liveness/readiness probes? | Deployments |
| OBS-06 | **Alerting Rules** | Thresholds defined? | Monitoring |

---

## 12. Maintainability (6 techniques)

| ID | Technique | Description | When to Use |
|----|-----------|-------------|-------------|
| MAINT-01 | **Readability** | Code self-explanatory? | Code review |
| MAINT-02 | **Consistent Style** | Follows project conventions? | Any PR |
| MAINT-03 | **File Organization** | Logical folder structure? | New modules |
| MAINT-04 | **Import Order** | Consistent import grouping? | All files |
| MAINT-05 | **Dead Code Removal** | Unused code deleted? | Refactoring |
| MAINT-06 | **TODO Resolution** | TODOs addressed or tracked? | Technical debt |

---

## Quick Selection Guide

### By Code Type

| Code Type | Primary Techniques |
|-----------|-------------------|
| **Auth/Security** | SEC-01, SEC-02, SEC-03, SEC-04, SEC-05 |
| **API Endpoints** | INT-01, DOC-01, TEST-01, SEC-02, PERF-05 |
| **Database** | PERF-01, DATA-01, DATA-02, CONC-06, ARCH-01 |
| **UI Components** | UX-01, UX-02, UX-03, TEST-01, ARCH-04 |
| **Business Logic** | ARCH-01, TEST-01, CQ-01, DOC-03, MAINT-01 |
| **Refactoring** | ARCH-02, ARCH-03, INT-02, TEST-06, CQ-07 |

### By Risk Level

| Risk Level | Must Apply |
|------------|------------|
| **High Risk** | SEC-*, CONC-*, DATA-02 |
| **Medium Risk** | ARCH-*, PERF-*, INT-* |
| **Low Risk** | DOC-*, MAINT-*, UX-* |

---

## Total: 75 Techniques

```
Code Quality:    7
Security:        7
Performance:     6
Architecture:    6
Testing:         6
Documentation:   6
UX/Accessibility:6
Data Integrity:  6
Concurrency:     6
Integration:     7
Observability:   6
Maintainability: 6
─────────────────
Total:          75
```
