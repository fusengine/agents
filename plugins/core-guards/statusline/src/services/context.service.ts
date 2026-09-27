/**
 * Context Service - Computes the context used
 *
 * @description SRP: Context computation only
 * @see https://github.com/anthropics/claude-code/issues/14830
 */

import { OVERHEAD_ESTIMATION, TOKEN_LIMITS } from "../constants";
import type { ContextResult, HookInput, TokenUsage } from "../interfaces";

function _calculateTotalTokens(usage: TokenUsage): number {
	return (
		usage.input_tokens +
		(usage.cache_creation_input_tokens || 0) +
		(usage.cache_read_input_tokens || 0)
	);
}

function _calculateSystemOverhead(estimateOverhead: boolean, overheadTokens?: number): number {
	if (!estimateOverhead) return 0;

	// If a custom overhead is defined, use it
	if (overheadTokens !== undefined) return overheadTokens;

	// Otherwise, compute with the default constants
	const mcpTokens = OVERHEAD_ESTIMATION.MCP_PER_SERVER * OVERHEAD_ESTIMATION.DEFAULT_MCP_SERVERS;

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
	_estimateOverhead: boolean = false,
	_overheadTokens?: number,
): ContextResult {
	const contextWindow = input.context_window;

	if (!contextWindow) {
		return { tokens: 0, maxTokens: TOKEN_LIMITS.CONTEXT_WINDOW, percentage: 0 };
	}

	const windowSize = contextWindow.context_window_size || TOKEN_LIMITS.CONTEXT_WINDOW;

	// Use used_percentage precomputed by Claude Code (the most accurate)
	// May be null (session start, post-/compact) or undefined (not provided)
	// Otherwise fall back to the manual computation, relative to the real context window
	// @see https://code.claude.com/docs/en/statusline
	if (contextWindow.used_percentage !== undefined && contextWindow.used_percentage !== null) {
		const tokens = Math.round((contextWindow.used_percentage / 100) * windowSize);
		const percentage = Math.min(contextWindow.used_percentage, 100);
		return { tokens, maxTokens: windowSize, percentage };
	}

	// Fallback: computed from totals (less accurate, includes compacted tokens)
	const totalTokens = contextWindow.total_input_tokens + contextWindow.total_output_tokens;
	const percentage = Math.min((totalTokens / windowSize) * 100, 100);

	return { tokens: totalTokens, maxTokens: windowSize, percentage };
}
