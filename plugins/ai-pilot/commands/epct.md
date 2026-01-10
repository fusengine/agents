---
description: Systematic Explore-Plan-Code-Test methodology for structured development. Ensures comprehensive approach to feature implementation.
---

# EPCT: Explore-Plan-Code-Test

Execute systematic development methodology:

## Phase 1: EXPLORE

> Use explore-codebase to understand relevant parts of the system

**Goals**:
- Identify where changes need to be made
- Understand existing patterns and conventions
- Map dependencies and impacts
- Locate relevant tests

**Deliverable**: Exploration summary with affected components

## Phase 2: PLAN

> Use research-expert to validate approach against best practices

**Goals**:
- Design solution following project patterns
- Identify edge cases and error handling
- Plan test strategy
- Estimate impact and complexity

**Deliverable**: Implementation plan with step-by-step approach

**Plan Format**:
```markdown
### Implementation Steps
1. [Component A]: [Changes needed]
2. [Component B]: [Changes needed]
3. [Tests]: [Test cases to add]

### Edge Cases
- [Case 1]: [Handling approach]
- [Case 2]: [Handling approach]

### Testing Strategy
- Unit tests: [What to test]
- Integration tests: [Scenarios]
- Manual testing: [Steps]
```

## Phase 3: CODE

Implement the solution:
1. Follow the plan step-by-step
2. Maintain existing code style and patterns
3. Add inline documentation for complex logic
4. Create/update tests alongside code

## Phase 4: TEST

Comprehensive validation:
1. **Run Linters**:
   ```bash
   bun run lint
   eslint .
   prettier --check .
   ```

2. **Run Tests**:
   ```bash
   bun test
   pytest
   ```

3. **Manual Testing**:
   - Execute test plan scenarios
   - Verify edge cases
   - Check error handling

4. **Final Verification**:
   > Use sniper to ensure 0 linter errors

**Deliverable**: Tested, validated code ready for commit

**Arguments**:
- $ARGUMENTS specifies the feature/task to implement

**Example Usage**:
- `/epct Add user profile editing` → Full EPCT for feature
- `/epct Fix authentication bug` → EPCT for bug fix
