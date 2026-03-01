#!/usr/bin/env python3
"""tracking.py - Centralized tracking functions for skill/MCP usage.

Importable functions (no main).
"""

import os
from datetime import datetime, timezone

TRACKING_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "fusengine-cache", "skill-tracking"
)


def _utc_now() -> str:
    """Return current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def track_skill_read(framework: str, skill: str, topic: str,
                     session_id: str = "") -> None:
    """Track a skill read event."""
    if not session_id:
        session_id = str(os.getpid())
    os.makedirs(TRACKING_DIR, exist_ok=True)
    ts = _utc_now()
    line = f"{ts} SKILL:{skill} {topic}\n"
    path = os.path.join(TRACKING_DIR, f"{framework}-{session_id}")
    with open(path, "a", encoding="utf-8") as f:
        f.write(line)
    if framework != "generic":
        generic = os.path.join(TRACKING_DIR, f"generic-{session_id}")
        with open(generic, "a", encoding="utf-8") as f:
            f.write(line)


def track_mcp_research(source: str, tool: str, query: str,
                       session_id: str = "") -> None:
    """Track an MCP research call."""
    if not session_id:
        session_id = str(os.getpid())
    q = query.lower()
    framework = "generic"
    for kw, fw in [("react", "react"), ("next", "nextjs"),
                   ("tailwind", "tailwind"), ("swift", "swift"),
                   ("swiftui", "swift"), ("ios", "swift"),
                   ("design", "design"), ("shadcn", "design"),
                   ("laravel", "laravel"), ("php", "laravel")]:
        if kw in q:
            framework = fw
    os.makedirs(TRACKING_DIR, exist_ok=True)
    ts = _utc_now()
    line = f"{ts} {source}:{tool} {query}\n"
    path = os.path.join(TRACKING_DIR, f"{framework}-{session_id}")
    with open(path, "a", encoding="utf-8") as f:
        f.write(line)
    if framework != "generic":
        generic = os.path.join(TRACKING_DIR, f"generic-{session_id}")
        with open(generic, "a", encoding="utf-8") as f:
            f.write(line)
