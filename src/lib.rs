pub mod app;
pub mod error_template;

#[cfg(feature = "ssr")]
pub mod fileserv;

#[cfg(feature = "hydrate")]
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate() {
    use crate::app::*;
    console_error_panic_hook::set_once();
    leptos::mount_to_body(App);
}

pub mod pages {
    pub mod home;

    pub mod projects {
        pub mod berli;
    }
}

pub mod layouts {
    pub mod layout;

    pub mod components {
        pub mod footer;
        pub mod header;
    }
}

pub mod components {
    pub mod project;

    pub mod home {
        pub mod experience;
        pub mod project_card;
    }

    pub mod common {
        pub mod card;
    }
}
