#!/usr/bin/env python3
"""SessionStart hook: Cleanup old session state files."""
import glob
import os
import sys
import time


def _cleanup_old_files(pattern_dir, pattern, max_age):
    """Remove files matching pattern older than max_age seconds."""
    if not os.path.isdir(pattern_dir):
        return
    now = time.time()
    for f in glob.glob(os.path.join(pattern_dir, pattern)):
        try:
            if now - os.path.getmtime(f) > max_age:
                os.remove(f)
        except OSError:
            pass


def _trim_log_file(log_file, max_bytes, keep_lines):
    """Trim log file if it exceeds max_bytes, keeping last keep_lines."""
    if not os.path.isfile(log_file):
        return
    try:
        if os.path.getsize(log_file) > max_bytes:
            with open(log_file, encoding='utf-8') as f:
                lines = f.readlines()
            with open(log_file, 'w', encoding='utf-8') as f:
                f.writelines(lines[-keep_lines:])
    except OSError:
        pass


def _cleanup_changes_file(cache_base, max_age):
    """Remove stale per-user changes file."""
    user = os.environ.get("USER", "unknown")
    changes_file = os.path.join(cache_base, f'changes-{user}.json')
    if not os.path.isfile(changes_file):
        return
    try:
        if time.time() - os.path.getmtime(changes_file) > max_age:
            os.remove(changes_file)
    except OSError:
        pass


def main():
    """Run all cleanup tasks on session start."""
    cache_base = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache')
    state_dir = os.path.join(cache_base, 'sessions')
    _cleanup_old_files(state_dir, 'session-*.json', 86400)
    _cleanup_changes_file(cache_base, 21600)
    _trim_log_file(os.path.expanduser('~/.claude/logs/hooks.log'), 10485760, 5000)
    apex_dir = os.path.expanduser('~/.claude/logs/00-apex')
    _cleanup_old_files(apex_dir, 'ref-cache-*.json', 86400)
    sys.exit(0)


if __name__ == '__main__':
    main()
