#!/usr/bin/env python3
"""Frontmatter parsing, level inference, and reference index cache."""
import glob
import hashlib
import json
import os
import re

PRINCIPLES = {'single-responsibility', 'open-closed', 'liskov-substitution',
              'interface-segregation', 'dependency-inversion', 'solid-principles'}


def parse_frontmatter(content):
    """Parse YAML frontmatter between --- markers."""
    m = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return {}
    meta = {}
    for line in m.group(1).split('\n'):
        if ':' in line:
            k, v = line.split(':', 1)
            meta[k.strip()] = v.strip().strip('"').strip("'")
    return meta


def _infer_level(fp):
    """Infer level from file path when not in frontmatter."""
    if '/templates/' in fp:
        return 'template'
    name = os.path.basename(fp).replace('.md', '')
    return 'principle' if name in PRINCIPLES else 'architecture'


def load_ref_index(skill_dir):
    """Load and cache reference metadata from frontmatters."""
    cache_dir = os.path.expanduser('~/.claude/logs/00-apex')
    os.makedirs(cache_dir, exist_ok=True)
    h = hashlib.sha256(skill_dir.encode()).hexdigest()[:16]
    cache_path = os.path.join(cache_dir, f'ref-cache-{h}.json')
    skill_md = os.path.join(skill_dir, 'SKILL.md')
    skill_mtime = os.path.getmtime(skill_md) if os.path.isfile(skill_md) else 0
    if os.path.isfile(cache_path):
        try:
            with open(cache_path, encoding='utf-8') as f:
                cache = json.load(f)
            if cache.get('mtime') == skill_mtime:
                return cache.get('refs', [])
        except (json.JSONDecodeError, OSError):
            pass
    refs = _build_ref_list(skill_dir)
    try:
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump({'mtime': skill_mtime, 'refs': refs}, f)
    except OSError:
        pass
    return refs


def _build_ref_list(skill_dir):
    """Scan references directory and build metadata list."""
    refs = []
    pattern = os.path.join(skill_dir, 'references', '**', '*.md')
    for fp in glob.glob(pattern, recursive=True):
        try:
            with open(fp, encoding='utf-8') as f:
                ct = f.read()
        except OSError:
            continue
        meta = parse_frontmatter(ct)
        if not meta.get('name'):
            continue
        refs.append({
            'name': meta.get('name', ''),
            'description': meta.get('description', ''),
            'keywords': meta.get('keywords', ''),
            'priority': meta.get('priority', 'medium'),
            'related': meta.get('related', ''),
            'appliesTo': meta.get('applies-to', ''),
            'triggerOnEdit': meta.get('trigger-on-edit', ''),
            'level': meta.get('level', '') or _infer_level(fp),
            'filePath': fp,
        })
    return refs
