/**
 * types.ts — Contrat de sortie du contrôle de mise en page déterministe.
 * Aucune logique ici : uniquement les interfaces partagées (règle SOLID du dépôt).
 */

/** Familles de contrôles. Une famille = un module dans `checks/`. */
export type ViolationType =
  | "text-overflow"
  | "overlap"
  | "cta-wrap"
  | "contrast"
  | "document-overflow";

/** Une violation mesurée, à une largeur de viewport donnée. */
export interface Violation {
  /** Famille du contrôle qui a produit la violation. */
  type: ViolationType;
  /** Sélecteur CSS de l'élément fautif (paire jointe par " ⟷ " pour `overlap`). */
  selector: string;
  /** Largeur de viewport (px) à laquelle la mesure a été prise. */
  viewport: number;
  /** Valeurs brutes mesurées dans la page (nombres uniquement, pas d'appréciation). */
  measured: Record<string, number | string | boolean>;
  /** Écart au seuil, en px (ou en points de ratio pour le contraste). */
  delta: number;
  /** Résumé factuel d'une ligne, sans jugement. */
  message: string;
}

/** Information non bloquante : mesure impossible, limite atteinte. */
export interface Warning {
  type: ViolationType | "probe";
  selector: string;
  viewport: number;
  reason: string;
}

/** Seuils numériques. Tout est réglable ; les défauts vivent dans `config.ts`. */
export interface Thresholds {
  /** Tolérance px sur scrollWidth − clientWidth. */
  overflowTolerance: number;
  /** Tolérance px sur le débordement de l'encre du texte hors de sa boîte. */
  inkTolerance: number;
  /** Tolérance px sur documentElement.scrollWidth − viewport. */
  documentOverflowTolerance: number;
  /** Largeur/hauteur minimale (px) d'une intersection pour être retenue. */
  overlapMinPx: number;
  /** Part minimale de l'aire du plus petit élément couverte par l'intersection. */
  overlapMinRatio: number;
  /** Multiplicateur de line-height au-delà duquel un libellé est sur 2 lignes. */
  ctaLineFactor: number;
  /** Ratio WCAG minimal pour le texte courant. */
  contrastNormal: number;
  /** Ratio WCAG minimal pour le grand texte (>= 24px, ou >= 18.66px en gras). */
  contrastLarge: number;
}

/** Configuration complète d'une exécution. */
export interface LayoutCheckConfig {
  /** Largeurs de viewport testées, en px. */
  widths: number[];
  /** Hauteur de viewport, en px. */
  height: number;
  /** Sélecteurs exclus de TOUS les contrôles. */
  exclude: string[];
  /** Sélecteurs considérés comme CTA pour le contrôle `cta-wrap`. */
  ctaSelector: string;
  /** Traiter les éléments positionnés/z-indexés comme des superpositions volontaires. */
  ignoreIntentionalOverlap: boolean;
  /** Nombre max d'éléments comparés deux à deux par le contrôle `overlap`. */
  overlapMaxElements: number;
  /** Émuler `prefers-reduced-motion: reduce` (neutralise les révélations au scroll). */
  reducedMotion: boolean;
  /** Parcourir la page de haut en bas avant de mesurer (déclenche les révélations JS). */
  warmup: boolean;
  /** Familles de contrôles activées. */
  checks: ViolationType[];
  /** Seuils numériques. */
  thresholds: Thresholds;
}

/** Rapport final sérialisé en JSON sur stdout. */
export interface LayoutCheckReport {
  target: string;
  generatedAt: string;
  config: LayoutCheckConfig;
  summary: {
    total: number;
    byType: Record<string, number>;
    byWidth: Record<string, number>;
    /** Violations de contraste regroupées par couple de couleurs résolues. */
    contrastPairs: Record<string, number>;
    warnings: number;
    pass: boolean;
  };
  violations: Violation[];
  warnings: Warning[];
}
