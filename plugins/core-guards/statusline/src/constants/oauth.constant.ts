/**
 * OAuth Constants - Claude Code OAuth API configuration
 *
 * @description Constants for accessing the OAuth API
 */

/** OAuth API URL for usage limits */
export const OAUTH_API_URL = "https://api.anthropic.com/api/oauth/usage";

/** Service name in the macOS Keychain */
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

/** Headers required by the OAuth API */
export const OAUTH_HEADERS = {
	"anthropic-beta": "oauth-2025-04-20",
	Accept: "application/json",
	"User-Agent": `claude-code/${getClaudeVersion()}`,
} as const;

/**
 * Enforcement TTL, configurable via FUSE_ENFORCE_TTL_SEC (seconds).
 * Default 120s (2 min); recommended values 120 / 240 / 480 / 600. Read once at
 * daemon start — change requires a daemon restart to take effect.
 */
const _ttlSec = Number(process.env.FUSE_ENFORCE_TTL_SEC);
const ENFORCE_TTL_MS = (Number.isFinite(_ttlSec) && _ttlSec > 0 ? _ttlSec : 120) * 1000;

/** Success cache TTL in milliseconds (default 2 minutes) */
export const CACHE_TTL_MS = ENFORCE_TTL_MS;

/** Error cache TTL in milliseconds (default 2 minutes) */
export const ERROR_CACHE_TTL_MS = ENFORCE_TTL_MS;
