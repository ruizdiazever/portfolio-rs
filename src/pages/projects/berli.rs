use crate::components::project::post::Post;
use crate::utils::config::get_project_by_id;
use crate::components::common::working::Working;
use crate::layouts::layout::Layout;
use leptos::*;
use uuid::{uuid, Uuid};

#[component]
pub fn Berli() -> impl IntoView {
    const ID: Uuid = uuid!("468ebc44-4ef0-4e41-8b05-525010becb11");
    let project = get_project_by_id(ID);

    if let Some(project) = project {
        view! {
            <Layout>
                <Post
                    id=project.id.to_string()
                    title=project.title
                    description=project.description
                    date=project.date
                    readtime=project.readtime
                    tags=project.tags
                >
                    <Working/>
                </Post>
            </Layout>
        }
    } else {
        view! {
            <Layout>
                <p>"Project not found"</p>
            </Layout>
        }
    }
}
