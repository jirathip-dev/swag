# swag

The theme package for blocks apps: every colour scheme and every theme pack (farm, kitchen, garden, bush) lives here and
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

The gates run through gatekeeper (pinned in `.gatekeeper/config.toml`): its core and rust packs (line cap, rules,
`drover arch-check`, the dependency list, the pin, actionlint, fmt, clippy with the shared lints, the banned-API
fixtures, `cargo deny`) and swag's own `.gatekeeper/gates/test.toml` (every scheme parses as a blocks scheme and
passes its gate, every pack passes its pack check). The rules are in `.drover/rules.md`; `just check` runs them all,
the same command as CI.

## Layout

| Folder | What it holds | Came from |
|---|---|---|
| `packs/<name>/` | the built packs: `theme.json`, `sprites.svg`, `scene.svg`, `icon.png` | cooee `packs/themes/` (bush from cooee PR #687) |
| `schemes/` | the 14 colour schemes, one JSON file each | blocks `theme/schemes/` at `3e95dbd` |
| `legacy-board/<name>/` | the same themes in the older layout herdsman's board reads today, plus `terminal`; goes once drover's art moves (drover#1344) | herdsman `assets/themes/` |
| `design/<name>/` | the source art and build scripts (`art.mjs`, `build.mjs`, the contrast and sprite gates) | herdsman `docs/design/`; bush from cooee `docs/design/bush/` |

## Still to do

- Run the theme gate in CI: the contrast part is done (`tests/gate.rs` gates every `*.json` in `schemes/` against
  blocks at the `rev` pinned in `Cargo.toml`; `just check` runs it locally); the required-sprites part is still to do.

- Point the build scripts in `design/` at this repo's folders (they still write to herdsman's paths), and have CI
  rebuild the packs from `design/` and compare.
