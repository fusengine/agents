#!/usr/bin/env python3
"""Install guard patterns - standalone Python version (data only, no-op when run)."""
import sys

SYSTEM_INSTALL_PATTERNS = [
    'brew install', 'brew upgrade', 'brew cask', 'apt install', 'apt-get install',
]

PROJECT_INSTALL_PATTERNS = [
    'npm install', 'npm i ', 'yarn add', 'pnpm add', 'pip install', 'pip3 install',
    'composer require', 'bun add', 'bun install', 'cargo install', 'go install',
    'gem install', 'pipx install',
]


def main():
    """No-op: data-only helper converted to standalone."""
    print('install-patterns: standalone Python data module (no-op)', file=sys.stderr)
    sys.exit(0)


if __name__ == '__main__':
    main()
