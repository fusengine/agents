#!/usr/bin/env python3
"""check-nextjs-skill.py - PreToolUse hook for Next.js skill enforcement.

Phase 1: Base skill check. Phase 2: Domain skills. Phase 3: MCP research.
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
from nextjs_skill_triggers import detect_required_skills, specific_skill_consulted
from shadcn_patterns import is_shadcn_project

NEXTJS_RE = r"(use client|use server|NextRequest|NextResponse)"
IMPORT_RE = r"(from ['\"]next|getServerSideProps|getStaticProps)"
FILE_RE = r"(page|layout|loading|error|route|middleware)\.(ts|tsx)$"
_P = os.path.expanduser(
    "~/.claude/plugins/marketplaces/fusengine-plugins/plugins")


def _is_ts_file(path: str) -> bool:
    """Check if file is TS/JS, excluding vendor dirs."""
    if not re.search(r"\.(tsx|ts|jsx|js)$", path):
        return False
    return not re.search(r"/(node_modules|dist|build|\.next)/", path)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_input = data.get("tool_input") or {}
    fp = tool_input.get("file_path", "")
    if data.get("tool_name") not in ("Write", "Edit"):
        sys.exit(0)
    content = tool_input.get("content") or tool_input.get("new_string") or ""
    if not _is_ts_file(fp):
        sys.exit(0)

    sid = data.get("session_id") or f"fallback-{os.getpid()}"
    root = find_project_root(os.path.dirname(fp), "package.json", ".git")

    # Phase 1: Base Next.js skill
    has_nx = (re.search(NEXTJS_RE, content)
              or re.search(IMPORT_RE, content)
              or re.search(FILE_RE, fp))
    if has_nx and not skill_was_consulted("nextjs", sid, root):
        deny_block(
            "BLOCKED: Next.js skill not consulted. READ ONE: "
            f"1) {_P}/nextjs-expert/skills/solid-nextjs/SKILL.md"
            f" | 2) {_P}/nextjs-expert/skills/nextjs-16/SKILL.md"
            " | 3) Use mcp__context7__query-docs. After reading, retry.")

    # Phase 2: Domain skills (skip shadcn if no components.json)
    required = detect_required_skills(content)
    if not is_shadcn_project(root):
        required = [s for s in required if s != "nextjs-shadcn"]
    missing = [s for s in required
               if not specific_skill_consulted(s, sid)]
    if missing:
        paths = " | ".join(f"{_P}/nextjs-expert/skills/{s}/SKILL.md"
                           for s in missing)
        deny_block(f"BLOCKED: Code uses {', '.join(missing)} but "
                   f"skill(s) not consulted. READ: {paths}")

    # Phase 3: MCP research (Context7 AND Exa required)
    if not mcp_research_done(sid):
        deny_block(
            "BLOCKED: No MCP research done. Use BOTH: "
            "1) mcp__context7__query-docs AND "
            "2) mcp__exa__web_search_exa before writing code.")

    allow_pass("check-nextjs-skill",
               f"pass (domain: {required or 'base'})")


if __name__ == "__main__":
    main()
