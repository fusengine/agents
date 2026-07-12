---
name: publish-workflow
description: GitHub Actions release workflows for npm (provenance) and JSR (OIDC)
keywords: github actions, publish, provenance, oidc, npm, jsr, id-token
---

# Publish Workflows

## Usage

Two workflows: npm with provenance, and JSR with tokenless OIDC. Both run on a
GitHub-hosted runner with `id-token: write`.

---

## npm with Provenance

```yaml
# .github/workflows/publish-npm.yml
name: Publish to npm
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write        # required for provenance
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "24.x"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npx @arethetypeswrong/cli --pack   # fail on broken types
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

With **trusted publishing** configured, drop the `--provenance` flag and
`NODE_AUTH_TOKEN` — provenance and auth are automatic via OIDC.

---

## JSR (tokenless OIDC)

```yaml
# .github/workflows/publish-jsr.yml
name: Publish to JSR
on:
  push:
    branches: [main]
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write        # OIDC auth with JSR
    steps:
      - uses: actions/checkout@v6
      - run: npx jsr publish
```

Link the package to its GitHub repo in JSR package settings first. `jsr publish`
skips if the version in `jsr.json` is already published.

---

## GitLab (npm provenance)

```yaml
# .gitlab-ci.yml
publish:
  image: "node:24"
  rules:
    - if: $CI_COMMIT_TAG
  id_tokens:
    SIGSTORE_ID_TOKEN:
      aud: sigstore
  script:
    - npm config set //registry.npmjs.org/:_authToken "$NPM_TOKEN"
    - npm publish --provenance --access public
```

---

## Local Verification (before tagging)

```bash
npm run build
npx @arethetypeswrong/cli --pack
npm publish --dry-run
```
