use crate::components::common::working::Working;
use crate::components::project::project::Project;
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Portfolio() -> impl IntoView {
    // Project
    let id = "9a5f3584-5a8a-4c22-8460-2d775d54d89b".to_string();
    let title = "Portfolio WASM".to_string();
    let subtitle = "Portfolio WASM powered by Rust with Leptos".to_string();
    let date = "Aug 31, 2024".to_string();
    let tags_key = "portfolio";

    view! {
        <Layout>
            <Project title=title subtitle=subtitle tags_key=tags_key date=date id=id>
                <Working/>
            </Project>
        </Layout>
    }
}
