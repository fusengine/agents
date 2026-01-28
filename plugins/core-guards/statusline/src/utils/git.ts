/**
 * Git Module - Informations Git
 *
 * @description SRP: Responsabilite unique de recuperation Git
 */

import { execSync } from "node:child_process";
import type { GitInfo } from "../interfaces";

export async function getGitInfo(): Promise<GitInfo> {
	const defaultInfo: GitInfo = { branch: null, isDirty: false, staged: 0, unstaged: 0 };

	try {
		execSync("git rev-parse --is-inside-work-tree", { stdio: "pipe" });

		const branch = execSync("git symbolic-ref --short HEAD 2>/dev/null", {
			stdio: "pipe",
			encoding: "utf-8",
		}).trim();

		const status = execSync("git status --porcelain 2>/dev/null", {
			stdio: "pipe",
			encoding: "utf-8",
		});

		const lines = status.split("\n").filter((l) => l.trim());
		let staged = 0;
		let unstaged = 0;

		for (const line of lines) {
			const indexStatus = line[0];
			const workStatus = line[1];

			if (indexStatus && indexStatus !== " " && indexStatus !== "?") staged++;
			if (workStatus && workStatus !== " " && workStatus !== "?") unstaged++;
			if (indexStatus === "?") unstaged++;
		}

		return { branch, isDirty: lines.length > 0, staged, unstaged };
	} catch {
		return defaultInfo;
	}
}
