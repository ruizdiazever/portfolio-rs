use crate::components::common::link::LinkSimple;
use leptos::*;

pub enum Link {
    Rust,
    Axum,
    Actix,
    Tokio,
    SQLx,
    GraphQL,
    Argon2,
    Vercel,
    Spacex,
    Nothing,
    Apple,
    Leptos,
    Guille,
}

impl Link {
    pub fn to_view(&self) -> impl IntoView {
        match self {
            Link::Guille => view! {
                <LinkSimple title="Guillermo Rauch".to_string()
                    link="https://rauchg.com/about".to_string()
                    blank=true
                />
            },
            Link::Rust => view! {
                <LinkSimple title="Rust".to_string()
                    link="https://www.rust-lang.org/".to_string()
                    blank=true
                />
            },
            Link::Leptos => view! {
                <LinkSimple title="Leptos".to_string()
                    link="https://www.leptos.dev/".to_string()
                    blank=true
                />
            },
            Link::Axum => view! {
                <LinkSimple title="Axum".to_string()
                    link="https://github.com/tokio-rs/axum".to_string()
                    blank=true
                />
            },
            Link::Actix => view! {
                <LinkSimple title="Actix".to_string()
                    link="https://actix.rs/".to_string()
                    blank=true
                />
            },
            Link::Tokio => view! {
                <LinkSimple title="Tokio".to_string()
                    link="https://tokio.rs/".to_string()
                    blank=true
                />
            },
            Link::SQLx => view! {
                <LinkSimple title="SQLx".to_string()
                    link="https://crates.io/crates/sqlx".to_string()
                    blank=true
                />
            },
            Link::GraphQL => view! {
                <LinkSimple title="async-graphql".to_string()
                    link="https://crates.io/crates/async-graphql".to_string()
                    blank=true
                />
            },
            Link::Argon2 => view! {
                <LinkSimple title="Argon2".to_string()
                    link="https://en.wikipedia.org/wiki/Argon2".to_string()
                    blank=true
                />
            },
            Link::Vercel => view! {
                <LinkSimple title="Vercel".to_string()
                    link="https://vercel.com/home".to_string()
                    blank=true
                />
            },
            Link::Spacex => view! {
                <LinkSimple title="SpaceX".to_string()
                    link="https://www.spacex.com/".to_string()
                    blank=true
                />
            },
            Link::Nothing => view! {
                <LinkSimple title="Nothing".to_string()
                    link="https://us.nothing.tech/".to_string()
                    blank=true
                />
            },
            Link::Apple => view! {
                <LinkSimple title="Apple".to_string()
                    link="https://developer.apple.com/design/human-interface-guidelines/".to_string()
                    blank=true
                />
            },
        }
    }
}
