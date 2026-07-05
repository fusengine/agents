---
name: flow-diagram
description: ASCII flow diagram of the full APEX workflow, start to finish
---

# Flow Diagram

```text
                    START
                      │
                      ▼
              ┌───────────────┐
              │ 00-init-branch│
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 00.5-brain-   │ ← brainstorming skill (NEW)
              │ storm         │   questions → design → approval
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 01-analyze    │ ← explore + research
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 02-plan       │ ← TaskCreate
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 03-execute    │ ← TDD: test first (RED→GREEN)
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 03.5-elicit   │ ← expert self-review
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 03.7-verify   │ ← verification skill (NEW)
              └───────┬───────┘   functional resolution check
                      │
                      ▼
              ┌───────────────┐
              │ 04-validate   │ ← sniper (code quality)
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 05-review     │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 09-create-pr  │
              └───────┬───────┘
                      │
                      ▼
                    DONE
```
