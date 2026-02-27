"""Shared hook output helpers for Claude Code PreToolUse/PostToolUse hooks.

Official format: hookSpecificOutput with permissionDecision (allow/deny/ask).
"""
import json


def emit_pre_tool(decision, reason, context=None):
    """Emit PreToolUse hookSpecificOutput JSON to stdout.

    Args:
        decision: 'allow', 'deny', or 'ask'.
        reason: Shown to user (allow/ask) or Claude (deny).
        context: Optional additionalContext visible to Claude.
    """
    output = {
        "hookEventName": "PreToolUse",
        "permissionDecision": decision,
        "permissionDecisionReason": reason,
    }
    if context:
        output["additionalContext"] = context
    print(json.dumps({"hookSpecificOutput": output}))


def emit_post_tool(context):
    """Emit PostToolUse hookSpecificOutput JSON to stdout.

    Args:
        context: additionalContext string visible to Claude.
    """
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": context,
    }}))


def allow_pass(script_name, detail="pass"):
    """Output PreToolUse allow with systemMessage for user visibility."""
    print(json.dumps({
        "systemMessage": f"{script_name}: {detail}",
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow",
        },
    }))


def post_pass(script_name, detail="ok"):
    """Output PostToolUse success with systemMessage for user visibility."""
    print(json.dumps({
        "systemMessage": f"{script_name}: {detail}",
        "hookSpecificOutput": {"hookEventName": "PostToolUse"},
    }))
