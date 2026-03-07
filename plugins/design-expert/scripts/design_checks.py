"""design_checks.py - Design validation check functions."""

import re


def check_accessibility(content: str) -> list[str]:
    """Check for accessibility issues in component content."""
    warnings = []
    if not re.search(r"<(button|a|input|img)", content):
        return warnings
    if re.search(r"<button[^>]*>", content):
        if not re.search(r"aria-label|aria-labelledby", content):
            icon_count = len(re.findall(r"<button[^>]*>[^<]*<.*Icon", content))
            if icon_count > 0:
                warnings.append("Accessibility: Icon buttons need aria-label.")
    if re.search(r'<img[^>]*src=', content):
        for match in re.finditer(r"<img[^>]*?>", content):
            if "alt=" not in match.group():
                warnings.append("Accessibility: Images need alt attribute.")
                break
    return warnings


def check_design_patterns(content: str) -> list[str]:
    """Check for design anti-patterns."""
    warnings = []
    if re.search(r"border-l-[0-9]+ border-l-(blue|green|red|purple)", content):
        warnings.append("Design: Avoid colored left borders - use shadow or gradient.")
    if re.search(r"from-purple|to-purple|via-purple|from-pink.*to-purple", content):
        warnings.append("Design: Avoid purple/pink gradients (AI slop) - use brand colors.")
    if re.search(r">[^\x00-\x7F]+<", content):
        emoji_pattern = r">[🎯🚀💡🔥⚡️✨🎨📊💼🏆]<"
        if re.search(emoji_pattern, content):
            warnings.append("Design: Avoid emojis as icons - use Lucide React.")
    return warnings


def check_forbidden_fonts(content: str) -> list[str]:
    """Detect forbidden font families in components and CSS."""
    warnings = []
    if re.search(r"font-family:\s*['\"]?(Roboto|Inter|Arial|Open Sans|Lato)\b",
                 content, re.IGNORECASE):
        warnings.append("FONT BLOCKED: Forbidden font (Roboto/Inter/Arial). Use identity fonts.")
    if re.search(r"@import.*fonts\.googleapis.*family=(Roboto|Inter)\b", content):
        warnings.append("FONT BLOCKED: Google Fonts import for forbidden font. Use Fontshare.")
    return warnings


def check_hardcoded_colors(content: str) -> list[str]:
    """Detect hard-coded hex/rgb colors in JSX."""
    warnings = []
    if re.findall(r'className="[^"]*#[0-9a-fA-F]{3,8}[^"]*"', content):
        warnings.append("COLOR BLOCKED: Hard-coded hex in className. Use CSS variables.")
    if re.findall(r"(?:color|background(?:-color)?|fill|stroke):\s*['\"]?#[0-9a-fA-F]{3,8}",
                  content):
        warnings.append("COLOR BLOCKED: Hard-coded hex in style. Use var(--color-*).")
    return warnings


def run_all_checks(content: str) -> list[str]:
    """Run all design checks and return warnings."""
    return (check_accessibility(content)
            + check_design_patterns(content)
            + check_forbidden_fonts(content)
            + check_hardcoded_colors(content))
