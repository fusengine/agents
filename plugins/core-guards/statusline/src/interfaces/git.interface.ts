/**
 * Git Interface - Structure des infos Git
 */

export interface GitInfo {
	branch: string | null;
	isDirty: boolean;
	staged: number;
	unstaged: number;
}
