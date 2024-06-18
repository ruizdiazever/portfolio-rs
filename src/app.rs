use crate::error_template::{AppError, ErrorTemplate};
use leptos::*;
use leptos_meta::*;
use leptos_router::*;

use crate::pages::home::Home;
use crate::pages::projects::berli::Berli;

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        // injects a stylesheet into the document <head>
        // id=leptos means cargo-leptos will hot-reload this stylesheet
        <Stylesheet id="leptos" href="/pkg/portfolio-rs-axum.css"/>
        <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>

        // sets the document title
        <Title text="Ever Ruiz Diaz"/>

        // content for this welcome page
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
                    <Route path="/projects/berli" view=  move || view! { <Berli/> }/>
                </Routes>
            </main>
        </Router>
    }
}
