#!/usr/bin/env python3
"""check-skill-loaded.py - PreToolUse hook: block React edits if skill not consulted."""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import allow_pass

NEXTJS_PATTERN = r"(use client|use server|NextRequest|NextResponse|from ['\"]next)"
REACT_PATTERN = r"(useState|useEffect|useContext|useReducer|from ['\"]react)"


def find_project_root(start_dir: str) -> str:
    """Find project root by walking up to find package.json or .git."""
    d = start_dir
    while d and d != "/":
        for marker in ("package.json", ".git"):
            if os.path.exists(os.path.join(d, marker)):
                return d
        d = os.path.dirname(d)
    return os.getcwd()


def skill_was_consulted(framework: str, session_id: str, project_root: str) -> bool:
    """Check if skill was consulted via tracking file or APEX task.json."""
    tracking = f"/tmp/claude-skill-tracking/{framework}-{session_id}"
    if os.path.isfile(tracking):
        return True
    task_file = os.path.join(project_root, ".claude", "apex", "task.json")
    if not os.path.isfile(task_file):
        return False
    try:
        with open(task_file, encoding="utf-8") as f:
            data = json.load(f)
        tid = str(data.get("current_task", "1"))
        doc = data.get("tasks", {}).get(tid, {}).get("doc_consulted", {}).get(framework, {})
        return isinstance(doc, dict) and doc.get("consulted", False)
    except (json.JSONDecodeError, OSError):
        return False


def deny_block(reason: str) -> None:
    """Output deny decision and exit."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))
    sys.exit(0)


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
    if not re.search(r"\.(tsx|ts|jsx|js)$", file_path):
        sys.exit(0)
    if re.search(r"/(node_modules|dist|build)/", file_path):
        sys.exit(0)

    content = tool_input.get("content") or tool_input.get("new_string") or ""
    if re.search(NEXTJS_PATTERN, content):
        sys.exit(0)
    if not re.search(REACT_PATTERN, content):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    project_root = find_project_root(os.path.dirname(file_path))
    if skill_was_consulted("react", session_id, project_root):
        allow_pass("check-skill-loaded")

    plugins = os.path.expanduser("~/.claude/plugins/marketplaces/fusengine-plugins/plugins")
    deny_block(
        "BLOCKED: React skill not consulted. READ ONE: "
        f"1) {plugins}/react-expert/skills/solid-react/SKILL.md | "
        f"2) {plugins}/react-expert/skills/react-19/SKILL.md | "
        "3) Use mcp__context7__query-docs (topic: react). After reading, retry."
    )


if __name__ == "__main__":
    main()
