# Claude Code - Load API keys from ~/.claude/.env
# Install: copy to ~/.config/fish/conf.d/claude-env.fish
#
# FUSE_* keys are skipped on purpose: they are per-harness
# (FUSE_HARNESS_REFS points at ONE harness' rules tree), so exporting them
# globally makes every other agent read Claude's rules instead of its own.

if test -f ~/.claude/.env
    while read -l line
        set -l entry (string trim -- $line)
        if test -z "$entry"; or string match -q '#*' -- $entry
            continue
        end
        set entry (string replace -r '^export\s+' '' -- $entry)
        if not string match -qr '^[A-Za-z_][A-Za-z0-9_]*=' -- $entry
            continue
        end
        set -l key (string split -m1 '=' -- $entry)[1]
        set -l val (string split -m1 '=' -- $entry)[2]
        if string match -q 'FUSE_*' -- $key
            continue
        end
        if string match -q '"*' -- $val
            set val (string replace -r '^"([^"]*)".*$' '$1' -- $val)
        else if string match -q "'*" -- $val
            set val (string replace -r "^'([^']*)'.*\$" '$1' -- $val)
        else
            set val (string replace -r '\s+#.*$' '' -- $val)
            set val (string trim -r -- $val)
        end
        set -gx $key $val
    end <~/.claude/.env

    # Non-interactive bash (used by Claude Code) loads this shim, not the raw
    # .env: sourcing the .env directly would re-leak the FUSE_* filtered above.
    set -gx BASH_ENV ~/.claude/bash-env-loader.sh
end
