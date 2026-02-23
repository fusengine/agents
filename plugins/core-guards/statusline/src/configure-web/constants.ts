/**
 * Web configurator - Client-side JavaScript constants
 * @module configure-web/constants
 */

/** Segment definitions, style options, and UI constants for the browser client. */
export const CLIENT_CONSTANTS = `
    const SEGMENTS = [
      { key: 'claude', icon: '', label: 'Claude', options: [] },
      { key: 'node', icon: '', label: 'Node', options: [] },
      { key: 'directory', icon: '', label: 'Directory', options: [
        { key: 'directory.showBranch', label: 'Git Branch' },
        { key: 'directory.showDirtyIndicator', label: 'Dirty *' },
        { key: 'directory.showStagedCount', label: 'Staged +N' },
        { key: 'directory.showUnstagedCount', label: 'Unstaged ~N' },
      ]},
      { key: 'model', icon: '', label: 'Model', options: [
        { key: 'model.showTokens', label: 'Tokens [K]' },
        { key: 'model.showMaxTokens', label: 'Max [K/K]' },
        { key: 'model.showDecimals', label: 'Decimals .0' },
      ]},
      { key: 'context', icon: '', label: 'Context', hasProgressBar: true, options: [
        { key: 'context.progressBar.enabled', label: 'Progress Bar' },
        { key: 'context.estimateOverhead', label: 'Est. Overhead' },
      ]},
      { key: 'cost', icon: '', label: 'Cost', options: [
        { key: 'cost.showLabel', label: 'Show Label' },
      ]},
      { key: 'fiveHour', icon: '', label: '5-Hour', hasProgressBar: true, hasSubscriptionPlan: true, options: [
        { key: 'fiveHour.showPercentage', label: 'Percentage %' },
        { key: 'fiveHour.progressBar.enabled', label: 'Progress Bar' },
        { key: 'fiveHour.showTimeLeft', label: 'Time Left' },
        { key: 'fiveHour.showCost', label: 'Show Cost' },
      ]},
      { key: 'weekly', icon: '', label: 'Weekly', hasProgressBar: true, options: [
        { key: 'weekly.progressBar.enabled', label: 'Progress Bar' },
        { key: 'weekly.showTimeLeft', label: 'Time Left' },
      ]},
      { key: 'limits', icon: '', label: 'Limits', hasProgressBar: true, options: [
        { key: 'limits.show5h', label: '5h Limit' },
        { key: 'limits.show7d', label: '7d Limit' },
        { key: 'limits.showOpus', label: 'Opus Limit' },
        { key: 'limits.showSonnet', label: 'Sonnet Limit' },
        { key: 'limits.showResetTime', label: 'Reset Time' },
      ]},
      { key: 'dailySpend', icon: '', label: 'Daily', options: [
        { key: 'dailySpend.showBudget', label: 'Show Budget' },
      ]},
      { key: 'edits', icon: '', label: 'Edits', options: [
        { key: 'edits.showLabel', label: 'Show Label' },
      ]},
    ];
    const GLOBAL_OPTIONS = [
      { key: 'global.showLabels', label: 'Labels' },
      { key: 'global.compactMode', label: 'Compact' },
    ];
    const BAR_STYLES = [
      { value: 'filled', display: '████░░' },
      { value: 'braille', display: '⣿⣿⣿⣀' },
      { value: 'dots', display: '●●●○○' },
      { value: 'line', display: '━━━╌╌' },
      { value: 'blocks', display: '▰▰▰▱▱' },
      { value: 'vertical', display: '▮▮▮▯▯' },
    ];
    const SEPARATORS = [
      { value: '|', display: '|' },
      { value: '-', display: '-' },
      { value: '│', display: '│' },
      { value: '·', display: '·' },
      { value: ' ', display: '␣' },
    ];
    const PATH_STYLES = [
      { value: 'truncated', display: '~/' },
      { value: 'full', display: '/full' },
      { value: 'basename', display: 'name' },
    ];
    const SUBSCRIPTION_PLANS = [
      { value: 'free', display: 'Free', limit: '50K' },
      { value: 'pro', display: 'Pro', limit: '1M' },
      { value: 'max', display: 'Max', limit: '10M' },
    ];
    const BAR_CHARS = {
      filled: { fill: '█', empty: '░' },
      braille: { fill: '⣿', empty: '⣀' },
      dots: { fill: '●', empty: '○' },
      line: { fill: '━', empty: '╌' },
      blocks: { fill: '▰', empty: '▱' },
      vertical: { fill: '▮', empty: '▯' },
    };
`;
