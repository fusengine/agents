#!/usr/bin/env python3
"""PreToolUse hook - Block shadcn edits if skill not consulted."""
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
    """Check shadcn skill was consulted before UI component edits."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    file_path = data.get("tool_input", {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not re.search(r"\.(tsx|jsx|css|scss|json)$", file_path):
        sys.exit(0)
    if re.search(r"/(node_modules|dist|build)/", file_path):
        sys.exit(0)
    if not re.search(r"(components|ui|shadcn|components\.json)", file_path):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    project_root = find_project_root(os.path.dirname(file_path), "package.json", ".git")

    if skill_was_consulted("shadcn", session_id, project_root):
        sys.exit(0)

    plugins_dir = os.path.join(os.path.expanduser("~"),
        ".claude", "plugins", "marketplaces", "fusengine-plugins", "plugins")
    msg = (
        "BLOCKED: shadcn skill not consulted. READ ONE: "
        f"1) {plugins_dir}/shadcn-expert/skills/shadcn-detection/SKILL.md | "
        f"2) {plugins_dir}/shadcn-expert/skills/shadcn-components/SKILL.md | "
        "3) Use mcp__shadcn__search_items_in_registries. After reading, retry."
    )
    deny_block(msg)


if __name__ == "__main__":
    main()
