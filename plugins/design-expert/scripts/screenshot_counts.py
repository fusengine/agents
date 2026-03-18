"""screenshot_counts.py - Count Playwright screenshots by session or agent."""

import os

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
TRACKING_DIR = os.path.join(CACHE_DIR, "skill-tracking")


def count_screenshots(session_id: str) -> int:
    """Count Playwright screenshot entries in session tracking files."""
    if not os.path.isdir(TRACKING_DIR):
        return 0
    count = 0
    for fname in os.listdir(TRACKING_DIR):
        if session_id not in fname:
            continue
        path = os.path.join(TRACKING_DIR, fname)
        try:
            with open(path, encoding="utf-8") as f:
                for line in f:
                    if "playwright" in line and "screenshot" in line:
                        count += 1
        except OSError:
            continue
    return count


def count_agent_screenshots(agent_id: str) -> int:
    """Count Playwright screenshots for a specific agent."""
    if not agent_id or not os.path.isdir(TRACKING_DIR):
        return 0
    agent_file = os.path.join(TRACKING_DIR, f"agent-{agent_id}")
    if not os.path.isfile(agent_file):
        return 0
    count = 0
    try:
        with open(agent_file, encoding="utf-8") as f:
            for line in f:
                if "playwright" in line and "screenshot" in line:
                    count += 1
    except OSError:
        pass
    return count


def count_agent_gemini_calls(agent_id: str) -> int:
    """Count Gemini Design MCP calls for a specific agent."""
    if not agent_id or not os.path.isdir(TRACKING_DIR):
        return 0
    agent_file = os.path.join(TRACKING_DIR, f"agent-{agent_id}")
    if not os.path.isfile(agent_file):
        return 0
    count = 0
    try:
        with open(agent_file, encoding="utf-8") as f:
            for line in f:
                if "gemini-design" in line:
                    count += 1
    except OSError:
        pass
    return count
