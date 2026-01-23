# APEX Documentation Tracking

Automatic tracking system for documentation consultations in the APEX workflow.

## Problem Solved

Without tracking, hooks blocked in an infinite loop:
```
Write/Edit → BLOCK "Consult the docs"
   ↓
Consult Context7/Exa
   ↓
Retry Write/Edit → BLOCK (again!) ← No memory
```

## Solution

The system tracks consultations in `.claude/apex/` per project:

```
project/
└── .claude/
    └── apex/
        ├── task.json              # Task state
        └── docs/                  # Auto-generated summaries
            ├── task-1-react.md
            ├── task-1-tailwind.md
            └── task-2-nextjs.md
```

## Initialization

```bash
# Auto-init (the system creates the structure on first tracking)

# Or manual init
bash ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/ai-pilot/scripts/init-apex-tracking.sh

# With a specific task ID
bash init-apex-tracking.sh "feat-button-component"
```

## Workflow

```
1. Claude wants to Write Button.tsx
         ↓
   [PreToolUse] enforce-apex-phases.sh
   ├── Detects: React code
   ├── Checks: .claude/apex/task.json
   └── doc_consulted.react = false → 🚫 BLOCK
         ↓
2. Claude consults Context7 (react)
         ↓
   [PostToolUse] track-doc-consultation.sh
   ├── Creates: .claude/apex/docs/task-1-react.md
   └── Update: task.json["1"]["react"]["consulted"] = true
         ↓
3. Claude retries Write Button.tsx
         ↓
   [PreToolUse] enforce-apex-phases.sh
   ├── Checks: task.json
   └── doc_consulted.react = true → ✅ ALLOW
         ↓
4. Write succeeds
```

## task.json Structure

```json
{
  "current_task": "1",
  "created_at": "2025-01-23T10:00:00Z",
  "tasks": {
    "1": {
      "status": "in_progress",
      "started_at": "2025-01-23T10:00:00Z",
      "doc_consulted": {
        "react": {
          "consulted": true,
          "file": "docs/task-1-react.md",
          "source": "context7:mcp__context7__query-docs",
          "timestamp": "2025-01-23T10:05:00Z"
        },
        "tailwind": {
          "consulted": true,
          "file": "docs/task-1-tailwind.md",
          "source": "exa:mcp__exa__get_code_context_exa",
          "timestamp": "2025-01-23T10:06:00Z"
        }
      }
    }
  }
}
```

## Auto-generated Docs

Each consultation creates a summary file:

```markdown
# Task 1 - React Documentation

## Consulted at
2025-01-23T10:05:00Z

## Source
- Tool: mcp__context7__query-docs
- Provider: context7

## Query/Input
libraryId: /vercel/react
query: react hooks patterns

## Key Information Extracted
[First 50 lines of the response]

## Patterns to Apply
- [ ] Follow SOLID principles
- [ ] Keep files < 100 lines
- [ ] Add JSDoc/comments
- [ ] Separate interfaces
```

## Tracked Sources

| Source | Detection |
|--------|-----------|
| **Context7** | `mcp__context7__query-docs`, `mcp__context7__resolve-library-id` |
| **Exa** | `mcp__exa__get_code_context_exa`, `mcp__exa__web_search_exa` |
| **Skills** | `Read skills/*.md` |

## Detected Frameworks

| Framework | Detected Patterns |
|-----------|-------------------|
| `react` | `.tsx`, `.jsx`, `useState`, `useEffect`, `className=` |
| `nextjs` | `page.tsx`, `layout.tsx`, `use client`, `NextRequest` |
| `swift` | `.swift`, `@State`, `@Observable`, `SwiftUI` |
| `laravel` | `.php`, `Illuminate`, `Route::`, `Eloquent` |
| `tailwind` | `.css`, `@tailwind`, `@apply`, `@theme` |
| `design` | `className=`, `cn(`, `cva(`, `Button`, `Card` |

## Involved Hooks

| Hook | Type | File |
|------|------|---------|
| `track-doc-consultation.sh` | PostToolUse | Tracks Context7/Exa/skills |
| `enforce-apex-phases.sh` | PreToolUse | Checks task.json before Write |
| `init-apex-tracking.sh` | Script | Manual initialization |

## Gitignore

The init script automatically adds to `.gitignore`:

```
# APEX tracking (auto-generated)
.claude/apex/
```

## Reset

To reset tracking for a task:

```bash
# Delete the folder
rm -rf .claude/apex/

# Or re-init
bash init-apex-tracking.sh "new-task-id"
```

## Troubleshooting

### Hook still blocks after consultation

Check that the detected framework matches:

```bash
cat .claude/apex/task.json | jq '.tasks["1"].doc_consulted'
```

### Tracking is not working

Check that the PostToolUse hook is properly configured:

```bash
cat ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/ai-pilot/hooks/hooks.json
```

### Manual test

```bash
echo '{"tool_name":"mcp__context7__query-docs","tool_input":{"libraryId":"/vercel/react","query":"hooks"}}' | \
  bash plugins/ai-pilot/scripts/track-doc-consultation.sh
```
