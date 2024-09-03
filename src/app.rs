use crate::security::error_template::{AppError, ErrorTemplate};
use leptos_meta::{provide_meta_context, Link, Meta, Stylesheet, Title};
use leptos::*;
use leptos_router::*;

use crate::pages::blog::{portfolio::Portfolio, cookies::Cookies};
use crate::pages::home::Home;
use crate::pages::projects::{aura::Aura, berli::Berli, picu::Picu, test::Test};

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        // Injects a stylesheet into the document <head>
        // id=leptos means cargo-leptos will hot-reload this stylesheet
        <Stylesheet id="leptos" href="/pkg/portfolio.css"/>
        <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>

        // Sets the document title
        <Title text="Ever Ruiz Diaz"/>

        // Meta
        <Meta name="description" content="Chasing Excellence"/>

        // Facebook Meta Tags
        <Meta property="og:url" content="https://www.everdev.it" />
        <Meta property="og:type" content="website"/>
        <Meta property="og:title" content="Ever Ruiz Diaz"/>
        <Meta property="og:description" content="Chasing Excellence"/>
        <Meta property="og:image" content="https://opengraph.b-cdn.net/production/images/1f770785-fa00-4cee-8f6e-cf8e09db5a15.png?token=PuajrLKhozdYPi5WF8N_txgnTDJtvFJy7WWCJh9Jymo&height=600&width=1200&expires=33261370253"/>

        // Twitter Meta Tags
        <Meta name="twitter:card" content="summary_large_image"/>
        <Meta property="twitter:domain" content="everdev.it"/>
        <Meta property="twitter:url" content="https://www.everdev.it"/>
        <Meta name="twitter:title" content="Ever Ruiz Diaz"/>
        <Meta name="twitter:description" content="Chasing Excellence"/>
        <Meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/1f770785-fa00-4cee-8f6e-cf8e09db5a15.png?token=PuajrLKhozdYPi5WF8N_txgnTDJtvFJy7WWCJh9Jymo&height=600&width=1200&expires=33261370253"/>

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
                    <Route path="/" view=  move || view! { <Home/> }/>
                    // Projects
                    <Route path="/projects/picu" view=  move || view! { <Picu/> }/>
                    <Route path="/projects/aura" view=  move || view! { <Aura/> }/>
                    <Route path="/projects/berli" view=  move || view! { <Berli/> }/>
                    <Route path="/projects/test" view=  move || view! { <Test/> }/>
                    // Blog
                    <Route path="/blog/portfolio" view=  move || view! { <Portfolio/> }/>
                    <Route path="/blog/cookies" view=  move || view! { <Cookies/> }/>
                </Routes>
            </main>
        </Router>
    }
}
