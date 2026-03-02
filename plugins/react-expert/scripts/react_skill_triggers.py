#!/usr/bin/env python3
"""react_skill_triggers.py - Domain-specific skill detection for React.

Detects which skills are required based on code content patterns,
and verifies if specific skills were consulted via tracking files.
"""

import re

from check_skill_common import specific_skill_consulted as _check
from shadcn_patterns import SHADCN_PATTERNS

# Domain-specific skill triggers: code patterns -> required skill
SKILL_TRIGGERS = {
    "react-19": [
        r"\buse\b\s*\(", r"useOptimistic\b", r"useActionState\b",
        r"useEffectEvent\b", r"<Activity\b",
        r"from\s+['\"]react['\"]",
    ],
    "react-tanstack-router": [
        r"(createRouter|createRoute|createRootRoute)\b",
        r"(useNavigate|useParams|useSearch|useLoaderData)\b",
        r"from\s+['\"]@tanstack/(react-router|router)",
        r"(routeTree|createFileRoute|createLazyFileRoute)\b",
    ],
    "react-forms": [
        r"(useForm|useAppForm|createFormHook|formOptions)\b",
        r"(mergeForm|formApi|FieldApi|FormApi)\b",
        r"form\.(Field|Subscribe|handleSubmit)\b",
        r"from\s+['\"]@tanstack/(react-form|zod-form-adapter)",
    ],
    "react-state": [
        r"(create|createStore)\(\s*\(\s*set",
        r"from\s+['\"]zustand(/\w+)?\"",
        r"(useShallow|useStore|skipHydration)\b",
        r"(persist|devtools|immer)\(",
    ],
    "react-testing": [
        r"(render|screen|fireEvent|waitFor)\b",
        r"from\s+['\"]@testing-library/react",
        r"(describe|it|expect|vi\.|jest\.)\b",
        r"from\s+['\"]vitest",
    ],
    "react-shadcn": SHADCN_PATTERNS,
    "react-i18n": [
        r"(useTranslation|Trans)\b",
        r"from\s+['\"]react-i18next",
        r"\bt\(\s*['\"]", r"i18n\.(language|changeLanguage)",
    ],
}


def specific_skill_consulted(skill_name: str, session_id: str) -> bool:
    """Check if a specific React skill was read."""
    return _check("react", skill_name, session_id)


def detect_required_skills(content: str) -> list:
    """Detect which domain skills are needed based on code content patterns."""
    required = []
    for skill_name, patterns in SKILL_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                required.append(skill_name)
                break
    return required
