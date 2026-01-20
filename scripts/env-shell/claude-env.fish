# Claude Code - Load API keys from ~/.claude/.env
# Copy to ~/.config/fish/conf.d/claude-env.fish

if test -f ~/.claude/.env
    for line in (grep -v '^#' ~/.claude/.env | grep -v '^$')
        set -l key (echo $line | sed 's/^export //' | cut -d= -f1)
        set -l val (echo $line | sed 's/^export //' | cut -d= -f2- | sed 's/^"//' | sed 's/"$//')
        set -gx $key $val
    end
end
