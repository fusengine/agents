#!/usr/bin/env python3
"""check-design-skill.py - PreToolUse hook: block UI edits if design skill not consulted."""

import json
import os
import re
import sys


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
    if os.path.isfile(task_file):
        try:
            with open(task_file, encoding="utf-8") as f:
                data = json.load(f)
            task_id = str(data.get("current_task", "1"))
            task = data.get("tasks", {}).get(task_id, {})
            doc = task.get("doc_consulted", {}).get(framework, {})
            if isinstance(doc, dict) and doc.get("consulted"):
                return True
        except (json.JSONDecodeError, OSError):
            pass
    return False


def deny_block(reason: str) -> None:
    """Output deny decision and exit."""
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input") or {}
    file_path = tool_input.get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not re.search(r"\.(tsx|jsx|css|scss)$", file_path):
        sys.exit(0)
    if re.search(r"/(node_modules|dist|build)/", file_path):
        sys.exit(0)
    if not re.search(r"(components|ui|styles)", file_path):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    project_root = find_project_root(os.path.dirname(file_path))

    if skill_was_consulted("design", session_id, project_root):
        sys.exit(0)

    plugins = os.path.expanduser(
        "~/.claude/plugins/marketplaces/fusengine-plugins/plugins"
    )
    msg = (
        "BLOCKED: Design skill not consulted. READ ONE: "
        f"1) {plugins}/design-expert/skills/generating-components/SKILL.md | "
        f"2) {plugins}/design-expert/skills/designing-systems/SKILL.md | "
        "3) Use mcp__context7__query-docs (topic: tailwindcss). After reading, retry."
    )
    deny_block(msg)


if __name__ == "__main__":
    main()
