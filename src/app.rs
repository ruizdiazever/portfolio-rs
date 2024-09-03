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
        <Meta name="keywords" content="ever, ever ruiz diaz, portfolio, software engineer, rust developer" />
        <Meta name="robots" content="index, follow" />
        <Meta name="googlebot" content="index, follow" />

        // Facebook Meta Tags
        <Meta property="og:url" content="https://www.everdev.it" />
        <Meta property="og:type" content="website"/>
        <Meta property="og:title" content="Ever Ruiz Diaz"/>
        <Meta property="og:description" content="Chasing Excellence"/>
        <Meta property="og:image" content="https://opengraph.b-cdn.net/production/images/40f75584-ba7a-4758-8967-d4fd954610d5.png?token=Rr1vGmijXX3aSifP6RqrN6rqcmO00fyd6HzkJ7BXBFs&height=675&width=1200&expires=33261379943"/>
        <Meta name="og:locale" content="en_EN" />

        // Twitter Meta Tags
        <Meta name="twitter:card" content="summary_large_image"/>
        <Meta property="twitter:domain" content="@EverToujours"/>
        <Meta name="twitter:creator" content="@EverToujours" />
        <Meta property="twitter:url" content="https://x.com/EverToujours"/>
        <Meta name="twitter:title" content="Ever Ruiz Diaz"/>
        <Meta name="twitter:description" content="Chasing Excellence"/>
        <Meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/40f75584-ba7a-4758-8967-d4fd954610d5.png?token=Rr1vGmijXX3aSifP6RqrN6rqcmO00fyd6HzkJ7BXBFs&height=675&width=1200&expires=33261379943"/>

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
