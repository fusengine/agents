#!/usr/bin/env python3
"""Block Write/Edit and Gemini MCP calls if < 4 Playwright screenshots taken."""
import json, os, sys

_SHARED = os.path.join(os.path.expanduser("~"), ".claude", "plugins",
    "marketplaces", "fusengine-plugins", "plugins", "_shared", "scripts")
sys.path.insert(0, _SHARED)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hook_output import allow_pass
from screenshot_counts import count_agent_screenshots, count_screenshots
from pipeline_checks import load_state, save_state
from playwright_helpers import deny_block, is_exempt, find_design_system

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(CACHE_DIR, "design-agent-active")
MIN_SCREENSHOTS = 4
DENY_MSG = ("BLOCKED: Only {count}/{min} Playwright screenshots. Browse 4 sites BEFORE writing. "
    "Read design-inspiration.md, use browser_navigate + browser_take_screenshot on 4 sites.")
DENY_DS = ("BLOCKED: design-system.md not found. Create it FIRST using identity templates "
    "from skills/0-identity-system/references/templates/.")
DENY_GEMINI = ("BLOCKED: 4 screenshots done but Gemini Design NOT called. Use "
    "mcp__gemini-design__create_frontend/modify_frontend/snippet_frontend BEFORE writing.")


def _update_state(agent_id: str, screenshots: int) -> None:
    """Sync screenshots_count into state file."""
    if not agent_id:
        return
    state = load_state(agent_id)
    if state:
        state["screenshots_count"] = screenshots
        save_state(state)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    if not os.path.isfile(FLAG_FILE):
        sys.exit(0)
    try:
        with open(FLAG_FILE) as f:
            design_agent_id = f.read().strip()
    except OSError:
        sys.exit(0)
    current_agent_id = data.get("agent_id") or ""
    if not current_agent_id or (design_agent_id and current_agent_id != design_agent_id):
        sys.exit(0)
    tool_name = data.get("tool_name", "")
    needs_check = tool_name.startswith("mcp__gemini-design__")
    if not needs_check and tool_name in ("Write", "Edit"):
        needs_check = not is_exempt((data.get("tool_input") or {}).get("file_path", ""))
    if not needs_check:
        sys.exit(0)
    agent_id = data.get("agent_id") or ""
    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    screenshots = count_agent_screenshots(agent_id) if agent_id else count_screenshots(session_id)
    _update_state(agent_id, screenshots)
    if screenshots >= MIN_SCREENSHOTS:
        if tool_name.startswith("mcp__gemini-design__"):
            cwd = os.getcwd()
            if not (os.path.isfile(os.path.join(cwd, "design-system.md"))
                    or find_design_system(os.path.join(cwd, "index.html"))):
                deny_block(DENY_DS)
        elif tool_name in ("Write", "Edit"):
            from screenshot_counts import count_agent_gemini_calls
            if (count_agent_gemini_calls(agent_id) if agent_id else 0) == 0:
                deny_block(DENY_GEMINI)
            if not find_design_system((data.get("tool_input") or {}).get("file_path", "")):
                deny_block(DENY_DS)
        allow_pass("check-playwright-browsing", f"pass ({screenshots} screenshots)")
        return
    deny_block(DENY_MSG.format(count=screenshots, min=MIN_SCREENSHOTS))


if __name__ == "__main__":
    main()
