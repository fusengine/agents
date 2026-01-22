# Prompt Engineer Plugin

Expert en création et optimisation de prompts IA. Maîtrise les meilleures pratiques 2025 : Context Engineering, Meta-Prompting, Chain-of-Thought avancé, et conception d'agents.

## Installation

```bash
claude plugins install prompt-engineer
```

## Agent

### prompt-engineer

Expert en ingénierie de prompts et conception d'agents IA.

**Modèle:** Opus
**Couleur:** Purple

**Capacités:**
- Création de prompts optimaux (system, task, few-shot, meta)
- Optimisation de prompts existants
- Conception d'agents complets
- Implémentation de guardrails de sécurité

## Skills

| Skill | Description |
|-------|-------------|
| `prompt-creation` | Techniques et templates pour créer des prompts |
| `prompt-optimization` | Améliorer et optimiser des prompts existants |
| `agent-design` | Concevoir des agents avec patterns recommandés |
| `guardrails` | Sécurité et contrôle qualité |

## Commande

### /prompt

```bash
/prompt [action] [description]
```

**Actions:**
- `create` - Créer un nouveau prompt
- `optimize` - Améliorer un prompt existant
- `agent` - Concevoir un agent complet
- `review` - Analyser un prompt

## Techniques Maîtrisées

### Structuration
- Chain-of-Thought (Zero-shot, Few-shot, Extended Thinking)
- Few-Shot Prompting (2-5 exemples optimaux)
- XML Tags pour structure claire
- Structured Outputs (JSON Schema)

### Context Engineering
- CLAUDE.md pour contexte automatique
- Fresh Eyes Principle (isolation contextuelle)
- Meta-Prompting (Conductor-Expert pattern)

### Guardrails
- Input Guardrails (topical, jailbreak, PII)
- Output Guardrails (format, hallucination, compliance)
- Ethical Boundaries

## Structure du Plugin

```text
prompt-engineer/
├── .mcp.json                    # Config MCP servers
├── README.md
├── agents/
│   └── prompt-engineer.md       # Agent principal
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

## Exemples d'utilisation

### Créer un assistant de support

```bash
/prompt create un assistant de support technique pour une app mobile de e-commerce
```

### Optimiser un prompt existant

```bash
/prompt optimize

[Coller votre prompt actuel]
```

### Concevoir un agent de code review

```bash
/prompt agent un revieweur de code spécialisé Python avec focus sur la sécurité
```

## Documentation

- [Techniques de prompting](skills/prompt-creation/docs/techniques.md)
- [Templates réutilisables](skills/prompt-creation/docs/templates.md)
- [Patterns multi-agents](skills/agent-design/docs/patterns.md)
- [Workflows recommandés](skills/agent-design/docs/workflows.md)

## Licence

MIT
