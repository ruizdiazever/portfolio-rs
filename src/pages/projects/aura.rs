use crate::components::project::post::Post;
use crate::utils::config::get_project_by_id;
use crate::components::common::working::Working;
use crate::layouts::layout::Layout;
use leptos::*;
use uuid::{uuid, Uuid};

#[component]
pub fn Aura() -> impl IntoView {
    const ID: Uuid = uuid!("e3399a11-7ce6-4cdc-aba6-7d88d2a412b6");
    let project = get_project_by_id(ID);

    match project {
        Some(project) => view! {
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
        },
        None => view! {
            <Layout>
                <p>"Project not found"</p>
            </Layout>
        },
    }
}
