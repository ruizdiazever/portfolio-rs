use crate::components::common::{working::Working, post::Post};
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Berli() -> impl IntoView {
    // Project
    let id = "468ebc44-4ef0-4e41-8b05-525010becb11".to_string();
    let title = "BERLi System".to_string();
    let subtitle = "Asynchronous enterprise software management".to_string();
    let date = "Jun 18, 2024".to_string();
    let tags_key = "berli";

    view! {
        <Layout>
            <Post title=title subtitle=subtitle tags_key=tags_key date=date id=id>
                <Working/>
            </Post>
        </Layout>
    }
}
