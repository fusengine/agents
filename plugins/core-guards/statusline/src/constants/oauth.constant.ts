/**
 * OAuth Constants - Configuration API OAuth Claude Code
 *
 * @description Constantes pour l'accès à l'API OAuth
 */

/** URL de l'API OAuth pour les limites d'usage */
export const OAUTH_API_URL = "https://api.anthropic.com/api/oauth/usage";

/** Nom du service dans le Keychain macOS */
export const KEYCHAIN_SERVICE = "Claude Code-credentials";

/** Headers requis pour l'API OAuth */
export const OAUTH_HEADERS = {
	"anthropic-beta": "oauth-2025-04-20",
	Accept: "application/json",
	"User-Agent": "claude-code/2.1.19",
} as const;

/** TTL du cache en millisecondes (30 secondes) */
export const CACHE_TTL_MS = 30_000;

/** Nombre maximum de retries en cas d'erreur */
export const MAX_RETRIES = 2;

/** Délai entre les retries en millisecondes */
export const RETRY_DELAY_MS = 1_000;
