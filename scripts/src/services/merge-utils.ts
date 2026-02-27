/**
 * JSON output merging utilities for hook results
 * Single Responsibility: Merge multiple hook JSON outputs
 */

/** Merge JSON outputs (additionalContext, hookSpecificOutput, systemMessage) */
export function mergeJsonOutput(existing: string, newOutput: string): string {
	try {
		const newJson = JSON.parse(newOutput);

		if (!existing) return newOutput;
		const existingJson = JSON.parse(existing);

		// Merge systemMessage fields (concatenate with newline separator)
		if (newJson.systemMessage && existingJson.systemMessage) {
			existingJson.systemMessage += `\n${newJson.systemMessage}`;
		} else if (newJson.systemMessage) {
			existingJson.systemMessage = newJson.systemMessage;
		}

		// Merge hookSpecificOutput.additionalContext across multiple hooks
		if (newJson.hookSpecificOutput && existingJson.hookSpecificOutput) {
			const existCtx = existingJson.hookSpecificOutput.additionalContext ?? "";
			const newCtx = newJson.hookSpecificOutput.additionalContext ?? "";
			if (newCtx) {
				existingJson.hookSpecificOutput.additionalContext = existCtx
					? `${existCtx}\n\n${newCtx}`
					: newCtx;
			}
			return JSON.stringify(existingJson);
		}

		// First hookSpecificOutput wins structure, or plain additionalContext merge
		if (newJson.hookSpecificOutput) return newOutput;
		if (newJson.additionalContext && existingJson.additionalContext) {
			existingJson.additionalContext += `\n\n${newJson.additionalContext}`;
			return JSON.stringify(existingJson);
		}

		return newJson.hookSpecificOutput || newJson.additionalContext
			? newOutput
			: existing;
	} catch {
		return existing;
	}
}
