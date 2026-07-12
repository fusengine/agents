/** How a policy outcome should surface in a harness. */
export type PromptKind = "ask" | "block" | "inform";

/**
 * Portable, harness-agnostic representation of a policy outcome as a prompt.
 *
 * Adapters render this into their harness's native shape (a Claude
 * `permissionDecision`, a Cursor block, a CLI exit + message, ...).
 */
export interface Prompt {
  kind: PromptKind;
  /** Short title, e.g. "SOLID file-size limit". */
  title: string;
  /** Why this fired. */
  reason: string;
  /** Concrete next actions to proceed. */
  actions?: string[];
}
