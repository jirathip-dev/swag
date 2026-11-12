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
| `drover-themes/<name>/` | the same themes as drover's page reads them today, plus `terminal` | herdsman `assets/themes/` |
| `design/<name>/` | the source art and build scripts (`art.mjs`, `build.mjs`, the contrast and sprite gates) | herdsman `docs/design/` |

The pack format is described in cooee's `docs/themes.md`; drover's in herdsman's `docs/themes.md`. They follow one
contract, so `packs/` and `drover-themes/` are meant to become one folder.

## Still to do

- Point the build scripts in `design/` at this repo's folders (they still write to herdsman's paths).
- One pack format, so `drover-themes/` goes.
- Run the theme gate (required sprites, contrast) in CI here.
- cooee and drover pin a commit of this repo with a checksum, and their own copies are deleted.
