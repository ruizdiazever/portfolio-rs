use crate::layouts::components::{footer::Footer, header::Header};
use leptos::*;
use leptos_meta::*;

#[component]
pub fn Layout<F, IV>(render_prop: F, children: Children) -> impl IntoView
where
    F: Fn() -> IV,
    IV: IntoView,
{
    provide_meta_context();

    view! {
        <Header/>
        <div class="flex flex-col justify-center mx-auto gap-4 max-w-screen-md px-6 sm:px-6 lg:px-8 antialiased">
            {render_prop()}
            {children()}
        </div>
        <Footer/>
    }
}
