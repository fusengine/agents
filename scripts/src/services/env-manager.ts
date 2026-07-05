/**
 * Environment manager - Re-exports all env services
 * Single Responsibility: Module aggregator for env configuration
 */

// Re-export env file operations
export { ENV_FILE, loadEnvFile, saveEnvFile } from "./env-file";

// Re-export shell configuration
export { configureShell } from "./shell-config";
