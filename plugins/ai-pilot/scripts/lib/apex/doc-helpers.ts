/**
 * Helpers for online documentation consultation checks.
 * Verifies Context7/Exa usage before allowing Write/Edit.
 */

/** Authorization entry from APEX state (supports legacy session + new sessions[]) */
export type AuthEntry = { source?: string; sources?: string[]; sessions?: string[]; session?: string; doc_sessions?: string[] };

/**
 * Resolve sessions array from auth entry, with legacy fallback.
 * @param auth - Authorization entry (may have sessions[] or legacy session)
 */
export function resolveSessions(auth: AuthEntry | undefined): string[] {
  if (!auth) return [];
  return auth.sessions ?? (auth.session ? [auth.session] : []);
}

/**
 * Check if online documentation was consulted (Context7 AND Exa) in this session.
 * Both sources must be consulted — not just one.
 * @param authorizations - All framework authorizations from APEX state
 * @param sessionId - Current session identifier
 */
export function isDocConsulted(
  authorizations: Record<string, AuthEntry> | undefined,
  sessionId: string,
): boolean {
  if (!authorizations) return false;
  const allSources = Object.values(authorizations)
    .filter((a) => a.doc_sessions?.includes(sessionId))
    .flatMap((a) => a.sources ?? [a.source ?? ""]);
  const hasContext7 = allSources.some((s) => /context7/.test(s));
  const hasExa = allSources.some((s) => /exa/.test(s));
  return hasContext7 && hasExa;
}

/**
 * Format deny message when online doc has not been consulted.
 * @param framework - Detected framework identifier
 */
export function formatDocDeny(framework: string): string {
  return [
    `APEX: Online documentation not consulted for ${framework}!`,
    "Use BOTH: 1) mcp__context7__query-docs AND 2) mcp__exa__web_search_exa.",
    "This check is once per session — after consulting both, Write/Edit will be allowed.",
  ].join("\n");
}
