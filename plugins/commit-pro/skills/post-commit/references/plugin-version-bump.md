# Plugin Version Bump Detail (Step M2)

Load when: doing Step M2 and you need the full per-plugin bump procedure, including the marketplace.json type-detection rule.

For each modified plugin detected in Step M1:

1. Read `plugins/{name}/.claude-plugin/plugin.json`
2. Increment PATCH version: `X.Y.Z` → `X.Y.(Z+1)`
3. Write the new version back to `plugin.json`

Then determine plugin type from `marketplace.json`:

- **In `plugins[]` array** → Also update matching `version` field in `marketplace.json`
- **In `core[]` array** → Only bump `plugin.json` (core entries have no version field)
