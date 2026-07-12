---
name: prompt-testing
description: "A/B testing and performance metrics for prompts. Use when: comparing two prompt variants, defining quality/efficiency/robustness metrics, or deciding whether to adopt a challenger prompt over a baseline."
allowed-tools: Read, Write, Bash
---

# Prompt Testing

Skill for testing, comparing, and measuring prompt performance.

## References

- [metrics.md](references/metrics.md) - Load when: defining or scoring Quality/Efficiency/Robustness/UX metrics with thresholds and calculation formulas
- [methodology.md](references/methodology.md) - Load when: running a full A/B test (hypothesis, dataset sizing, statistical significance, common pitfalls)
- [templates.md](references/templates.md) - Load when: writing a test dataset JSON or an A/B test report

## Testing Workflow

```text
1. DEFINE
   └── Test objective
   └── Metrics to measure
   └── Success criteria

2. PREPARE
   └── Variants A and B
   └── Test dataset
   └── Baseline (if existing)

3. EXECUTE
   └── Run on dataset
   └── Collect results
   └── Document observations

4. ANALYZE
   └── Calculate metrics
   └── Compare variants
   └── Identify patterns

5. DECIDE
   └── Recommendation
   └── Statistical confidence
   └── Next iterations
```

## Performance Metrics

### Quality

| Metric | Description | Calculation |
|--------|-------------|-------------|
| **Accuracy** | Correct responses | Correct / Total |
| **Compliance** | Format adherence | Compliant / Total |
| **Consistency** | Response stability | 1 - Variance |
| **Relevance** | Meeting the need | Average score (1-5) |

### Efficiency

| Metric | Description | Calculation |
|--------|-------------|-------------|
| **Tokens Input** | Prompt size | Token count |
| **Tokens Output** | Response size | Token count |
| **Latency** | Response time | ms |
| **Cost** | Price per request | Tokens × Price |

### Robustness

| Metric | Description | Calculation |
|--------|-------------|-------------|
| **Edge Cases** | Edge case handling | Passed / Total |
| **Jailbreak Resist** | Bypass resistance | Blocked / Attempts |
| **Error Recovery** | Error recovery | Recovered / Errors |

For full definitions, thresholds, and the UX metrics category, see [metrics.md](references/metrics.md). For the test dataset and report formats, see [templates.md](references/templates.md).

## Commands

```bash
# Create a test
/prompt test create --name "Test v1" --dataset tests.json

# Run an A/B test
/prompt test run --a prompt_a.md --b prompt_b.md --dataset tests.json

# View results
/prompt test results --id test_001

# Compare two tests
/prompt test compare --tests test_001,test_002
```

## Decision Criteria

### When to adopt variant B?

```text
IF:
  - Accuracy B >= Accuracy A
  AND (Tokens B <= Tokens A * 1.1 OR accuracy improvement > 5%)
  AND no regression on edge cases
THEN:
  → Adopt B

ELSE IF:
  - Accuracy improvement > 10%
  AND token regression < 20%
THEN:
  → Consider B (acceptable trade-off)

ELSE:
  → Keep A or iterate
```

## Best Practices

1. **Minimum 20 test cases** for significance
2. **Include edge cases** (15-20% of dataset)
3. **Test multiple runs** for consistency
4. **Document hypotheses** before testing
5. **Version the prompts** being tested
