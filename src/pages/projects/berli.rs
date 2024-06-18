use crate::components::common::card::TechList;
use crate::components::project::Project;
use crate::layouts::layout::Layout;
use leptos::*;

#[component]
pub fn Berli() -> impl IntoView {
    // Project
    let title = "BERLi System Project".to_string();
    let subtitle = "A cutting-edge IoT platform".to_string();
    let category = "Project".to_string();
    let date = "Jun 18, 2024".to_string();

    // BERLi
    let intro_1 = "Picu was born out of my desire to master Rust and learn in parallel about embedded systems and IoT.";
    let intro_2 = "I've decided to leverage the most cutting-edge technology for designing interfaces, infrastructure, and backend systems!";

    view! {
        <Layout>
            <Project title=title subtitle=subtitle category=category date=date>
                <h1 class="text-2xl text-gray-800">The reason</h1>
                <article class="text-gray-800 space-y-3 ">
                    <p>{intro_1}</p>
                    <p>{intro_2}</p>
                </article>

                <h1 class="text-2xl text-gray-800">Architecture</h1>
                <img
                    class="h-8 w-auto rounded-full"
                    src="public/images/picu_arch.webp"
                    alt="Architecture"
                    width="64"
                    height="64"
                    href="/"
                />

                <h1 class="text-2xl text-gray-800">Stack</h1>
                <TechList/>
            </Project>
        </Layout>
    }
}
