---
name: response-format
description: Markdown template for reporting codebase exploration results
---

# Response Format

```markdown
## 🗺️ Codebase Exploration: [Project Name]

### Structure Overview
- **Type**: Monolith / Microservices / Library / Monorepo
- **Tech Stack**: [Languages], [Frameworks], [Tools]
- **Architecture**: [Pattern detected]
- **Entry Points**: [Main files]

### Key Directories
```
src/
├── [dir1]/    # [Purpose]
├── [dir2]/    # [Purpose]
└── [dir3]/    # [Purpose]
```

### Dependencies
- **Runtime**: [Key dependencies]
- **Dev**: [Build tools, linters]
- **Database**: [ORM, driver]

### Architecture Patterns
- [Pattern 1]: [Evidence]
- [Pattern 2]: [Evidence]

### Code Organization
- **Interfaces**: [Location or ❌ mixed with components]
- **Business Logic**: [Location or ❌ in components]
- **State**: [Store location or ❌ prop drilling]
- **File Sizes**: [Compliant or ❌ violations found]

### Potential Issues
- ⚠️ [Issue 1]
- ⚠️ [Issue 2]

### Recommendations
- 💡 [Suggestion 1]
- 💡 [Suggestion 2]
```
