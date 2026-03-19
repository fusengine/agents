#!/usr/bin/env python3
"""Block Write/Edit and Gemini MCP calls if < 4 Playwright screenshots taken."""
import json, os, sys

_SHARED = os.path.join(os.path.expanduser("~"), ".claude", "plugins",
    "marketplaces", "fusengine-plugins", "plugins", "_shared", "scripts")
sys.path.insert(0, _SHARED)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hook_output import allow_pass
from screenshot_counts import count_agent_screenshots, count_screenshots

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")
FLAG_FILE = os.path.join(CACHE_DIR, "design-agent-active")
MIN_SCREENSHOTS = 4
REF_PATH = "skills/generating-components/references/design-inspiration.md"
EXEMPT_DIRS = ("node_modules/", "dist/", "build/", ".claude/")
DENY_MSG = ("BLOCKED: Only {count}/{min} Playwright screenshots. Browse 4 sites BEFORE writing. "
    "Read {ref}, use browser_navigate + browser_take_screenshot fullPage:true on 4 sites.")
DENY_DS = ("BLOCKED: design-system.md not found. Create it FIRST using identity templates "
    "from skills/identity-system/references/templates/ (creative/devtool/ecommerce/fintech).")
DENY_GEMINI = ("BLOCKED: 4 screenshots done but Gemini Design NOT called. Use "
    "mcp__gemini-design__create_frontend/modify_frontend/snippet_frontend BEFORE writing.")

def deny_block(reason: str) -> None:
    """Emit deny block and exit."""
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)

def _is_exempt(fp: str) -> bool:
    """Return True if the file is exempt from screenshot checks."""
    return fp.endswith(".md") or any(d in fp for d in EXEMPT_DIRS)

def _find_design_system(file_path: str) -> bool:
    """Check up to 5 parent dirs for design-system.md."""
    check_dir = os.path.dirname(file_path)
    for _ in range(5):
        if os.path.isfile(os.path.join(check_dir, "design-system.md")):
            return True
        parent = os.path.dirname(check_dir)
        if parent == check_dir:
            break
        check_dir = parent
    return False

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
    if not current_agent_id:
        sys.exit(0)
    if design_agent_id and current_agent_id != design_agent_id:
        sys.exit(0)
    tool_name = data.get("tool_name", "")
    needs_check = False
    if tool_name.startswith("mcp__gemini-design__"):
        needs_check = True
    elif tool_name in ("Write", "Edit"):
        fp = (data.get("tool_input") or {}).get("file_path", "")
        if not _is_exempt(fp):
            needs_check = True
    if not needs_check:
        sys.exit(0)
    agent_id = data.get("agent_id") or ""
    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    screenshots = count_agent_screenshots(agent_id) if agent_id else count_screenshots(session_id)
    if screenshots >= MIN_SCREENSHOTS:
        if tool_name.startswith("mcp__gemini-design__"):
            cwd = os.getcwd()
            has_ds = (os.path.isfile(os.path.join(cwd, "design-system.md"))
                      or _find_design_system(os.path.join(cwd, "index.html")))
            if not has_ds:
                deny_block(DENY_DS)
        elif tool_name in ("Write", "Edit"):
            from screenshot_counts import count_agent_gemini_calls
            gemini_calls = count_agent_gemini_calls(agent_id) if agent_id else 0
            if gemini_calls == 0:
                deny_block(DENY_GEMINI)
            file_path = (data.get("tool_input") or {}).get("file_path", "")
            if not _find_design_system(file_path):
                deny_block(DENY_DS)
        allow_pass("check-playwright-browsing", f"pass ({screenshots} screenshots)")
        return
    deny_block(DENY_MSG.format(count=screenshots, min=MIN_SCREENSHOTS, ref=REF_PATH))

if __name__ == "__main__":
    main()
