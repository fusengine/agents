# Prompt Templates

## Template: Agent Assistant

```markdown
---
name: [agent-name]
description: [Description in 1 line]
model: [sonnet|opus]
---

# [Agent Name]

[Purpose description in 2-3 sentences]

## Core Principles

1. **[Principle 1]**: [Explanation]
2. **[Principle 2]**: [Explanation]
3. **[Principle 3]**: [Explanation]

## Workflow

### Phase 1: [Name]
```
1. [Action 1]
2. [Action 2]
```

### Phase 2: [Name]
```
1. [Action 1]
2. [Action 2]
```

## Output Format

[Expected response structure]

## Examples

### Example 1
**Input:** [...]
**Output:** [...]

## Forbidden

- Never [Prohibition 1]
- Never [Prohibition 2]
```

## Template: Task Prompt

```markdown
# Objective
[Task to accomplish in 1 sentence]

# Context
[Necessary information]

# Instructions
1. [Step 1]
2. [Step 2]
3. [Step 3]

# Output Format
[Expected structure]

# Constraints
- [Constraint 1]
- [Constraint 2]
```

## Template: Few-Shot Classifier

```markdown
# [Type] Classification

## Categories
- **Category A**: [Description]
- **Category B**: [Description]
- **Category C**: [Description]

## Examples

### Example 1
Input: "[example text 1]"
Output: Category A
Reason: [Justification]

### Example 2
Input: "[example text 2]"
Output: Category B
Reason: [Justification]

### Example 3
Input: "[example text 3]"
Output: Category C
Reason: [Justification]

## Your Task
Classify the following text:
Input: "[text to classify]"
```

## Template: Code Generator

```markdown
# [Language] Code Generator

## Context
- Project: [project type]
- Stack: [technologies]
- Standards: [conventions]

## Specifications
[Functional description]

## Technical Constraints
- [ ] [Constraint 1]
- [ ] [Constraint 2]

## Output Format

```[language]
// Code here
```

## Expected Tests
```[language]
// Tests here
```
```

## Template: Analyzer/Reviewer

```markdown
# [Content Type] Analysis

## Evaluation Criteria
| Criterion | Weight | Description |
|-----------|--------|-------------|
| [Criterion 1] | [X]% | [Description] |
| [Criterion 2] | [X]% | [Description] |
| [Criterion 3] | [X]% | [Description] |

## Report Format

### Executive Summary
[2-3 sentences]

### Strengths
- [Point 1]
- [Point 2]

### Areas for Improvement
- [Area 1]: [Recommendation]
- [Area 2]: [Recommendation]

### Overall Score
[X]/10 - [Justification]
```

## Template: Conversational Agent

```markdown
# [Assistant Name]

## Personality
- Tone: [friendly/professional/technical]
- Style: [concise/detailed]
- Approach: [proactive/reactive]

## Domain of Expertise
[Skills description]

## Limitations
- I cannot: [limitation 1]
- I am not: [limitation 2]

## Key Behaviors

### Greetings
[How to greet the user]

### Clarification
[How to ask for clarification]

### Uncertainty
[How to handle uncertain cases]

### End of Conversation
[How to conclude]

## Typical Phrases
- Welcome: "[phrase]"
- Clarification: "[phrase]"
- Apology: "[phrase]"
- Transition: "[phrase]"
```

## Template: Meta-Prompt

```markdown
# Prompt Generator

You are an expert in prompt engineering. Your mission is to create optimal prompts.

## Process

1. **Analyze** the user request
2. **Identify** the type of prompt needed
3. **Apply** best practices
4. **Generate** the structured prompt
5. **Explain** the choices made

## Best Practices to Apply
- Clear and specific instructions
- Explicit output format
- Examples if complex format
- Appropriate guardrails

## Output

### Generated Prompt
---
[The complete prompt]
---

### Justification
- Technique used: [CoT/Few-shot/etc.]
- Reason: [Why this choice]

### Possible Variations
- [Variation 1]: [When to use]
- [Variation 2]: [When to use]
```
