---
description: Comprehensive codebase investigation using research-expert for documentation, explore-codebase for structure, and deep analysis. Perfect for understanding complex systems.
---

# Deep Code Analysis

Perform comprehensive codebase investigation:

1. **Initial Exploration**:
   > Use explore-codebase to map the project structure and identify key components

   Wait for exploration results.

2. **Documentation Research**:
   > Use research-expert to find official documentation for [detected frameworks/libraries]

   Focus on:
   - Architecture patterns used
   - Best practices for detected tech stack
   - Common pitfalls to avoid

3. **Pattern Analysis**:
   - Identify design patterns (MVC, Repository, Factory, etc.)
   - Analyze data flow and state management
   - Map component relationships
   - Detect code smells and anti-patterns

4. **Security Review**:
   - Check for common vulnerabilities (SQL injection, XSS, CSRF)
   - Validate input sanitization
   - Review authentication/authorization
   - Analyze dependency security

5. **Performance Assessment**:
   - Identify N+1 query problems
   - Check for memory leaks
   - Analyze algorithm efficiency
   - Review caching strategies

6. **Generate Report**:
   ```markdown
   ## 🔍 Deep Code Analysis: [Project Name]

   ### Architecture Overview
   - **Pattern**: [Detected pattern]
   - **Tech Stack**: [Technologies]
   - **Structure**: [Organization approach]

   ### Strengths
   - ✅ [Positive aspect 1]
   - ✅ [Positive aspect 2]

   ### Areas for Improvement
   - ⚠️  [Issue 1]: [Impact] → [Recommendation]
   - ⚠️  [Issue 2]: [Impact] → [Recommendation]

   ### Security Findings
   - 🔒 [Finding 1]
   - 🔒 [Finding 2]

   ### Performance Opportunities
   - ⚡ [Optimization 1]
   - ⚡ [Optimization 2]

   ### Recommendations
   1. **[Priority 1]**: [Action]
   2. **[Priority 2]**: [Action]
   ```

**Arguments**:
- $ARGUMENTS specifies focus area (security/performance/architecture)

**Example Usage**:
- `/deep-code-analysis security` → Focus on security review
- `/deep-code-analysis` → Comprehensive analysis
