/**
 * Directory Segment - Affiche le repertoire et Git
 *
 * @description SRP: Affichage repertoire et Git uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, formatPath } from "../utils";

export class DirectorySegment implements ISegment {
	readonly name = "directory";
	readonly priority = 20;

	isEnabled(config: StatuslineConfig): boolean {
		return config.directory.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { icons, directory, global } = config;
		const currentDir = context.input.workspace.current_dir;

		const dirDisplay = formatPath(currentDir, directory.pathStyle);

		// OSC 8 hyperlink - clickable in iTerm2, VS Code, etc.
		const fileUrl = `file://${currentDir}`;
		const clickableDir = `\x1b]8;;${fileUrl}\x07${colors.bold(dirDisplay)}\x1b]8;;\x07`;

		const label = global.showLabels ? " dir:" : "";
		let result = `${colors.cyan(icons.directory)}${colors.cyan(label)} ${clickableDir}`;

		if (directory.showGit && context.git.branch) {
			const gitParts: string[] = [];

			if (directory.showBranch) {
				let branchDisplay = context.git.branch;
				if (directory.showDirtyIndicator && context.git.isDirty) branchDisplay += "*";
				gitParts.push(colors.magenta(branchDisplay));
			}

			if (directory.showStagedCount && context.git.staged > 0) {
				gitParts.push(colors.green(`+${context.git.staged}`));
			}
			if (directory.showUnstagedCount && context.git.unstaged > 0) {
				gitParts.push(colors.red(`~${context.git.unstaged}`));
			}

			if (gitParts.length > 0) {
				result += ` ${colors.gray("(")}${gitParts.join(" ")}${colors.gray(")")}`;
			}
		}

		return result;
	}
}
