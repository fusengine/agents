#!/usr/bin/env bun
/**
 * Web-based Statusline Configurator - Entry point
 * Opens in browser with full mouse support
 */

import { startServer } from "./src/configure-web/server";

startServer().catch((err) => {
	console.error(`Error: ${err}`);
	process.exit(1);
});
