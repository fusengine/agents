/**
 * Web configurator - Bun HTTP server and routes
 * @module configure-web/server
 */

import { ConfigManager } from "../config/manager";
import type { StatuslineConfig } from "../config/schema";
import { buildHTML } from "./template";

const manager = new ConfigManager();

/** Platform-specific commands to open URLs in default browser. */
const OPEN_COMMANDS: Record<string, string[]> = {
	darwin: ["open"],
	linux: ["xdg-open"],
	win32: ["cmd", "/c", "start"],
};

/** Start the web configurator server and open the browser. */
export async function startServer(): Promise<void> {
	const server = Bun.serve({
		port: 3847,
		async fetch(req) {
			const url = new URL(req.url);

			if (url.pathname === "/") {
				const config = await manager.load();
				return new Response(buildHTML(config), {
					headers: { "Content-Type": "text/html" },
				});
			}

			if (url.pathname === "/save" && req.method === "POST") {
				await manager.save((await req.json()) as StatuslineConfig);
				return new Response("OK");
			}

			if (url.pathname === "/reset" && req.method === "POST") {
				const config = await manager.reset();
				return new Response(JSON.stringify(config), {
					headers: { "Content-Type": "application/json" },
				});
			}

			return new Response("Not Found", { status: 404 });
		},
	});

	console.log("\n🎨 Configurateur Web ouvert!");
	console.log(`\n   👉 http://localhost:${server.port}\n`);
	console.log("   Clique sur les options pour les activer/désactiver");
	console.log("   Ctrl+C pour fermer\n");

	const cmd = OPEN_COMMANDS[process.platform];
	if (cmd) Bun.spawn([...cmd, `http://localhost:${server.port}`]);
}
