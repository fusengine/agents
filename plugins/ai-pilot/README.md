# APEX Agents Plugin

Collection d'agents spécialisés pour le workflow APEX (Analyze → Plan → Execute → eXamine).

## Skill APEX (Auto-détection)

Le skill `/apex` détecte automatiquement le type de projet et charge les références spécifiques:

| Config détectée | Framework | Références chargées |
|-----------------|-----------|---------------------|
| `composer.json` + `artisan` | Laravel | `references/laravel/*.md` |
| `next.config.*` | Next.js | `references/nextjs/*.md` |
| `package.json` (react) | React | `references/react/*.md` |
| `Package.swift`, `*.xcodeproj` | Swift | `references/swift/*.md` |

### Phases APEX (00-09)

1. `00-init-branch` - Création branche, vérification état git
2. `01-analyze` - Exploration codebase, patterns existants
3. `02-features-plan` - TodoWrite, estimation fichiers <100 lignes
4. `03-execution` - Implémentation SOLID, interfaces séparées
5. `04-validation` - Linters, type-check, build
6. `05-review` - Self-review, checklist qualité
7. `06-fix-issue` - Correction des problèmes trouvés
8. `07-add-test` - Tests unitaires et d'intégration
9. `08-check-test` - Exécution et couverture
10. `09-create-pr` - Pull request avec description

## Agents inclus

### Code Quality
- **sniper** - Détection et correction d'erreurs, validation SOLID, linters
- **sniper-faster** - Modifications rapides et silencieuses

### Research
- **research-expert** - Recherche technique (Context7, Exa, Sequential Thinking)
- **websearch** - Recherche web rapide avec sources

### SEO
- **seo-expert** - SEO/SEA/GEO 2026, Local SEO, anti-cannibalization, AI optimization

### Exploration
- **explore-codebase** - Découverte et analyse d'architecture

## Skills par domaine

- `apex/` - Méthodologie APEX avec références par framework
- `code-quality/` - Patterns linting, SOLID, architecture
- `research/` - Méthodologies de recherche
- `seo/` - Guidelines SEO/SEA/GEO/Local SEO
- `exploration/` - Techniques d'exploration

## Usage

```bash
# Skill APEX (recommandé pour toute tâche de développement)
/apex

# Agents individuels
> Use sniper to fix all TypeScript errors
> Use research-expert to find Next.js 16 documentation
> Use explore-codebase to understand the project structure
```

## Workflow APEX

1. **A**nalyze - `explore-codebase` + `research-expert` en parallèle
2. **P**lan - `TodoWrite` pour planification, fichiers <100 lignes
3. **E**xecute - Agents spécialisés, SOLID, interfaces séparées
4. **e**Xamine - `sniper` pour validation finale (OBLIGATOIRE)
