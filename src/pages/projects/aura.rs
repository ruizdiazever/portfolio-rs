use crate::components::common::{working::Working, post::Post};
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Aura() -> impl IntoView {
    // Project
    let id = "e3399a11-7ce6-4cdc-aba6-7d88d2a412b6".to_string();
    let title = "Aura Design".to_string();
    let subtitle = "Engineering Design Company".to_string();
    let date = "Jun 20, 2024".to_string();
    let tags_key = "aura";

    view! {
        <Layout>
            <Post title=title subtitle=subtitle tags_key=tags_key date=date id=id>
                <Working/>
            </Post>
        </Layout>
    }
}
