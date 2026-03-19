#!/usr/bin/env python3
"""design_skill_triggers.py - Domain-specific skill detection for UI/UX design.

Detects which design skills are required based on code content patterns,
and verifies if specific skills were consulted via tracking files.
"""

import re

from check_skill_common import specific_skill_consulted as _check

# Domain-specific skill triggers: code patterns -> required skill
SKILL_TRIGGERS = {
    "3-generating-components": [
        r'className\s*=\s*["\{]',
        r'<(div|section|main|header|footer|nav|aside)\s',
        r'(flex|grid|gap-|p-|m-|bg-|text-|rounded|shadow|border)',
        r'(Button|Card|Dialog|Sheet|Input|Select|Table)\b',
        r"(cva|class-variance-authority|variants)\b",
        r"(VariantProps|variant.*:\s*\{)\b",
        r"(children|slots|asChild|Slot|render.?prop)\b",
        r"(forwardRef|React\.cloneElement|compound)\b",
    ],
    "1-designing-systems": [
        r"--(\w+-)+color:|:root\s*\{|@theme\b",
        r"(design.?system|token|palette|typography.?scale)\b",
        r"--(\w+)-(foreground|background|primary|muted|accent):",
        r"(cssVariables|themeConfig|colorScheme)\b",
        r"(dark:|prefers-color-scheme|next-themes|useTheme)\b",
        r"(ThemeProvider|data-theme|color-scheme)\b",
        r"(sm:|md:|lg:|xl:|2xl:)\b",
        r"(@container|container-type|@media)\b",
        r"(clamp\(|fluid|min-width:)\b",
    ],
    "4-adding-animations": [
        r"(motion\.|framer-motion|animate|variants)\b",
        r"(whileHover|whileTap|AnimatePresence|transition)\b",
        r"@keyframes\b|animation:\s",
        r"(backdrop-blur|bg-.*/([\d]+)|glass)\b",
        r"backdrop-filter:\s*blur",
        r"(hover:|focus:|active:|disabled:|focus-visible:)\b",
        r"(data-\[state=|data-\[disabled\])\b",
        r"(bg-gradient|from-|via-|to-)\b",
        r"(radial-gradient|conic-gradient|bg-\[url)\b",
        r"(blur-.*xl|opacity-|mix-blend)\b",
    ],
    "5-design-audit": [
        r"(aria-|role=|sr-only|tabIndex|alt=)\b",
        r"(WCAG|a11y|contrast|screen.?reader)\b",
    ],
}


def specific_skill_consulted(skill_name: str, session_id: str) -> bool:
    """Check if a specific Design skill was read."""
    return _check("design", skill_name, session_id)


def detect_required_skills(content: str) -> list:
    """Detect which domain skills are needed based on code content patterns."""
    required = []
    for skill_name, patterns in SKILL_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                required.append(skill_name)
                break
    return required
