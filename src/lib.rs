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
    const SCHEMES: [(&str, &str); 26] = [
        scheme!("bush-dark"),
        scheme!("bush-light"),
        scheme!("catppuccin-latte"),
        scheme!("catppuccin-mocha"),
        scheme!("dracula"),
        scheme!("farm"),
        scheme!("farm-light"),
        scheme!("garden-dark"),
        scheme!("garden-light"),
        scheme!("github-dark"),
        scheme!("github-light"),
        scheme!("gruvbox-dark"),
        scheme!("gruvbox-light"),
        scheme!("house-dark"),
        scheme!("house-light"),
        scheme!("kitchen"),
        scheme!("kitchen-light"),
        scheme!("nord"),
        scheme!("one-dark"),
        scheme!("paper"),
        scheme!("rose-pine"),
        scheme!("rose-pine-dawn"),
        scheme!("solarized-dark"),
        scheme!("solarized-light"),
        scheme!("tokyonight"),
        scheme!("tokyonight-light"),
    ];
    &SCHEMES
}

/// Every theme pack.
pub fn packs() -> &'static [Pack] {
    const PACKS: [Pack; 4] = [
        pack!("bush"),
        pack!("farm"),
        pack!("garden"),
        pack!("kitchen"),
    ];
    &PACKS
}
