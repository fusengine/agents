/**
 * Menu Helpers - Utility functions for menu display
 *
 * @description SRP: Display formatting helpers only
 */

/**
 * Display ON/OFF checkbox
 */
export function chk(enabled: boolean): string {
	return enabled ? "[✓]" : "[ ]";
}

/**
 * Display all available styles with current one highlighted
 */
export function getStyleIcon(currentStyle: string): string {
	const styles = [
		{ name: "filled", icon: "████████▓▓" },
		{ name: "braille", icon: "⣿⣿⣿⣿⣿⣿⣿⣿⣀⣀" },
		{ name: "dots", icon: "●●●●●●●●○○" },
		{ name: "line", icon: "━━━━━━━━╌╌" },
	];

	return styles.map((s) => (s.name === currentStyle ? `[${s.icon}]` : s.icon)).join(" ");
}

/**
 * Display all available separators with current one highlighted
 */
export function getSeparatorDisplay(currentSep: string): string {
	const separators = [
		{ value: "|", label: "pipe (|)" },
		{ value: "-", label: "dash (-)" },
		{ value: " ", label: "space ( )" },
	];

	return separators.map((s) => (s.value === currentSep ? `[${s.label}]` : s.label)).join(" ");
}
