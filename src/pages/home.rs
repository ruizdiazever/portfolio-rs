use crate::components::home::{experience::Experience, project::Project};
use crate::layout::layout::Layout;
use icondata as i;
use leptos::*;
use leptos_icons::*;

const DESCRIPTION: &str =
    "I'm Ever, a software developer enginner based in Italy with +3 years of experience.";

const SUB_DESCRIPTION: &str = "I'm passionate about science, state-of-the-art tech, design
and development.";

#[component]
pub fn Home() -> impl IntoView {
    view! {
        <Layout render_prop=|| view! {
            <p class="text-gray-600 text-lg text-left">
                {DESCRIPTION}
                <br/>
                {SUB_DESCRIPTION}
            </p> }>
            // Childrens
            <h1 class="text-2xl mt-6">Projects</h1>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2 place-items-center">
                <Project github=true title="portfolio-rs".to_string() description="Portfolio WASM powered by Rust".to_string()>
                    <Icon width="1.3em" height="1.3em" icon=i::FaRustBrands />
                    <Icon width="1.3em" height="1.3em" icon=i::SiLeptos />
                    <Icon width="1.3em" height="1.3em" icon=i::BiTailwindCss />
                </Project>
                <Project github=false title="BERLi".to_string() description="Async Software Managment".to_string()>
                    <Icon width="1.3em" height="1.3em" icon=i::FaRustBrands />
                    <Icon width="1.3em" height="1.3em" icon=i::SiSvelte />
                    <Icon width="1.3em" height="1.3em" icon=i::SiAstro />
                    <Icon width="1.3em" height="1.3em" icon=i::BiPostgresql />
                    <Icon width="1.3em" height="1.3em" icon=i::SiInfluxdb />
                    <Icon width="1.3em" height="1.3em" icon=i::BiTailwindCss />
                </Project>
                <Project github=false title="Aura".to_string() description="Design Engineering Company".to_string()>
                    <Icon width="1.3em" height="1.3em" icon=i::FaRustBrands />
                    <Icon width="1.3em" height="1.3em" icon=i::SiSvelte />
                    <Icon width="1.3em" height="1.3em" icon=i::SiAstro />
                    <Icon width="1.3em" height="1.3em" icon=i::BiPostgresql />
                    <Icon width="1.3em" height="1.3em" icon=i::SiInfluxdb />
                    <Icon width="1.3em" height="1.3em" icon=i::BiTailwindCss />
                </Project>
                <Project github=false title="Picu".to_string() description="STATE-OF-THE-ART IoT Platform".to_string()>
                    <Icon width="1.3em" height="1.3em" icon=i::FaRustBrands />
                    <Icon width="1.3em" height="1.3em" icon=i::SiSvelte />
                    <Icon width="1.3em" height="1.3em" icon=i::SiEspressif />
                    <Icon width="1.3em" height="1.3em" icon=i::BiFlutter />
                    <Icon width="1.3em" height="1.3em" icon=i::SiAstro />
                    <Icon width="1.3em" height="1.3em" icon=i::BiPostgresql />
                    <Icon width="1.3em" height="1.3em" icon=i::SiInfluxdb />
                    <Icon width="1.3em" height="1.3em" icon=i::BiTailwindCss />
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
                        company="Be".to_string()
                        description="My main work consists of integrations of components made by the Data Science area in the workflow of applications with Python Standalone (pure Python 3 without frameworks).
                        On the other hand, I have been responsible for developing the frontend and most of the backend of a very important project with Vue.js on the client side and a backend with a REST API with Flask.".to_string()
                        url="https://www.aeronautica.difesa.it/".to_string()
                    />
                  </div>
            </div>
        </Layout>
    }
}
