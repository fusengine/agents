#!/usr/bin/env python3
"""PreToolUse hook - Block Swift edits if skill not consulted."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
try:
    from check_skill_common import find_project_root, skill_was_consulted, deny_block
    from hook_output import allow_pass
except ImportError:
    sys.exit(0)


def main():
    """Check Swift skill was consulted before .swift file edits."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    file_path = data.get("tool_input", {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not file_path.endswith(".swift"):
        sys.exit(0)
    if re.search(r"/(\.build|DerivedData|Pods)/", file_path):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    project_root = find_project_root(
        os.path.dirname(file_path), "Package.swift", "*.xcodeproj", ".git"
    )

    if skill_was_consulted("swift", session_id, project_root):
        allow_pass("check-swift-skill")

    plugins_dir = os.path.join(os.path.expanduser("~"),
        ".claude", "plugins", "marketplaces", "fusengine-plugins", "plugins")
    msg = (
        "BLOCKED: Swift skill not consulted. READ ONE: "
        f"1) {plugins_dir}/swift-apple-expert/skills/solid-swift/SKILL.md | "
        f"2) {plugins_dir}/swift-apple-expert/skills/swiftui-components/SKILL.md | "
        "3) Use mcp__context7__query-docs (topic: swiftui). After reading, retry."
    )
    deny_block(msg)


if __name__ == "__main__":
    main()
