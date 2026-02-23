/**
 * Tests for MCP Catalog loading
 */
import { describe, expect, test } from "bun:test";
import { loadMcpCatalog } from "../services/mcp-installer";

describe("loadMcpCatalog", () => {
	test("loads catalog from mcp.json", async () => {
		const catalog = await loadMcpCatalog();
		expect(catalog).toBeDefined();
		expect(catalog.mcpServers).toBeDefined();
		expect(typeof catalog.mcpServers).toBe("object");
	});

	test("catalog contains expected servers", async () => {
		const catalog = await loadMcpCatalog();
		expect(catalog.mcpServers["sequential-thinking"]).toBeDefined();
		expect(catalog.mcpServers.memory).toBeDefined();
	});

	test("servers have required fields", async () => {
		const catalog = await loadMcpCatalog();
		const server = catalog.mcpServers["sequential-thinking"];
		expect(server._description).toBeDefined();
		expect(server.type).toBe("stdio");
		expect(typeof server.requiresApiKey).toBe("boolean");
	});
});
