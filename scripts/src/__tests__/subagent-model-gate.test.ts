/**
 * Tests for resolveSubagentModelValue and the SUBAGENT_MODEL_OPTIONS table.
 */
import { describe, expect, test } from "bun:test";
import {
	resolveSubagentModelValue,
	SUBAGENT_MODEL_OPTIONS,
} from "../services/subagent-model-gate";

describe("resolveSubagentModelValue", () => {
	test("sonnet passes through unchanged", () => {
		expect(resolveSubagentModelValue("sonnet")).toBe("sonnet");
	});

	test("haiku passes through unchanged", () => {
		expect(resolveSubagentModelValue("haiku")).toBe("haiku");
	});

	test("opus passes through unchanged", () => {
		expect(resolveSubagentModelValue("opus")).toBe("opus");
	});

	test("unset resolves to undefined (removes the key)", () => {
		expect(resolveSubagentModelValue("unset")).toBeUndefined();
	});
});

describe("SUBAGENT_MODEL_OPTIONS", () => {
	test("opus is the first option (visual default)", () => {
		expect(SUBAGENT_MODEL_OPTIONS[0]?.value).toBe("opus");
	});

	test("unset is present as an option", () => {
		expect(SUBAGENT_MODEL_OPTIONS.some((o) => o.value === "unset")).toBe(true);
	});
});
