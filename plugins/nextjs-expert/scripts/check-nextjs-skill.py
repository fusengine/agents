#!/usr/bin/env python3
"""check-nextjs-skill.py - PreToolUse hook for Next.js skill enforcement.

Phase 1: Base skill check (solid-nextjs or nextjs-16).
Phase 2: Domain-specific skill check via nextjs_skill_triggers.
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_skill_common import deny_block, find_project_root, skill_was_consulted
from hook_output import allow_pass
from nextjs_skill_triggers import detect_required_skills, specific_skill_consulted
from shadcn_patterns import is_shadcn_project

NEXTJS_PATTERNS = r"(use client|use server|NextRequest|NextResponse)"
IMPORT_PATTERNS = r"(from ['\"]next|getServerSideProps|getStaticProps)"
FILE_PATTERNS = r"(page|layout|loading|error|route|middleware)\.(ts|tsx)$"
PLUGINS_DIR = os.path.expanduser(
    "~/.claude/plugins/marketplaces/fusengine-plugins/plugins")


def _is_ts_file(file_path: str) -> bool:
    """Check if file is a TS/JS file, excluding vendor directories."""
    if not re.search(r"\.(tsx|ts|jsx|js)$", file_path):
        return False
    return not re.search(r"/(node_modules|dist|build|\.next)/", file_path)


def _has_nextjs_patterns(file_path: str, content: str) -> bool:
    """Check if file has Next.js-specific patterns (Phase 1 gate only)."""
    return bool(
        re.search(NEXTJS_PATTERNS, content)
        or re.search(IMPORT_PATTERNS, content)
        or re.search(FILE_PATTERNS, file_path)
    )


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

    content = tool_input.get("content") or tool_input.get("new_string") or ""
    if not _is_ts_file(file_path):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    project_root = find_project_root(
        os.path.dirname(file_path), "package.json", ".git")

    # Phase 1: Base Next.js skill (only for files with Next.js patterns)
    if _has_nextjs_patterns(file_path, content):
        if not skill_was_consulted("nextjs", session_id, project_root):
            deny_block(
                "BLOCKED: Next.js skill not consulted. READ ONE: "
                f"1) {PLUGINS_DIR}/nextjs-expert/skills/solid-nextjs/SKILL.md"
                f" | 2) {PLUGINS_DIR}/nextjs-expert/skills/nextjs-16/SKILL.md"
                " | 3) Use mcp__context7__query-docs. After reading, retry.")

    # Phase 2: Domain skills (ALL .ts/.tsx - hooks, services, actions)
    # Skip shadcn patterns if project doesn't have components.json
    required = detect_required_skills(content)
    if not is_shadcn_project(project_root):
        required = [s for s in required if s != "nextjs-shadcn"]
    missing = [s for s in required
               if not specific_skill_consulted(s, session_id)]
    if missing:
        paths = " | ".join(
            f"{PLUGINS_DIR}/nextjs-expert/skills/{s}/SKILL.md"
            for s in missing)
        deny_block(f"BLOCKED: Code uses {', '.join(missing)} but "
                   f"skill(s) not consulted. READ: {paths}")

    allow_pass("check-nextjs-skill",
               f"pass (domain: {required or 'base'})")


if __name__ == "__main__":
    main()
