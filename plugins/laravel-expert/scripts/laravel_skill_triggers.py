#!/usr/bin/env python3
"""laravel_skill_triggers.py - Domain-specific skill detection for Laravel.

Detects which skills are required based on PHP code content patterns,
and verifies if specific skills were consulted via tracking files.
"""

import re

from check_skill_common import specific_skill_consulted as _check
from laravel_patterns import (
    API_PATTERNS, AUTH_PATTERNS, BILLING_PATTERNS, BLADE_PATTERNS,
    ELOQUENT_PATTERNS, I18N_PATTERNS, LIVEWIRE_PATTERNS,
    MIGRATION_PATTERNS, PERMISSION_PATTERNS, QUEUE_PATTERNS,
    STRIPE_CONNECT_PATTERNS, TESTING_PATTERNS, VITE_PATTERNS,
)

SKILL_TRIGGERS = {
    "laravel-eloquent": ELOQUENT_PATTERNS,
    "laravel-api": API_PATTERNS,
    "laravel-auth": AUTH_PATTERNS,
    "laravel-livewire": LIVEWIRE_PATTERNS,
    "laravel-queues": QUEUE_PATTERNS,
    "laravel-billing": BILLING_PATTERNS,
    "laravel-stripe-connect": STRIPE_CONNECT_PATTERNS,
    "laravel-testing": TESTING_PATTERNS,
    "laravel-migrations": MIGRATION_PATTERNS,
    "laravel-blade": BLADE_PATTERNS,
    "laravel-permission": PERMISSION_PATTERNS,
    "laravel-i18n": I18N_PATTERNS,
    "laravel-vite": VITE_PATTERNS,
}


def specific_skill_consulted(skill_name: str, session_id: str) -> bool:
    """Check if a specific Laravel skill was read."""
    return _check("laravel", skill_name, session_id)


def detect_required_skills(content: str) -> list:
    """Detect which domain skills are needed based on code content patterns."""
    required = []
    for skill_name, patterns in SKILL_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                required.append(skill_name)
                break
    return required
