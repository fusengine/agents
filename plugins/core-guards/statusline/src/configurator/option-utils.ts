/**
 * Option Utils - Helper functions for option manipulation
 *
 * @description SRP: Object path manipulation utilities only
 */

/**
 * Get nested value from object using dot notation path
 */
export function getNestedValue(obj: unknown, path: string): unknown {
	return path.split(".").reduce((current: unknown, key: string) => {
		if (current && typeof current === "object") {
			return (current as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
}

/**
 * Set nested value in object using dot notation path (immutable)
 */
export function setNestedValue(obj: unknown, path: string, value: unknown): unknown {
	const keys = path.split(".");
	const lastKey = keys.pop()!;

	// Clone and navigate to parent
	const clone = JSON.parse(JSON.stringify(obj));
	const parent = keys.reduce(
		(current: Record<string, unknown>, key: string) => current[key] as Record<string, unknown>,
		clone,
	);

	// Set the value
	parent[lastKey] = value;

	return clone;
}

/**
 * Cycle through progress bar styles
 */
export function cycleProgressBarStyle(currentStyle: string): string {
	const styles = ["filled", "braille", "dots", "line"];
	const currentIndex = styles.indexOf(currentStyle);
	const nextIndex = (currentIndex + 1) % styles.length;
	return styles[nextIndex];
}

/**
 * Cycle through separators
 */
export function cycleSeparator(currentSeparator: string): string {
	const separators = ["|", "-", " "];
	const currentIndex = separators.indexOf(currentSeparator);
	const nextIndex = (currentIndex + 1) % separators.length;
	return separators[nextIndex];
}
