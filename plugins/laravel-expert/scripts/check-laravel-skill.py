#!/usr/bin/env python3
"""check-laravel-skill.py - PreToolUse hook for Laravel skill enforcement.

Phase 1: Base Laravel skill check (solid-php or laravel-eloquent).
Phase 2: Domain-specific skill check via laravel_skill_triggers.
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_skill_common import (
    deny_block, find_project_root, mcp_research_done, skill_was_consulted)
from hook_output import allow_pass
from laravel_skill_triggers import detect_required_skills, specific_skill_consulted

PLUGINS_DIR = os.path.expanduser(
    "~/.claude/plugins/marketplaces/fusengine-plugins/plugins")


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_input = data.get("tool_input") or {}
    file_path = tool_input.get("file_path", "")
    if data.get("tool_name") not in ("Write", "Edit"):
        sys.exit(0)
    if not file_path.endswith(".php"):
        sys.exit(0)
    if re.search(r"/(vendor|storage|bootstrap/cache)/", file_path):
        sys.exit(0)

    content = tool_input.get("content") or tool_input.get("new_string") or ""
    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    project_root = find_project_root(
        os.path.dirname(file_path), "composer.json", "artisan", ".git")

    # Phase 1: Base Laravel skill
    if not skill_was_consulted("laravel", session_id, project_root):
        deny_block(
            "BLOCKED: Laravel skill not consulted. READ ONE: "
            f"1) {PLUGINS_DIR}/laravel-expert/skills/solid-php/SKILL.md"
            f" | 2) {PLUGINS_DIR}/laravel-expert/skills/laravel-eloquent/SKILL.md"
            " | 3) Use mcp__context7__query-docs. After reading, retry.")

    # Phase 2: Domain skills (all .php files)
    required = detect_required_skills(content)
    missing = [s for s in required
               if not specific_skill_consulted(s, session_id)]
    if missing:
        paths = " | ".join(
            f"{PLUGINS_DIR}/laravel-expert/skills/{s}/SKILL.md"
            for s in missing)
        deny_block(f"BLOCKED: Code uses {', '.join(missing)} but "
                   f"skill(s) not consulted. READ: {paths}")

    # Phase 3: MCP research (Context7 AND Exa must be consulted)
    if not mcp_research_done(session_id):
        deny_block(
            "BLOCKED: No MCP research done. Use BOTH: "
            "1) mcp__context7__query-docs AND "
            "2) mcp__exa__web_search_exa before writing code.")

    allow_pass("check-laravel-skill",
               f"pass (domain: {required or 'base'})")


if __name__ == "__main__":
    main()
