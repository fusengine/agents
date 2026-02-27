/**
 * Helpers for online documentation consultation checks.
 * Verifies Context7/Exa usage before allowing Write/Edit.
 */

/**
 * Check if online documentation was consulted (Context7 or Exa) in this session.
 * @param auth - Authorization entry from APEX state
 * @param sessionId - Current session identifier
 */
export function isDocConsulted(
  auth: { source?: string; session?: string } | undefined,
  sessionId: string,
): boolean {
  if (!auth?.source || auth.session !== sessionId) return false;
  return /context7|exa/.test(auth.source);
}

/**
 * Format deny message when online doc has not been consulted.
 * @param framework - Detected framework identifier
 */
export function formatDocDeny(framework: string): string {
  return [
    `APEX: Online documentation not consulted for ${framework}!`,
    "Consult doc first via Context7 (mcp__context7__query-docs) or Exa (mcp__exa__web_search_exa).",
    "This check is once per session — after consulting, Write/Edit will be allowed.",
  ].join("\n");
}
