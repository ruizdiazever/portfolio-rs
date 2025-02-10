use crate::security::error_template::{AppError, ErrorTemplate};
use leptos::*;
use leptos_meta::{provide_meta_context, Link, Meta, Stylesheet, Title};
use leptos_router::*;

use crate::pages::blog::ms::Ms;
use crate::pages::blog::{auth::Auth, orgs::State, portfolio::Portfolio};
use crate::pages::home::Home;
use crate::pages::projects::{berli::Berli, picu::Picu, raau::Raau};

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        <!DOCTYPE html>
        <html lang="en">
            <body>
                // Injects a stylesheet into the document <head>
                // id=leptos means cargo-leptos will hot-reload this stylesheet
                <Stylesheet id="leptos" href="/pkg/portfolio.css"/>
                <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>

                // Sets the document title
                <Title text="Ever Ruiz Diaz"/>

                // Meta
                <Meta charset="utf-8"/>
                <Meta name="viewport" content="width=device-width, initial-scale=1"/>
                <Meta name="description" content="Chasing Excellence"/>
                <Meta name="keywords" content="ever, ever ruiz diaz, portfolio, software engineer, rust developer" />
                <Meta name="robots" content="index, follow" />
                <Meta name="googlebot" content="index, follow" />

                // Facebook Meta Tags
                <Meta property="og:url" content="https://www.everdev.it" />
                <Meta property="og:type" content="website"/>
                <Meta property="og:title" content="Ever Ruiz Diaz"/>
                <Meta property="og:description" content="Chasing Excellence"/>
                <Meta property="og:image" content="https://opengraph.b-cdn.net/production/images/14346c08-4465-430f-8474-ea9ffce8fede.png?token=oUjmrdUgBWgksOH-7-6tSte0PNtG5cLcvaLU8UDHR40&height=675&width=1200&expires=33261385714"/>
                <Meta name="og:locale" content="en_EN" />

                // Twitter Meta Tags
                <Meta name="twitter:card" content="summary_large_image"/>
                <Meta property="twitter:domain" content="@EverToujours"/>
                <Meta name="twitter:creator" content="@EverToujours" />
                <Meta property="twitter:url" content="https://x.com/EverToujours"/>
                <Meta name="twitter:title" content="Ever Ruiz Diaz"/>
                <Meta name="twitter:description" content="Chasing Excellence"/>
                <Meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/14346c08-4465-430f-8474-ea9ffce8fede.png?token=oUjmrdUgBWgksOH-7-6tSte0PNtG5cLcvaLU8UDHR40&height=675&width=1200&expires=33261385714"/>

                // Plausible Analytics
                <script defer data-domain="everdev.it" src="https://plausible.berli.app/js/script.js"></script>
            </body>
        </html>

        // Content for this welcome page
        <Router fallback=|| {
            let mut outside_errors = Errors::default();
            outside_errors.insert_with_default_key(AppError::NotFound);
            view! {
                <ErrorTemplate outside_errors/>
            }
            .into_view()
        }>
            <main>
                <Routes>
                    // Home
                    <Route path="/" view=  move || view! { <Home/> }/>
                    // Projects
                    <Route path="/projects/picu-iot" view=  move || view! { <Picu/> }/>
                    <Route path="/projects/raau-design" view=  move || view! { <Raau/> }/>
                    <Route path="/projects/berli-system" view=  move || view! { <Berli/> }/>
                    // Blog
                    <Route path="/blog/portfolio-wasm" view=  move || view! { <Portfolio/> }/>
                    <Route path="/blog/auth-refresh-acess-token" view=  move || view! { <Auth/> }/>
                    <Route path="/blog/organizations-using-rust" view=  move || view! { <State/> }/>
                    <Route path=r#"/blog/hardware/minisforum-ms-01"# view=  move || view! { <Ms/> }/>
                </Routes>
            </main>
        </Router>
    }
}
