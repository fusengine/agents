# Claude Code - Load API keys from ~/.claude/.env
# Install: copy to ~/.config/fish/conf.d/claude-env.fish
#
# FUSE_* keys are skipped on purpose: they are per-harness
# (FUSE_HARNESS_REFS points at ONE harness' rules tree), so exporting them
# globally makes every other agent read Claude's rules instead of its own.

if test -f ~/.claude/.env
    # Filled by the loop: keys exported (non-FUSE) and the raw FUSE_GUI_ENV
    # opt-in, read from the file but never exported (FUSE_* stays filtered).
    set -l loaded_keys
    set -l fuse_gui_env
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
            if test "$key" = FUSE_GUI_ENV
                set fuse_gui_env (string trim -c '"\'' -- $val)
            end
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
        set -a loaded_keys $key
    end <~/.claude/.env

    # macOS GUI apps (Claude Desktop) never inherit the shell env. OPT-IN
    # bridge: FUSE_GUI_ENV=1 in the .env pushes every non-FUSE key loaded
    # above into the launchd session — visible to EVERY GUI app, not only
    # Claude. Absent/anything else = no launchctl call at all.
    # FUSE_GUI_APP (process env) overrides the app path probed (tests).
    if test "$fuse_gui_env" = 1
        set -l gui_app /Applications/Claude.app
        set -q FUSE_GUI_APP; and set gui_app $FUSE_GUI_APP
        if command -sq launchctl; and test -d "$gui_app"
            for key in $loaded_keys
                launchctl setenv $key $$key
            end
        end
    end

    # Non-interactive bash (used by Claude Code) loads this shim, not the raw
    # .env: sourcing the .env directly would re-leak the FUSE_* filtered above.
    set -gx BASH_ENV ~/.claude/bash-env-loader.sh
end
