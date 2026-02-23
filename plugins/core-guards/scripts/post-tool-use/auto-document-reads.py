#!/usr/bin/env python3
"""PostToolUse hook: Auto-document important file reads to task docs."""
import json
import os
import re
import sys
from datetime import datetime, timezone

DOC_PATTERNS = [
    r'(SKILL\.md|README\.md|CLAUDE\.md)$', r'/docs/.*\.md$',
    r'/references/.*\.md$', r'skills/[^/]+/SKILL\.md$',
]
TYPE_MAP = [
    ('SKILL.md', 'Skill'), ('README.md', 'README'), ('CLAUDE.md', 'Rules'),
    ('/references/', 'Reference'), ('/docs/', 'Doc'),
]


def find_project_root(directory):
    """Walk up to find project root."""
    d = directory
    while d != '/':
        for marker in ['package.json', 'composer.json']:
            if os.path.exists(os.path.join(d, marker)):
                return d
        if os.path.isdir(os.path.join(d, '.git')):
            return d
        d = os.path.dirname(d)
    return ''


def detect_framework(root):
    """Detect project framework."""
    if any(os.path.isfile(os.path.join(root, c)) for c in ['next.config.js', 'next.config.ts']):
        return 'nextjs'
    pkg = os.path.join(root, 'package.json')
    if os.path.isfile(pkg):
        try:
            with open(pkg, encoding='utf-8') as f:
                if 'react' in f.read():
                    return 'react'
        except OSError:
            pass
    if os.path.isfile(os.path.join(root, 'composer.json')) and os.path.isfile(os.path.join(root, 'artisan')):
        return 'laravel'
    if os.path.isfile(os.path.join(root, 'Package.swift')):
        return 'swift'
    return 'generic'


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    fp = data.get('tool_input', {}).get('file_path', '')
    if data.get('tool_name') != 'Read' or not fp:
        sys.exit(0)
    if not any(re.search(p, fp) for p in DOC_PATTERNS):
        sys.exit(0)
    root = find_project_root(os.path.dirname(fp))
    if not root:
        sys.exit(0)
    fw = detect_framework(root)
    task_file = os.path.join(root, '.claude', 'apex', 'task.json')
    cur = '1'
    if os.path.isfile(task_file):
        try:
            with open(task_file, encoding='utf-8') as f:
                cur = json.load(f).get('current_task', '1')
        except (json.JSONDecodeError, OSError):
            pass
    doc_dir = os.path.join(root, '.claude', 'apex', 'docs')
    os.makedirs(doc_dir, exist_ok=True)
    doc_file = os.path.join(doc_dir, f'task-{cur}-{fw}.md')
    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    fname = os.path.basename(fp)
    doc_type = next((t for k, t in TYPE_MAP if k in fp), 'File')
    if doc_type == 'Skill':
        print(f'skill loaded: {os.path.basename(os.path.dirname(fp))}', file=sys.stderr)
    if not os.path.isfile(doc_file):
        fc = fw[0].upper() + fw[1:]
        with open(doc_file, 'w', encoding='utf-8') as f:
            f.write(f'# Task {cur} - {fc} Documentation\n## Consulted: {ts} | Source: skill:Read\n## Key Info\n\n')
    try:
        with open(doc_file, encoding='utf-8') as f:
            if f'`{fname}`' in f.read():
                sys.exit(0)
    except OSError:
        pass
    with open(doc_file, 'a', encoding='utf-8') as f:
        f.write(f'- **[{doc_type}]** `{fname}` - {ts}\n')
    print(json.dumps({"systemMessage": f"📖 [{doc_type}] {fname} logged"}))
    sys.exit(0)


if __name__ == '__main__':
    main()
