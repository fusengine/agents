/**
 * MCP API Key Prompt Service
 * Single Responsibility: Prompt for missing API keys needed by selected MCP servers
 */
import * as p from "@clack/prompts";
import type { McpCatalog } from "../interfaces/mcp";
import { hasApiKey } from "./mcp-defaults";
import { loadEnvFile, saveEnvFile } from "./env-file";

/** Prompt for missing API keys needed by selected MCP servers */
export async function promptMissingKeys(
	selected: string[],
	catalog: McpCatalog,
): Promise<void> {
	const missing = selected
		.map((name) => catalog.mcpServers[name])
		.filter((c) => c.requiresApiKey && c.apiKeyEnv)
		.filter((c) => !hasApiKey(c.apiKeyEnv!));

	if (missing.length === 0) return;

	p.note(
		missing.map((c) => `  ${c.apiKeyEnv}`).join("\n"),
		`${missing.length} API key(s) required`,
	);

	const env = loadEnvFile();
	let hasChanges = false;

	for (const config of missing) {
		const value = await p.text({
			message: `${config.apiKeyEnv}`,
			placeholder: config.apiKeyUrl ?? config._description,
		});

		if (p.isCancel(value)) break;
		if (value?.trim()) {
			env[config.apiKeyEnv!] = value.trim();
			process.env[config.apiKeyEnv!] = value.trim();
			hasChanges = true;
		}
	}

	if (hasChanges) saveEnvFile(env);
}
