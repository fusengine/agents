# Prompt Engineer Plugin

Expert en création et optimisation de prompts IA. Maîtrise les meilleures pratiques 2025 : Context Engineering, Meta-Prompting, Chain-of-Thought avancé, et conception d'agents.

## Installation

```bash
/plugin install fuse-prompt-engineer
```

## Agent

### prompt-engineer

Expert en ingénierie de prompts et conception d'agents IA.

- **Modèle** : Opus
- **Couleur** : Purple
- **MCP** : Context7, Exa, Sequential-Thinking

## Skills

| Skill | Description |
|-------|-------------|
| `prompt-creation` | Techniques et templates pour créer des prompts optimaux |
| `prompt-optimization` | Améliorer et optimiser des prompts existants |
| `agent-design` | Concevoir des agents avec patterns recommandés |
| `guardrails` | Sécurité et contrôle qualité |

## Commande

### /prompt

```bash
/prompt [action] [description]
```

**Actions disponibles** :

| Action | Description |
|--------|-------------|
| `create` | Créer un nouveau prompt |
| `optimize` | Améliorer un prompt existant |
| `agent` | Concevoir un agent complet |
| `review` | Analyser un prompt |

## Techniques Maîtrisées

### 1. Structuration des prompts

- **Chain-of-Thought (CoT)** : Zero-shot, Few-shot, Extended Thinking
- **Few-Shot Prompting** : 2-5 exemples optimaux avec diversité
- **XML Tags** : Structure claire pour Claude
- **Structured Outputs** : JSON Schema pour formats garantis

### 2. Context Engineering

- **CLAUDE.md** : Contexte automatique par projet
- **Fresh Eyes Principle** : Isolation contextuelle entre sous-agents
- **Meta-Prompting** : Pattern Conductor-Expert pour orchestration

### 3. Structure en 10 étapes

Chaque prompt système devrait couvrir :

1. **Identity & Purpose** : Qui est l'agent, sa mission
2. **Tone & Style** : Formel/casual, concis/détaillé
3. **Knowledge Domain** : Expertise et limites
4. **Interaction Rules** : TOUJOURS/JAMAIS/SI...ALORS
5. **Response Structure** : Format des réponses
6. **Context Awareness** : Gestion de l'historique
7. **Error Handling** : Gestion des incertitudes
8. **Ethical Boundaries** : Limites éthiques
9. **Examples** : Few-shot si nécessaire
10. **Quality Checklist** : Auto-vérification

### 4. Guardrails

**Input Guardrails** :

- Topical check (hors-sujet)
- Jailbreak detection
- PII redaction

**Output Guardrails** :

- Format validation
- Hallucination detection
- Compliance check

### 5. Patterns d'Agents

| Pattern | Usage |
|---------|-------|
| **Network** | Collaboration créative, brainstorming |
| **Supervisor** | Délégation, workflows parallèles |
| **Hierarchical** | Grandes organisations, multi-équipes |
| **Sequential** | Pipelines linéaires (Analyse → Plan → Code) |
| **Meta-Prompting** | Conductor-Expert, vérification croisée |

## Exemples d'utilisation

### Créer un assistant de support

```bash
/prompt create un assistant de support technique pour app mobile e-commerce
```

### Optimiser un prompt existant

```bash
/prompt optimize

[Coller votre prompt actuel ici]
```

### Concevoir un agent de code review

```bash
/prompt agent un reviewer de code Python avec focus sécurité OWASP
```

### Analyser la qualité d'un prompt

```bash
/prompt review

[Coller le prompt à analyser]
```

## Workflow de l'agent

```text
Phase 1: ANALYZE
└── Identifier type (system, task, few-shot, meta)
└── Identifier contraintes (modèle, format, domaine)

Phase 2: RESEARCH
└── Charger skill approprié
└── Consulter Context7/Exa si nécessaire

Phase 3: DESIGN
└── Appliquer structure 10 étapes
└── Choisir techniques (CoT, Few-shot, XML)

Phase 4: IMPLEMENT
└── Rédiger avec emphase progressive
└── Inclure guardrails

Phase 5: VALIDATE
└── Checklist qualité
└── Test mental cas limites
```

## Références

- [Techniques de prompting](../plugins/prompt-engineer/skills/prompt-creation/docs/techniques.md)
- [Templates réutilisables](../plugins/prompt-engineer/skills/prompt-creation/docs/templates.md)
- [Patterns multi-agents](../plugins/prompt-engineer/skills/agent-design/docs/patterns.md)
- [Workflows recommandés](../plugins/prompt-engineer/skills/agent-design/docs/workflows.md)
