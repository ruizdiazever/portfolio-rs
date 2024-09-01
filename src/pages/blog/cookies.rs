use crate::components::common::working::Working;
use crate::components::project::project::Project;
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Portfolio() -> impl IntoView {
    // Project
    let id = "f7583be4-ebf7-48a9-928d-5a058f0aabd9".to_string();
    let title = "Refresh/access token with Rust".to_string();
    let subtitle = "Auth security with Axum, GraphQL and Rust".to_string();
    let date = "Aug 31, 2024".to_string();
    let tags_key = "cookies";

    view! {
        <Layout>
            <Project title=title subtitle=subtitle tags_key=tags_key date=date id=id>
                <Working/>
            </Project>
        </Layout>
    }
}
