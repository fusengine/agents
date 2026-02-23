#!/usr/bin/env python3
"""PostToolUse hook - Check file size after writing."""
import json
import os
import re
import sys


def count_loc(file_path):
    """Count lines of code excluding comments and blank lines."""
    ext = os.path.splitext(file_path)[1].lstrip(".")
    try:
        with open(file_path, encoding="utf-8") as f:
            lines = f.readlines()
    except OSError:
        return 0

    code_comment = {
        "ts": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "tsx": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "js": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "jsx": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "go": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "rs": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "java": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "swift": r"^\s*$|^\s*//|^\s*/\*|^\s*\*",
        "php": r"^\s*$|^\s*//|^\s*#|^\s*/\*|^\s*\*",
        "py": r"^\s*$|^\s*#|^\s*\"\"\"|^\s*'''",
    }
    pattern = code_comment.get(ext)
    if pattern:
        return sum(1 for line in lines if not re.match(pattern, line))
    return len(lines)


def main():
    """Check file size and warn if over SOLID limit."""
    ptype = os.environ.get("SOLID_PROJECT_TYPE", "")
    if not ptype or ptype == "unknown":
        sys.exit(0)

    data = json.load(sys.stdin)
    file_path = (
        data.get("tool_input", {}).get("file_path")
        or data.get("tool_input", {}).get("filePath")
        or ""
    )
    if not file_path or not os.path.isfile(file_path):
        sys.exit(0)

    loc = count_loc(file_path)
    limit = int(os.environ.get("SOLID_FILE_LIMIT", "100"))

    if loc > limit:
        filename = os.path.basename(file_path)
        print(f"SOLID: {filename} has {loc} lines (limit: {limit})")
        print("   Consider splitting into smaller modules")

    sys.exit(0)


if __name__ == "__main__":
    main()
