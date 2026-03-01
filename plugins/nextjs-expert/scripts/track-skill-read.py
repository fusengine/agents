#!/usr/bin/env python3
"""track-skill-read.py - Track skill file reads for nextjs-expert."""

import json
import os
import re
import sys
from datetime import datetime, timezone

FRAMEWORK = "nextjs"


def track_skill_read(framework: str, skill: str, topic: str, session_id: str) -> None:
    """Write tracking entry to TRACKING_DIR."""
    from tracking import TRACKING_DIR
    tracking_dir = TRACKING_DIR
    os.makedirs(tracking_dir, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    entry = f"{timestamp} SKILL:{skill} {topic}\n"
    with open(os.path.join(tracking_dir, f"{framework}-{session_id}"), "a", encoding="utf-8") as f:
        f.write(entry)
    if framework != "generic":
        with open(os.path.join(tracking_dir, f"generic-{session_id}"), "a", encoding="utf-8") as f:
            f.write(entry)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    if data.get("tool_name") != "Read":
        sys.exit(0)

    file_path = (data.get("tool_input") or {}).get("file_path", "")
    if not re.search(r"skills/.*\.(md|txt)$", file_path):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    track_skill_read(FRAMEWORK, "skill:Read", file_path, session_id)
    sys.exit(0)


if __name__ == "__main__":
    main()
