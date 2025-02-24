use crate::components::common::working::Working;
use crate::utils::config::get_post_by_id;
use crate::components::blog::post::Post;
use crate::layouts::layout::Layout;
use uuid::{uuid, Uuid};
use leptos::*;

#[component]
pub fn Auth() -> impl IntoView {
    const ID: Uuid = uuid!("f7583be4-ebf7-48a9-928d-5a058f0aabd9");

    let post = create_resource(
        || (),
        move |_| async move { get_post_by_id(ID) },
    );

    view! {
        <Layout>
            <Suspense fallback=|| view! { <p>"Loading..."</p> }>
                {move || {
                    post
                        .get()
                        .map(|post| match post {
                            Some(post) => view! {
                                <Post
                                    id=post.id.to_string()
                                    title=post.title
                                    description=post.description
                                    date=post.date
                                    readtime=post.readtime
                                    tags=post.tags
                                >
                                    <Working/>
                                </Post>
                            },
                            None => view! {
                                <p>"Project not found"</p>
                            }.into_view(),
                        })
                }}
            </Suspense>
        </Layout>
    }
}
