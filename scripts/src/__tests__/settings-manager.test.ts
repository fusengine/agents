/**
 * Settings manager test suite - split per SOLID SRP
 * IO tests:        settings-manager.load-save.test.ts
 * Config tests:    settings-manager.configure.test.ts
 */

// Re-export split suites so `bun test` picks them up individually.
// This file intentionally left as an index; actual tests live in:
//   - settings-manager.load-save.test.ts   (loadSettings, saveSettings, backupSettings)
//   - settings-manager.configure.test.ts   (configureHooks, configureDefaults, configureStatusLine)
export {};
