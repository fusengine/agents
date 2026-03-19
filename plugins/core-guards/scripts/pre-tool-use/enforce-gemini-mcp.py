#!/usr/bin/env python3
"""PreToolUse: Block UI code with Tailwind if Gemini Design MCP not called in session."""
import json
import re
import sys

UI_EXT = re.compile(r'\.(tsx|jsx|vue|svelte)$')
EXEMPT_DIRS = re.compile(r'(node_modules|dist|build|\.next|\.claude)/')

TAILWIND_PATTERNS = [
    r'\bflex\b', r'\bgrid\b', r'\bp-\d', r'\bpx-\d', r'\bpy-\d',
    r'\bm-\d', r'\bmx-\d', r'\bmy-\d', r'\bmt-\d', r'\bmb-\d',
    r'\bbg-\w+', r'\btext-\w+', r'\brounded', r'\bshadow',
    r'\bborder\b', r'\bgap-\d', r'\bw-\w+', r'\bh-\w+',
    r'\bjustify-\w+', r'\bitems-\w+', r'\bspace-\w+-\d',
]

GEMINI_PREFIX = 'mcp__gemini-design__'
MIN_TAILWIND_CLASSES = 3
MIN_LINES_FOR_EDIT = 2

BLOCK_MSG = (
    "BLOCKED: UI code with Tailwind detected but Gemini Design MCP not used.\n"
    "Use mcp__gemini-design__create_frontend, modify_frontend, or "
    "snippet_frontend BEFORE writing UI code manually.\n"
    "NEVER write Tailwind classes by hand — always use Gemini Design MCP first."
)


def count_tailwind_classes(content):
    """Count distinct Tailwind pattern matches in content."""
    return sum(1 for p in TAILWIND_PATTERNS if re.search(p, content))


def gemini_was_called(transcript_path):
    """Check if mcp__gemini-design__* was called in session transcript."""
    try:
        with open(transcript_path, 'r', encoding='utf-8') as fh:
            for line in fh:
                try:
                    entry = json.loads(line.strip())
                    for block in entry.get('message', {}).get('content', []):
                        if block.get('type') == 'tool_use':
                            if block.get('name', '').startswith(GEMINI_PREFIX):
                                return True
                except (json.JSONDecodeError, AttributeError):
                    continue
    except (OSError, IOError):
        return False
    return False


def main():
    """Entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    if data.get('agent_id'):
        sys.exit(0)
    tool_input = data.get('tool_input', {})
    fp = tool_input.get('file_path', '')
    if not fp or not UI_EXT.search(fp):
        sys.exit(0)
    if EXEMPT_DIRS.search(fp):
        sys.exit(0)
    tool_name = data.get('tool_name', '')
    content = tool_input.get('content', '') or tool_input.get('new_string', '')
    if not content:
        sys.exit(0)
    if tool_name == 'Edit' and content.count('\n') < MIN_LINES_FOR_EDIT:
        sys.exit(0)
    if count_tailwind_classes(content) < MIN_TAILWIND_CLASSES:
        sys.exit(0)
    transcript = data.get('transcript_path', '')
    if transcript and gemini_was_called(transcript):
        sys.exit(0)
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": BLOCK_MSG,
    }}))


if __name__ == '__main__':
    main()
