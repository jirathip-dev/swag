// The issue's start values (#11, the consumer's palettes today), expanded to swag's 19 tokens by the issue's mapping.
const COLS = ['--bg', '--card', '--line', '--edge', '--fg', '--mute', '--l', '--link', '--g', '--a', '--r', '--p', '--c'];
const ROWS = `
house-dark dark #121212 #1c1c1c #222222 #2e2e2e #ededed #707070 #3ecf8e #60a5fa #3ecf8e #f5c542 #f56565 #a78bfa #818cf8
house-light light #f8f9fa #ffffff #f1f3f5 #e2e5e9 #1c1c1c #6b7280 #059669 #1d4ed8 #059669 #b45309 #dc2626 #7c3aed #4f46e5
tokyonight dark #1a1b26 #16161e #24283b #101014 #a9b1d6 #62677e #9ece6a #7aa2f7 #9ece6a #e0af68 #f7768e #bb9af7 #7dcfff
tokyonight-light light #e6e7ed #d6d8df #c1c2c7 #c1c2c7 #343b59 #707280 #385f0d #2959aa #385f0d #8f5e15 #8c4351 #65359d #006c86
catppuccin-mocha dark #1e1e2e #181825 #313244 #45475a #cdd6f4 #6c7086 #a6e3a1 #89b4fa #a6e3a1 #f9e2af #f38ba8 #cba6f7 #b4befe
catppuccin-latte light #eff1f5 #e6e9ef #ccd0da #bcc0cc #4c4f69 #858896 #40a02b #1e66f5 #40a02b #df8e1d #d20f39 #8839ef #7287fd
nord dark #2e3440 #3b4252 #434c5e #4c566a #eceff4 #d8dee9 #a3be8c #88c0d0 #a3be8c #ebcb8b #bf616a #b48ead #81a1c1
dracula dark #282a36 #282a36 #44475a #6272a4 #f8f8f2 #6272a4 #50fa7b #8be9fd #50fa7b #f1fa8c #ff5555 #bd93f9 #ff79c6
gruvbox-dark dark #282828 #3c3836 #504945 #7c6f64 #ebdbb2 #928374 #b8bb26 #83a598 #b8bb26 #fabd2f #fb4934 #d3869b #83a598
gruvbox-light light #fbf1c7 #ebdbb2 #d5c4a1 #a89984 #3c3836 #928374 #79740e #076678 #79740e #b57614 #9d0006 #8f3f71 #076678
solarized-dark dark #002b36 #073642 #073642 #586e75 #93a1a1 #839496 #859900 #268bd2 #859900 #b58900 #dc322f #6c71c4 #2aa198
solarized-light light #fdf6e3 #eee8d5 #eee8d5 #93a1a1 #506870 #657b83 #859900 #268bd2 #859900 #b58900 #dc322f #6c71c4 #2aa198
rose-pine dark #191724 #1f1d2e #26233a #6e6a86 #e0def4 #908caa #31748f #9ccfd8 #31748f #f6c177 #eb6f92 #c4a7e7 #ebbcba
rose-pine-dawn light #faf4ed #fffaf3 #f2e9e1 #9893a5 #464261 #797593 #286983 #56949f #286983 #ea9d34 #b4637a #907aa9 #d7827e
one-dark dark #282c34 #21252b #333842 #5c6370 #abb2bf #828997 #98c379 #61afef #98c379 #e5c07b #e06c75 #c678dd #56b6c2
github-dark dark #0d1117 #151b23 #262c36 #3d444d #f0f6fc #9198a1 #3fb950 #58a6ff #3fb950 #d29922 #f85149 #d2a8ff #ab7df8
github-light light #ffffff #f6f8fa #eff2f5 #d1d9e0 #25292e #59636e #1a7f37 #0969da #1a7f37 #9a6700 #cf222e #8250df #a475f9`;

export const LABELS = {
  'house-dark': 'House dark', 'house-light': 'House light', tokyonight: 'Tokyo Night', 'tokyonight-light': 'Tokyo Night light',
  'catppuccin-mocha': 'Catppuccin Mocha', 'catppuccin-latte': 'Catppuccin Latte', nord: 'Nord', dracula: 'Dracula',
  'gruvbox-dark': 'Gruvbox dark', 'gruvbox-light': 'Gruvbox light', 'solarized-dark': 'Solarized dark',
  'solarized-light': 'Solarized light', 'rose-pine': 'Rosé Pine', 'rose-pine-dawn': 'Rosé Pine Dawn', 'one-dark': 'One Dark',
  'github-dark': 'GitHub dark', 'github-light': 'GitHub light',
};

export function expand(mode, t, label) {
  return {
    label, 'color-scheme': mode,
    tokens: {
      '--bg': t['--bg'], '--card': t['--card'], '--edge': t['--edge'], '--line': t['--line'], '--scrim': `${t['--bg']}99`,
      '--fg': t['--fg'], '--mute': t['--mute'], '--l': t['--l'], '--link': t['--link'], '--g': t['--g'], '--a': t['--a'],
      '--r': t['--r'], '--p': t['--p'], '--c': t['--c'], '--fk-l': t['--l'], '--fk-p': t['--p'], '--fk-c': t['--c'],
      '--fk-g': t['--g'], '--fk-a': t['--a'],
    },
  };
}

export const START = Object.fromEntries(ROWS.trim().split('\n').map(line => {
  const [name, mode, ...v] = line.split(' ');
  return [name, expand(mode, Object.fromEntries(COLS.map((k, i) => [k, v[i]])), LABELS[name])];
}));
