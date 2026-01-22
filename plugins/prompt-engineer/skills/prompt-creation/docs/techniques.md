# Prompt Engineering Techniques

## Chain-of-Thought (CoT)

### Zero-Shot CoT
Simple addition to activate reasoning:
```
Let's think step-by-step.
```

### Few-Shot CoT
Examples with explicit reasoning:
```markdown
Q: If I have 3 apples and give away 1, how many do I have left?
A: Let's think step-by-step.
   1. I start with 3 apples
   2. I give away 1
   3. 3 - 1 = 2
   So I have 2 apples left.
```

### Extended Thinking (Claude 4+)
Progressive thinking budgets:

| Command | Budget | Usage |
|---------|--------|-------|
| `think` | Minimal | Simple tasks |
| `think hard` | Moderate | Medium tasks |
| `think harder` | High | Complex tasks |
| `ultrathink` | Maximum | Critical tasks |

## Few-Shot Prompting

### Golden Rules
1. **2-5 examples** are sufficient (more ≠ better)
2. **Diversity** > Quantity
3. **Include edge cases** in examples
4. **Consistent format** between examples

### Optimal Structure
```markdown
## Instructions
[Clear and concise instructions]

## Examples

### Example 1
Input: [standard case]
Output: [expected response]

### Example 2
Input: [edge case]
Output: [response for edge case]

## Your Task
Input: [actual input]
```

## XML Tags

Claude responds particularly well to XML tags:

```xml
<instructions>
  <identity>Senior Python expert</identity>

  <rules>
    <mandatory>Always include type hints</mandatory>
    <forbidden>Never use global variables</forbidden>
  </rules>

  <output>
    <format>Python code with docstring</format>
    <structure>
      1. Imports
      2. Types
      3. Functions
      4. Main
    </structure>
  </output>
</instructions>
```

## Structured Outputs

Force a JSON format:
```markdown
Respond ONLY with this JSON:
{
  "summary": "string",
  "status": "open|closed",
  "priority": "low|medium|high"
}
```

## Role Prompting

Define a specific role:
```markdown
You are a senior cybersecurity expert with 15 years of experience.
You have worked for Fortune 500 companies.
You always prioritize security over ease of use.
```

## Negative Constraints

Sometimes more effective than positive ones:
```markdown
# DO NOT
- NEVER start with "As an AI..."
- DO NOT use technical jargon without explanation
- DO NOT make assumptions about user intent
```

## Delimiters

Clearly separate sections:
```markdown
###INSTRUCTIONS###
[instructions here]

###CONTEXT###
[context here]

###TASK###
[task here]

###FORMAT###
[expected format]
```

## Self-Consistency

For critical tasks, generate multiple responses:
```markdown
Generate 3 different solutions for this problem.
For each solution, evaluate:
- Pros
- Cons
- Confidence score (1-10)

Then select the best with justification.
```
