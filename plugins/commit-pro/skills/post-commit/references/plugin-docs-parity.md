# Plugin Docs Parity (Step M3.5)

Load when: doing Step M3.5 and you need the detection command and the full per-plugin checklist for new plugins lacking a docs page.

For any plugin **added** in this commit, create its docs page and link it. Doc filenames are abbreviated (e.g. dir `nextjs-expert` → `docs/plugins/nextjs.md`), so match the existing naming in `docs/plugins/`, not the raw dir.

```bash
git diff --name-only HEAD~1 HEAD | grep -oE '^plugins/[^/]+' | sort -u   # plugins touched this commit
```

For each NEW plugin lacking a page:

1. Create `docs/plugins/<name>.md` mirroring a sibling page (title, How It Works, Configuration, Commands, Scripts tables).
2. Add a row to the matching README plugin table **and** append the plugin to the `/plugin install …` command list.
