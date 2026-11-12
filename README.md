# swag

The theme packs that cooee and drover share: farm, kitchen and garden, with their sprites, scenes, colour schemes
and the scripts that draw them. A swag is the bundle a drover carries.

This repo was seeded from the two places the art lived (see `SOURCE`). Nothing reads it yet: cooee still uses its own
`packs/themes/` and drover its own `assets/themes/`. Moving both over is
[herdsman#928](https://github.com/jirathip-dev/herdsman/issues/928).

## Layout

| Folder | What it holds | Came from |
|---|---|---|
| `packs/<name>/` | the built packs in cooee's pack format: `theme.json`, `sprites.svg`, `scene.svg`, `icon.png` | cooee `packs/themes/` |
| `schemes/` | colour schemes, one JSON file each | herdsman `assets/schemes/` |
| `legacy-board/<name>/` | the same themes in the older layout herdsman's board reads today, plus `terminal`; goes once drover's page reads `packs/` | herdsman `assets/themes/` |
| `design/<name>/` | the source art and build scripts (`art.mjs`, `build.mjs`, the contrast and sprite gates); `design/bush/` is a mockup only, no pack yet | herdsman `docs/design/`, and branch `design-462` for bush |

The pack format is described in cooee's `docs/themes.md`; drover's in herdsman's `docs/themes.md`. They follow one
contract, so `packs/` and `legacy-board/` are meant to become one folder.

## Still to do

- Point the build scripts in `design/` at this repo's folders (they still write to herdsman's paths).
- One pack format, so `legacy-board/` goes.
- Build the bush pack from `design/bush/` (the mockup from herdsman branch `design-462`; spec in cooee#22). The owner approves the design before the build.
- Run the theme gate (required sprites, contrast) in CI here.
- cooee and drover pin a commit of this repo with a checksum, and their own copies are deleted.
