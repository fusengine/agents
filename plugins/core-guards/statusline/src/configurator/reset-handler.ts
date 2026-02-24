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
		message: "Êtes-vous sûr de vouloir réinitialiser la configuration ?",
		initialValue: false,
	});

	if (confirmReset && !p.isCancel(confirmReset)) {
		const spinner = p.spinner();
		spinner.start("Réinitialisation...");
		try {
			const resetConfig = await manager.reset();
			spinner.stop("✓ Configuration réinitialisée");
			p.log.success("Configuration restaurée aux valeurs par défaut");
			return { shouldContinue: true, config: resetConfig };
		} catch (error) {
			spinner.stop("✗ Erreur");
			p.log.error(
				`Impossible de réinitialiser: ${error instanceof Error ? error.message : String(error)}`,
			);
			return { shouldContinue: true, config: currentConfig };
		}
	}

	return { shouldContinue: true, config: currentConfig };
}
