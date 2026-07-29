---
name: prompt-optimization
description: "Use when auditing an existing prompt for clarity, structure, or completeness issues, fixing vague instructions, or producing a before/after optimization report."
allowed-tools: Read, Write, Edit
---

<objective>
Prompt Optimization analyzes and improves an existing prompt through a 5-step workflow: analyze the current prompt, identify issues, apply corrections, validate the improvement, and document the changes. Its checklist covers four dimensions -- clarity (unambiguous instructions, precise vocabulary), structure (well-delimited sections, logical order), completeness (output format, error cases, examples), and guardrails (explicit limits, forbidden behaviors, security).

It never changes the prompt's original meaning, adds unrequested features, removes existing guardrails, or lengthens the prompt without justification. See `common-problems.md` for before/after fix patterns and `improvement-techniques.md` for strengthening via CoT, few-shot, or guardrails.
</objective>

# Prompt Optimization

Skill for analyzing and improving existing prompts.

## References

- [common-problems.md](references/common-problems.md) - Load when: diagnosing a vague or ambiguous prompt — 5 before/after examples (vague instructions, missing context, undefined format, no error handling, weak emphasis)
- [improvement-techniques.md](references/improvement-techniques.md) - Load when: strengthening a prompt with Chain-of-Thought, few-shot examples, or reinforced guardrails
- [scorecard-template.md](references/scorecard-template.md) - Load when: writing the before/after optimization report to hand off

## Optimization Workflow

```
1. ANALYZE current prompt
   ↓
2. IDENTIFY issues
   ↓
3. APPLY corrections
   ↓
4. VALIDATE improvement
   ↓
5. DOCUMENT changes
```

## Analysis Checklist

### Clarity
- [ ] Unambiguous instructions?
- [ ] Clearly defined objective?
- [ ] Precise vocabulary?

### Structure
- [ ] Well-delimited sections?
- [ ] Logical order?
- [ ] Clear hierarchy?

### Completeness
- [ ] Output format defined?
- [ ] Error cases handled?
- [ ] Examples if needed?

### Guardrails
- [ ] Explicit limits?
- [ ] Forbidden behaviors listed?
- [ ] Appropriate security?

For common problem patterns with before/after fixes, see [common-problems.md](references/common-problems.md). For techniques to strengthen a prompt (CoT, examples, guardrails), see [improvement-techniques.md](references/improvement-techniques.md).

## Forbidden

- Never change the original meaning of the prompt
- Never add unrequested features
- Never remove existing guardrails
- Never make the prompt longer without justification
