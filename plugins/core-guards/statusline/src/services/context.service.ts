/**
 * Context Service - Calcul du contexte utilise
 *
 * @description SRP: Calcul contexte uniquement
 * @see https://github.com/anthropics/claude-code/issues/14830
 */

import { OVERHEAD_ESTIMATION, TOKEN_LIMITS } from "../constants";
import type { ContextResult, HookInput, TokenUsage } from "../interfaces";

function calculateTotalTokens(usage: TokenUsage): number {
	return (
		usage.input_tokens +
		(usage.cache_creation_input_tokens || 0) +
		(usage.cache_read_input_tokens || 0)
	);
}

function calculateSystemOverhead(estimateOverhead: boolean, overheadTokens?: number): number {
	if (!estimateOverhead) return 0;

	// Si un overhead custom est défini, l'utiliser
	if (overheadTokens !== undefined) return overheadTokens;

	// Sinon, calculer avec les constantes par défaut
	const mcpTokens =
		OVERHEAD_ESTIMATION.MCP_PER_SERVER * OVERHEAD_ESTIMATION.DEFAULT_MCP_SERVERS;

	return (
		OVERHEAD_ESTIMATION.SYSTEM_TOOLS +
		OVERHEAD_ESTIMATION.SYSTEM_PROMPT +
		OVERHEAD_ESTIMATION.MEMORY_FILES +
		OVERHEAD_ESTIMATION.AUTOCOMPACT_BUFFER +
		mcpTokens
	);
}

export function getContextFromInput(
	input: HookInput,
	estimateOverhead: boolean = true,
	overheadTokens?: number,
): ContextResult {
	const contextWindow = input.context_window;

	if (!contextWindow) {
		return { tokens: 0, maxTokens: TOKEN_LIMITS.CONTEXT_WINDOW, percentage: 0 };
	}

	const usage = contextWindow.current_usage;
	const baseTokens = usage ? calculateTotalTokens(usage) : 0;
	const overhead = calculateSystemOverhead(estimateOverhead, overheadTokens);
	const realTokens = baseTokens + overhead;

	const windowSize = contextWindow.context_window_size || TOKEN_LIMITS.CONTEXT_WINDOW;
	const autocompactBuffer = 45_000; // Buffer réservé pour autocompact
	const usableSpace = windowSize - autocompactBuffer;
	const percentage = Math.min((realTokens / usableSpace) * 100, 100);

	return { tokens: realTokens, maxTokens: usableSpace, percentage };
}
