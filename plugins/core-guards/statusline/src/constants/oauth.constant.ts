/**
 * OAuth Constants - Configuration API OAuth Claude Code
 *
 * @description Constantes pour l'accès à l'API OAuth
 */

/** URL de l'API OAuth pour les limites d'usage */
export const OAUTH_API_URL = "https://api.anthropic.com/api/oauth/usage";

/** Nom du service dans le Keychain macOS */
export const KEYCHAIN_SERVICE = "Claude Code-credentials";

/** Detect Claude Code version dynamically */
function getClaudeVersion(): string {
	try {
		const proc = Bun.spawnSync(["claude", "--version"]);
		const raw = proc.stdout.toString().trim();
		const match = raw.match(/^(\d+\.\d+\.\d+)/);
		return match ? match[1] : "2.1.69";
	} catch {
		return "2.1.69";
	}
}

/** Headers requis pour l'API OAuth */
export const OAUTH_HEADERS = {
	"anthropic-beta": "oauth-2025-04-20",
	Accept: "application/json",
	"User-Agent": `claude-code/${getClaudeVersion()}`,
} as const;

/** TTL du cache succes en millisecondes (2 minutes) */
export const CACHE_TTL_MS = 120_000;

/** TTL du cache erreur en millisecondes (2 minutes) */
export const ERROR_CACHE_TTL_MS = 120_000;
