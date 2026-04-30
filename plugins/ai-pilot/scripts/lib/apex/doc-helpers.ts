/**
 * Helpers for online documentation consultation checks.
 * Verifies Context7/Exa usage before allowing Write/Edit.
 */

/** Authorization entry from APEX state (supports legacy session + new sessions[]) */
export type AuthEntry = {
  source?: string;
  sources?: string[];
  sessions?: string[];
  session?: string;
  doc_sessions?: string[];
  /** Cache MCP file paths read in this session (Read on cached doc satisfies research) */
  read_paths?: string[];
};

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
 * Both sources must be satisfied — either via fresh MCP query (sources) or via Read
 * on a cached MCP result file (read_paths matching /context/mcp/{provider}-*).
 * @param authorizations - All framework authorizations from APEX state
 * @param sessionId - Current session identifier
 */
export function isDocConsulted(
  authorizations: Record<string, AuthEntry> | undefined,
  sessionId: string,
): boolean {
  if (!authorizations) return false;
  const sessionAuths = Object.values(authorizations).filter((a) =>
    a.doc_sessions?.includes(sessionId),
  );
  const allSources = sessionAuths.flatMap((a) => a.sources ?? [a.source ?? ""]);
  const readPaths = sessionAuths.flatMap((a) => a.read_paths ?? []);
  const hasContext7 = allSources.some((s) => /context7/.test(s));
  const hasExa = allSources.some((s) => /exa/.test(s));
  const cacheReadHasContext7 = readPaths.some((p) => /\/context\/mcp\/context7-/.test(p));
  const cacheReadHasExa = readPaths.some((p) =>
    /\/context\/mcp\/(exa-search|exa-code-context)-/.test(p),
  );
  return (hasContext7 || cacheReadHasContext7) && (hasExa || cacheReadHasExa);
}

/** Per-source satisfaction status for a session. */
export type DocSatisfactionStatus = {
  context7: boolean;
  exa: boolean;
  viaCache: boolean;
};

/**
 * Report how each doc source (Context7, Exa) was satisfied for a session.
 * `viaCache` is true when at least one source was satisfied solely by a cache read.
 * @param authorizations - All framework authorizations from APEX state
 * @param sessionId - Current session identifier
 */
export function formatDocSatisfactionStatus(
  authorizations: Record<string, AuthEntry> | undefined,
  sessionId: string,
): DocSatisfactionStatus {
  if (!authorizations) return { context7: false, exa: false, viaCache: false };
  const sessionAuths = Object.values(authorizations).filter((a) =>
    a.doc_sessions?.includes(sessionId),
  );
  const allSources = sessionAuths.flatMap((a) => a.sources ?? [a.source ?? ""]);
  const readPaths = sessionAuths.flatMap((a) => a.read_paths ?? []);
  const liveContext7 = allSources.some((s) => /context7/.test(s));
  const liveExa = allSources.some((s) => /exa/.test(s));
  const cacheContext7 = readPaths.some((p) => /\/context\/mcp\/context7-/.test(p));
  const cacheExa = readPaths.some((p) =>
    /\/context\/mcp\/(exa-search|exa-code-context)-/.test(p),
  );
  const context7 = liveContext7 || cacheContext7;
  const exa = liveExa || cacheExa;
  const viaCache = (!liveContext7 && cacheContext7) || (!liveExa && cacheExa);
  return { context7, exa, viaCache };
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
