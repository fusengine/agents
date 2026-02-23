#!/usr/bin/env python3
"""SessionEnd hook: Clean temp files on session end."""
import glob
import os
import sys
import time


def main():
    tracking_dir = '/tmp/claude-session'
    if os.path.isdir(tracking_dir):
        now = time.time()
        for f in glob.glob(os.path.join(tracking_dir, '*.tmp')):
            try:
                if now - os.path.getmtime(f) > 3600:
                    os.remove(f)
            except OSError:
                pass

    now = time.time()
    for pattern in ['claude_solid_reads_*', 'claude_session_changes_*']:
        for f in glob.glob(os.path.join('/tmp', pattern)):
            try:
                if now - os.path.getmtime(f) > 7200:
                    os.remove(f)
            except OSError:
                pass

    sys.exit(0)


if __name__ == '__main__':
    main()
