# MCP Servers

Model Context Protocol servers available in the plugins.

## Context7

**Purpose**: Official documentation lookup

**Used by**: `research-expert` agent

**Tools**:
- `resolve-library-id` - Find library ID
- `query-docs` - Query documentation

**Example**:
```
"How to use React Server Components?"
→ Context7 fetches official React docs
```

**API Key**: `CONTEXT7_API_KEY`
Get at: https://context7.com

## Exa

**Purpose**: Web search, code context, deep research

**Used by**: `research-expert`, `websearch` agents

**Tools**:
- `web_search_exa` - Web search
- `get_code_context_exa` - Code examples
- `deep_researcher_start` - Deep research
- `deep_researcher_check` - Check status

**Example**:
```
"Latest Next.js 16 features"
→ Exa searches recent articles, tutorials
```

**API Key**: `EXA_API_KEY`
Get at: https://exa.ai

## Magic (21st.dev)

**Purpose**: UI component generation

**Used by**: `design-expert` agent

**Tools**:
- `21st_magic_component_builder` - Generate components
- `21st_magic_component_inspiration` - Get inspiration
- `21st_magic_component_refiner` - Refine components
- `logo_search` - Search logos

**Example**:
```
"Create a pricing card component"
→ Magic generates production-ready React component
```

**API Key**: `MAGIC_API_KEY`
Get at: https://21st.dev

## shadcn

**Purpose**: Component registry

**Used by**: `design-expert`, `nextjs-expert`, `react-expert`

**Tools**:
- `search_items_in_registries` - Search components
- `view_items_in_registries` - View component code
- `get_item_examples_from_registries` - Get examples
- `get_add_command_for_items` - Get install command

**Example**:
```
"Add a button component"
→ shadcn provides: npx shadcn@latest add button
```

**No API key required** (public registry)

## Configuration

API keys are stored in `~/.claude/.env`:

```bash
export CONTEXT7_API_KEY="ctx7sk-xxx"
export EXA_API_KEY="xxx"
export MAGIC_API_KEY="xxx"
```

API keys are configured automatically during setup.
