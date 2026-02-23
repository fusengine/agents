#!/usr/bin/env python3
"""PreToolUse hook: Block interfaces/types in component/view files (SOLID)."""
import json
import re
import sys

RULES = [
    (r'\.(tsx|jsx|vue|svelte)$', r'^(export )?(interface|type) [A-Z]',
     'Interface/type in component file. Move to src/interfaces/'),
    (r'(views?|controllers?|routes?)/.*\.py$', r'^class [A-Z].*(BaseModel|TypedDict|Protocol)',
     'Type class in view file. Move to src/interfaces/'),
    (r'(handlers?|controllers?)/.*\.go$', r'^type [A-Z].*interface',
     'Interface in handler file. Move to internal/interfaces/'),
    (r'(controllers?|handlers?)/.*\.(java|kt)$', r'^(public |private )?(interface|record) [A-Z]',
     'Interface in controller file. Move to interfaces/ package'),
    (r'(Controllers?|Handlers?)/.*\.php$', r'^(interface|class) [A-Z].*(Interface|DTO|Request)',
     'Interface in controller file. Move to Interfaces/ directory'),
    (r'(Views?|Components?)/.*\.swift$', r'^protocol [A-Z]',
     'Protocol in view file. Move to Protocols/ or Models/'),
]


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    fp = data.get('tool_input', {}).get('file_path', '')
    content = data.get('tool_input', {}).get('content', '')
    if not fp or not content:
        sys.exit(0)

    for path_pat, content_pat, msg in RULES:
        if re.search(path_pat, fp):
            for line in content.splitlines():
                if re.search(content_pat, line):
                    print(json.dumps({"hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "deny",
                        "permissionDecisionReason": f"SOLID VIOLATION: {msg}"
                    }}))
                    sys.exit(0)
    sys.exit(0)


if __name__ == '__main__':
    main()
