/**
 * page.types.ts — Browser abstractions and the data shapes returned by the page.
 * The script depends on these contracts, not on Playwright's concrete type (dependency inversion).
 */

/** Subset of Playwright's `Page` API actually used here. */
export interface PageLike {
  goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<unknown>;
  setViewportSize(size: { width: number; height: number }): Promise<void>;
  addInitScript(script: { content: string }): Promise<void>;
  evaluate<Result, Arg>(fn: (arg: Arg) => Result, arg: Arg): Promise<Result>;
  waitForTimeout(ms: number): Promise<void>;
}

/** Subset of Playwright's `Browser` API actually used here. */
export interface BrowserLike {
  newPage(options?: { reducedMotion?: string }): Promise<PageLike>;
  close(): Promise<void>;
}

/** Text ink overflowing its box, on all 4 sides + the line count. */
export interface InkBox {
  start: number;
  end: number;
  top: number;
  bottom: number;
  lines: number;
}

/** Raw row of the `text-overflow` check, measured in the page. */
export interface OverflowRow {
  selector: string;
  scrollWidth: number;
  clientWidth: number;
  delta: number;
  /** Ink overflowing on the start side (left in LTR), in px; negative = remaining margin. */
  inkStart: number;
  /** Ink overflowing on the end side (right in LTR), in px; negative = remaining margin. */
  inkEnd: number;
  /** Number of lines taken by the element's own text. */
  lines: number;
  /** Text height in excess of the allotted height, in px. */
  vertOverflow: number;
  clipped: boolean;
  ellipsis: boolean;
  text: string;
}

/** Raw row of the `overlap` check (one pair of elements). */
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

/** Raw row of the `cta-wrap` check. */
export interface CtaRow {
  selector: string;
  contentHeight: number;
  lineHeight: number;
  limit: number;
  lineBoxes: number;
  label: string;
}

/** Raw row of the `contrast` check (violation or unresolved background). */
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

/** Raw result of the cross-cutting `document-overflow` check. */
export interface DocumentOverflowRow {
  scrollWidth: number;
  clientWidth: number;
  delta: number;
  /** Horizontal offset actually reached after a `scrollTo` to the right. */
  scrollXReached: number;
  offenders: { selector: string; right: number; width: number }[];
}
