#!/usr/bin/env python3
"""PostToolUse hook: Run prettier and eslint on edited TypeScript files."""
import os
import shutil
import subprocess
import sys


def main():
    file_paths = os.environ.get('CLAUDE_FILE_PATHS', '')
    if not file_paths:
        sys.exit(0)

    for file_path in file_paths.split():
        if not file_path.endswith(('.ts', '.tsx')):
            continue
        if shutil.which('prettier'):
            subprocess.run(
                ['prettier', '--write', file_path],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                check=False,
            )
        if shutil.which('eslint'):
            subprocess.run(
                ['eslint', '--fix', file_path],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                check=False,
            )

    sys.exit(0)


if __name__ == '__main__':
    main()
