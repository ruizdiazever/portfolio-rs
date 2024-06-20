use crate::components::common::values::Icon;
use crate::components::home::{experience::Experience, project_card::Project};
use crate::layouts::layout::Layout;
use leptos::*;

const DESCRIPTION: &str =
    "I'm Ever, a software developer based in Italy with +3 years of experience.";

const SUB_DESCRIPTION: &str = "I'm passionate about science, state-of-the-art tech, design
and development.";

#[component]
pub fn Home() -> impl IntoView {
    // Icons
    let picu_icons = vec![
        Icon::Rust.to_view(),
        Icon::PostgreSQL.to_view(),
        Icon::Svelte.to_view(),
        Icon::Astro.to_view(),
        Icon::Flutter.to_view(),
        Icon::TailwindCSS.to_view(),
        Icon::InfluxDB.to_view(),
        Icon::Grafana.to_view(),
    ];

    let aura_icons = vec![
        Icon::Rust.to_view(),
        Icon::PostgreSQL.to_view(),
        Icon::Astro.to_view(),
        Icon::Svelte.to_view(),
        Icon::TailwindCSS.to_view(),
        Icon::InfluxDB.to_view(),
        Icon::Grafana.to_view(),
        Icon::Docker.to_view(),
    ];

    let berli_icons = vec![
        Icon::Rust.to_view(),
        Icon::PostgreSQL.to_view(),
        Icon::Svelte.to_view(),
        Icon::Astro.to_view(),
        Icon::TailwindCSS.to_view(),
        Icon::InfluxDB.to_view(),
        Icon::Grafana.to_view(),
        Icon::Docker.to_view(),
    ];

    view! {
        <Layout>
            // Childrens
            <p class="text-gray-600 text-lg text-left">
                {DESCRIPTION}
                <br/>
                {SUB_DESCRIPTION}
            </p>
            <h1 class="text-2xl mt-6">Projects</h1>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2 place-items-center">
                <Project
                    github=false
                    title="Picu".to_string()
                    description="Async Software Managment".to_string()
                    url="/projects/picu".to_string()
                    repository="https://github.com/ruizdiazever/portfolio-rs".to_string()
                    blank=false
                >
                    {picu_icons}
                </Project>
                <Project
                    github=false
                    title="Aura".to_string()
                    description="Design Engineering Company".to_string()
                    url="/projects/aura".to_string()
                    repository="https://github.com/ruizdiazever/portfolio-rs".to_string()
                    blank=false
                >
                    {aura_icons}
                </Project>
                <Project
                    github=false
                    title="BERLi".to_string()
                    description="STATE-OF-THE-ART IoT Platform".to_string()
                    url="/projects/berli".to_string()
                    repository="https://github.com/ruizdiazever/portfolio-rs".to_string()
                    blank=false
                >
                    {berli_icons}
                </Project>
            </div>
            <h1 class="text-2xl mt-6">Experience</h1>
            <div class="relative flex flex-col gap-4">
                  <div class="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-6 after:left-0 grid gap-10">
                    <Experience
                        date="Jan 2023 - Present".to_string()
                        title="Tech Lead".to_string()
                        company="Anritsu".to_string()
                        description="Python lead developer in M4 Platform Team at Anritsu.
                        My work consists in Python code quality control and modern interface development using RestAPI or GraphQL in VMs and Cloud infrastructures.".to_string()
                        url="https://www.anritsu.com/en-gb/".to_string()
                    />
                    <Experience
                        date="July 2022 - December 2022".to_string()
                        title="Senior Software Engineer".to_string()
                        company="Aeronautica Militare (Italian Air Force)".to_string()
                        description="I successfully developed a key microservice for the military aviation weather system, greatly improving my team's DX and service performance along the way by migrating the API from Flask to FastAPI.".to_string()
                        url="https://www.aeronautica.difesa.it/".to_string()
                    />
                    <Experience
                        date="October 2021 - July 2022".to_string()
                        title="Software Developer".to_string()
                        company="Qi4M".to_string()
                        description="My main work consists of integrations of components made by the Data Science area in the workflow of applications with Python Standalone (pure Python 3 without frameworks).
                        On the other hand, I have been responsible for developing the frontend and most of the backend of a very important project with Vue.js on the client side and a backend with a REST API with Flask.".to_string()
                        url="https://www.qi4m.com/".to_string()
                    />
                  </div>
            </div>
        </Layout>
    }
}
