/**
 * MCP Default selections and UI options
 * Single Responsibility: Build selection options for installer UI
 */
import type { McpCatalog, McpSelectOption } from "../interfaces/mcp";
import { loadEnvFile } from "./env-file";

/** Check if API key is available in environment or .env file */
export function hasApiKey(envVar: string): boolean {
	if (process.env[envVar]) return true;
	const envFile = loadEnvFile();
	return !!envFile[envVar];
}

/** Build selection options grouped by API key requirement */
export function buildMcpOptions(catalog: McpCatalog): McpSelectOption[] {
	const entries = Object.entries(catalog.mcpServers).filter(
		([k]) => !k.startsWith("_"),
	);
	const noKey = entries.filter(([, v]) => !v.requiresApiKey);
	const withKey = entries.filter(([, v]) => v.requiresApiKey);
	const options: McpSelectOption[] = [];

	for (const [name, config] of noKey) {
		options.push({
			value: name,
			label: name,
			hint: config._description,
		});
	}

	for (const [name, config] of withKey) {
		const keyStatus = hasApiKey(config.apiKeyEnv ?? "") ? "✓" : "⚠ key missing";
		options.push({
			value: name,
			label: `${name} [${keyStatus}]`,
			hint: config._description,
		});
	}

	return options;
}

/** Get default selections (explicit default > no-key > configured key) */
export function getDefaultSelections(catalog: McpCatalog): string[] {
	return Object.entries(catalog.mcpServers)
		.filter(([k]) => !k.startsWith("_"))
		.filter(([, v]) => {
			if (v.default === true) return true;
			if (v.default === false) return false;
			return !v.requiresApiKey || (v.apiKeyEnv && hasApiKey(v.apiKeyEnv));
		})
		.map(([name]) => name);
}
