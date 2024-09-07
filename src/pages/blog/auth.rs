use crate::components::common::working::Working;
use crate::utils::config::get_post_by_id;
use crate::components::blog::post::Post;
use crate::layouts::layout::Layout;
use uuid::{uuid, Uuid};
use leptos::*;

#[component]
pub fn Auth() -> impl IntoView {
    const ID: Uuid = uuid!("f7583be4-ebf7-48a9-928d-5a058f0aabd9");
    let post = get_post_by_id(ID);

    if let Some(post) = post {
        view! {
            <Layout>
                <Post
                    title=post.title
                    description=post.description
                    date=post.date
                    id=post.id.to_string()
                    readtime=post.readtime
                    tags=post.tags
                >
                    <Working/>
                </Post>
            </Layout>
        }
    } else {
        view! {
            <Layout>
                <p>"Post not found"</p>
            </Layout>
        }
    }
}
