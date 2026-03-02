#!/usr/bin/env python3
"""shadcn_skill_triggers.py - Domain-specific skill detection for shadcn/ui.

Detects which shadcn skills are required based on code content patterns.
"""

import re

from check_skill_common import specific_skill_consulted as _check

SKILL_TRIGGERS = {
    "shadcn-detection": [
        r"components\.json", r"@radix-ui/", r"@base-ui/",
        r"data-\[state=", r"data-\[disabled\]",
    ],
    "shadcn-components": [
        r"from\s+['\"].*components/ui/",
        r"<(Button|Input|Select|Dialog|Card|Table|Tabs|Badge)\b",
        r"(Popover|Tooltip|Sheet|Drawer|Command|Accordion)\b",
    ],
    "shadcn-theming": [
        r"--(primary|secondary|muted|accent|destructive|foreground):",
        r"(cssVariables|themeConfig|globals\.css)\b",
        r":root\s*\{|\.dark\s*\{",
    ],
    "shadcn-registries": [
        r"mcp__shadcn__(search|view|get_add_command|list_items)",
        r"bunx.*shadcn@latest\s+add\b",
        r"(registries|@shadcn|@acme)\b",
    ],
    "shadcn-migration": [
        r"(@radix-ui.*@base-ui|@base-ui.*@radix-ui)",
        r"(migrat|convert|switch).*(radix|base.?ui)",
    ],
}


def specific_skill_consulted(skill_name: str, session_id: str) -> bool:
    """Check if a specific shadcn skill was read."""
    return _check("shadcn", skill_name, session_id)


def detect_required_skills(content: str) -> list:
    """Detect which shadcn skills are needed based on code patterns."""
    required = []
    for skill_name, patterns in SKILL_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                required.append(skill_name)
                break
    return required
