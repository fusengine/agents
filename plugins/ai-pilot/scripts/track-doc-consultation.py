#!/usr/bin/env python3
"""track-doc-consultation.py - PostToolUse hook.

Tracks doc consultation (context7, exa, skill reads) into APEX state.
"""
import json
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(__file__))
from track_doc_helpers import acquire_state_lock, detect_framework, extract_tool_info

def _update_doc_sessions(fw_auth, sid, source, tool):
    """Update doc_sessions and sources for online doc consultation."""
    sources = fw_auth.get("sources", [])
    entry = f"{source}:{tool}"
    if entry not in sources:
        sources.append(entry)
    fw_auth["sources"] = sources
    fw_auth["source"] = entry  # Keep legacy compat
    doc_sessions = fw_auth.get("doc_sessions", [])
    if sid and sid not in doc_sessions:
        doc_sessions.append(sid)
    fw_auth["doc_sessions"] = doc_sessions

def main() -> None:
    """Main entry point for PostToolUse doc tracking."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    info = extract_tool_info(data)
    if not info:
        sys.exit(0)
    source, query, tool = info
    framework = detect_framework(query)
    state_dir = os.path.join(os.path.expanduser("~"),
                             ".claude", "logs", "00-apex")
    os.makedirs(state_dir, exist_ok=True)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    state_file = os.path.join(state_dir, f"{today}-state.json")
    lock_dir = os.path.join(state_dir, ".state.lock")
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    if not acquire_state_lock(lock_dir):
        sys.exit(0)
    try:
        default = {"$schema": "apex-state-v1", "target": {},
                    "authorizations": {}}
        state = default
        if os.path.isfile(state_file):
            try:
                with open(state_file, encoding="utf-8") as f:
                    state = json.load(f)
            except (json.JSONDecodeError, OSError):
                state = default
        auth = state.setdefault("authorizations", {})
        fw_auth = auth.setdefault(framework, {})
        sid = data.get("session_id", "")
        fw_auth["doc_consulted"] = ts
        # Only update source + doc_sessions for online doc (context7/exa)
        if source != "skill":
            _update_doc_sessions(fw_auth, sid, source, tool)
            # Also update target framework if different (query may not mention it)
            target_fw = state.get("target", {}).get("framework", "")
            if target_fw and target_fw != framework:
                t_auth = auth.setdefault(target_fw, {})
                _update_doc_sessions(t_auth, sid, source, tool)
        # Migrate old session (string) -> sessions (array) with dedup
        old = fw_auth.pop("session", None)
        sessions = fw_auth.get("sessions", [old] if old else [])
        if sid and sid not in sessions:
            sessions.append(sid)
        fw_auth["sessions"] = sessions
        with open(state_file, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2, ensure_ascii=False)
        print(json.dumps({
            "systemMessage": f"doc consulted: {source}:{framework}",
            "hookSpecificOutput": {"hookEventName": "PostToolUse"},
        }))
    finally:
        try:
            os.rmdir(lock_dir)
        except OSError:
            pass
    sys.exit(0)

if __name__ == "__main__":
    main()
