// Per scheme, the tokens that change and the colour each starts from: [colour, where it comes from, why]. Only tokens
// the gate fails at the start values appear; solve.mjs steps a pick's lightness when the pick alone still misses.
const ACC = 'accent equals success (ΔE 0)';
export const PICKS = {
  'house-dark': {
    '--mute': ['#8b8b8b', 'approved', 'mute under 4.5:1'],
    '--l': ['#4ce5f6', 'approved', ACC],
  },
  'house-light': {
    '--mute': ['#4b5563', 'gray-600, one step darker', 'mute under 4.5:1 on the needs-you card'],
    '--l': ['#0e7490', 'cyan, as house-dark', `${ACC}; under 4.5:1`],
    '--g': ['#047857', 'emerald-700, one step darker', 'success text under 4.5:1'],
    '--a': ['#a16207', 'yellow-700', 'warning too near danger (ΔE 16)'],
  },
  tokyonight: {
    '--mute': ['#737aa2', 'Tokyo Night dark5', 'mute under 4.5:1'],
    '--l': ['#7aa2f7', 'Tokyo Night blue', ACC],
  },
  'tokyonight-light': {
    '--mute': ['#565a6e', 'Tokyo Night light fg-dark', 'mute under 4.5:1'],
    '--l': ['#2959aa', 'Tokyo Night light blue', ACC],
    '--c': ['#006c86', 'same cyan', 'cyan text under 4.5:1 on card'],
    '--a': ['#8f5e15', 'same amber', 'amber text under 4.5:1 on card'],
  },
  'catppuccin-mocha': {
    '--mute': ['#9399b2', 'Catppuccin overlay2', 'mute under 4.5:1'],
    '--l': ['#cba6f7', 'Catppuccin mauve (its default accent)', ACC],
  },
  'catppuccin-latte': {
    '--mute': ['#6c6f85', 'Catppuccin subtext0', 'mute under 4.5:1'],
    '--l': ['#8839ef', 'Catppuccin mauve (its default accent)', `${ACC}; under 4.5:1`],
    '--link': ['#1e66f5', 'same blue', 'link under 4.5:1'],
    '--g': ['#40a02b', 'same green', 'success under 3:1'],
    '--a': ['#df8e1d', 'same yellow', 'warning under 3:1'],
    '--p': ['#8839ef', 'same mauve', 'mauve text under 4.5:1 on card'],
    '--c': ['#7287fd', 'same lavender', 'lavender text under 4.5:1'],
  },
  nord: {
    '--l': ['#88c0d0', 'Nord frost nord8 (swag nord today)', `${ACC}; too near warning`],
    '--g': ['#9ccc8c', 'swag nord today', 'success too near warning (ΔE 18.8)'],
    '--r': ['#bf616a', 'same aurora red', 'danger under 3:1 on card'],
    '--p': ['#b48ead', 'same aurora purple', 'purple text under 4.5:1'],
    '--c': ['#81a1c1', 'same frost nord9', 'frost text under 4.5:1 on card'],
  },
  dracula: {
    '--mute': ['#6272a4', 'Dracula comment', 'mute under 4.5:1'],
    '--l': ['#bd93f9', 'Dracula purple (swag dracula today)', ACC],
  },
  'gruvbox-dark': {
    '--mute': ['#a89984', 'Gruvbox fg4', 'mute under 4.5:1'],
    '--l': ['#83a598', 'Gruvbox blue (swag gruvbox today)', `${ACC}; too near warning`],
    '--link': ['#83a598', 'same blue', 'link under 4.5:1 on card'],
    '--g': ['#8ec07c', 'Gruvbox aqua', 'success too near warning (ΔE 17.2)'],
    '--p': ['#d3869b', 'same purple', 'purple text under 4.5:1 on card'],
    '--c': ['#83a598', 'same blue', 'blue text under 4.5:1 on card'],
  },
  'gruvbox-light': {
    '--mute': ['#7c6f64', 'Gruvbox fg4', 'mute under 4.5:1'],
    '--l': ['#076678', 'Gruvbox faded blue', `${ACC}; under 4.5:1`],
    '--g': ['#79740e', 'same faded green', 'success text under 4.5:1'],
    '--a': ['#b57614', 'same faded yellow', 'warning under 3:1 on card'],
  },
  'solarized-dark': {
    '--mute': ['#839496', 'Solarized base0', 'mute under 4.5:1 on card'],
    '--l': ['#268bd2', 'Solarized blue (swag solarized today)', `${ACC}; under 4.5:1 on card`],
    '--link': ['#268bd2', 'same blue', 'link under 4.5:1'],
    '--g': ['#859900', 'same green', 'success text under 4.5:1 on card'],
    '--a': ['#b58900', 'same yellow', 'warning text under 4.5:1 on card'],
    '--r': ['#dc322f', 'same red', 'danger under 3:1 on card'],
    '--p': ['#6c71c4', 'same violet', 'violet text under 4.5:1'],
    '--c': ['#2aa198', 'same cyan', 'cyan text under 4.5:1 on card'],
  },
  'solarized-light': {
    '--fg': ['#506870', 'same', 'text under 4.5:1 on the needs-you card'],
    '--mute': ['#657b83', 'Solarized base00', 'mute under 4.5:1'],
    '--l': ['#268bd2', 'Solarized blue', `${ACC}; under 4.5:1`],
    '--link': ['#268bd2', 'same blue', 'link under 4.5:1'],
    '--g': ['#859900', 'same green', 'success under 3:1'],
    '--a': ['#b58900', 'same yellow', 'warning under 3:1'],
    '--p': ['#6c71c4', 'same violet', 'violet text under 4.5:1'],
    '--c': ['#2aa198', 'same cyan', 'cyan text under 4.5:1'],
  },
  'rose-pine': {
    '--mute': ['#908caa', 'Rosé Pine subtle', 'mute under 4.5:1 on the needs-you card'],
    '--l': ['#c4a7e7', 'Rosé Pine iris', `${ACC}; under 4.5:1`],
    '--g': ['#31748f', 'same pine', 'success text under 4.5:1'],
  },
  'rose-pine-dawn': {
    '--mute': ['#797593', 'Rosé Pine Dawn subtle', 'mute under 4.5:1'],
    '--l': ['#907aa9', 'Rosé Pine Dawn iris', ACC],
    '--link': ['#907aa9', 'Rosé Pine Dawn iris', 'link under 4.5:1; too near success (ΔE 17.6)'],
    '--a': ['#ea9d34', 'same gold', 'warning under 3:1'],
    '--p': ['#907aa9', 'same iris', 'iris text under 4.5:1'],
    '--c': ['#d7827e', 'same rose', 'rose text under 4.5:1'],
  },
  'one-dark': {
    '--mute': ['#828997', 'same grey', 'mute under 4.5:1'],
    '--l': ['#61afef', 'One Dark blue', ACC],
  },
  'github-dark': {
    '--l': ['#58a6ff', 'GitHub accent blue (swag github-dark today)', ACC],
  },
  'github-light': {
    '--l': ['#0969da', 'GitHub accent blue', ACC],
    '--c': ['#a475f9', 'same purple', 'purple text under 4.5:1'],
  },
};
