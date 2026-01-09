---
description: Memory optimization - removes duplicates, consolidates knowledge, and cleans memory banks for better performance.
---

# Cleanup Context

Exécute le script de nettoyage automatique du contexte Claude Code.

## Script Automatique

Lance le nettoyage complet:

```bash
~/.claude/scripts/cleanup-context.sh
```

## Ce qui est nettoyé (SUPPRESSION DÉFINITIVE):

1. **file-history/** - Fichiers >7 jours supprimés
2. **history.jsonl** - Supprimé et réinitialisé
3. **hook-debug.log** - Supprimé et réinitialisé
4. **security.log** - Supprimé et réinitialisé
5. **session-env/** - Sessions >30 jours supprimées
6. **projects/** - Fichiers >60 jours supprimés
7. **statsig/** - Entièrement vidé
8. **todos/** - Fichiers >30 jours supprimés

⚠️ **Aucune archive** - Suppression définitive

## Rapport de Nettoyage

Le script affiche:
- État AVANT (nombre de fichiers, lignes, taille)
- Actions effectuées
- État APRÈS
- Résumé des suppressions/archives

## Exemple de sortie:

```
🧹 Nettoyage du contexte Claude Code

📊 État AVANT nettoyage:
  File history: 1234 fichiers
  History.jsonl: 5678 lignes
  Sessions: 89 fichiers
  Taille totale: 245MB

🗑️ Nettoyage file-history (>7 jours)...
  ✓ 856 fichiers supprimés

🗑️ Suppression history.jsonl...
  ✓ Supprimé et réinitialisé

✅ Nettoyage terminé!

📈 Résumé:
  File history: 856 fichiers supprimés
  Sessions supprimées: 34
  Logs supprimés: hook-debug.log, security.log, history.jsonl
```

**Example Usage**:
- `/cleanup-context` → Lance le nettoyage complet
