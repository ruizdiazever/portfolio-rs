use crate::error_template::{AppError, ErrorTemplate};
use leptos::*;
use leptos_meta::*;
use leptos_router::*;

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
                    <Route path="/projects/picu" view=  move || view! { <Picu/> }/>
                    <Route path="/projects/aura" view=  move || view! { <Aura/> }/>
                    <Route path="/projects/berli" view=  move || view! { <Berli/> }/>
                    <Route path="/projects/test" view=  move || view! { <Test/> }/>
                </Routes>
            </main>
        </Router>
    }
}
