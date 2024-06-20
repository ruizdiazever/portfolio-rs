use crate::components::common::working::Working;
use crate::components::project::Project;
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Berli() -> impl IntoView {
    // Project
    let title = "BERLi System".to_string();
    let subtitle = "Asynchronous enterprise software management".to_string();
    let date = "Jun 18, 2024".to_string();

    let categories = vec![
        "Project".to_string(),
        "Rust".to_string(),
        "Astro".to_string(),
    ];

    view! {
        <Layout>
            <Project title=title subtitle=subtitle categories=categories date=date>
                <Working/>
            </Project>
        </Layout>
    }
}
