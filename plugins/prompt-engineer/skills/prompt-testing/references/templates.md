# Test Format Templates

## Test Dataset

```json
{
  "name": "Test Dataset v1",
  "description": "Dataset for testing prompt XYZ",
  "cases": [
    {
      "id": "case_001",
      "type": "standard",
      "input": "Test input",
      "expected": "Expected output",
      "tags": ["basic", "format"]
    },
    {
      "id": "case_002",
      "type": "edge_case",
      "input": "Edge input",
      "expected": "Expected behavior",
      "tags": ["edge", "error"]
    }
  ]
}
```

## Test Report

```markdown
# A/B Test Report: {{TEST_NAME}}

## Configuration

| Parameter | Value |
|-----------|-------|
| Date | {{DATE}} |
| Dataset | {{DATASET}} |
| Cases tested | {{N_CASES}} |
| Model | {{MODEL}} |

## Tested Variants

### Variant A (Baseline)
[Description or link to prompt A]

### Variant B (Challenger)
[Description or link to prompt B]

## Results

### Overall Scores

| Metric | A | B | Delta | Winner |
|--------|---|---|-------|--------|
| Accuracy | X% | Y% | +/-Z% | A/B |
| Compliance | X% | Y% | +/-Z% | A/B |
| Tokens | X | Y | +/-Z | A/B |
| Latency | Xms | Yms | +/-Zms | A/B |

### Detail by Case Type

| Type | A | B | Notes |
|------|---|---|-------|
| Standard | X% | Y% | |
| Edge cases | X% | Y% | |
| Error cases | X% | Y% | |

### Problematic Cases

| Case ID | Expected | A | B | Analysis |
|---------|----------|---|---|----------|
| case_XXX | ... | ❌ | ✅ | [Explanation] |

## Analysis

### B's Strengths
- [Improvement 1]
- [Improvement 2]

### B's Weaknesses
- [Regression 1]

### Observations
[Qualitative insights]

## Recommendation

**Verdict**: ✅ Adopt B / ⚠️ Iterate / ❌ Keep A

**Confidence**: High / Medium / Low

**Justification**:
[Explanation of recommendation]

## Next Steps
1. [Action 1]
2. [Action 2]
```
