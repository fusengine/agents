# Claude Code - Load API keys from ~/.claude/.env
# Install: copy to ~/.config/fish/conf.d/claude-env.fish

if test -f ~/.claude/.env
    # Load each export line
    for line in (grep '^export' ~/.claude/.env)
        # Parse: export KEY="value" or export KEY=value
        set -l keyval (string replace 'export ' '' $line)
        set -l key (string split -m1 '=' $keyval)[1]
        set -l val (string split -m1 '=' $keyval)[2]
        # Remove quotes if present
        set val (string trim -c '"' $val)
        set val (string trim -c "'" $val)
        # Export globally
        set -gx $key $val
    end

    # Tell bash to load .env for non-interactive shells (Claude Code uses bash)
    set -gx BASH_ENV ~/.claude/.env
end
