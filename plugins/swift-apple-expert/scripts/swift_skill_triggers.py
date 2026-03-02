#!/usr/bin/env python3
"""swift_skill_triggers.py - Domain-specific skill detection for Swift/Apple.

Detects which Swift skills are required based on code content patterns.
"""

import re

from check_skill_common import specific_skill_consulted as _check

SKILL_TRIGGERS = {
    "swiftui-core": [
        r"\bstruct\s+\w+\s*:\s*View\b", r"@State\b", r"@Binding\b",
        r"@Observable\b", r"@Environment\b", r"NavigationStack\b",
        r"\.sheet\b", r"\.toolbar\b", r"\.task\b",
    ],
    "swift-core": [
        r"\bactor\b", r"\basync\s+(let|func|throws)\b",
        r"\bawait\b", r"Task\s*\{", r"TaskGroup\b",
        r"Sendable\b", r"@MainActor\b",
    ],
    "ios": [
        r"UIKit|UIViewController|UIView\b",
        r"UIApplication\b", r"\.simulatorId\b",
        r"import\s+UIKit\b",
    ],
    "macos": [
        r"AppKit|NSViewController|NSWindow\b",
        r"NSApplication\b", r"\.menuBar\b",
        r"import\s+AppKit\b",
    ],
    "watchos": [
        r"WatchKit|WKInterface|WKExtension\b",
        r"HealthKit|HKWorkout\b", r"WatchConnectivity\b",
    ],
    "visionos": [
        r"RealityKit|RealityView|ImmersiveSpace\b",
        r"\.volumeBaseplateVisibility\b", r"SpatialTapGesture\b",
    ],
    "ipados": [
        r"UISplitViewController|UIKeyCommand\b",
        r"\.horizontalSizeClass\b", r"pencilInteraction\b",
    ],
    "tvos": [
        r"TVUIKit|focusable\b", r"\.focusSection\b",
        r"TVMonogram\b",
    ],
    "build-distribution": [
        r"TestFlight|AppStore\b", r"\.entitlements\b",
        r"codesign|notarize|archive\b",
    ],
}


def specific_skill_consulted(skill_name: str, session_id: str) -> bool:
    """Check if a specific Swift skill was read."""
    return _check("swift", skill_name, session_id)


def detect_required_skills(content: str) -> list:
    """Detect which Swift skills are needed based on code patterns."""
    required = []
    for skill_name, patterns in SKILL_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, content):
                required.append(skill_name)
                break
    return required
