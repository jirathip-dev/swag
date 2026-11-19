# swag

The theme package for blocks apps: every colour scheme and every theme pack (farm, kitchen, garden) lives here and
nowhere else. blocks holds the rules (the scheme type, the contrast gate, the pack check); swag holds the looks. A
swag is the bundle a drover carries.

## The crate

`swag` is a Rust crate with its data compiled in and no runtime dependency:

- `swag::schemes()`: each scheme's name and its JSON text, from `schemes/`
- `swag::packs()`: each pack's name and its files as bytes (`theme.json`, `sprites.svg`, `scene.svg`, `icon.png`),
  from `packs/`

It hands out names, text and bytes, never blocks' types, so an app parses them with the blocks it already pins.

## Pinning it

An app's server pins swag beside blocks, each by `rev`:

```toml
[dependencies]
blocks = { git = "https://github.com/jirathip-dev/blocks", rev = "<sha>" }
swag = { git = "https://github.com/jirathip-dev/swag", rev = "<sha>" }
```

blocks is only a dev-dependency here (for the gate tests), so the two pins can never clash.

## A new look

A new or changed scheme or pack is a design-first PR in this repo: the design is approved first, then the files land
here and CI checks them with blocks' gate. No blocks change is needed.

## Gates

CI's `gates` job runs fmt, clippy (pedantic, with unwrap, expect, panic, todo, dbg, prints, indexing and `as` casts
denied), the lint fixtures in `ci/lint-fixtures/`, the tests (every scheme parses as a blocks scheme and passes its
gate, every pack passes its pack check), `cargo deny`, `drover arch-check`, the line cap and actionlint. The rules
are in `.drover/rules.md`; `just check` runs them all.

## Layout

| Folder | What it holds | Came from |
|---|---|---|
| `packs/<name>/` | the built packs: `theme.json`, `sprites.svg`, `scene.svg`, `icon.png` | cooee `packs/themes/` |
| `schemes/` | the 12 colour schemes, one JSON file each | blocks `theme/schemes/` at `3e95dbd` |
| `legacy-board/<name>/` | the same themes in the older layout herdsman's board reads today, plus `terminal`; goes once drover's art moves (drover#1344) | herdsman `assets/themes/` |
| `design/<name>/` | the source art and build scripts (`art.mjs`, `build.mjs`, the contrast and sprite gates); `design/bush/` is a mockup only, no pack yet | herdsman `docs/design/`, and branch `design-462` for bush |

## Still to do

- Point the build scripts in `design/` at this repo's folders (they still write to herdsman's paths), and have CI
  rebuild the packs from `design/` and compare.
- Build the bush pack from `design/bush/` (spec in cooee#22). The owner approves the design before the build.
