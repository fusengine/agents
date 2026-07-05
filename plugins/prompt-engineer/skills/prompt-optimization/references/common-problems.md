# Common Problems and Solutions

## 1. Vague Instructions

**Before:**
```
Write a good summary.
```

**After:**
```
Write a 100-150 word summary that:
1. Captures the main idea in the first sentence
2. Includes 2-3 supporting key points
3. Uses accessible language (high school level)
4. Avoids technical jargon
```

## 2. Lack of Context

**Before:**
```
Analyze this code.
```

**After:**
```
Analyze this Python code focusing on:
- Performance (algorithmic complexity)
- Readability (PEP 8 conventions)
- Security (OWASP vulnerabilities)

Context: Code for production REST API, 10k requests/day.
```

## 3. Undefined Format

**Before:**
```
Give me recommendations.
```

**After:**
```
Provide 3-5 recommendations in this format:

## Recommendation [N]: [Short title]
**Impact:** [High/Medium/Low]
**Effort:** [High/Medium/Low]
**Action:** [1-2 sentence description]
```

## 4. No Error Handling

**Before:**
```
Translate this text to French.
```

**After:**
```
Translate this text to French.

IF the text is already in French:
  → Indicate "The text is already in French" and suggest style improvements.

IF the text contains technical jargon:
  → Keep technical terms in English with translation in parentheses.

IF the text is too long (>1000 words):
  → Ask for confirmation before proceeding.
```

## 5. Insufficient Emphasis

**Before:**
```
Don't make up information.
```

**After:**
```
CRITICAL - ZERO TOLERANCE: NEVER make up information.
IF uncertain → Explicitly say "I'm not sure about..."
IF no data → Say "I don't have this information"
```
