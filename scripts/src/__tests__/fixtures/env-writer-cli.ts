/**
 * Sandbox CLI fixture: writes/removes FUSE_* vars via the real env-file
 * writer, and optionally prints the real reader's output. Spawned as a
 * subprocess with HOME pointed at a temp dir so the module-level ENV_FILE
 * const in env-file.ts resolves to the sandbox home, never the real
 * ~/.claude/.env (that const is computed once at import time, so it must
 * be set before the process starts, not after).
 *
 * Ops: 2-tuple `[name, value]` -> upsertEnvVar; 1-tuple `[name]` -> removeEnvVar.
 * Invoked as: bun env-writer-cli.ts '[["FUSE_X","1"],["FUSE_Y"]]' [--load]
 * With `--load`, prints `JSON.stringify(loadEnvFile())` to stdout after ops.
 */
import { loadEnvFile, removeEnvVar, upsertEnvVar } from "../../services/env-file";

type Op = [string, string] | [string];

const ops = JSON.parse(process.argv[2] ?? "[]") as Op[];

for (const op of ops) {
	if (op.length === 2) {
		upsertEnvVar(op[0], op[1]);
	} else {
		removeEnvVar(op[0]);
	}
}

if (process.argv[3] === "--load") {
	process.stdout.write(JSON.stringify(loadEnvFile()));
}
