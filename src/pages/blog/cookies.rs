use crate::components::common::{working::Working, post::Post};
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Cookies() -> impl IntoView {
    // Project
    let id = "f7583be4-ebf7-48a9-928d-5a058f0aabd9".to_string();
    let title = "Secure auth with Rust";
    let subtitle = "Refresh/access token with Axum and async-graphql";
    let date = "Aug 31, 2024";
    let tags_key = "cookies";
    let min = "0";

    view! {
        <Layout>
            <Post title=title subtitle=subtitle tags_key=tags_key date=date id=id min=min>
                <Working/>
            </Post>
        </Layout>
    }
}
