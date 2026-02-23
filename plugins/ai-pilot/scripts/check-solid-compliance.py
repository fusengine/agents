#!/usr/bin/env python3
"""check-solid-compliance.py - PostToolUse hook for ai-pilot.

Validates SOLID compliance after any code modification (Write/Edit).
"""

import json
import os
import re
import sys


CODE_EXTENSIONS = re.compile(
    r"\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java)$"
)


def _count_code_lines(file_path: str) -> int:
    """Count non-empty, non-comment lines."""
    try:
        with open(file_path, encoding="utf-8") as f:
            lines = f.readlines()
    except OSError:
        return 0
    count = 0
    for line in lines:
        s = line.strip()
        if not s or s.startswith("//") or s.startswith("#") or s.startswith("*"):
            continue
        count += 1
    return count


def main() -> None:
    """Main entry for PostToolUse SOLID compliance."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool = data.get("tool_name", "")
    fp = data.get("tool_input", {}).get("file_path", "")

    if tool not in ("Write", "Edit"):
        sys.exit(0)
    if not CODE_EXTENSIONS.search(fp):
        sys.exit(0)
    if not os.path.isfile(fp):
        sys.exit(0)

    violations = []
    lc = _count_code_lines(fp)

    if lc > 100:
        violations.append(f"FILE SIZE: {lc} lines (max: 100)")
    elif lc > 90:
        violations.append(f"FILE SIZE WARNING: {lc} lines (split at 90)")

    if re.search(r"(components|pages|views)/", fp):
        try:
            with open(fp, encoding="utf-8") as f:
                if re.search(r"^(export )?(interface|type) [A-Z]",
                             f.read(), re.M):
                    violations.append("INTERFACE LOCATION: Move to "
                                      "src/interfaces/")
        except OSError:
            pass
    elif re.search(r"(Controllers|Models|Services)/", fp):
        try:
            with open(fp, encoding="utf-8") as f:
                if re.search(r"^interface ", f.read(), re.M):
                    violations.append("INTERFACE LOCATION: Move to "
                                      "app/Contracts/")
        except OSError:
            pass

    if not violations:
        sys.exit(0)

    name = os.path.basename(fp)
    print(f"solid: violations in {name}", file=sys.stderr)
    content = (f"SOLID COMPLIANCE CHECK: {name}\n\n"
               + "\n".join(violations)
               + "\nINSTRUCTION: Fix violations before continuing."
               "\nRun sniper agent for full validation.")

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": content,
        }
    }))
    sys.exit(0)


if __name__ == "__main__":
    main()
