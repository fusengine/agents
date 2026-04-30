"""Compaction helpers for the MCP cache pipeline.

Levels: 1 = entity decode + boilerplate strip, 2C = whitespace normalize
+ 5KB UTF-8 truncate, 4 = 8-char query hash + Jaccard similarity. Pure;
safe to import from SubagentStart/PreToolUse hooks.
"""
from __future__ import annotations

import hashlib
import re

_HTML_ENTITIES = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
    "&#x27;": "'", "&#39;": "'", "&nbsp;": " ", "&apos;": "'",
}

_BOILERPLATE_PATTERNS = [
    re.compile(r"(?im)^.*cookie.*(accept|consent|banner).*$"),
    re.compile(r"(?im)^.*was this (helpful|page helpful|article helpful).*$"),
    re.compile(r"(?im)^.*©\s*\d{4}.*all rights reserved.*$"),
    re.compile(r"(?im)^\s*(home|about|contact|privacy|terms)\s*\|\s*.*$"),
    re.compile(r"(?im)^.*subscribe to (our )?newsletter.*$"),
    re.compile(r"(?im)^.*follow us on (twitter|facebook|linkedin).*$"),
]

_WS_RE = re.compile(r"\n{3,}")
_HEX_ENT_RE = re.compile(r"&#x([0-9a-fA-F]+);")
_DEC_ENT_RE = re.compile(r"&#(\d+);")
_MAX_BYTES = 5 * 1024


def _decode_entities(text: str) -> str:
    """Decode named + numeric HTML entities to their unicode chars."""
    for ent, char in _HTML_ENTITIES.items():
        text = text.replace(ent, char)
    text = _HEX_ENT_RE.sub(lambda m: chr(int(m.group(1), 16)), text)
    text = _DEC_ENT_RE.sub(lambda m: chr(int(m.group(1))), text)
    return text


def compact_markdown(content: str) -> str:
    """Compact markdown: strip entities/boilerplate, normalize whitespace, truncate.

    :param content: Raw markdown/text content to compact.
    :return: Compacted string, truncated to ~5KB with marker if oversized.
    """
    text = _decode_entities(content)
    for pat in _BOILERPLATE_PATTERNS:
        text = pat.sub("", text)
    text = _WS_RE.sub("\n\n", text).strip()
    encoded = text.encode("utf-8")
    if len(encoded) > _MAX_BYTES:
        truncated = encoded[:_MAX_BYTES].decode("utf-8", errors="ignore")
        remaining = text[len(truncated):].count("\n")
        text = f"{truncated}\n\n[... truncated, {remaining} lines]"
    return text


def query_hash(tool_name: str, query: str) -> str:
    """Compute 8-char MD5 hash of tool_name + query concat.

    :param tool_name: MCP tool identifier.
    :param query: Query payload string.
    :return: First 8 hex chars of MD5 digest.
    """
    digest = hashlib.md5(f"{tool_name}::{query}".encode("utf-8")).hexdigest()
    return digest[:8]


def jaccard_similar(query_a: str, query_b: str, threshold: float = 0.8) -> bool:
    """Bag-of-words Jaccard similarity check between two queries.

    :param query_a: First query string.
    :param query_b: Second query string.
    :param threshold: Minimum Jaccard score to consider similar.
    :return: True if intersection/union > threshold.
    """
    tokens_a = set(query_a.lower().split())
    tokens_b = set(query_b.lower().split())
    if not tokens_a or not tokens_b:
        return False
    inter = len(tokens_a & tokens_b)
    union = len(tokens_a | tokens_b)
    return (inter / union) > threshold


if __name__ == "__main__":
    assert compact_markdown("a &amp; b") == "a & b"
    assert "truncated" in compact_markdown("x\n" * 5000)
    assert compact_markdown("a\n\n\n\n\nb") == "a\n\nb"
    assert "cookie" not in compact_markdown("Accept cookie banner here\nreal content").lower()
    h = query_hash("search", "foo bar")
    assert len(h) == 8 and h == query_hash("search", "foo bar")
    assert query_hash("a", "x") != query_hash("b", "x")
    assert jaccard_similar("the quick brown fox", "the quick brown fox jumps", 0.5)
    assert not jaccard_similar("hello world", "completely different terms")
    assert not jaccard_similar("", "anything")
    print("cache_compactor: all assertions passed")
