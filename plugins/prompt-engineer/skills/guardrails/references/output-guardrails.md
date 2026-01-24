# Output Guardrails

Validation AFTER LLM generation.

```
Main LLM Output
    │
    ▼
┌──────────────────┐
│ Output Guardrail │
│ - Format valid   │
│ - Hallucination  │
│ - Compliance     │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
  VALID    INVALID
    │         │
    ▼         ▼
  User    Retry/Error
```

## Format Validation

Verifies output respects expected format.

```python
# Pseudo-code
import json
import jsonschema

def validate_output(output, expected_schema):
    try:
        parsed = json.loads(output)
        jsonschema.validate(parsed, expected_schema)
        return True
    except:
        return False
```

**Example schema:**
```json
{
  "type": "object",
  "properties": {
    "response": {"type": "string"},
    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
    "sources": {"type": "array", "items": {"type": "string"}}
  },
  "required": ["response", "confidence"]
}
```

## Hallucination Detection

Verifies generated facts against sources.

```markdown
# Verification Prompt

Verify if the following claims are consistent with provided sources.

Sources: {context}

Claims to verify:
{extracted_claims}

For each claim, respond:
- "VERIFIED" if confirmed by sources
- "UNVERIFIED" if not mentioned in sources
- "CONTRADICTED" if contradicted by sources
```

**Implementation:**
```python
def extract_claims(text):
    # Use LLM to identify factual claims
    prompt = f"Extract all factual claims from: {text}"
    claims = llm(prompt)
    return claims

def verify_claims(claims, sources):
    prompt = f"""Verify claims against sources.

Sources: {sources}
Claims: {claims}

Rate each claim: VERIFIED / UNVERIFIED / CONTRADICTED"""

    result = llm(prompt)
    return result
```

## Tool Call Validation

Verifies tool calls match intent and are safe.

```markdown
# Validation Rule

IF user requests: {user_goal}
AND agent wants to call: {tool_call}

THEN verify:
- Is tool_call relevant to user_goal?
- Is there a security risk?
- Is the action proportionate?

Blocking examples:
- User: "What time is it?" → Tool: wire_money() ❌
- User: "Delete this file" → Tool: rm -rf / ❌
```

**Implementation:**
```python
def validate_tool_call(user_goal, tool_name, tool_args):
    checks = {
        "relevant": is_relevant(user_goal, tool_name),
        "safe": not has_security_risk(tool_name, tool_args),
        "proportionate": is_proportionate(user_goal, tool_name),
    }

    if all(checks.values()):
        return True
    else:
        raise SecurityError(f"Tool call rejected: {checks}")
```

## Safety Checks

Pre-execution validations.

```python
def safety_check(tool_call):
    # 1. Rate limiting
    if rate_limited(tool_call.user_id):
        raise RateLimitError()

    # 2. Permission check
    if not has_permission(tool_call.user_id, tool_call.tool):
        raise PermissionError()

    # 3. Input sanitization
    sanitized_args = sanitize(tool_call.args)

    # 4. Dry-run simulation
    result = simulate(tool_call.tool, sanitized_args)
    if result.has_errors:
        raise ValidationError(result.errors)

    return True
```

## Compliance Validation

Post-execution validation against regulations.

```python
def compliance_check(output, regulation_set="GDPR"):
    checks = {
        "no_pii": not contains_pii(output),
        "no_secrets": not contains_secrets(output),
        "appropriate_tone": check_tone(output),
        "factually_accurate": verify_facts(output),
    }

    if all(checks.values()):
        return "COMPLIANT"
    else:
        return f"COMPLIANCE_VIOLATION: {checks}"
```
