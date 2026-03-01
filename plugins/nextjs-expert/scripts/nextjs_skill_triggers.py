#!/usr/bin/env python3
"""nextjs_skill_triggers.py - Domain-specific skill detection for Next.js.

Detects which skills are required based on code content patterns,
and verifies if specific skills were consulted via tracking files.
"""

import os
import re

from shadcn_patterns import SHADCN_PATTERNS

# Domain-specific skill triggers: code patterns -> required skill
SKILL_TRIGGERS = {
    "better-auth": [
        r"(authClient|betterAuth|createAuthClient)\b",
        r"(signIn|signUp|signOut|useSession|getSession)\b",
        r"auth\.(api|handler)\b",
        r"(prismaAdapter|drizzleAdapter|mongodbAdapter)\b",
        r"(twoFactor|passkey|magicLink|emailOtp|organization)\b",
        r"(apiKey|bearer|jwt|sso|scim|captcha|anonymous)\b",
        r"from\s+['\"].*better-auth",
    ],
    "nextjs-tanstack-form": [
        r"(useForm|useAppForm|createFormHook|formOptions)\b",
        r"(mergeForm|formApi|FieldApi|FormApi)\b",
        r"form\.(Field|Subscribe|handleSubmit)\b",
        r"(zodValidator|onServerValidate)\b",
        r"from\s+['\"]@tanstack/(react-form|zod-form-adapter)",
    ],
    "prisma-7": [
        r"(PrismaClient|prismaAdapter)\b",
        r"prisma\.(\w+\.\w+|\$\w+)",
        r"(globalForPrisma|\$transaction|\$queryRaw|\$executeRaw)\b",
        r"from\s+['\"](@prisma|\..*generated.*prisma)",
    ],
    "nextjs-shadcn": SHADCN_PATTERNS,
    "nextjs-zustand": [
        r"(create|createStore)\(\s*\(\s*set",
        r"from\s+['\"]zustand(/\w+)?\"",
        r"(useShallow|useStore|skipHydration)\b",
        r"\.(getState|setState|subscribe)\(\)",
        r"(persist|devtools|immer)\(",
    ],
    "nextjs-i18n": [
        r"(useTranslations|useLocale|useMessages|useFormatter)\b",
        r"(getTranslations|getLocale|getMessages|getFormatter)\b",
        r"(NextIntlClientProvider|defineRouting)\b",
        r"from\s+['\"]next-intl(/\w+)?\"",
        r"\bt\(\s*['\"]",
    ],
}


def specific_skill_consulted(skill_name: str, session_id: str) -> bool:
    """Check if a specific skill was read by scanning tracking file contents."""
    from tracking import TRACKING_DIR
    tracking = os.path.join(TRACKING_DIR, f"nextjs-{session_id}")
    if not os.path.isfile(tracking):
        return False
    try:
        with open(tracking, encoding="utf-8") as f:
            content = f.read()
        return f"skills/{skill_name}/" in content
    except OSError:
        return False


def detect_required_skills(content: str) -> list:
    """Detect which domain skills are needed based on code content patterns."""
    required = []
    for skill_name, patterns in SKILL_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                required.append(skill_name)
                break
    return required
