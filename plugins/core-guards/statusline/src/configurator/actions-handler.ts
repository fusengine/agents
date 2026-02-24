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
		message: "Que souhaitez-vous faire ?",
		options: [
			{ value: "continue", label: "✓ Voir la preview", hint: "Afficher les changements" },
			{ value: "save", label: "💾 Sauvegarder & Quitter", hint: "Enregistrer la configuration" },
			{ value: "reset", label: "🔄 Réinitialiser", hint: "Retour aux valeurs par défaut" },
			{ value: "cancel", label: "❌ Annuler", hint: "Quitter sans sauvegarder" },
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
	spinner.start("Sauvegarde de la configuration...");
	try {
		await manager.save(config);
		spinner.stop("✓ Configuration sauvegardée");
		p.log.success("Toutes les options ont été mises à jour !");
		return { shouldContinue: false, config };
	} catch (error) {
		spinner.stop("✗ Erreur lors de la sauvegarde");
		p.log.error(
			`Impossible de sauvegarder: ${error instanceof Error ? error.message : String(error)}`,
		);
		return { shouldContinue: true, config };
	}
}

/**
 * Handle cancel action
 */
export function handleCancel(): ActionResult {
	p.log.warn("Configuration non sauvegardée");
	return { shouldContinue: false, config: {} as StatuslineConfig };
}
