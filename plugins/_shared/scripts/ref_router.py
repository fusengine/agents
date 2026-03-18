#!/usr/bin/env python3
"""Metadata-aware reference routing for SOLID skill references."""
import fnmatch
import os

from ref_router_utils import load_ref_index


def _score_ref(ref, file_path, content):
    """Score a single reference against the edited file."""
    score = 0
    applies = (ref.get('appliesTo') or '').split(',')
    if any(p.strip() and fnmatch.fnmatch(file_path, p.strip()) for p in applies):
        score += 10
    triggers = (ref.get('triggerOnEdit') or '').split(',')
    if any(f.strip().rstrip('/') and f.strip().rstrip('/') in file_path for f in triggers):
        score += 5
    haystack = (file_path + ' ' + content).lower()
    keywords = (ref.get('keywords') or '').split(',')
    score += sum(1 for kw in keywords if kw.strip() and kw.strip().lower() in haystack)
    return score


def _ensure_levels(top, scored):
    """Guarantee at least one principle and one template entry in top results."""
    for level in ('principle', 'template'):
        if not any(r['meta']['level'] == level for r in top):
            found = next((r for r in scored if r['meta']['level'] == level), None)
            if found and found not in top:
                top = top[:3] + [found]
    return top


def route_references(file_path, content, skill_dir):
    """Route to relevant references based on file being edited."""
    if not os.path.isdir(os.path.join(skill_dir, 'references')):
        return None
    refs = load_ref_index(skill_dir)
    if not refs:
        return None
    scored = [
        {'meta': r, 'score': s}
        for r in refs
        if (s := _score_ref(r, file_path, content)) > 0
    ]
    if not scored:
        return None
    scored.sort(key=lambda x: -x['score'])
    top = _ensure_levels(scored[:4], scored)
    return {
        'required': top[:2],
        'optional': top[2:4],
        'skillPath': f'{skill_dir}/SKILL.md',
    }
