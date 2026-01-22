# Prompt Engineer Plugin

Expert in AI prompt creation and optimization. Masters 2025 best practices: Context Engineering, Meta-Prompting, advanced Chain-of-Thought, and agent design.

## Installation

```bash
claude plugins install prompt-engineer
```

## Agent

### prompt-engineer

Expert in prompt engineering and AI agent design.

**Model:** Opus
**Color:** Purple

**Capabilities:**
- Optimal prompt creation (system, task, few-shot, meta)
- Existing prompt optimization
- Complete agent design
- Security guardrails implementation

## Skills

| Skill | Description |
|-------|-------------|
| `prompt-creation` | Techniques and templates for prompt creation |
| `prompt-optimization` | Improve and optimize existing prompts |
| `agent-design` | Design agents with recommended patterns |
| `guardrails` | Security and quality control |

## Command

### /prompt

```bash
/prompt [action] [description]
```

**Actions:**
- `create` - Create a new prompt
- `optimize` - Improve an existing prompt
- `agent` - Design a complete agent
- `review` - Analyze a prompt

## Mastered Techniques

### Structuring
- Chain-of-Thought (Zero-shot, Few-shot, Extended Thinking)
- Few-Shot Prompting (2-5 optimal examples)
- XML Tags for clear structure
- Structured Outputs (JSON Schema)

### Context Engineering
- CLAUDE.md for automatic context
- Fresh Eyes Principle (contextual isolation)
- Meta-Prompting (Conductor-Expert pattern)

### Guardrails
- Input Guardrails (topical, jailbreak, PII)
- Output Guardrails (format, hallucination, compliance)
- Ethical Boundaries

## Plugin Structure

```text
prompt-engineer/
├── .mcp.json                    # MCP servers config
├── README.md
├── agents/
│   └── prompt-engineer.md       # Main agent
├── skills/
│   ├── prompt-creation/
│   │   ├── SKILL.md
│   │   └── docs/
│   │       ├── techniques.md
│   │       └── templates.md
│   ├── prompt-optimization/
│   │   └── SKILL.md
│   ├── agent-design/
│   │   ├── SKILL.md
│   │   └── docs/
│   │       ├── patterns.md
│   │       └── workflows.md
│   └── guardrails/
│       └── SKILL.md
└── commands/
    └── prompt.md
```

## Usage Examples

### Create a support assistant

```bash
/prompt create a technical support assistant for an e-commerce mobile app
```

### Optimize an existing prompt

```bash
/prompt optimize

[Paste your current prompt]
```

### Design a code review agent

```bash
/prompt agent a Python-specialized code reviewer focused on security
```

## Documentation

- [Prompting techniques](skills/prompt-creation/docs/techniques.md)
- [Reusable templates](skills/prompt-creation/docs/templates.md)
- [Multi-agent patterns](skills/agent-design/docs/patterns.md)
- [Recommended workflows](skills/agent-design/docs/workflows.md)

## License

MIT
