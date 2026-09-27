/**
 * Actions Handler - Handles user actions (save/cancel)
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Only responsible for handling save, cancel, and menu display
 */

import * as p from "@clack/prompts";
import type { ConfigManager } from "../config/manager";
import type { StatuslineConfig } from "../config/schema";
import type { ActionResult, ConfigAction } from "./actions-handler.types";

// Re-export types and reset handler for backward compatibility
export type { ActionResult, ConfigAction } from "./actions-handler.types";
export { handleReset } from "./reset-handler";

/**
 * Show action menu and get user's choice
 */
export async function showActionMenu(): Promise<ConfigAction | symbol> {
	return await p.select({
		message: "What would you like to do?",
		options: [
			{ value: "continue", label: "✓ View preview", hint: "Show the changes" },
			{ value: "save", label: "💾 Save & Quit", hint: "Save the configuration" },
			{ value: "reset", label: "🔄 Reset", hint: "Restore default values" },
			{ value: "cancel", label: "❌ Cancel", hint: "Quit without saving" },
		],
	});
}

/**
 * Handle save action
 */
export async function handleSave(
	manager: ConfigManager,
	config: StatuslineConfig,
): Promise<ActionResult> {
	const spinner = p.spinner();
	spinner.start("Saving configuration...");
	try {
		await manager.save(config);
		spinner.stop("✓ Configuration saved");
		p.log.success("All options have been updated!");
		return { shouldContinue: false, config };
	} catch (error) {
		spinner.stop("✗ Error while saving");
		p.log.error(`Unable to save: ${error instanceof Error ? error.message : String(error)}`);
		return { shouldContinue: true, config };
	}
}

/**
 * Handle cancel action
 */
export function handleCancel(): ActionResult {
	p.log.warn("Configuration not saved");
	return { shouldContinue: false, config: {} as StatuslineConfig };
}
