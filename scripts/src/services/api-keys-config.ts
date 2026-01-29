/**
 * API keys configuration service
 * Single Responsibility: Configure and check API keys
 */
import * as p from "@clack/prompts";
import { API_KEYS } from "../config/api-keys";
import { loadEnvFile, saveEnvFile, ENV_FILE } from "./env-file";

/**
 * Configure API keys with prompts
 */
export async function configureApiKeys(): Promise<void> {
  const existing = loadEnvFile();
  const updated: Record<string, string> = { ...existing };
  let hasChanges = false;

  p.intro("🔑 API Keys Configuration");

  for (const key of API_KEYS) {
    const current = existing[key.name];

    if (current) {
      p.log.success(`${key.name} - configured`);
      continue;
    }

    const value = await p.text({
      message: `${key.name}`,
      placeholder: key.description,
    });

    if (p.isCancel(value)) {
      p.cancel("Configuration cancelled");
      return;
    }

    if (value && value.trim()) {
      updated[key.name] = value.trim();
      hasChanges = true;
    }
  }

  if (hasChanges) {
    saveEnvFile(updated);
    p.log.success(`Saved to ${ENV_FILE}`);
  }

  p.outro("✅ API keys configured");
}

/**
 * Check if API keys are configured
 */
export function checkApiKeys(): { configured: string[]; missing: string[] } {
  const env = loadEnvFile();
  const configured: string[] = [];
  const missing: string[] = [];

  for (const key of API_KEYS) {
    if (env[key.name]) {
      configured.push(key.name);
    } else {
      missing.push(key.name);
    }
  }

  return { configured, missing };
}
