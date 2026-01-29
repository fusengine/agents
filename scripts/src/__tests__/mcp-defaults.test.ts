/**
 * Tests for MCP Installer - Default selections
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { getDefaultSelections } from "../services/mcp-installer";
import { mockCatalog } from "./mcp-test-fixtures";

describe("getDefaultSelections", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("includes servers without API key requirement", () => {
    const defaults = getDefaultSelections(mockCatalog);
    expect(defaults).toContain("no-key-server");
  });

  test("excludes servers with missing API key", () => {
    delete process.env.TEST_API_KEY;
    const defaults = getDefaultSelections(mockCatalog);
    expect(defaults).not.toContain("key-server");
  });

  test("includes servers with configured API key", () => {
    process.env.TEST_API_KEY = "configured";
    const defaults = getDefaultSelections(mockCatalog);
    expect(defaults).toContain("key-server");
  });

  test("excludes entries starting with underscore", () => {
    const defaults = getDefaultSelections(mockCatalog);
    expect(defaults).not.toContain("_comment");
  });
});
