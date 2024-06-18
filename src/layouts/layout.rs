use crate::layouts::components::{footer::Footer, header::Header};
use leptos::*;
use leptos_meta::*;

#[component]
pub fn Layout(children: Children) -> impl IntoView {
    provide_meta_context();

    view! {
        <Header/>
        <div class="flex flex-col justify-center mx-auto gap-4 max-w-screen-md px-6 sm:px-6 lg:px-8 antialiased">
            {children()}
        </div>
        <Footer/>
    }
}
