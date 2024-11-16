pub mod app;

#[cfg(feature = "ssr")]
pub mod fileserv;

#[cfg(feature = "hydrate")]
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate() {
    use crate::app::*;
    console_error_panic_hook::set_once();
    leptos::mount_to_body(App);
}

pub mod security {
    pub mod error_template;
}

pub mod pages {
    pub mod home;

    pub mod projects {
        pub mod aura;
        pub mod berli;
        pub mod picu;
    }

    pub mod blog {
        pub mod auth;
        pub mod ms;
        pub mod orgs;
        pub mod portfolio;
    }
}

pub mod utils {
    pub mod api;
    pub mod config;
    pub mod models;
}

pub mod layouts {
    pub mod clean;
    pub mod layout;

    pub mod components {
        pub mod footer;
        pub mod header;
    }
}

pub mod components {
    pub mod blog {
        pub mod card;
        pub mod post;
    }

    pub mod experience {
        pub mod entry;
    }

    pub mod project {
        pub mod card;
        pub mod post;
        pub mod tech;
    }

    pub mod common {
        pub mod feature;
        pub mod helpful;
        pub mod link;
        pub mod modal;
        pub mod values;
        pub mod working;
    }
}
