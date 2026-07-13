/**
 * Deterministic test hook fixture (no shell required).
 * Invoked as `bun hook-fixture.mjs <mode> [arg]`; behaviour selected by <mode>.
 * Used by hook-executor tests to exercise the shell-free spawn path cross-platform.
 */
const mode = process.argv[2];
const arg = process.argv[3];

switch (mode) {
	case "stdout":
		process.stdout.write("hello-world");
		break;
	case "ctx":
		process.stdout.write(JSON.stringify({ additionalContext: arg }));
		break;
	case "plain":
		process.stdout.write("plain text output");
		break;
	case "block":
		process.stderr.write("blocked reason");
		process.exit(2);
	case "fail":
		process.stderr.write("boom");
		process.exit(3);
	case "stdin": {
		const chunks = [];
		for await (const c of process.stdin) chunks.push(c);
		process.stdout.write(`STDIN:${Buffer.concat(chunks).toString()}`);
		break;
	}
	case "sleep":
		await new Promise((r) => setTimeout(r, 50));
		process.stdout.write(arg || "slept");
		break;
	default:
		break;
}
process.exit(0);
