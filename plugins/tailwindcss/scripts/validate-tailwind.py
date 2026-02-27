#!/usr/bin/env python3
"""PostToolUse hook - Validate Tailwind CSS best practices after Write/Edit."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import post_pass


def main():
    """Validate Tailwind best practices on written files."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    file_path = data.get("tool_input", {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not os.path.isfile(file_path):
        sys.exit(0)

    warnings = []

    try:
        with open(file_path, encoding="utf-8") as f:
            content = f.read()
    except OSError:
        sys.exit(0)

    if file_path.endswith(".css"):
        if re.search(r"@tailwind (base|components|utilities)", content):
            warnings.append(
                "Tailwind v4: @tailwind directives are deprecated"
                " - use @import 'tailwindcss'."
            )
        apply_count = len(re.findall(r"@apply", content))
        if apply_count > 10:
            warnings.append(
                f"Excessive @apply usage ({apply_count})"
                " - prefer utility classes directly."
            )

    if re.search(r"\.(tsx|jsx)$", file_path):
        long_classes = len(re.findall(r'className="[^"]{150,}"', content))
        if long_classes > 0:
            warnings.append(
                f"Very long className ({long_classes} lines)"
                " - extract to @utility or use cn()."
            )

    if warnings:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": " ".join(warnings),
            }
        }))

    post_pass("validate-tailwind", "tailwind ok")


if __name__ == "__main__":
    main()
