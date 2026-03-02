#!/usr/bin/env python3
"""tailwind_skill_triggers.py - Domain-specific skill detection for Tailwind CSS.

Detects which Tailwind skills are required based on code content patterns.
"""

import re

from check_skill_common import specific_skill_consulted as _check

SKILL_TRIGGERS = {
    "tailwindcss-v4": [
        r"@theme\b", r"@source\b", r"@utility\b", r"@variant\b",
        r"@import\s+['\"]tailwindcss", r"@config\b",
    ],
    "tailwindcss-layout": [
        r"\b(flex|grid|inline-flex|inline-grid)\b",
        r"(justify|items|place)-(start|end|center|between)",
        r"(grid-cols|grid-rows|col-span|row-span)-",
        r"(absolute|relative|fixed|sticky)\b",
    ],
    "tailwindcss-typography": [
        r"(font-sans|font-serif|font-mono|font-bold|font-semibold)\b",
        r"(text-xs|text-sm|text-base|text-lg|text-xl|text-2xl)\b",
        r"(tracking-|leading-|line-clamp-)\b",
    ],
    "tailwindcss-backgrounds": [
        r"(bg-gradient|bg-linear|bg-radial|bg-conic)\b",
        r"(from-|via-|to-)\w+",
        r"bg-\[url\b",
    ],
    "tailwindcss-borders": [
        r"(rounded-|border-|ring-|outline-|divide-)\w+",
        r"(border-dashed|border-dotted|border-double)\b",
    ],
    "tailwindcss-effects": [
        r"(shadow-|opacity-|blur-|brightness-|contrast-)\w+",
        r"(backdrop-blur|backdrop-brightness|backdrop-contrast)\b",
        r"(inset-shadow-|mask-)\w+",
    ],
    "tailwindcss-transforms": [
        r"(scale-|rotate-|translate-|skew-)\w+",
        r"(transition-|duration-|ease-|delay-)\w+",
        r"(animate-spin|animate-pulse|animate-bounce)\b",
    ],
    "tailwindcss-responsive": [
        r"(sm:|md:|lg:|xl:|2xl:)\w+",
        r"(@container|container-type)\b",
        r"(min-\[|max-\[)\d+",
    ],
    "tailwindcss-spacing": [
        r"\b[pm][xytblr]?-\d+\b",
        r"(space-x-|space-y-|gap-)\d+",
    ],
    "tailwindcss-sizing": [
        r"\b[wh]-(full|screen|auto|min|max|fit)\b",
        r"(min-w-|max-w-|min-h-|max-h-)\w+",
        r"(aspect-video|aspect-square)\b",
    ],
    "tailwindcss-interactivity": [
        r"(cursor-|select-|pointer-events-|scroll-)\w+",
        r"(snap-|overscroll-|touch-)\w+",
    ],
    "tailwindcss-custom-styles": [
        r"@apply\b", r"@utility\s+\w+",
        r"@variant\s+\w+", r"theme\(\s*['\"]",
    ],
}


def specific_skill_consulted(skill_name: str, session_id: str) -> bool:
    """Check if a specific Tailwind skill was read."""
    return _check("tailwind", skill_name, session_id)


def detect_required_skills(content: str) -> list:
    """Detect which Tailwind skills are needed based on code patterns."""
    required = []
    for skill_name, patterns in SKILL_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, content):
                required.append(skill_name)
                break
    return required
