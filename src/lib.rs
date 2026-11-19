macro_rules! scheme {
    ($name:literal) => {
        ($name, include_str!(concat!("../schemes/", $name, ".json")))
    };
}

macro_rules! pack {
    ($name:literal) => {
        Pack {
            name: $name,
            files: &[
                pack!(@file $name, "theme.json"),
                pack!(@file $name, "sprites.svg"),
                pack!(@file $name, "scene.svg"),
                pack!(@file $name, "icon.png"),
            ],
        }
    };
    (@file $name:literal, $file:literal) => {
        ($file, include_bytes!(concat!("../packs/", $name, "/", $file)))
    };
}

/// A theme pack: its name and its files by name, compiled in.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Pack {
    pub name: &'static str,
    pub files: &'static [(&'static str, &'static [u8])],
}

/// Every colour scheme: its name and its JSON text.
pub fn schemes() -> &'static [(&'static str, &'static str)] {
    const SCHEMES: [(&str, &str); 12] = [
        scheme!("dracula"),
        scheme!("farm"),
        scheme!("farm-light"),
        scheme!("garden-dark"),
        scheme!("garden-light"),
        scheme!("github-dark"),
        scheme!("gruvbox"),
        scheme!("kitchen"),
        scheme!("kitchen-light"),
        scheme!("nord"),
        scheme!("paper"),
        scheme!("solarized-dark"),
    ];
    &SCHEMES
}

/// Every theme pack.
pub fn packs() -> &'static [Pack] {
    const PACKS: [Pack; 3] = [pack!("farm"), pack!("garden"), pack!("kitchen")];
    &PACKS
}
