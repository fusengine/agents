# A/B Testing Methodology for Prompts

## Fundamental Principles

### 1. Hypothesis Before Test

Always formulate a hypothesis before testing:

```markdown
**Hypothesis**: By adding [modification X] to the prompt,
we will improve [metric Y] by [Z%]
because [justification].
```

### 2. One Variable at a Time

Change only one element between A and B:
- ✅ A vs B (only tone changes)
- ❌ A vs B (tone + structure + examples change)

### 3. Representative Dataset

The dataset must cover:
- Standard cases (70%)
- Edge cases (20%)
- Error cases (10%)

## Complete Process

### Phase 1: Preparation

```text
1. Define the objective
   └── Which metric to improve?
   └── What success threshold?

2. Create the dataset
   └── Minimum 20 cases
   └── Input diversity
   └── Expected outputs documented

3. Establish the baseline
   └── Test current prompt (A)
   └── Document current metrics

4. Design variant (B)
   └── Single modification
   └── Clear hypothesis
```

### Phase 2: Execution

```text
1. Configuration
   └── Same model for A and B
   └── Same temperature (recommended: 0)
   └── Same dataset

2. Execution
   └── Randomize test order
   └── Log all responses
   └── Note errors/timeouts

3. Repetition
   └── Minimum 3 runs per variant
   └── Identify variance
```

### Phase 3: Analysis

```text
1. Calculate metrics
   └── Accuracy, Compliance, Tokens, etc.
   └── Mean and standard deviation per variant

2. Comparison
   └── Absolute and relative delta
   └── Statistical significance

3. Qualitative analysis
   └── Cases where A > B
   └── Cases where B > A
   └── Patterns identified
```

### Phase 4: Decision

```text
1. Evaluate trade-off
   └── Improvement vs regression
   └── Cost vs benefit

2. Recommendation
   └── Adopt B
   └── Keep A
   └── Iterate

3. Documentation
   └── Complete results
   └── Decision justification
   └── Lessons learned
```

## Test Templates

### Test Case Template

```json
{
  "id": "test_001",
  "name": "Case description",
  "type": "standard|edge|error",
  "input": "The input to test",
  "expected": {
    "type": "exact|semantic|structure",
    "value": "Expected output or criteria"
  },
  "tags": ["tag1", "tag2"],
  "weight": 1.0
}
```

### Result Template

```json
{
  "case_id": "test_001",
  "variant": "A|B",
  "run": 1,
  "output": "Model response",
  "metrics": {
    "correct": true,
    "compliant": true,
    "tokens_input": 150,
    "tokens_output": 200,
    "latency_ms": 1200
  },
  "notes": "Observations"
}
```

## Significance Calculation

### Simple Test (N > 30)

```python
# Proportion test
from scipy import stats

successes_a, total_a = 85, 100
successes_b, total_b = 92, 100

# Z-test for proportions
z, p_value = stats.proportions_ztest(
    [successes_a, successes_b],
    [total_a, total_b]
)

significant = p_value < 0.05
```

### Empirical Rule

| Difference | Minimum N | Confidence |
|------------|-----------|------------|
| > 10% | 20 | Likely |
| 5-10% | 50 | Moderate |
| < 5% | 100+ | Low |

## Pitfalls to Avoid

### 1. Confirmation Bias

❌ Seeking to confirm that B is better
✅ Let the data decide

### 2. Over-optimization

❌ Optimizing for test dataset only
✅ Validate on a hold-out dataset

### 3. Ignoring Regressions

❌ "B is better on average, let's ignore the 5 cases where it fails"
✅ Analyze each regression

### 4. Rushing

❌ Deciding after 10 tests
✅ Wait for statistical significance

## Test Checklist

### Before Test

- [ ] Hypothesis formulated
- [ ] Dataset ready (N >= 20)
- [ ] Baseline measured
- [ ] Variant B created (1 change)
- [ ] Metrics defined
- [ ] Success threshold defined

### During Test

- [ ] Same configuration A and B
- [ ] Results logged
- [ ] Errors documented
- [ ] Multiple runs (>= 3)

### After Test

- [ ] Metrics calculated
- [ ] Significance verified
- [ ] Regressions analyzed
- [ ] Decision documented
- [ ] Lessons learned noted
