---
description: Create or restructure skills following standard patterns. Generates SKILL.md + references/ structure with Agent Workflow, proper frontmatter, and documentation conventions.
argument-hint: "<skill-name> [--from <source-skill>] [--adapt <next→react>]"
---

# Skill Creator

Create or restructure skills following established patterns and conventions.

---

## Skill Architecture

```
skills/<skill-name>/
├── SKILL.md                    # Main entry point (index)
├── references/                 # Conceptual documentation (NO CODE)
│   ├── installation.md
│   ├── patterns.md
│   └── ...
└── templates/                  # Full code examples (OPTIONAL)
    ├── basic-example.md
    └── ...
```

---

## SKILL.md Structure

### Frontmatter (YAML)

```yaml
---
name: skill-name
description: Short description for skill detection. Use when [trigger conditions].
versions:
  library: X.Y.Z
  react: 19
user-invocable: true|false
references: references/file1.md, references/file2.md, ...
related-skills: skill-a, skill-b
---
```

### Agent Workflow (MANDATORY)

```markdown
## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing [domain] patterns
2. **fuse-ai-pilot:research-expert** - Verify latest [library] docs via Context7/Exa
3. **mcp__context7__query-docs** - Check [specific] patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.
```

### Required Sections

1. **Overview** - When to use, Why this library
2. **Critical Rules** - Non-negotiable patterns
3. **Architecture** - SOLID module structure
4. **Key Concepts** - Core patterns (conceptual)
5. **Reference Guide** - Table linking to references/
6. **Best Practices** - Do's and don'ts

---

## Reference File Structure

### Frontmatter

```yaml
---
name: reference-name
description: What this reference covers
when-to-use: Trigger conditions for this reference
keywords: keyword1, keyword2, keyword3
priority: high|medium|low
requires: other-reference.md
related: related1.md, related2.md
---
```

### Content Rules

- **Conceptual first** - Explain WHY, not just HOW
- **Code in templates/** - References have minimal inline code
- **Max 150 lines** - Split large topics
- **Links to related** - Cross-reference other docs

---

## Creation Workflow

### Option 1: From Scratch

```bash
# 1. Create structure
mkdir -p plugins/<agent>/skills/<skill-name>/references

# 2. Create SKILL.md with frontmatter + sections

# 3. Create reference files

# 4. Commit with pattern:
# docs(<skill-name>): create skill with X reference files
```

### Option 2: Copy & Adapt (RECOMMENDED)

```bash
# 1. Find similar skill
ls plugins/<agent>/skills/

# 2. Copy references
cp -r plugins/<source>/skills/<similar>/references/ \
      plugins/<target>/skills/<new-skill>/references/

# 3. Adapt with sed
for file in references/*.md; do
  sed -i '' "s/Next\.js/React/g; s/'use client'//g" "$file"
done

# 4. Remove non-applicable files
rm references/hydration.md  # If no SSR

# 5. Update SKILL.md

# 6. Commit
```

---

## Adaptation Patterns

### Next.js → React

```bash
sed -i '' "s/Next\.js 16/React/g" *.md
sed -i '' "s/Next\.js App Router/React applications/g" *.md
sed -i '' "s/Next\.js/React/g" *.md
sed -i '' "s/'use client'//g" *.md
# Remove: hydration.md, nextjs-integration.md, server-actions.md
```

### Next.js → Laravel

```bash
# Different approach - usually create from scratch
# or adapt from laravel-expert existing skills
```

---

## Validation Checklist

- [ ] SKILL.md has proper frontmatter
- [ ] Agent Workflow section present
- [ ] All references listed in frontmatter
- [ ] No code in references (code in templates/)
- [ ] Keywords in each reference frontmatter
- [ ] related-skills points to valid skills
- [ ] No Next.js references in React skills
- [ ] No 'use client' in React SPA skills

---

## Examples

### Create Zustand skill for React

```
/skill-creator react-state --from nextjs-zustand --adapt next→react
```

**Result**:
1. Copy 12 references from nextjs-zustand
2. Adapt: Remove SSR (hydration, nextjs-integration)
3. Adapt: Remove 'use client' directives
4. Update SKILL.md with React context

### Create new skill from scratch

```
/skill-creator react-animations
```

**Result**:
1. Create empty structure
2. Generate SKILL.md template
3. Suggest reference files based on topic

---

## Register Skill to Agent (MANDATORY)

After creating a skill, you MUST register it in two places:

### 1. Agent Frontmatter

```yaml
# plugins/<plugin>/agents/<agent>.md
---
name: agent-name
skills: existing-skill-a, existing-skill-b, NEW-SKILL-NAME
---
```

### 2. Marketplace.json

```json
// .claude-plugin/marketplace.json
{
  "plugins": [
    {
      "name": "fuse-<plugin>",
      "skills": [
        "./skills/existing-skill-a",
        "./skills/existing-skill-b",
        "./skills/NEW-SKILL-NAME"
      ]
    }
  ]
}
```

### Registration Checklist

- [ ] Add skill name to agent's `skills:` list in frontmatter
- [ ] Add skill path to plugin's `skills:` array in marketplace.json
- [ ] Verify skill name matches folder name exactly
- [ ] Check related-skills in SKILL.md point to valid registered skills

---

## Commit Convention

```
docs(<skill-name>): create/restructure skill with X reference files

- List main reference files added
- Note any files adapted from source
- Note any SSR/framework-specific removals
- Register in agent and marketplace.json
```
