/**
 * Git Interface - Git info structure
 */

export interface GitInfo {
	branch: string | null;
	isDirty: boolean;
	staged: number;
	unstaged: number;
}
