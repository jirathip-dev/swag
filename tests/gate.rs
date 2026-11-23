use std::path::{Path, PathBuf};

use blocks::theme::{check_pack, gate, Scheme};
use swag::{packs, schemes};

fn root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
}

fn names_in(dir: &Path, strip: &str) -> Vec<String> {
    let mut names: Vec<String> = std::fs::read_dir(dir)
        .unwrap()
        .map(|e| e.unwrap().file_name().to_string_lossy().replace(strip, ""))
        .collect();
    names.sort();
    names
}

fn scheme_files() -> Vec<(String, String)> {
    let dir = root().join("schemes");
    names_in(&dir, "")
        .into_iter()
        .filter(|n| Path::new(n).extension().is_some_and(|e| e == "json"))
        .map(|n| {
            let json = std::fs::read_to_string(dir.join(&n)).unwrap();
            (n, json)
        })
        .collect()
}

fn scheme_misses(json: &str) -> Vec<String> {
    match serde_json::from_str::<Scheme>(json) {
        Err(e) => vec![format!("does not parse: {e}")],
        Ok(s) => gate(&s)
            .into_iter()
            .map(|m| format!("{}: {:.2} < {}", m.what, m.got, m.min))
            .collect(),
    }
}

fn swag_schemes() -> Vec<(&'static str, Scheme)> {
    schemes()
        .iter()
        .map(|(n, json)| (*n, serde_json::from_str(json).unwrap()))
        .collect()
}

fn pack_files(dir: &Path) -> Vec<(String, Vec<u8>)> {
    names_in(dir, "")
        .into_iter()
        .map(|n| {
            let bytes = std::fs::read(dir.join(&n)).unwrap();
            (n, bytes)
        })
        .collect()
}

#[test]
fn schemes_are_the_files_in_schemes_byte_for_byte() {
    let names: Vec<&str> = schemes().iter().map(|(n, _)| *n).collect();
    assert_eq!(names, names_in(&root().join("schemes"), ".json"));
    for (name, json) in schemes() {
        let file = std::fs::read_to_string(root().join(format!("schemes/{name}.json"))).unwrap();
        assert_eq!(*json, file, "{name}");
    }
}

#[test]
fn every_file_in_schemes_parses_and_passes_the_gate() {
    let files = scheme_files();
    let misses: Vec<String> = files
        .iter()
        .flat_map(|(file, json)| {
            scheme_misses(json)
                .into_iter()
                .map(move |m| format!("schemes/{file}: {m}"))
        })
        .collect();
    assert!(misses.is_empty(), "gate misses:\n{}", misses.join("\n"));
}

#[test]
fn a_scheme_that_misses_the_gate_or_does_not_parse_is_caught() {
    let canonical =
        std::fs::read_to_string(root().join("fixtures/schemes/solarized-canonical.json")).unwrap();
    let misses = scheme_misses(&canonical);
    assert!(
        misses.iter().any(|m| m.starts_with("--mute on --bg:")),
        "{misses:?}"
    );
    let misses = scheme_misses(r#"{"label": "x"}"#);
    assert!(
        misses.iter().any(|m| m.starts_with("does not parse")),
        "{misses:?}"
    );
}

#[test]
fn packs_are_the_four_folders_in_packs_byte_for_byte() {
    let names: Vec<&str> = packs().iter().map(|p| p.name).collect();
    assert_eq!(names, ["bush", "farm", "garden", "kitchen"]);
    assert_eq!(names, names_in(&root().join("packs"), ""));
    for p in packs() {
        let names: Vec<&str> = p.files.iter().map(|(n, _)| *n).collect();
        assert_eq!(
            names,
            ["theme.json", "sprites.svg", "scene.svg", "icon.png"]
        );
        for (file, bytes) in p.files {
            assert_eq!(
                *bytes,
                std::fs::read(root().join("packs").join(p.name).join(file)).unwrap(),
                "{file}"
            );
        }
    }
}

#[test]
fn every_pack_passes_check_pack_on_swag_schemes() {
    let given = swag_schemes();
    for p in packs() {
        assert_eq!(
            check_pack(p.files, &given),
            Vec::<String>::new(),
            "{}",
            p.name
        );
    }
}

#[test]
fn a_pack_that_fails_check_pack_is_caught() {
    let files = pack_files(&root().join("fixtures/packs/broken"));
    let files: Vec<(&str, &[u8])> = files
        .iter()
        .map(|(n, b)| (n.as_str(), b.as_slice()))
        .collect();
    let misses = check_pack(&files, &swag_schemes());
    for why in [
        "lacks icon.png",
        "sprites.svg: not an SVG",
        "scheme.dark: \"paper\" is not a dark scheme",
    ] {
        assert!(misses.iter().any(|m| m == why), "{why}: {misses:?}");
    }
}
