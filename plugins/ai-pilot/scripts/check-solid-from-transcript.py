#!/usr/bin/env python3
"""check-solid-from-transcript.py - SubagentStop hook.

Checks SOLID compliance on files written/edited by subagents.
"""

import json
import os
import re
import sys


CODE_EXTENSIONS = re.compile(
    r"\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java)$"
)
INTERFACE_PATTERN = re.compile(r"^(export )?(interface|type) [A-Z]", re.M)


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
    """Main entry for SubagentStop SOLID check."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    transcript = data.get("agent_transcript_path", "")
    if not transcript or not os.path.isfile(transcript):
        sys.exit(0)

    try:
        with open(transcript, encoding="utf-8") as f:
            tr_data = json.load(f)
    except (json.JSONDecodeError, OSError):
        sys.exit(0)

    files = set()
    messages = tr_data if isinstance(tr_data, list) else [tr_data]
    for msg in messages:
        for content in msg.get("message", {}).get("content", []):
            if content.get("type") != "tool_use":
                continue
            if content.get("name") not in ("Write", "Edit"):
                continue
            fp = content.get("input", {}).get("file_path", "")
            if fp:
                files.add(fp)

    violations = []
    for fp in sorted(files):
        if not os.path.isfile(fp) or not CODE_EXTENSIONS.search(fp):
            continue
        lc = _count_code_lines(fp)
        name = os.path.basename(fp)
        if lc > 100:
            violations.append(f"SOLID: {name} = {lc} lines (max 100)")
        for prefix in ["components/", "pages/", "views/", "app/"]:
            if prefix in fp:
                try:
                    with open(fp, encoding="utf-8") as f:
                        if INTERFACE_PATTERN.search(f.read()):
                            violations.append(
                                f"SOLID: {name} has interfaces "
                                "(move to interfaces/)")
                except OSError:
                    pass
                break

    if not violations:
        sys.exit(0)

    warn = ("## SOLID VIOLATIONS DETECTED (subagent output)\n"
            + "\n".join(violations)
            + "\nRun sniper to fix these issues.")

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "SubagentStop",
            "additionalContext": warn,
        }
    }))


if __name__ == "__main__":
    main()
