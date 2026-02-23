#!/usr/bin/env python3
"""Metadata-aware reference routing for SOLID skill references."""
import fnmatch, glob, hashlib, json, os, re

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
    return 'principle' if os.path.basename(fp).replace('.md', '') in PRINCIPLES else 'architecture'


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
    refs = []
    for fp in glob.glob(os.path.join(skill_dir, 'references', '**', '*.md'), recursive=True):
        try:
            with open(fp, encoding='utf-8') as f:
                ct = f.read()
        except OSError:
            continue
        meta = parse_frontmatter(ct)
        if not meta.get('name'):
            continue
        refs.append({'name': meta.get('name', ''), 'description': meta.get('description', ''),
            'keywords': meta.get('keywords', ''), 'priority': meta.get('priority', 'medium'),
            'related': meta.get('related', ''), 'appliesTo': meta.get('applies-to', ''),
            'triggerOnEdit': meta.get('trigger-on-edit', ''),
            'level': meta.get('level', '') or _infer_level(fp), 'filePath': fp})
    try:
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump({'mtime': skill_mtime, 'refs': refs}, f)
    except OSError:
        pass
    return refs


def _score_ref(ref, file_path, content):
    """Score a single reference against the edited file."""
    score = 0
    if any(p.strip() and fnmatch.fnmatch(file_path, p.strip()) for p in (ref.get('appliesTo') or '').split(',')):
        score += 10
    if any(f.strip().rstrip('/') and f.strip().rstrip('/') in file_path for f in (ref.get('triggerOnEdit') or '').split(',')):
        score += 5
    haystack = (file_path + ' ' + content).lower()
    score += sum(1 for kw in (ref.get('keywords') or '').split(',') if kw.strip() and kw.strip().lower() in haystack)
    return score


def route_references(file_path, content, skill_dir):
    """Route to relevant references based on file being edited."""
    if not os.path.isdir(os.path.join(skill_dir, 'references')):
        return None
    refs = load_ref_index(skill_dir)
    if not refs:
        return None
    scored = [{'meta': r, 'score': s} for r in refs if (s := _score_ref(r, file_path, content)) > 0]
    if not scored:
        return None
    scored.sort(key=lambda x: -x['score'])
    top = scored[:4]
    for level in ('principle', 'template'):
        if not any(r['meta']['level'] == level for r in top):
            found = next((r for r in scored if r['meta']['level'] == level), None)
            if found and found not in top:
                top = top[:3] + [found]
    return {'required': top[:2], 'optional': top[2:4], 'skillPath': f'{skill_dir}/SKILL.md'}
