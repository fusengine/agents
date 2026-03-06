/**
 * MCP Installer Service
 * Single Responsibility: Install MCP servers to global scope
 */
import { join } from "node:path";
import { $ } from "bun";
import type { McpCatalog, McpServerConfig } from "../interfaces/mcp";

const MCP_JSON_PATH = join(import.meta.dir, "../../mcp/mcp.json");

/** Load MCP catalog from mcp.json */
export async function loadMcpCatalog(): Promise<McpCatalog> {
	const file = Bun.file(MCP_JSON_PATH);
	return await file.json();
}

/** Install a single MCP server to global scope */
export async function installMcpServer(
	name: string,
	config: McpServerConfig,
): Promise<boolean> {
	try {
		const configJson = JSON.stringify(buildClaudeConfig(config));
		await $`claude mcp add-json --scope=user ${name} ${configJson}`.quiet();
		return true;
	} catch {
		return false;
	}
}

/** Replace environment variables in string */
function expandEnvVars(value: string): string {
	const home = process.env.HOME || process.env.USERPROFILE || "";
	return value.replace(/\$\{HOME\}/g, home).replace(/\$HOME/g, home);
}

/** Recursively expand env vars in config */
function expandConfigVars(obj: unknown): unknown {
	if (typeof obj === "string") return expandEnvVars(obj);
	if (Array.isArray(obj)) return obj.map(expandConfigVars);
	if (obj && typeof obj === "object") {
		const result: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(obj)) {
			result[k] = expandConfigVars(v);
		}
		return result;
	}
	return obj;
}

/** Build Claude-compatible config (remove custom fields, expand vars) */
function buildClaudeConfig(config: McpServerConfig): Record<string, unknown> {
	const {
		_description,
		requiresApiKey: _requiresApiKey,
		apiKeyEnv: _apiKeyEnv,
		apiKeyUrl: _apiKeyUrl,
		default: _default,
		...claudeConfig
	} = config;
	return expandConfigVars(claudeConfig) as Record<string, unknown>;
}

/** Install multiple MCP servers with progress */
export async function installMcpServers(
	names: string[],
	catalog: McpCatalog,
): Promise<{ success: string[]; failed: string[] }> {
	const success: string[] = [];
	const failed: string[] = [];

	for (const name of names) {
		const config = catalog.mcpServers[name];
		if (!config) continue;

		const ok = await installMcpServer(name, config);
		if (ok) {
			success.push(name);
		} else {
			failed.push(name);
		}
	}

	return { success, failed };
}

export { buildMcpOptions, getDefaultSelections, hasApiKey } from "./mcp-defaults";
