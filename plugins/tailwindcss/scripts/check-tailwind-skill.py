#!/usr/bin/env python3
"""PreToolUse hook - Block Tailwind edits if skill not consulted."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
try:
    from check_skill_common import find_project_root, skill_was_consulted, deny_block
except ImportError:
    sys.exit(0)


def main():
    """Check Tailwind skill was consulted before style/component edits."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    file_path = data.get("tool_input", {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not re.search(r"\.(tsx|jsx|css|html)$", file_path):
        sys.exit(0)
    if re.search(r"/(node_modules|dist|build)/", file_path):
        sys.exit(0)

    content = (
        data.get("tool_input", {}).get("content")
        or data.get("tool_input", {}).get("new_string")
        or ""
    )
    tw_pattern = r"(className|class).*['\"].*\b(flex|grid|p-|m-|w-|h-|text-|bg-|border-)"
    if not re.search(tw_pattern, content):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    project_root = find_project_root(
        os.path.dirname(file_path),
        "tailwind.config.js", "tailwind.config.ts", "package.json"
    )

    if skill_was_consulted("tailwind", session_id, project_root):
        sys.exit(0)

    plugins_dir = os.path.join(os.path.expanduser("~"),
        ".claude", "plugins", "marketplaces", "fusengine-plugins", "plugins")
    msg = (
        "BLOCKED: Tailwind skill not consulted. READ ONE: "
        f"1) {plugins_dir}/tailwindcss/skills/tailwindcss-v4/SKILL.md | "
        f"2) {plugins_dir}/tailwindcss/skills/tailwindcss-utilities/SKILL.md | "
        "3) Use mcp__context7__query-docs (topic: tailwindcss). After reading, retry."
    )
    deny_block(msg)


if __name__ == "__main__":
    main()
