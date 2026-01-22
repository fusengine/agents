# Multi-Agent Architecture Patterns

## Pattern 1: Network

```
        ┌─────────┐
        │ Agent A │
        └────┬────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐
│Agent B│◄►│Agent C│◄►│Agent D│
└───────┘ └───────┘ └───────┘
```

**Characteristics:**
- Bidirectional communication
- Horizontal collaboration
- No strict hierarchy

**Use cases:**
- Collaborative brainstorming
- Design thinking
- Complex problem solving

**Implementation:**
```python
# Pseudo-code
agents = [AgentA(), AgentB(), AgentC()]
shared_context = {}

while not solved:
    for agent in agents:
        contribution = agent.think(shared_context)
        shared_context.update(contribution)
        broadcast(agents, contribution)
```

## Pattern 2: Supervisor

```
              ┌────────────┐
              │ Supervisor │
              └─────┬──────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   ┌────────┐  ┌────────┐  ┌────────┐
   │Worker 1│  │Worker 2│  │Worker 3│
   └────────┘  └────────┘  └────────┘
```

**Characteristics:**
- One supervisor agent coordinates
- Workers execute specific tasks
- Vertical communication

**Use cases:**
- Task delegation
- Workflows with parallel steps
- Quality assurance (supervisor = reviewer)

**Implementation:**
```python
# Pseudo-code
supervisor = SupervisorAgent()
workers = {
    "research": ResearchWorker(),
    "code": CodeWorker(),
    "test": TestWorker()
}

task = supervisor.analyze(user_request)
assignments = supervisor.delegate(task)

results = {}
for worker_type, subtask in assignments:
    results[worker_type] = workers[worker_type].execute(subtask)

final = supervisor.synthesize(results)
```

## Pattern 3: Hierarchical

```
                ┌──────────────┐
                │   Director   │
                └──────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │Manager A│    │Manager B│    │Manager C│
   └────┬────┘    └────┬────┘    └────┬────┘
        │              │              │
   ┌────┴────┐    ┌────┴────┐    ┌────┴────┐
   ▼         ▼    ▼         ▼    ▼         ▼
┌─────┐  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│W1   │  │W2   │ │W3   │ │W4   │ │W5   │ │W6   │
└─────┘  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
```

**Characteristics:**
- Multi-level supervision
- Domain specialization
- Natural problem escalation

**Use cases:**
- Large organizations
- Multi-team projects
- Enterprise systems

**Implementation:**
```python
# Pseudo-code
org = {
    "director": DirectorAgent(),
    "managers": {
        "frontend": ManagerAgent("frontend"),
        "backend": ManagerAgent("backend"),
        "qa": ManagerAgent("qa")
    },
    "workers": {
        "frontend": [ReactDev(), CssDev()],
        "backend": [ApiDev(), DbDev()],
        "qa": [Tester(), SecurityAuditor()]
    }
}

# Director decomposes
plan = org["director"].plan(user_request)

# Managers delegate
for domain, tasks in plan.items():
    manager = org["managers"][domain]
    assignments = manager.assign(tasks)

    for worker, task in assignments:
        worker.execute(task)
```

## Pattern 4: Sequential (Pipeline)

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Agent 1 │──►│ Agent 2 │──►│ Agent 3 │──►│ Agent 4 │
│(Analyze)│   │ (Plan)  │   │(Execute)│   │(Review) │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
```

**Characteristics:**
- Linear flow
- Output of one = input of next
- Clearly defined steps

**Use cases:**
- Data pipelines
- Publishing processes
- Conceptual CI/CD

**Implementation:**
```python
# Pseudo-code
pipeline = [
    AnalyzerAgent(),
    PlannerAgent(),
    ExecutorAgent(),
    ReviewerAgent()
]

result = user_request
for agent in pipeline:
    result = agent.process(result)
    if not result.valid:
        break

return result
```

## Pattern 5: Meta-Prompting (Conductor-Expert)

```
              ┌───────────────┐
              │   Conductor   │
              │ (Orchestrator)│
              └───────┬───────┘
                      │ Decomposes
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │Expert 1 │  │Expert 2 │  │Expert 3 │
    │(Isolated│  │(Isolated│  │(Isolated│
    │ context)│  │ context)│  │ context)│
    └────┬────┘  └────┬────┘  └────┬────┘
         │            │            │
         └────────────┼────────────┘
                      ▼
              ┌───────────────┐
              │   Conductor   │
              │ (Synthesizes) │
              └───────────────┘
```

**Characteristics:**
- Conductor maintains global context
- Experts have "fresh" (isolated) contexts
- Verification loops possible

**Use cases:**
- Complex multi-domain tasks
- Need for multiple perspectives
- Cross-verification

**Implementation:**
```python
# Pseudo-code
conductor = ConductorAgent()

# Phase 1: Decomposition
subtasks = conductor.decompose(user_request)

# Phase 2: Delegation with isolated context
expert_results = {}
for subtask in subtasks:
    expert = conductor.select_expert(subtask)
    # Minimal context, not complete history
    context = conductor.extract_relevant_context(subtask)
    expert_results[subtask.id] = expert.execute(context)

# Phase 3: Synthesis and verification
final = conductor.synthesize(expert_results)
if not conductor.validate(final):
    final = conductor.refine(final, expert_results)

return final
```

## Pattern Comparison

| Pattern | Complexity | Reliability | Flexibility | Latency |
|---------|------------|-------------|-------------|---------|
| Network | High | Medium | Very High | High |
| Supervisor | Medium | High | High | Medium |
| Hierarchical | Very High | Very High | Medium | High |
| Sequential | Low | High | Low | Low |
| Meta-Prompting | Medium | Very High | High | Medium |

## Choosing a Pattern

```
Simple, linear task?
    └─► Sequential

Need parallel specialists?
    └─► Supervisor

Complex organization, multi-team?
    └─► Hierarchical

Creative collaboration?
    └─► Network

Critical cross-verification?
    └─► Meta-Prompting
```
