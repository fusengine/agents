/**
 * Test fixtures for MCP tests
 */
import type { McpCatalog } from "../interfaces/mcp";

/** Mock MCP catalog for testing */
export const mockCatalog: McpCatalog = {
  mcpServers: {
    "no-key-server": {
      _description: "Server without API key requirement",
      command: "npx",
      args: ["-y", "test-server"],
      type: "stdio",
      requiresApiKey: false,
    },
    "key-server": {
      _description: "Server with API key requirement",
      command: "npx",
      args: ["-y", "key-server"],
      type: "stdio",
      requiresApiKey: true,
      apiKeyEnv: "TEST_API_KEY",
      apiKeyUrl: "https://example.com/api-keys",
    },
    "_comment": {
      _description: "Should be ignored",
      type: "stdio",
      requiresApiKey: false,
    },
  },
};
