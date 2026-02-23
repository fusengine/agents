---
name: module-template
description: TypeScript/Bun module template (< 80 lines)
when-to-use: creating modules, barrel exports, feature entry points
keywords: module, barrel, exports, index, feature
priority: medium
related: single-responsibility.md, architecture-patterns.md
applies-to: "**/*module*.ts, **/index.ts"
trigger-on-edit: "modules/"
level: template
---

# Module (< 80 lines)

## Basic Module with Exports

```typescript
// modules/parser/src/services/parser.service.ts
import type { ParserOptions, ParseResult } from '../interfaces/parser.interface'
import { ParserError } from '@/modules/cores/errors/parser.error'
import { DEFAULT_OPTIONS } from '../constants/parser.constants'

/**
 * Create a parser with given options.
 *
 * @param options - Parser configuration
 * @returns Parser instance with parse and validate methods
 */
export function createParser(options: ParserOptions = DEFAULT_OPTIONS) {
  return {
    /**
     * Parse input string into structured result.
     *
     * @param input - Raw input string
     * @returns Parsed result object
     * @throws ParserError if input is malformed
     */
    parse(input: string): ParseResult {
      if (!input.trim()) throw new ParserError('Empty input')
      // parsing logic...
      return { data: input, valid: true }
    },

    /**
     * Validate input without parsing.
     *
     * @param input - Raw input string
     * @returns True if input is valid
     */
    validate(input: string): boolean {
      try {
        this.parse(input)
        return true
      } catch {
        return false
      }
    }
  }
}
```

---

## Bun Script Module

```typescript
// scripts/process-data.ts
import type { ProcessOptions } from './lib/interfaces/process.interface'
import { createProcessor } from './lib/services/processor.service'

/**
 * Main entry point - wiring only.
 */
async function main(): Promise<void> {
  const input = await Bun.stdin.text()
  if (!input) process.exit(0)

  const processor = createProcessor({ format: 'json' })
  const result = await processor.execute(input)

  await Bun.write(Bun.stdout, JSON.stringify(result))
}

await main()
```

---

## Rules

- Max 80 lines per module
- Import feature types from `../interfaces/`, shared from `@/modules/cores/`
- JSDoc for all exports
- Entry points: wiring only (< 30 lines)
- Export functions, not classes (prefer composition)
