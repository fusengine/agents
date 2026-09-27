/**
 * Reset Handler - Handles configuration reset action
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Only responsible for the reset flow with confirmation
 */

import * as p from "@clack/prompts";
import type { ConfigManager } from "../config/manager";
import type { StatuslineConfig } from "../config/schema";
import type { ActionResult } from "./actions-handler.types";

/**
 * Handle reset action with user confirmation
 * @param manager - Config manager instance
 * @param currentConfig - Current configuration to fall back to
 * @returns Action result with reset or current config
 */
export async function handleReset(
	manager: ConfigManager,
	currentConfig: StatuslineConfig,
): Promise<ActionResult> {
	const confirmReset = await p.confirm({
		message: "Are you sure you want to reset the configuration?",
		initialValue: false,
	});

	if (confirmReset && !p.isCancel(confirmReset)) {
		const spinner = p.spinner();
		spinner.start("Resetting...");
		try {
			const resetConfig = await manager.reset();
			spinner.stop("✓ Configuration reset");
			p.log.success("Configuration restored to default values");
			return { shouldContinue: true, config: resetConfig };
		} catch (error) {
			spinner.stop("✗ Error");
			p.log.error(`Unable to reset: ${error instanceof Error ? error.message : String(error)}`);
			return { shouldContinue: true, config: currentConfig };
		}
	}

	return { shouldContinue: true, config: currentConfig };
}
