"""pipeline_checks.py - Phase gate checks for design-expert pipeline."""

from typing import Optional
import json
import os
import sys

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
MIN_SCREENSHOTS = {"full": 4, "page": 2, "component": 0}


def deny(reason: str) -> None:
    """Emit deny and exit."""
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


def load_state(agent_id: str) -> Optional[dict]:
    """Load state file for agent_id, return None if missing."""
    path = os.path.join(CACHE_DIR, f".design-state-{agent_id}.json")
    if not os.path.isfile(path):
        return None
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return None


def save_state(state: dict) -> None:
    """Save updated state file."""
    from datetime import datetime, timezone
    state["updated_at"] = datetime.now(timezone.utc).isoformat()
    path = os.path.join(CACHE_DIR, f".design-state-{state['agent_id']}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def check_design_system_write(state: dict) -> None:
    """Gate: writing design-system.md requires enough screenshots."""
    mode = state.get("mode", "full")
    needed = MIN_SCREENSHOTS.get(mode, 4)
    count = state.get("screenshots_count", 0)
    phase = state.get("current_phase", 0)
    if phase < 2:
        deny(
            f"BLOCKED: Cannot write design-system.md at phase {phase}. "
            "RECOVERY: 1) Read identity templates from skills/0-identity-system/ "
            "2) Read design-inspiration.md 3) Browse and screenshot sites "
            "4) Then write design-system.md")
    if count < needed:
        deny(
            f"BLOCKED: {count}/{needed} screenshots for mode '{mode}'. "
            f"RECOVERY: 1) Take {needed - count} more Playwright screenshots "
            "2) Use browser_navigate + browser_take_screenshot fullPage:true "
            "3) Then write design-system.md")


def check_gemini_create(state: dict) -> None:
    """Gate: Gemini create requires phase >= 3 and valid design system."""
    if state.get("current_phase", 0) < 3:
        deny(
            "BLOCKED: Cannot call Gemini create_frontend before phase 3. "
            "RECOVERY: 1) Complete screenshot browsing phase "
            "2) Write a valid design-system.md "
            "3) Then call mcp__gemini-design__create_frontend")
    if not state.get("design_system_valid", False):
        deny(
            "BLOCKED: design-system.md not validated. "
            "RECOVERY: 1) Ensure design-system.md has ## Design Reference, "
            "OKLCH tokens, typography pair, reference URL "
            "2) Then retry mcp__gemini-design__create_frontend")


def check_playwright_navigate(state: dict) -> None:
    """Gate: Playwright navigate requires phase >= 1 and inspiration read."""
    if state.get("current_phase", 0) < 1:
        deny(
            "BLOCKED: Cannot browse before phase 1. "
            "RECOVERY: 1) Read identity templates "
            "2) Read design-inspiration.md first "
            "3) Then use mcp__playwright__browser_navigate")
    if not state.get("inspiration_read", False):
        deny(
            "BLOCKED: design-inspiration.md not read yet. "
            "RECOVERY: 1) Read design-inspiration.md "
            "2) Read design-inspiration-urls.md "
            "3) Choose 4 URLs then browse")
