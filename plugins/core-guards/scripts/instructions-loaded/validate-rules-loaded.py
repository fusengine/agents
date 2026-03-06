#!/usr/bin/env python3
"""Validate that APEX rules are loaded at session start."""
import json
import sys
from pathlib import Path


def main():
    """Log loaded instruction files for APEX debugging."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    file_path = data.get("file_path", "")
    load_reason = data.get("load_reason", "")
    memory_type = data.get("memory_type", "")

    # Log to debug file
    log_dir = Path.home() / ".claude" / "logs" / "instructions-loaded"
    log_dir.mkdir(parents=True, exist_ok=True)
    session_id = data.get("session_id", "unknown")
    log_file = log_dir / f"{session_id}.log"

    with open(log_file, "a") as f:
        f.write(f"{load_reason} | {memory_type} | {file_path}\n")

    # Exit 0 — InstructionsLoaded has no decision control
    sys.exit(0)


if __name__ == "__main__":
    main()
