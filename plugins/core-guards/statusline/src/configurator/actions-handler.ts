/**
 * Actions Handler - Handles user actions (save/reset/cancel)
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Only responsible for handling user action commands
 */

import * as p from "@clack/prompts";
import type { ConfigManager } from "../config/manager";
import type { StatuslineConfig } from "../config/schema";

/**
 * Action type returned by action menu
 */
export type ConfigAction = "continue" | "save" | "reset" | "cancel";

/**
 * Action result
 */
export interface ActionResult {
	shouldContinue: boolean;
	config: StatuslineConfig;
}

/**
 * Show action menu and get user's choice
 */
export async function showActionMenu(): Promise<ConfigAction | symbol> {
	return await p.select({
		message: "Que souhaitez-vous faire ?",
		options: [
			{
				value: "continue",
				label: "✓ Voir la preview",
				hint: "Afficher les changements",
			},
			{
				value: "save",
				label: "💾 Sauvegarder & Quitter",
				hint: "Enregistrer la configuration",
			},
			{
				value: "reset",
				label: "🔄 Réinitialiser",
				hint: "Retour aux valeurs par défaut",
			},
			{
				value: "cancel",
				label: "❌ Annuler",
				hint: "Quitter sans sauvegarder",
			},
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
 * Handle reset action
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

/**
 * Handle cancel action
 */
export function handleCancel(): ActionResult {
	p.log.warn("Configuration non sauvegardée");
	return { shouldContinue: false, config: {} as StatuslineConfig };
}
