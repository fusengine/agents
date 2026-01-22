# Prompt Performance Metrics

## Overview

Metrics are organized in 4 categories:

```text
┌─────────────────────────────────────────────────────┐
│                    METRICS                           │
├─────────────┬─────────────┬─────────────┬───────────┤
│   Quality   │ Efficiency  │ Robustness  │    UX     │
├─────────────┼─────────────┼─────────────┼───────────┤
│ Accuracy    │ Tokens      │ Edge cases  │ Clarity   │
│ Compliance  │ Latency     │ Jailbreak   │ Utility   │
│ Consistency │ Cost        │ Recovery    │ Satisfaction│
│ Relevance   │ Throughput  │ Degradation │ Confidence│
└─────────────┴─────────────┴─────────────┴───────────┘
```

## Quality Metrics

### 1. Accuracy

**Definition**: Proportion of correct responses.

**Calculation**:
```
Accuracy = Correct responses / Total responses × 100
```

**Evaluation**:
- For factual responses: Exact or semantic comparison
- For generation: Human evaluation or LLM-as-judge
- For classification: Confusion matrix

**Thresholds**:
| Score | Evaluation |
|-------|------------|
| > 95% | Excellent |
| 85-95% | Good |
| 70-85% | Acceptable |
| < 70% | Insufficient |

### 2. Compliance (Format)

**Definition**: Adherence to requested output format.

**Calculation**:
```
Compliance = Compliant responses / Total responses × 100
```

**Criteria**:
- Valid JSON/Markdown structure
- Required fields present
- Correct data types
- Length within limits

### 3. Consistency

**Definition**: Stability of responses for identical inputs.

**Calculation**:
```
Consistency = 1 - (Response standard deviation / Mean)
```

**Protocol**:
1. Execute the same prompt 5-10 times
2. Measure response variance
3. Lower variance = higher consistency

### 4. Relevance

**Definition**: Degree of correspondence with the need.

**Calculation**: Average score (1-5) on:
- Answers the question asked
- Useful and complete information
- No off-topic content
- Appropriate level of detail

## Efficiency Metrics

### 1. Tokens

**Metrics**:
```
Tokens Input   = Prompt tokens
Tokens Output  = Response tokens
Tokens Total   = Input + Output
Ratio I/O      = Input / Output
```

**Objective**: Minimize tokens for the same result.

### 2. Latency

**Definition**: Model response time.

**Calculation**:
```
Latency = Response end time - Request send time
TTFB    = Time to First Byte (streaming)
```

**Thresholds** (depends on use case):
| Use case | Acceptable latency |
|----------|-------------------|
| Chat | < 2s |
| Batch | < 30s |
| Async | < 5min |

### 3. Cost

**Calculation**:
```
Cost = (Tokens Input × Input Price) + (Tokens Output × Output Price)
```

**Indicative prices (2025)**:

| Model | Input/1M | Output/1M |
|-------|----------|-----------|
| Claude Sonnet | $3 | $15 |
| Claude Opus | $15 | $75 |
| GPT-4o | $5 | $15 |

### 4. Throughput

**Definition**: Number of requests processable per time unit.

**Calculation**:
```
Throughput = Successful requests / Total time
```

## Robustness Metrics

### 1. Edge Cases

**Definition**: Handling of edge cases.

**Types of cases**:
- Empty or very long input
- Special characters
- Multiple languages
- Malformed data
- Ambiguous requests

**Calculation**:
```
Edge Score = Successful edge cases / Total edge cases × 100
```

### 2. Jailbreak Resistance

**Definition**: Resistance to bypass attempts.

**Types of tests**:
- Prompt injection
- Roleplay bypass
- Gradual requests
- Emotional manipulation

**Calculation**:
```
Resistance = Blocked attempts / Total attempts × 100
```

### 3. Error Recovery

**Definition**: Ability to handle and recover from errors.

**Criteria**:
- Error detection
- Clear error message
- Alternative proposal
- No crash/hallucination

### 4. Graceful Degradation

**Definition**: Behavior under non-optimal conditions.

**Scenarios**:
- Truncated context
- Partial information
- Partial timeout

## UX Metrics

### 1. Clarity

**Evaluation** (1-5):
- Accessible language
- Logical structure
- No unnecessary jargon

### 2. Utility

**Evaluation** (1-5):
- Actionable
- Complete
- Correct

### 3. Satisfaction

**Measurement**:
- NPS (Net Promoter Score)
- CSAT (Customer Satisfaction)
- Explicit feedback

### 4. Confidence

**Evaluation**:
- Perceived consistency
- Sources cited
- Uncertainty expressed

## Recommended Dashboard

```markdown
## Prompt Performance Dashboard

### Main Metrics
| Metric | Value | Trend | Target |
|--------|-------|-------|--------|
| Accuracy | 92% | ↑ +2% | 95% |
| Compliance | 98% | → | 95% |
| Latency P50 | 1.2s | ↓ -0.3s | <2s |
| Cost/req | $0.02 | → | <$0.05 |

### Alerts
🔴 Edge cases < 80%
🟡 Consistency declining over 7 days

### Actions
- [ ] Improve edge case handling
- [ ] Investigate consistency variance
```
