/**
 * page.types.ts — Abstractions du navigateur et formes de données renvoyées par la page.
 * Le script dépend de ces contrats, pas du type concret de Playwright (inversion de dépendance).
 */

/** Sous-ensemble de l'API `Page` de Playwright réellement utilisé ici. */
export interface PageLike {
  goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<unknown>;
  setViewportSize(size: { width: number; height: number }): Promise<void>;
  addInitScript(script: { content: string }): Promise<void>;
  evaluate<Result, Arg>(fn: (arg: Arg) => Result, arg: Arg): Promise<Result>;
  waitForTimeout(ms: number): Promise<void>;
}

/** Sous-ensemble de l'API `Browser` de Playwright réellement utilisé ici. */
export interface BrowserLike {
  newPage(options?: { reducedMotion?: string }): Promise<PageLike>;
  close(): Promise<void>;
}

/** Débordement de l'encre du texte hors de sa boîte, les 4 côtés + le compte de lignes. */
export interface InkBox {
  start: number;
  end: number;
  top: number;
  bottom: number;
  lines: number;
}

/** Ligne brute du contrôle `text-overflow`, mesurée dans la page. */
export interface OverflowRow {
  selector: string;
  scrollWidth: number;
  clientWidth: number;
  delta: number;
  /** Encre sortant du côté start (gauche en LTR), en px ; négatif = marge restante. */
  inkStart: number;
  /** Encre sortant du côté end (droite en LTR), en px ; négatif = marge restante. */
  inkEnd: number;
  /** Nombre de lignes occupées par le texte propre de l'élément. */
  lines: number;
  /** Hauteur de texte en trop par rapport à la hauteur allouée, en px. */
  vertOverflow: number;
  clipped: boolean;
  ellipsis: boolean;
  text: string;
}

/** Ligne brute du contrôle `overlap` (une paire d'éléments). */
export interface OverlapRow {
  selectorA: string;
  selectorB: string;
  intersectWidth: number;
  intersectHeight: number;
  intersectArea: number;
  smallerArea: number;
  ratio: number;
  textA: string;
  textB: string;
}

/** Ligne brute du contrôle `cta-wrap`. */
export interface CtaRow {
  selector: string;
  contentHeight: number;
  lineHeight: number;
  limit: number;
  lineBoxes: number;
  label: string;
}

/** Ligne brute du contrôle `contrast` (violation ou fond non résolu). */
export interface ContrastRow {
  selector: string;
  ratio: number;
  required: number;
  foreground: string;
  background: string;
  fontSize: number;
  fontWeight: number;
  largeText: boolean;
  unresolvedImageAt: string | null;
  text: string;
}

/** Résultat brut du contrôle transverse `document-overflow`. */
export interface DocumentOverflowRow {
  scrollWidth: number;
  clientWidth: number;
  delta: number;
  /** Décalage horizontal réellement atteint après un `scrollTo` vers la droite. */
  scrollXReached: number;
  offenders: { selector: string; right: number; width: number }[];
}
