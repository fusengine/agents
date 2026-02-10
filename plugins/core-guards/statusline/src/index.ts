#!/usr/bin/env bun
/**
 * Statusline Entry Point
 *
 * @description Point d'entree principal du statusline Claude Code
 * Architecture SOLID avec segments modulaires
 *
 * @see https://starship.rs/guide/ - Inspired by Starship
 * @see https://blog.logrocket.com/applying-solid-principles-typescript/
 */

import { ConfigManager } from "./config/manager";
import type { HookInput, SegmentContext } from "./interfaces";
import { StatuslineRenderer } from "./renderer";
import {
	getContextFromInput,
	trackDailySpend,
	trackFiveHourUsage,
	trackWeeklyUsage,
} from "./services";
import { colors, getGitInfo } from "./utils";

async function main(): Promise<void> {
	try {
		// 1. Lire l'input de Claude Code
		const input: HookInput = await Bun.stdin.json();

		// 2. Charger la configuration
		const configManager = new ConfigManager();
		const config = await configManager.load();

		// 3. Calculer les donnees de contexte
		const contextData = getContextFromInput(
			input,
			config.context.estimateOverhead,
			config.context.overheadTokens,
		);

		// 4. Tracker l'usage 5 heures
		const fiveHourUsage = trackFiveHourUsage(
			input.session_id,
			contextData.tokens,
			input.model.id,
			config.fiveHour.subscriptionPlan,
		);

		// 5. Tracker l'usage hebdomadaire (si active)
		const weeklyUsage = config.weekly.enabled
			? trackWeeklyUsage(input.session_id, contextData.tokens, input.cost.total_cost_usd)
			: undefined;

		// 6. Tracker les depenses quotidiennes (si active)
		const dailySpend = config.dailySpend.enabled
			? trackDailySpend(input.session_id, input.cost.total_cost_usd, config.dailySpend.budget)
			: undefined;

		// 7. Recuperer les infos Git
		const git = await getGitInfo();

		// 8. Recuperer la version Node
		const nodeVersion = process.version || "N/A";

		// 9. Construire le contexte des segments
		const segmentContext: SegmentContext = {
			input,
			context: contextData,
			fiveHourUsage,
			weeklyUsage,
			dailySpend,
			git,
			nodeVersion,
		};

		// 10. Rendre le statusline
		const renderer = new StatuslineRenderer();
		const statusline = await renderer.render(segmentContext, config);
		console.log(statusline);

		// 11. Afficher les warnings si necessaire
		const pct = Math.round(fiveHourUsage.percentage);
		if (pct >= 100) {
			console.log(`\n${colors.red(config.icons.warning)} LIMITE ATTEINTE: ${pct}% sur 5h`);
		} else if (pct >= 90) {
			console.log(`\n${colors.yellow(config.icons.warning)} Attention: ${pct}% de la limite 5h`);
		}
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
		process.exit(1);
	}
}

main();
