#!/usr/bin/env python3
"""SessionStart hook: Cleanup old session state files."""
import glob
import os
import sys
import time


def main():
    state_dir = '/tmp/claude-code-sessions'
    if os.path.isdir(state_dir):
        now = time.time()
        for f in glob.glob(os.path.join(state_dir, 'session-*.json')):
            try:
                if now - os.path.getmtime(f) > 86400:
                    os.remove(f)
            except OSError:
                pass

    changes_file = f'/tmp/claude-code-changes-{os.environ.get("USER", "unknown")}.json'
    if os.path.isfile(changes_file):
        try:
            if time.time() - os.path.getmtime(changes_file) > 21600:
                os.remove(changes_file)
        except OSError:
            pass

    log_file = os.path.expanduser('~/.claude/logs/hooks.log')
    if os.path.isfile(log_file):
        try:
            if os.path.getsize(log_file) > 10485760:
                with open(log_file, encoding='utf-8') as f:
                    lines = f.readlines()
                with open(log_file, 'w', encoding='utf-8') as f:
                    f.writelines(lines[-5000:])
        except OSError:
            pass

    sys.exit(0)


if __name__ == '__main__':
    main()
