# APEX Agents Plugin

Collection d'agents spécialisés pour le workflow APEX (Analyze → Plan → Execute → eXamine).

## Agents inclus

### Code Quality
- **sniper** - Détection et correction d'erreurs, validation SOLID, linters
- **sniper-faster** - Modifications rapides et silencieuses

### Research
- **research-expert** - Recherche technique (Context7, Exa, Sequential Thinking)
- **websearch** - Recherche web rapide avec sources

### Frameworks
- **nextjs-expert** - Expert Next.js 16+, App Router, Server Components
- **stripe-expert** - Intégration paiements, subscriptions, webhooks

### SEO
- **seo-expert** - SEO/SEA/GEO 2025, anti-cannibalization, AI optimization

### Exploration
- **explore-codebase** - Découverte et analyse d'architecture

## Skills par domaine

Chaque domaine a des skills associés pour guider les agents:

- `code-quality/` - Patterns linting, SOLID, architecture
- `research/` - Méthodologies de recherche
- `frameworks/` - Best practices frameworks
- `seo/` - Guidelines SEO/SEA/GEO
- `exploration/` - Techniques d'exploration

## Usage

Les agents sont invoqués automatiquement ou explicitement:

```
> Use sniper to fix all TypeScript errors
> Use research-expert to find Next.js 16 documentation
> Use explore-codebase to understand the project structure
```

## Workflow APEX

1. **A**nalyze - `explore-codebase` + `research-expert` en parallèle
2. **P**lan - `TodoWrite` pour planification
3. **E**xecute - Agents spécialisés (nextjs-expert, stripe-expert, etc.)
4. **e**Xamine - `sniper` pour validation finale
