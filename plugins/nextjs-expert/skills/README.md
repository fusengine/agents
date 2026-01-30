# Next.js Expert Skills

Documentation et conventions pour les skills du plugin nextjs-expert.

## Structure des Skills

### 3 Patterns selon la taille

| Pattern | Taille | Structure |
|---------|--------|-----------|
| **Standalone** | < 150 lignes | Tout dans SKILL.md |
| **Hub Léger** | 150-500 lignes | SKILL.md + references/ |
| **Hub Complet** | > 500 lignes | SKILL.md index + arborescence |

### Structure Standard (Hub Léger)

```
skill-name/
├── SKILL.md                    # Index + Quick Start (< 150 lignes)
└── references/
    ├── patterns.md             # Patterns de code
    ├── examples.md             # Exemples avancés
    └── api.md                  # Référence API (optionnel)
```

### Structure Hub Complet

```
skill-name/
├── SKILL.md                    # Index uniquement
├── getting-started/
├── concepts/
├── api-reference/
└── examples/
```

---

## Skills Disponibles

### Standalone Skills (< 150 lignes)
- `nextjs-stack` - Orchestrateur de stack

### Hub Léger Skills (150-500 lignes)
- `nextjs-shadcn` - Composants UI shadcn/ui
- `nextjs-zustand` - State management
- `nextjs-tanstack-form` - Formulaires avec Server Actions
- `nextjs-i18n` - Internationalisation
- `solid-nextjs` - Architecture SOLID

### Hub Complet Skills (> 500 lignes)
- `better-auth` - Authentification (145 fichiers)
- `nextjs-16` - Documentation Next.js (376 fichiers)
- `prisma-7` - ORM Prisma (415 fichiers)

---

## Convention de Nommage

### Noms de skills
- Minuscules uniquement
- Format `kebab-case`
- Max 64 caractères
- Exemples: `nextjs-shadcn`, `better-auth`, `prisma-7`

### Fichiers
- `SKILL.md` - Fichier principal (MAJUSCULES)
- `references/` - Dossier de références (minuscules)
- Fichiers markdown en `kebab-case.md`

---

## Frontmatter SKILL.md

```yaml
---
name: skill-name
description: Description claire pour auto-invocation
version: 1.0.0
user-invocable: false
references:
  - path: references/patterns.md
    title: Patterns de code
  - path: references/examples.md
    title: Exemples avancés
---
```

### Champs obligatoires
- `name` - Identifiant unique
- `description` - Description pour Claude

### Champs recommandés
- `version` - Versioning sémantique
- `user-invocable` - `false` pour knowledge-only
- `references` - Liste des fichiers de référence

---

## Best Practices

### SKILL.md
1. **< 150 lignes** - Garder concis
2. **Quick Start en premier** - Installation, config de base
3. **Exemples essentiels** - Un exemple complet
4. **Liens vers references/** - Pour les détails

### References
1. **patterns.md** - Patterns de code réutilisables
2. **examples.md** - Exemples avancés et cas d'usage
3. **api.md** - Référence API complète (si nécessaire)

### Documentation volumineuse
1. **Diviser par thème** - Un fichier par concept
2. **Max 500 lignes/fichier** - Respecter SOLID
3. **Index clair** - Navigation facile dans SKILL.md

---

## Workflow de Création

1. Identifier le type de skill (standalone/hub léger/hub complet)
2. Créer la structure de dossiers appropriée
3. Rédiger SKILL.md avec frontmatter complet
4. Extraire patterns vers references/ si > 150 lignes
5. Ajouter les références dans le frontmatter
