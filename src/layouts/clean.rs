use crate::layouts::components::{footer::Footer, header::Header};
use leptos::*;
use leptos_meta::*;

#[component]
pub fn CleanLayout(children: Children) -> impl IntoView {
    provide_meta_context();

    view! {
        <Header/>
        <div class="antialiased bg-[#fafafa]">
            {children()}
        </div>
        <Footer/>
    }
}
