/**
 * Trivial edit counter — tracks cumulative small edits per session.
 * After 5 trivial edits within 2 minutes, full APEX enforcement kicks in.
 */
import { readJsonFile, writeJsonFile, ensureDir } from "../core";

const HOME = process.env.HOME ?? "";
const SESSIONS_DIR = `${HOME}/.claude/fusengine-cache/sessions`;
const TRIVIAL_EDIT_WINDOW_MS = 120_000; // 2 minutes

/** Shape of the trivial edits tracking data */
interface TrivialEditState {
  trivial_edits?: number[];
  [key: string]: unknown;
}

/**
 * Increment the trivial edit counter for a session.
 * Stores timestamps in the session state file.
 * @param sessionId - Current session identifier
 * @returns Count of trivial edits in the last 2 minutes
 */
export async function incrementTrivialEditCounter(
  sessionId: string,
): Promise<number> {
  const filePath = `${SESSIONS_DIR}/session-${sessionId}-agents.json`;
  await ensureDir(SESSIONS_DIR);
  const state: TrivialEditState =
    (await readJsonFile<TrivialEditState>(filePath)) ?? {};
  const now = Date.now();
  const cutoff = now - TRIVIAL_EDIT_WINDOW_MS;
  const edits = (state.trivial_edits ?? []).filter((ts) => ts > cutoff);
  edits.push(now);
  state.trivial_edits = edits;
  await writeJsonFile(filePath, state);
  return edits.length;
}
