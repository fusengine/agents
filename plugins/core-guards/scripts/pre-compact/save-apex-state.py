#!/usr/bin/env python3
"""PreCompact hook: Save APEX state before context compression."""
import glob
import json
import os
import shutil
import sys
from datetime import datetime


def main():
    project_root = os.getcwd()
    apex_dir = os.path.join(project_root, '.claude', 'apex')
    state_file = os.path.join(apex_dir, 'task.json')
    backup_dir = os.path.join(apex_dir, 'backups')

    if not os.path.isfile(state_file):
        sys.exit(0)

    os.makedirs(backup_dir, exist_ok=True)

    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    shutil.copy2(state_file, os.path.join(backup_dir, f'task-{timestamp}.json'))

    backups = sorted(glob.glob(os.path.join(backup_dir, 'task-*.json')), reverse=True)
    for old in backups[5:]:
        try:
            os.remove(old)
        except OSError:
            pass

    print(json.dumps({"additionalContext":
        "APEX state saved before compaction. Previous task state preserved in .claude/apex/backups/"}))
    sys.exit(0)


if __name__ == '__main__':
    main()
