/**
 * Tests for MCP Installer Service - Core functions
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { hasApiKey, buildMcpOptions } from "../services/mcp-installer";
import { mockCatalog } from "./mcp-test-fixtures";

describe("hasApiKey", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("returns true when env var exists and is not empty", () => {
    process.env.MY_API_KEY = "test-value";
    expect(hasApiKey("MY_API_KEY")).toBe(true);
  });

  test("returns false when env var does not exist", () => {
    delete process.env.NONEXISTENT_KEY;
    expect(hasApiKey("NONEXISTENT_KEY")).toBe(false);
  });

  test("returns false when env var is empty string", () => {
    process.env.EMPTY_KEY = "";
    expect(hasApiKey("EMPTY_KEY")).toBe(false);
  });
});

describe("buildMcpOptions", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("excludes entries starting with underscore", () => {
    const options = buildMcpOptions(mockCatalog);
    const names = options.map((o) => o.value);
    expect(names).not.toContain("_comment");
  });

  test("includes servers without API key requirement", () => {
    const options = buildMcpOptions(mockCatalog);
    const noKeyServer = options.find((o) => o.value === "no-key-server");
    expect(noKeyServer).toBeDefined();
    expect(noKeyServer?.label).toBe("no-key-server");
    expect(noKeyServer?.hint).toBe("Server without API key requirement");
  });

  test("shows key status for servers requiring API key", () => {
    process.env.TEST_API_KEY = "configured";
    const options = buildMcpOptions(mockCatalog);
    const keyServer = options.find((o) => o.value === "key-server");
    expect(keyServer?.label).toContain("[✓]");
  });

  test("shows missing key warning when API key not configured", () => {
    delete process.env.TEST_API_KEY;
    const options = buildMcpOptions(mockCatalog);
    const keyServer = options.find((o) => o.value === "key-server");
    expect(keyServer?.label).toContain("⚠ key missing");
  });
});
