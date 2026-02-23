#!/usr/bin/env python3
"""Setup hook: First-run validation on plugin installation."""
import os
import shutil
import sys


def main():
    missing = []
    for key in ['CONTEXT7_API_KEY', 'EXA_API_KEY']:
        if not os.environ.get(key):
            missing.append(key)

    if missing:
        print(f"Missing API keys: {', '.join(missing)}. Run setup.sh to configure.", file=sys.stderr)

    if not shutil.which('bun'):
        print("Bun runtime not found. Install: curl -fsSL https://bun.sh/install | bash", file=sys.stderr)

    sys.exit(0)


if __name__ == '__main__':
    main()
