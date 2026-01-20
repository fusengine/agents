# 01 - Analyze Code

**Understand codebase before making changes (APEX Phase A).**

## When to Use

- After creating feature branch
- Before writing ANY code
- When unfamiliar with affected areas

---

## Dual-Agent Analysis

### Launch in Parallel (ONE message)

```text
Agent 1: explore-codebase
→ Map project structure
→ Identify patterns and conventions
→ Find where changes should go

Agent 2: research-expert
→ Verify official documentation
→ Confirm API methods/patterns
→ Check framework best practices
```

---

## explore-codebase Focus

### Structure Discovery

```text
1. Project architecture
   → src/ structure
   → Component organization
   → Module boundaries

2. Existing patterns
   → Naming conventions
   → File organization
   → Import patterns

3. Dependencies
   → Package versions
   → External libraries
   → Internal utilities
```

### Key Questions

```text
□ Where do similar features live?
□ What patterns are already used?
□ What utilities exist?
□ What interfaces are defined?
□ What tests exist for similar code?
```

---

## research-expert Focus

### Documentation Verification

```text
1. Framework docs (latest version)
   → API signatures
   → Best practices
   → Breaking changes

2. Library docs
   → Correct usage
   → Type definitions
   → Common patterns

3. Project-specific
   → README guidelines
   → Contributing rules
   → Architecture decisions
```

### Verification Points

```text
□ API method signatures correct?
□ Types/interfaces verified?
□ Deprecations checked?
□ Version-specific features?
□ Security considerations?
```

---

## Output Requirements

### From explore-codebase

```markdown
## Codebase Analysis

### Structure
- [relevant directories]
- [file patterns]

### Existing Patterns
- [naming conventions]
- [architectural patterns]

### Change Locations
- [files to modify]
- [files to create]

### Dependencies
- [relevant packages]
- [internal utilities]
```

### From research-expert

```markdown
## Research Findings

### Official Documentation
- [framework version]
- [relevant APIs]

### Best Practices
- [recommended patterns]
- [anti-patterns to avoid]

### Implementation Notes
- [specific guidance]
- [gotchas]
```

---

## Anti-Patterns

```text
❌ Skip analysis and start coding
❌ Assume API syntax without verification
❌ Ignore existing patterns
❌ Create duplicate utilities
❌ Use outdated documentation
```

---

## Validation Checklist

```text
□ explore-codebase completed
□ research-expert completed
□ Existing patterns documented
□ APIs verified with docs
□ Change locations identified
□ Dependencies understood
```

---

## Next Phase

→ Proceed to `02-features-plan.md`
