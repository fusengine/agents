/**
 * Helpers for online documentation consultation checks.
 * Verifies Context7/Exa usage before allowing Write/Edit.
 */

/** Authorization entry from APEX state (supports legacy session + new sessions[]) */
export type AuthEntry = { source?: string; sessions?: string[]; session?: string; doc_sessions?: string[] };

/**
 * Resolve sessions array from auth entry, with legacy fallback.
 * @param auth - Authorization entry (may have sessions[] or legacy session)
 */
export function resolveSessions(auth: AuthEntry | undefined): string[] {
  if (!auth) return [];
  return auth.sessions ?? (auth.session ? [auth.session] : []);
}

/**
 * Check if online documentation was consulted (Context7 or Exa) in this session.
 * Checks ALL frameworks — the goal is "did you consult any online doc?", not framework-specific.
 * @param authorizations - All framework authorizations from APEX state
 * @param sessionId - Current session identifier
 */
export function isDocConsulted(
  authorizations: Record<string, AuthEntry> | undefined,
  sessionId: string,
): boolean {
  if (!authorizations) return false;
  return Object.values(authorizations).some(
    (auth) => auth.doc_sessions?.includes(sessionId) && /context7|exa/.test(auth.source ?? ""),
  );
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
