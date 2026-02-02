---
name: template-template
description: Complete template for creating code template files
keywords: template, code, example, complete, copy-paste
---

# Code Template File Template

## Usage

Copy this template when creating a new code template in `references/templates/`.

---

## Template

```markdown
---
name: <template-name>
description: Complete example of <what this demonstrates>
keywords: <keyword1>, <keyword2>, <keyword3>
source: <optional-official-docs-url>
---

# <Template Title>

## Overview

<Brief description of what this template demonstrates and when to use it.>

---

## Prerequisites

- <Prerequisite 1>
- <Prerequisite 2>
- <Prerequisite 3>

---

## Installation

\`\`\`bash
<installation commands>
\`\`\`

---

## File: <path/to/file.ts>

\`\`\`typescript
/**
 * <File description>
 */

// Imports
import { ... } from '...';

// Types/Interfaces
interface ... {
  ...
}

// Implementation
export function/const ... {
  ...
}
\`\`\`

---

## File: <path/to/another-file.ts>

\`\`\`typescript
/**
 * <File description>
 */

// Full implementation
...
\`\`\`

---

## Usage Example

\`\`\`typescript
// How to use the above code
import { ... } from './...';

// Example usage
...
\`\`\`

---

## Configuration (if applicable)

\`\`\`typescript
// config file
export const config = {
  ...
};
\`\`\`

---

## Testing (if applicable)

\`\`\`typescript
// Test file
import { describe, it, expect } from '...';

describe('...', () => {
  it('should ...', () => {
    ...
  });
});
\`\`\`

---

## Notes

- <Important note 1>
- <Important note 2>
- <Important note 3>
```

---

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Template identifier |
| `description` | Yes | What template demonstrates |
| `keywords` | Yes | Search keywords |
| `source` | No | Official docs URL |

---

## Guidelines

### Completeness

**Include everything needed to run the code:**
- All imports
- All types/interfaces
- Full implementation
- Usage example

### File Paths

**Always specify where files go:**
```markdown
## File: src/hooks/useAuth.ts
```

### Comments

**Explain key parts:**
```typescript
// This hook manages authentication state
export function useAuth() {
  // Store user in state
  const [user, setUser] = useState(null);

  // Check auth on mount
  useEffect(() => {
    // ...
  }, []);
}
```

### No Size Limit

Templates can be as long as needed for completeness.

---

## Example Filled

```yaml
---
name: basic-query-setup
description: Complete TanStack Query setup with provider and first query
keywords: setup, provider, useQuery, queryClient
source: https://tanstack.com/query/latest/docs/framework/react/quick-start
---

# Basic Query Setup

## File: src/lib/queryClient.ts

\`\`\`typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});
\`\`\`

## File: src/app/providers.tsx

\`\`\`typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
\`\`\`
```
