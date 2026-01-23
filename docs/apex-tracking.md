# APEX Documentation Tracking

Système de tracking automatique des consultations de documentation pour le workflow APEX.

## Problème résolu

Sans tracking, les hooks bloquaient en boucle infinie :
```
Write/Edit → BLOCK "Consulte la doc"
   ↓
Consulte Context7/Exa
   ↓
Retry Write/Edit → BLOCK (encore!) ← Pas de mémoire
```

## Solution

Le système track les consultations dans `.claude/apex/` par projet :

```
projet/
└── .claude/
    └── apex/
        ├── task.json              # État des tâches
        └── docs/                  # Résumés auto-générés
            ├── task-1-react.md
            ├── task-1-tailwind.md
            └── task-2-nextjs.md
```

## Initialisation

```bash
# Auto-init (le système crée la structure au premier tracking)

# Ou init manuelle
bash ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/ai-pilot/scripts/init-apex-tracking.sh

# Avec un task ID spécifique
bash init-apex-tracking.sh "feat-button-component"
```

## Workflow

```
1. Claude veut Write Button.tsx
         ↓
   [PreToolUse] enforce-apex-phases.sh
   ├── Détecte: React code
   ├── Vérifie: .claude/apex/task.json
   └── doc_consulted.react = false → 🚫 BLOCK
         ↓
2. Claude consulte Context7 (react)
         ↓
   [PostToolUse] track-doc-consultation.sh
   ├── Crée: .claude/apex/docs/task-1-react.md
   └── Update: task.json["1"]["react"]["consulted"] = true
         ↓
3. Claude retry Write Button.tsx
         ↓
   [PreToolUse] enforce-apex-phases.sh
   ├── Vérifie: task.json
   └── doc_consulted.react = true → ✅ ALLOW
         ↓
4. Écriture réussie
```

## Structure task.json

```json
{
  "current_task": "1",
  "created_at": "2025-01-23T10:00:00Z",
  "tasks": {
    "1": {
      "status": "in_progress",
      "started_at": "2025-01-23T10:00:00Z",
      "doc_consulted": {
        "react": {
          "consulted": true,
          "file": "docs/task-1-react.md",
          "source": "context7:mcp__context7__query-docs",
          "timestamp": "2025-01-23T10:05:00Z"
        },
        "tailwind": {
          "consulted": true,
          "file": "docs/task-1-tailwind.md",
          "source": "exa:mcp__exa__get_code_context_exa",
          "timestamp": "2025-01-23T10:06:00Z"
        }
      }
    }
  }
}
```

## Docs auto-générées

Chaque consultation crée un fichier résumé :

```markdown
# Task 1 - React Documentation

## Consulted at
2025-01-23T10:05:00Z

## Source
- Tool: mcp__context7__query-docs
- Provider: context7

## Query/Input
libraryId: /vercel/react
query: react hooks patterns

## Key Information Extracted
[Premiers 50 lignes de la réponse]

## Patterns to Apply
- [ ] Follow SOLID principles
- [ ] Keep files < 100 lines
- [ ] Add JSDoc/comments
- [ ] Separate interfaces
```

## Sources trackées

| Source | Détection |
|--------|-----------|
| **Context7** | `mcp__context7__query-docs`, `mcp__context7__resolve-library-id` |
| **Exa** | `mcp__exa__get_code_context_exa`, `mcp__exa__web_search_exa` |
| **Skills** | `Read skills/*.md` |

## Frameworks détectés

| Framework | Patterns détectés |
|-----------|-------------------|
| `react` | `.tsx`, `.jsx`, `useState`, `useEffect`, `className=` |
| `nextjs` | `page.tsx`, `layout.tsx`, `use client`, `NextRequest` |
| `swift` | `.swift`, `@State`, `@Observable`, `SwiftUI` |
| `laravel` | `.php`, `Illuminate`, `Route::`, `Eloquent` |
| `tailwind` | `.css`, `@tailwind`, `@apply`, `@theme` |
| `design` | `className=`, `cn(`, `cva(`, `Button`, `Card` |

## Hooks impliqués

| Hook | Type | Fichier |
|------|------|---------|
| `track-doc-consultation.sh` | PostToolUse | Track Context7/Exa/skills |
| `enforce-apex-phases.sh` | PreToolUse | Vérifie task.json avant Write |
| `init-apex-tracking.sh` | Script | Initialisation manuelle |

## Gitignore

Le script d'init ajoute automatiquement au `.gitignore` :

```
# APEX tracking (auto-generated)
.claude/apex/
```

## Reset

Pour reset le tracking d'une tâche :

```bash
# Supprimer le dossier
rm -rf .claude/apex/

# Ou re-init
bash init-apex-tracking.sh "new-task-id"
```

## Troubleshooting

### Le hook bloque encore après consultation

Vérifier que le framework détecté correspond :

```bash
cat .claude/apex/task.json | jq '.tasks["1"].doc_consulted'
```

### Le tracking ne se fait pas

Vérifier que le hook PostToolUse est bien configuré :

```bash
cat ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/ai-pilot/hooks/hooks.json
```

### Tester manuellement

```bash
echo '{"tool_name":"mcp__context7__query-docs","tool_input":{"libraryId":"/vercel/react","query":"hooks"}}' | \
  bash plugins/ai-pilot/scripts/track-doc-consultation.sh
```
