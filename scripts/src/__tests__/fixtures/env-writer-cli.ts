/**
 * Sandbox CLI fixture: writes FUSE_* vars via the real env-file writer.
 * Spawned as a subprocess with HOME pointed at a temp dir so the
 * module-level ENV_FILE const in env-file.ts resolves to the sandbox
 * home, never the real ~/.claude/.env (that const is computed once at
 * import time, so it must be set before the process starts, not after).
 *
 * Invoked as: bun env-writer-cli.ts '[["FUSE_X","1"],["FUSE_Y","2"]]'
 */
import { upsertEnvVar } from "../../services/env-file";

const pairs = JSON.parse(process.argv[2] ?? "[]") as [string, string][];

for (const [name, value] of pairs) {
	upsertEnvVar(name, value);
}
