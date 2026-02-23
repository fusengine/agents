/**
 * MCP Setup Service
 * Single Responsibility: Interactive MCP server configuration
 */
import * as p from "@clack/prompts";
import {
	buildMcpOptions,
	getDefaultSelections,
	installMcpServers,
	loadMcpCatalog,
} from "./mcp-installer";

/** Interactive MCP server configuration */
export async function configureMcpServers(): Promise<void> {
	const installMcp = await p.confirm({
		message: "Install MCP servers to global scope?",
		initialValue: true,
	});

	if (p.isCancel(installMcp) || !installMcp) {
		p.log.info("Skipping MCP server installation");
		return;
	}

	const catalog = await loadMcpCatalog();
	const options = buildMcpOptions(catalog);
	const defaults = getDefaultSelections(catalog);

	const selected = await p.multiselect({
		message: "Select MCP servers to install globally:",
		options: options.map((opt) => ({
			value: opt.value,
			label: opt.label,
			hint: opt.hint,
		})),
		initialValues: defaults,
		required: false,
	});

	if (p.isCancel(selected) || selected.length === 0) {
		p.log.info("No MCP servers selected");
		return;
	}

	const s = p.spinner();
	s.start(`Installing ${selected.length} MCP servers...`);

	const { success, failed } = await installMcpServers(
		selected as string[],
		catalog,
	);

	if (failed.length > 0) {
		s.stop(`Installed ${success.length}/${selected.length} MCP servers`);
		p.log.warn(`Failed: ${failed.join(", ")}`);
	} else {
		s.stop(`${success.length} MCP servers installed globally`);
	}

	if (success.length > 0) {
		p.log.success(`Installed: ${success.join(", ")}`);
	}
}
