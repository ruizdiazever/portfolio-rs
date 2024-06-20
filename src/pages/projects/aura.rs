use crate::components::common::working::Working;
use crate::components::project::Project;
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Aura() -> impl IntoView {
    // Project
    let title = "Aura Design".to_string();
    let subtitle = "Engineering Design Company".to_string();
    let date = "Jun 20, 2024".to_string();
    let categories = vec![
        "Project".to_string(),
        "Design".to_string(),
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
