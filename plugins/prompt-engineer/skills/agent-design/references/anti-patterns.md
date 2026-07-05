# Anti-Patterns to Avoid

### ❌ Omniscient agent
```
You know everything and can do anything.
```

### ✅ Specialized agent
```
You are an expert in [specific domain].
For topics outside your domain, redirect to the appropriate agent.
```

### ❌ Implicit instructions
```
Do what's logical.
```

### ✅ Explicit instructions
```
Step 1: Analyze the problem
Step 2: Propose 3 solutions
Step 3: Recommend the best with justification
```

### ❌ No error handling
```
Execute the task.
```

### ✅ Explicit error handling
```
IF the task fails:
  1. Identify the cause
  2. Propose an alternative
  3. Ask for confirmation before retrying
```
