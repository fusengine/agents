/**
 * Tests for api-keys config
 */
import { describe, test, expect } from "bun:test";
import { API_KEYS } from "../config/api-keys";
import type { EnvKey } from "../interfaces/env";

describe("api-keys config", () => {
  test("API_KEYS is an array", () => {
    expect(Array.isArray(API_KEYS)).toBe(true);
  });

  test("all keys have required properties", () => {
    for (const key of API_KEYS) {
      expect(key).toHaveProperty("name");
      expect(key).toHaveProperty("description");
      expect(typeof key.name).toBe("string");
      expect(typeof key.description).toBe("string");
    }
  });

  test("contains expected API keys", () => {
    const keyNames = API_KEYS.map((k) => k.name);

    expect(keyNames).toContain("CONTEXT7_API_KEY");
    expect(keyNames).toContain("EXA_API_KEY");
    expect(keyNames).toContain("MAGIC_API_KEY");
    expect(keyNames).toContain("GEMINI_DESIGN_API_KEY");
  });

  test("key names follow naming convention", () => {
    for (const key of API_KEYS) {
      // Should be UPPER_SNAKE_CASE ending with _API_KEY
      expect(key.name).toMatch(/^[A-Z][A-Z0-9_]*_API_KEY$/);
    }
  });

  test("descriptions are not empty", () => {
    for (const key of API_KEYS) {
      expect(key.description.length).toBeGreaterThan(0);
    }
  });

  test("implements EnvKey interface correctly", () => {
    const testKey: EnvKey = API_KEYS[0];
    expect(testKey.name).toBeDefined();
    expect(testKey.description).toBeDefined();
  });
});
