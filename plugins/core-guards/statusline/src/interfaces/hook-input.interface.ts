/**
 * Hook Input Interface - Structure JSON de Claude Code
 *
 * @see https://code.claude.com/docs/en/statusline
 */

export interface TokenUsage {
	input_tokens: number;
	cache_creation_input_tokens?: number;
	cache_read_input_tokens?: number;
}

export interface HookInput {
	session_id: string;
	transcript_path: string;
	cwd: string;
	model: {
		id: string;
		display_name: string;
	};
	workspace: {
		current_dir: string;
		project_dir: string;
	};
	version: string;
	output_style: {
		name: string;
	};
	cost: {
		total_cost_usd: number;
		total_duration_ms: number;
		total_api_duration_ms: number;
		total_lines_added: number;
		total_lines_removed: number;
	};
	context_window?: {
		total_input_tokens: number;
		total_output_tokens: number;
		context_window_size: number;
		used_percentage?: number;
		remaining_percentage?: number;
		current_usage: TokenUsage;
	};
	exceeds_200k_tokens?: boolean;
}
