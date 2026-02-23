#!/usr/bin/env python3
"""fetch-changelog.py - Fetch Claude Code changelog and detect new versions."""

import json
import os
import re
import sys
from datetime import datetime, timezone
from urllib.request import urlopen
from urllib.error import URLError


DOCS_BASE = "https://code.claude.com/docs/en"


def main() -> None:
    """Fetch changelog, detect versions, save state."""
    state_dir = os.path.join(os.path.expanduser("~"),
                             ".claude", "logs", "00-changelog")
    os.makedirs(state_dir, exist_ok=True)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    state_file = os.path.join(state_dir, f"{today}-state.json")

    try:
        with urlopen(f"{DOCS_BASE}/changelog.md", timeout=10) as resp:
            changelog = resp.read().decode("utf-8", errors="replace")
    except (URLError, OSError):
        print(json.dumps({"status": "error",
                          "message": "Failed to fetch changelog"}))
        sys.exit(1)

    versions = re.findall(r"## v?(\d+\.\d+\.\d+)", changelog)[:10]

    last_known = ""
    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding="utf-8") as f:
                last_known = json.load(f).get("last_version", "")
        except (json.JSONDecodeError, OSError):
            pass

    latest = versions[0] if versions else ""
    new_count = 0
    if last_known and latest:
        for v in versions:
            if v == last_known:
                break
            new_count += 1

    state = {
        "last_version": latest, "previous": last_known,
        "new_versions": new_count, "checked": today,
    }
    try:
        with open(state_file, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2, ensure_ascii=False)
    except OSError:
        pass

    print(json.dumps({
        "latest": latest,
        "new_since_last_check": new_count,
        "recent_versions": versions,
    }))


if __name__ == "__main__":
    main()
