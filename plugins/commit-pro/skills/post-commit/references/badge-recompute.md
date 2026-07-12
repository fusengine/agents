# Badge Recompute (Step M3)

Load when: doing Step M3 and you need the exact commands to recompute README.md shields.io badges from the filesystem.

Never hand-maintain badge counts (they drift) — always recompute from the filesystem:

```bash
PLUGINS=$(grep -cE '"source": "\./plugins/' .claude-plugin/marketplace.json)
AGENTS=$(ls plugins/*/agents/*.md 2>/dev/null | wc -l | tr -d ' ')
SKILLS=$(ls -d plugins/*/skills/*/ 2>/dev/null | wc -l | tr -d ' ')
```

Update each badge token in `README.md` so it matches reality (replace the token, not the whole line):

- `version-v<any>-` → `version-v<newSuite>-`
- `plugins-<any>-` → `plugins-$PLUGINS-`
- `agents-<any>-` → `agents-$AGENTS-`
- `skills-<any>-` → `skills-$SKILLS-`

```bash
sed -i '' -E "s/version-v[0-9.]+-/version-v${NEW}-/; s/plugins-[0-9]+-/plugins-${PLUGINS}-/; s/agents-[0-9]+-/agents-${AGENTS}-/; s/skills-[0-9]+-/skills-${SKILLS}-/" README.md
```
