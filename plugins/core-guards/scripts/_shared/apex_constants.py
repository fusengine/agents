"""Shared constants for APEX sub-agent tracking hooks."""
import re

# MCP tools that count as research-expert equivalent.
RESEARCH_TOOLS = {
    'mcp__context7__query-docs',
    'mcp__context7__resolve-library-id',
    'mcp__exa__web_search_exa',
    'mcp__exa__get_code_context_exa',
    'mcp__exa__deep_researcher_start',
    'WebSearch',
    'WebFetch',
}

# Native tools that count as explore-codebase equivalent.
EXPLORE_TOOLS = {'Glob', 'Grep'}

# Bash executables that count as exploration (subagents lacking native Glob/Grep).
EXPLORE_BASH_CMDS = {'grep', 'rg', 'find', 'ls', 'fd', 'ast-grep', 'tree', 'cat', 'head', 'tail'}

# Reads of cached MCP results count as research-expert sufficient.
CACHE_READ_RE = re.compile(r'/context/mcp/(exa-search|exa-code-context|context7-)')
