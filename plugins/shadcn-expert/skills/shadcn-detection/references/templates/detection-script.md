---
name: detection-script
description: Complete example of running primitive detection on a project
keywords: detection, script, usage, example
---

# Detection Script Usage

## Complete Detection Example

### Running the Script

```bash
# From project root
bash /path/to/plugins/shadcn-expert/scripts/detect-primitive-lib.sh /path/to/project

# Example output
# {"primitive":"radix","confidence":85,"pm":"bun","runner":"bunx","signals":["pkg:radix-ui","style:new-york","import:radix","attr:data-state","pm:bun"]}
```

### Interpreting Results

```typescript
// Parse detection output
interface DetectionResult {
  primitive: "radix" | "base-ui" | "mixed" | "none"
  confidence: number  // 0-100
  pm: "bun" | "npm" | "pnpm" | "yarn"
  runner: "bunx" | "npx" | "pnpm dlx" | "yarn dlx"
  signals: string[]
}

// Usage in agent workflow
const result: DetectionResult = JSON.parse(output)

if (result.primitive === "radix") {
  // Use Radix patterns: asChild, data-state, namespace imports
} else if (result.primitive === "base-ui") {
  // Use Base UI patterns: render prop, data-[open], subpath imports
} else if (result.primitive === "mixed") {
  // Flag for migration: both primitives detected
} else {
  // Fresh setup: recommend initialization
}

// Use detected runner for CLI commands
const addCommand = `${result.runner} shadcn@latest add button`
```

### Agent Workflow Integration

```bash
# Step 1: Detect primitive
RESULT=$(bash detect-primitive-lib.sh .)

# Step 2: Extract values
PRIMITIVE=$(echo "$RESULT" | jq -r '.primitive')
RUNNER=$(echo "$RESULT" | jq -r '.runner')

# Step 3: Use runner for CLI
$RUNNER shadcn@latest add dialog
```
