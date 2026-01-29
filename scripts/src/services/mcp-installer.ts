/**
 * MCP Installer Service
 * Single Responsibility: Install MCP servers to global scope
 */
import { join } from "path";
import { $ } from "bun";
import * as p from "@clack/prompts";
import type { McpCatalog, McpServerConfig, McpSelectOption } from "../interfaces/mcp";

const MCP_JSON_PATH = join(import.meta.dir, "../../mcp/mcp.json");

/** Load MCP catalog from mcp.json */
export async function loadMcpCatalog(): Promise<McpCatalog> {
  const file = Bun.file(MCP_JSON_PATH);
  return await file.json();
}

/** Check if API key is available in environment */
export function hasApiKey(envVar: string): boolean {
  return !!process.env[envVar];
}

/** Build selection options grouped by API key requirement */
export function buildMcpOptions(catalog: McpCatalog): McpSelectOption[] {
  const entries = Object.entries(catalog.mcpServers).filter(([k]) => !k.startsWith("_"));
  const noKey = entries.filter(([, v]) => !v.requiresApiKey);
  const withKey = entries.filter(([, v]) => v.requiresApiKey);

  const options: McpSelectOption[] = [];

  // Add no-key servers
  for (const [name, config] of noKey) {
    options.push({
      value: name,
      label: name,
      hint: config._description,
    });
  }

  // Add with-key servers
  for (const [name, config] of withKey) {
    const keyStatus = hasApiKey(config.apiKeyEnv!) ? "✓" : "⚠ key missing";
    options.push({
      value: name,
      label: `${name} [${keyStatus}]`,
      hint: config._description,
    });
  }

  return options;
}

/** Install a single MCP server to global scope */
export async function installMcpServer(name: string, config: McpServerConfig): Promise<boolean> {
  try {
    const configJson = JSON.stringify(buildClaudeConfig(config));
    await $`claude mcp add-json --scope=user ${name} ${configJson}`.quiet();
    return true;
  } catch {
    return false;
  }
}

/** Build Claude-compatible config (remove our custom fields) */
function buildClaudeConfig(config: McpServerConfig): Record<string, unknown> {
  const { _description, requiresApiKey, apiKeyEnv, apiKeyUrl, ...claudeConfig } = config;
  return claudeConfig;
}

/** Install multiple MCP servers with progress */
export async function installMcpServers(
  names: string[],
  catalog: McpCatalog
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

/** Get default selections (no-key servers + servers with configured keys) */
export function getDefaultSelections(catalog: McpCatalog): string[] {
  return Object.entries(catalog.mcpServers)
    .filter(([k, v]) => !k.startsWith("_"))
    .filter(([, v]) => !v.requiresApiKey || (v.apiKeyEnv && hasApiKey(v.apiKeyEnv)))
    .map(([name]) => name);
}
