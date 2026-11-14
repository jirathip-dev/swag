# swag

The theme packs that cooee and drover share: farm, kitchen and garden, with their sprites, scenes, colour schemes
and the scripts that draw them. A swag is the bundle a drover carries.

This repo was seeded from the two places the art lived (see `SOURCE`). Drover vendors `legacy-board/` at a pinned
commit of this repo with a `SHA256SUMS` (herdsman#928); cooee's `packs/themes/` moves over next.

## Layout

| Folder | What it holds | Came from |
|---|---|---|
| `packs/<name>/` | the built packs in cooee's pack format: `theme.json`, `sprites.svg`, `scene.svg`, `icon.png` | cooee `packs/themes/` |
| `schemes/` | colour schemes, one JSON file each | herdsman `assets/schemes/` |
| `legacy-board/<name>/` | the same themes in the layout drover's page reads today (drover keeps `terminal` built in); goes once drover's page reads `packs/` | herdsman `assets/themes/` |
| `design/<name>/` | the source art and build scripts (`art.mjs`, `build.mjs`; `design/theme-370/` adds the row-sprite loops); `design/bush/` is a mockup only, no pack yet | herdsman `docs/design/`, and branch `design-462` for bush |

The pack format is described in cooee's `docs/themes.md`; drover's in herdsman's `docs/themes.md`. They follow one
contract, so `packs/` and `legacy-board/` are meant to become one folder.

## Building and the gate

Run from the repo root: `node design/garden/build.mjs` and `node design/kitchen/build.mjs` write `legacy-board/<name>/`
(garden also `schemes/`). Farm's and the kitchen's row-sprite loops come from `node design/theme-370/build.mjs`, which
writes `design/theme-370/proposed/` to copy over; `python3 design/farm-v2/make_sprites.py` draws the farm-v2 sheet. `node gate.mjs` is the theme gate CI
runs on every PR: each scheme passes the board's contrast gate, and every sprite a theme names is in its `sprites.svg`.
The mockup pages (`index.html`, `sheet.html`) link drover's board CSS, so they render fully only from a drover checkout.

## Still to do

- One pack format, so `legacy-board/` goes.
- Build the bush pack from `design/bush/` (the mockup from herdsman branch `design-462`; spec in cooee#22). The owner approves the design before the build.
- cooee pins a commit of this repo with a checksum, and its own copy is deleted.
