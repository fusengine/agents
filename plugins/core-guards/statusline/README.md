# Claude Code Statusline

Modular SOLID statusline for Claude Code.

## Architecture

```
src/
├── index.ts                 # Entry point
├── interfaces/              # Interfaces (ISP)
│   ├── hook-input.interface.ts
│   ├── usage.interface.ts
│   ├── git.interface.ts
│   ├── segment.interface.ts
│   └── context.interface.ts
├── constants/               # Centralized constants
│   ├── colors.constant.ts
│   ├── icons.constant.ts
│   ├── progress-bar.constant.ts
│   └── limits.constant.ts
├── config/                  # Configuration (SRP)
│   ├── schema.ts
│   └── manager.ts
├── segments/                # Modular segments (OCP, LSP)
│   ├── claude.segment.ts
│   ├── directory.segment.ts
│   ├── model.segment.ts
│   ├── context.segment.ts
│   ├── cost.segment.ts
│   ├── five-hour.segment.ts
│   ├── weekly.segment.ts
│   ├── daily-spend.segment.ts
│   ├── node.segment.ts
│   └── edits.segment.ts
├── services/                # Business services (SRP)
│   ├── context.service.ts
│   ├── usage.service.ts
│   ├── weekly.service.ts
│   └── daily.service.ts
├── utils/                   # Utilities (SRP)
│   ├── colors.ts
│   ├── progress-bar.ts
│   ├── formatters.ts
│   └── git.ts
└── renderer/                # Main renderer (DIP)
    └── statusline.renderer.ts
```

## SOLID Principles

- **SRP**: Each module = one responsibility
- **OCP**: Add segments without modifying existing code
- **LSP**: All segments implement ISegment
- **ISP**: Small and specific interfaces
- **DIP**: Depend on abstractions (ISegment)

## Installation

**Automatic installation (recommended):**

```bash
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh
```

This script automatically installs hooks AND statusline.

**Manual installation:**

```bash
cd ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/core-guards/statusline
bun install
```

Then add to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bun ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/core-guards/statusline/src/index.ts",
    "padding": 0
  }
}
```

## Segment Configuration

Edit `config.json` to enable/disable segments:

```bash
bun run config        # Web configurator
bun run config:term   # Terminal configurator
```

## Adding a Segment

1. Create `src/segments/my-segment.segment.ts`
2. Implement `ISegment`
3. Add to `src/segments/index.ts`

```typescript
import type { ISegment, SegmentContext } from "../interfaces";
import type { StatuslineConfig } from "../config/schema";

export class MySegment implements ISegment {
  readonly name = "my-segment";
  readonly priority = 55; // Position in statusline

  isEnabled(config: StatuslineConfig): boolean {
    return true;
  }

  async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
    return "My segment";
  }
}
```

## Sources

- [Starship](https://starship.rs/) - Modular architecture
- [SOLID TypeScript](https://blog.logrocket.com/applying-solid-principles-typescript/)
- [Picocolors](https://github.com/alexeyraspopov/picocolors)
