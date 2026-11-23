## Summary

Decision: all 17 theme palettes pass the blocks gate by changing only the colours that fail, each moved to the nearest passing shade of the theme's own colour; the accent leaves the success green for the theme's signature hue (blue, mauve, purple, frost), as house-dark's approved cyan does.
Screens: one overview of all schemes, and one before/after swatch sheet per scheme (17 themes plus swag's 9 other schemes), each at 1440 and 390 wide.
Open questions: (1) Light themes need their warning, success and cyan darkened a lot because the text twins (`--fk-a`, `--fk-g`, `--fk-c`) follow their base colour, as the issue maps them: keep that, or let the base keep the brighter published colour and darken only the text twin? (2) In rosé-pine-dawn the link moves from foam to iris (foam is too close to pine, the success colour): OK?

Folder: [`docs/design/theme-schemes/`](.) · start with [index](png/index-1440.png).

## Images

| Image | Decision it shows |
|---|---|
| `png/index-1440.png`, `png/index-390.png` | Every theme's start strip next to its proposal, misses before (all fail) and after (all pass), the tokens that change; swag's other 9 schemes pass today with no change, with their tightest contrast and ΔE. |
| `png/<theme>-1440.png`, `png/<theme>-390.png` (17) | Per theme: a live preview and the 13 swatches for the start values and the proposal (changed tokens outlined, the start hex struck), what changes and why, and every gate check's number before and after (fixed cells green, misses red). |
| `png/dracula-*`, `github-dark-*`, `gruvbox-dark-*`, `nord-*`, `solarized-dark-*` | The five schemes swag ships today get a third column, swag's current file, beside the start values and the one proposed palette. `gruvbox-dark.json` replaces `gruvbox.json`. |
| `png/<other>-1440.png`, `png/<other>-390.png` (bush-dark, bush-light, farm, farm-light, garden-dark, garden-light, kitchen, kitchen-light, paper) | Those files' gate numbers: all pass, so no fix is proposed. |

## How the proposals were made

- The rule: only tokens the gate fails change; `--bg`, `--card`, `--line`, `--edge` never change. Where accent equals success (all 17, ΔE 0), the accent changes and success stays, as in house-dark's approved values; the new accent is the theme's own UI accent (the one swag's current file uses, where there is one).
- Each change starts from a colour in the theme's published palette (`palette.mjs`); if that colour still fails, `solve.mjs` moves it to the nearest colour (least ΔE2000 from it, same chroma, small lightness and hue steps) that clears every check naming that token. The "From" column gives that distance.
- `--fk-*` follow `--l`, `--p`, `--c`, `--g`, `--a`, and `--scrim` is `--bg` at 60%, as the issue maps them.
- The numbers are the gate at blocks `d0882093e32c6d752910c459efa04a2a6beb5c3a` (the rev swag pins). `gate.mjs` ports it line for line; `gate-output.txt` is the real Rust gate (`blocks::theme::gate`) run on `proposed/*.json` and on every file in `schemes/`: 31 PASS. Some of the issue's quoted ratios (dracula 1.94 and so on) differ from this gate's; the sheets show the gate's own.
- `proposed/<name>.json` are the 17 scheme files impl copies into `schemes/` after approval.
- Regenerate: `node build.mjs` (data.json and proposed/, exit 1 on any miss), then `node shoot.mjs <chrome-headless-shell>`.

## Every change

| Scheme | Token | Start | Proposed | From | Why |
|---|---|---|---|---|---|
| house-dark | `--mute` | #707070 | #8b8b8b | approved | mute under 4.5:1 |
| house-dark | `--l` | #3ecf8e | #4ce5f6 | approved | accent equals success (ΔE 0) |
| house-light | `--mute` | #6b7280 | #4b5563 | gray-600, one step darker | mute under 4.5:1 on the needs-you card |
| house-light | `--l` | #059669 | #066c88 | cyan, as house-dark, nearest passing (ΔE 2.9 from #0e7490) | accent equals success (ΔE 0); under 4.5:1 |
| house-light | `--g` | #059669 | #047857 | emerald-700, one step darker | success text under 4.5:1 |
| house-light | `--a` | #b45309 | #a16207 | yellow-700 | warning too near danger (ΔE 16) |
| tokyonight | `--mute` | #62677e | #8e92bc | Tokyo Night dark5, nearest passing (ΔE 8.9 from #737aa2) | mute under 4.5:1 |
| tokyonight | `--l` | #9ece6a | #7aa2f7 | Tokyo Night blue | accent equals success (ΔE 0) |
| tokyonight-light | `--mute` | #707280 | #55596d | Tokyo Night light fg-dark, nearest passing (ΔE 0.4 from #565a6e) | mute under 4.5:1 |
| tokyonight-light | `--l` | #385f0d | #2858a9 | Tokyo Night light blue, nearest passing (ΔE 0.3 from #2959aa) | accent equals success (ΔE 0) |
| tokyonight-light | `--c` | #006c86 | #056780 | same cyan, nearest passing (ΔE 1.7 from #006c86) | cyan text under 4.5:1 on card |
| tokyonight-light | `--a` | #8f5e15 | #855403 | same amber, nearest passing (ΔE 3.6 from #8f5e15) | amber text under 4.5:1 on card |
| catppuccin-mocha | `--mute` | #6c7086 | #959ab3 | Catppuccin overlay2, nearest passing (ΔE 0.6 from #9399b2) | mute under 4.5:1 |
| catppuccin-mocha | `--l` | #a6e3a1 | #cba6f7 | Catppuccin mauve (its default accent) | accent equals success (ΔE 0) |
| catppuccin-latte | `--mute` | #858896 | #5a5c72 | Catppuccin subtext0, nearest passing (ΔE 7.1 from #6c6f85) | mute under 4.5:1 |
| catppuccin-latte | `--l` | #40a02b | #762ae3 | Catppuccin mauve (its default accent), nearest passing (ΔE 4.7 from #8839ef) | accent equals success (ΔE 0); under 4.5:1 |
| catppuccin-latte | `--link` | #1e66f5 | #065eeb | same blue, nearest passing (ΔE 3.1 from #1e66f5) | link under 4.5:1 |
| catppuccin-latte | `--g` | #40a02b | #027b01 | same green, nearest passing (ΔE 13.8 from #40a02b) | success under 3:1 |
| catppuccin-latte | `--a` | #df8e1d | #9a5a01 | same yellow, nearest passing (ΔE 20.5 from #df8e1d) | warning under 3:1 |
| catppuccin-latte | `--p` | #8839ef | #8738ee | same mauve, nearest passing (ΔE 0.3 from #8839ef) | mauve text under 4.5:1 on card |
| catppuccin-latte | `--c` | #7287fd | #3f61d0 | same lavender, nearest passing (ΔE 15.2 from #7287fd) | lavender text under 4.5:1 |
| nord | `--l` | #a3be8c | #88c0d0 | Nord frost nord8 (swag nord today) | accent equals success (ΔE 0); too near warning |
| nord | `--g` | #a3be8c | #9ccc8c | swag nord today | success too near warning (ΔE 18.8) |
| nord | `--r` | #bf616a | #d07077 | same aurora red, nearest passing (ΔE 5.4 from #bf616a) | danger under 3:1 on card |
| nord | `--p` | #b48ead | #c8a2c2 | same aurora purple, nearest passing (ΔE 6.0 from #b48ead) | purple text under 4.5:1 |
| nord | `--c` | #81a1c1 | #90b1d1 | same frost nord9, nearest passing (ΔE 4.7 from #81a1c1) | frost text under 4.5:1 on card |
| dracula | `--mute` | #6272a4 | #919dd3 | Dracula comment, nearest passing (ΔE 15.6 from #6272a4) | mute under 4.5:1 |
| dracula | `--l` | #50fa7b | #bd93f9 | Dracula purple (swag dracula today) | accent equals success (ΔE 0) |
| gruvbox-dark | `--mute` | #928374 | #aea08b | Gruvbox fg4, nearest passing (ΔE 2.2 from #a89984) | mute under 4.5:1 |
| gruvbox-dark | `--l` | #b8bb26 | #86a99c | Gruvbox blue (swag gruvbox today), nearest passing (ΔE 1.2 from #83a598) | accent equals success (ΔE 0); too near warning |
| gruvbox-dark | `--link` | #83a598 | #86a99c | same blue, nearest passing (ΔE 1.2 from #83a598) | link under 4.5:1 on card |
| gruvbox-dark | `--g` | #b8bb26 | #b4d284 | Gruvbox aqua, nearest passing (ΔE 7.3 from #8ec07c) | success too near warning (ΔE 17.2) |
| gruvbox-dark | `--p` | #d3869b | #d98ba0 | same purple, nearest passing (ΔE 1.6 from #d3869b) | purple text under 4.5:1 on card |
| gruvbox-dark | `--c` | #83a598 | #86a99c | same blue, nearest passing (ΔE 1.2 from #83a598) | blue text under 4.5:1 on card |
| gruvbox-light | `--mute` | #928374 | #64594d | Gruvbox fg4, nearest passing (ΔE 8.5 from #7c6f64) | mute under 4.5:1 |
| gruvbox-light | `--l` | #79740e | #026476 | Gruvbox faded blue, nearest passing (ΔE 0.7 from #076678) | accent equals success (ΔE 0); under 4.5:1 |
| gruvbox-light | `--g` | #79740e | #676402 | same faded green, nearest passing (ΔE 6.2 from #79740e) | success text under 4.5:1 |
| gruvbox-light | `--a` | #b57614 | #905202 | same faded yellow, nearest passing (ΔE 14.2 from #b57614) | warning under 3:1 on card |
| solarized-dark | `--mute` | #839496 | #8b9b9e | Solarized base0, nearest passing (ΔE 2.5 from #839496) | mute under 4.5:1 on card |
| solarized-dark | `--l` | #859900 | #419ee8 | Solarized blue (swag solarized today), nearest passing (ΔE 6.4 from #268bd2) | accent equals success (ΔE 0); under 4.5:1 on card |
| solarized-dark | `--link` | #268bd2 | #419ee8 | same blue, nearest passing (ΔE 6.4 from #268bd2) | link under 4.5:1 |
| solarized-dark | `--g` | #859900 | #87a322 | same green, nearest passing (ΔE 3.7 from #859900) | success text under 4.5:1 on card |
| solarized-dark | `--a` | #b58900 | #bf9118 | same yellow, nearest passing (ΔE 2.8 from #b58900) | warning text under 4.5:1 on card |
| solarized-dark | `--r` | #dc322f | #e23935 | same red, nearest passing (ΔE 2.0 from #dc322f) | danger under 3:1 on card |
| solarized-dark | `--p` | #6c71c4 | #8d90e7 | same violet, nearest passing (ΔE 11.2 from #6c71c4) | violet text under 4.5:1 |
| solarized-dark | `--c` | #2aa198 | #35a9a0 | same cyan, nearest passing (ΔE 2.5 from #2aa198) | cyan text under 4.5:1 on card |
| solarized-light | `--fg` | #506870 | #4e666e | same, nearest passing (ΔE 0.7 from #506870) | text under 4.5:1 on the needs-you card |
| solarized-light | `--mute` | #657b83 | #52666f | Solarized base00, nearest passing (ΔE 8.0 from #657b83) | mute under 4.5:1 |
| solarized-light | `--l` | #859900 | #0268a0 | Solarized blue, nearest passing (ΔE 13.8 from #268bd2) | accent equals success (ΔE 0); under 4.5:1 |
| solarized-light | `--link` | #268bd2 | #046dae | same blue, nearest passing (ΔE 11.6 from #268bd2) | link under 4.5:1 |
| solarized-light | `--g` | #859900 | #5f7000 | same green, nearest passing (ΔE 15.7 from #859900) | success under 3:1 |
| solarized-light | `--a` | #b58900 | #8d6006 | same yellow, nearest passing (ΔE 16.3 from #b58900) | warning under 3:1 |
| solarized-light | `--p` | #6c71c4 | #5b61b2 | same violet, nearest passing (ΔE 6.3 from #6c71c4) | violet text under 4.5:1 |
| solarized-light | `--c` | #2aa198 | #00766c | same cyan, nearest passing (ΔE 15.7 from #2aa198) | cyan text under 4.5:1 |
| rose-pine | `--mute` | #908caa | #928eac | Rosé Pine subtle, nearest passing (ΔE 0.7 from #908caa) | mute under 4.5:1 on the needs-you card |
| rose-pine | `--l` | #31748f | #c4a7e7 | Rosé Pine iris | accent equals success (ΔE 0); under 4.5:1 |
| rose-pine | `--g` | #31748f | #4b8ea9 | same pine, nearest passing (ΔE 10.0 from #31748f) | success text under 4.5:1 |
| rose-pine-dawn | `--mute` | #797593 | #64627f | Rosé Pine Dawn subtle, nearest passing (ΔE 7.6 from #797593) | mute under 4.5:1 |
| rose-pine-dawn | `--l` | #286983 | #6d5d8b | Rosé Pine Dawn iris, nearest passing (ΔE 12.1 from #907aa9) | accent equals success (ΔE 0) |
| rose-pine-dawn | `--link` | #56949f | #766999 | Rosé Pine Dawn iris, nearest passing (ΔE 7.9 from #907aa9) | link under 4.5:1; too near success (ΔE 17.6) |
| rose-pine-dawn | `--a` | #ea9d34 | #a16202 | same gold, nearest passing (ΔE 21.0 from #ea9d34) | warning under 3:1 |
| rose-pine-dawn | `--p` | #907aa9 | #7b6897 | same iris, nearest passing (ΔE 7.4 from #907aa9) | iris text under 4.5:1 |
| rose-pine-dawn | `--c` | #d7827e | #a95959 | same rose, nearest passing (ΔE 15.0 from #d7827e) | rose text under 4.5:1 |
| one-dark | `--mute` | #828997 | #9aa3b1 | same grey, nearest passing (ΔE 8.4 from #828997) | mute under 4.5:1 |
| one-dark | `--l` | #98c379 | #61afef | One Dark blue | accent equals success (ΔE 0) |
| github-dark | `--l` | #3fb950 | #58a6ff | GitHub accent blue (swag github-dark today) | accent equals success (ΔE 0) |
| github-light | `--l` | #1a7f37 | #0162d0 | GitHub accent blue, nearest passing (ΔE 2.7 from #0969da) | accent equals success (ΔE 0) |
| github-light | `--c` | #a475f9 | #8956d7 | same purple, nearest passing (ΔE 11.0 from #a475f9) | purple text under 4.5:1 |
