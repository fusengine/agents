#!/usr/bin/env python3
"""shadcn_patterns.py - Comprehensive HTML-to-shadcn detection patterns.

Detects native HTML elements, ARIA attributes, and CSS patterns
that should use shadcn/ui components instead. Covers all 52 components.
Shared across nextjs-expert, react-expert, design-expert, shadcn-ui-expert.
"""

import os

# Forms: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider,
#        Label, InputOTP, Toggle, ToggleGroup
FORM_PATTERNS = [
    r"<(button|input|select|textarea|label|option|optgroup)\b",
    r"type=\"(checkbox|radio|range|file)\"",
    r"<input[^>]*maxLength=\"[1-2]\"",
]

# Overlay: Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip,
#          HoverCard, ContextMenu, Command, DropdownMenu
OVERLAY_PATTERNS = [
    r"<dialog\b",
    r"role=\"(dialog|alertdialog)\"",
    r"(aria-haspopup|aria-expanded|aria-pressed)=\"",
    r"(onContextMenu|onMouseEnter.*onMouseLeave)\b",
    r"\b(confirm|window\.confirm)\(",
    r"title=\"[^\"]{2,}\"",
]

# Data: Table, Card, Badge, Avatar, Calendar, Chart, Carousel, Pagination
DATA_PATTERNS = [
    r"<(table|thead|tbody|tfoot|th|td|tr|caption|colgroup)\b",
    r"<(article|section)\b[^>]*className",
    r"rounded-full[^>]*className|className[^>]*rounded-full",
    r"<img\b[^>]*rounded",
    r"(new Date|\.toLocaleDateString|date-fns|dayjs)\b",
    r"(recharts|chart\.js|<svg[^>]*viewBox)",
    r"(scroll-snap|embla-carousel|useEmbla)\b",
    r"(page=|currentPage|totalPages|pageSize)\b",
]

# Navigation: Breadcrumb, NavigationMenu, Menubar, Sidebar, Tabs
NAV_PATTERNS = [
    r"<(nav|aside)\b",
    r"<(menu|menuitem)\b",
    r"role=\"(menubar|menu|menuitem|tablist|tab|tabpanel)\"",
    r"aria-label=\"(breadcrumb|navigation|sidebar)\"",
    r"aria-current=\"(page|step)\"",
]

# Layout: Accordion, Collapsible, Separator, ScrollArea, AspectRatio,
#         Resizable
LAYOUT_PATTERNS = [
    r"<(hr|details|summary)\b",
    r"role=\"separator\"",
    r"overflow-(auto|scroll|y-auto|x-auto)",
    r"(aspect-ratio|aspect-video|aspect-square)\b",
    r"(resize|cursor-(col|row)-resize)\b",
]

# Feedback: Alert, Toast, Progress, Skeleton, Spinner
FEEDBACK_PATTERNS = [
    r"role=\"(alert|status|progressbar)\"",
    r"aria-live=\"(polite|assertive)\"",
    r"<progress\b",
    r"(animate-pulse|animate-spin)\b",
    r"(sonner|react-hot-toast|\.toast\()\b",
]

# All patterns combined
SHADCN_PATTERNS = (
    FORM_PATTERNS + OVERLAY_PATTERNS + DATA_PATTERNS
    + NAV_PATTERNS + LAYOUT_PATTERNS + FEEDBACK_PATTERNS
)


def is_shadcn_project(project_root: str) -> bool:
    """Check if shadcn/ui is installed (components.json or ui/ dir)."""
    if os.path.isfile(os.path.join(project_root, "components.json")):
        return True
    for ui_path in ("src/components/ui", "components/ui",
                    "src/modules/cores/shadcn/components/ui"):
        if os.path.isdir(os.path.join(project_root, ui_path)):
            return True
    return False
