use crate::components::blog::post::Post;
use crate::components::common::modal::InfoModal;
use crate::components::common::values::Link;
use crate::layouts::layout::Layout;
use crate::utils::config::{capitalize_first_letter, get_orgs_from_json, get_post_by_id};
use icondata as i;
use leptos::*;
use leptos_icons::*;
use uuid::{uuid, Uuid};

#[component]
pub fn State() -> impl IntoView {
    const ID: Uuid = uuid!("511bc558-3f6e-4375-8e57-37e19519f1db");
    let organizations = create_resource(|| (), move |_| async move { get_orgs_from_json() });
    let post_resource = create_resource(|| (), move |_| async move { get_post_by_id(ID) });

    let intro = r#" opening doors for developers
        skilled in this game-changing language. Learn how Rust's exceptional ergonomics are revolutionizing
        engineering by providing safety, speed, and ease of use—reshaping the future of software development."#;

    let (show_description, set_show_description) = create_signal(false);
    let (description, set_description) = create_signal("".to_string());
    let open_description = move |text: &str| {
        set_description(text.to_string());
        set_show_description(true);
    };

    view! {
        <Layout>
            <Suspense fallback=|| view! { <p>"Loading..."</p> }>
                {move || {
                    post_resource
                        .get()
                        .map(|post| match post {
                            Some(post) => view! {
                                <Post
                                    title=post.title
                                    description=post.description
                                    date=post.date
                                    id=post.id.to_string()
                                    readtime=post.readtime
                                    tags=post.tags
                                >
                                    // Journey
                                    <h1 id="tomorrow" class="text-2xl text-gray-800">
                                        <a href="#tomorrow">Building Tomorrow</a>
                                    </h1>
                                    <p class="text-gray-700">
                                        Discover the companies and organizations embracing {Link::Rust.to_view()}, {intro}
                                    </p>
                                    <h1 id="icon" class="text-xl text-gray-800">
                                        <a href="#icon">Meaning of icons</a>
                                    </h1>
                                    // Icons
                                    <div class="overflow-x-auto rounded-lg border border-gray-200">
                                        <table class="min-w-full divide-y-2 divide-gray-200 bg-white md:text-sm text-xs">
                                        <thead class="ltr:text-left rtl:text-right bg-[#fafafa]">
                                            <tr>
                                            <th class="text-left whitespace-nowrap pl-2 md:pl-4 py-2 font-medium text-gray-900">Icon</th>
                                            <th class="text-left whitespace-nowrap px-2 md:px-4 py-2 font-medium text-gray-900">Description</th>
                                            </tr>
                                        </thead>

                                        <tbody class="divide-y divide-gray-200">
                                            <tr class="hover:bg-[#fafafa]">
                                                <td class="whitespace-nowrap pl-2 md:px-4 py-2 font-medium text-gray-900">
                                                    <Icon class="fill-red-500 stroke-red-500 h-4 w-4" icon=i::SiGithubsponsors />
                                                </td>
                                                <td class="whitespace-nowrap px-2 md:px-4 py-2 text-gray-700">Founder and Sponsor of Rust Foundation</td>
                                            </tr>
                                            <tr class="hover:bg-[#fafafa]">
                                                <td class="whitespace-nowrap pl-2 md:px-4 py-2 font-medium text-gray-900">
                                                    <Icon class="group-hover:translate-x-[1.5px] h-4 w-4" icon=i::SiGithubsponsors />
                                                </td>
                                                <td class="whitespace-nowrap px-2 md:px-4 py-2 text-gray-700">Sponsor of Rust Foundation</td>
                                            </tr>
                                            <tr class="hover:bg-[#fafafa]">
                                                <td class="whitespace-nowrap pl-2 md:px-4 py-2 font-medium text-gray-900">
                                                    <Icon class="h-5 w-5" icon=i::BiLinkAltRegular />
                                                </td>
                                                <td class="whitespace-nowrap px-2 md:px-4 py-2 text-gray-700">Link to source of entry</td>
                                            </tr>
                                            <tr class="hover:bg-[#fafafa]">
                                                <td class="whitespace-nowrap pl-2 md:px-4 py-2 font-medium text-gray-900">
                                                    <Icon class="h-5 w-5" icon=i::IoDocumentTextOutline />
                                                </td>
                                                <td class="whitespace-nowrap px-2 md:px-4 py-2 text-gray-700">Modal with a short description</td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                    // List
                                    <h1 id="list" class="text-xl text-gray-800">
                                        <a href="#list">List</a>
                                    </h1>
                                    // Tablet
                                    <div class="overflow-x-auto rounded-lg border border-gray-200">
                                      <table class="min-w-full divide-y-2 divide-gray-200 bg-white md:text-sm text-xs">
                                        <thead class="ltr:text-left rtl:text-right bg-[#fafafa]">
                                          <tr>
                                            <th class="text-left whitespace-nowrap pl-2 md:pl-4 py-2 font-medium text-gray-900">#</th>
                                            <th class="text-left whitespace-nowrap px-2 md:px-4 py-2 font-medium text-gray-900">Founded</th>
                                            <th class="text-left whitespace-nowrap px-2 md:px-4 py-2 font-medium text-gray-900 md:block hidden">Industry</th>
                                            <th class="text-left whitespace-nowrap px-2 md:px-4 py-2 font-medium text-gray-900">Country</th>
                                            <th class="text-left whitespace-nowrap px-2 md:px-4 py-2 font-medium text-gray-900">More</th>
                                          </tr>
                                        </thead>

                                        <tbody class="divide-y divide-gray-200">
                                            {move || organizations.get().map(|orgs| view! {
                                                <For
                                                    each=move || orgs.clone()
                                                    key=|org| org.name.clone()
                                                    children=move |org| view! {
                                                        <tr class="hover:bg-[#fafafa]">
                                                            <td class="whitespace-nowrap pl-2 md:px-4 py-2 font-medium text-gray-900">
                                                                <a class="flex items-center duration-200 hover:text-[#68b5fc] group flex items-center gap-1
                                                                hover:underline hover:decoration-dashed hover:underline-offset-8 hover:decoration-[#68b5fc]" target="_blank" href={&org.url}>
                                                                    {&org.name}
                                                                    <div class="flex gap-x-1" title={capitalize_first_letter(&org.sponsor)}>
                                                                        <Icon width="1em" height="1em" class="group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                                                                        {move || {
                                                                            if &org.sponsor.as_str() == &"founder" {
                                                                                view! {
                                                                                    <Icon class="fill-red-500 stroke-red-500" width="1em" height="1em" icon=i::SiGithubsponsors />
                                                                                }
                                                                            } else if &org.sponsor.as_str() != &"" && &org.sponsor.as_str() != &"founder" {
                                                                                view! {
                                                                                    <Icon width="1em" height="1em" icon=i::SiGithubsponsors />
                                                                                }
                                                                            } else {
                                                                                view! {
                                                                                    <span></span>
                                                                                }.into_view()
                                                                            }
                                                                        }}
                                                                    </div>
                                                                </a>
                                                            </td>
                                                            <td class="whitespace-nowrap px-2 md:px-4 py-2 text-gray-700">{org.founded}</td>
                                                            <td class="whitespace-nowrap px-2 md:px-4 py-2 text-gray-700 md:block hidden">{&org.industry}</td>
                                                            <td class="whitespace-nowrap px-2 md:px-4 py-2 text-gray-700">{&org.country}</td>
                                                            <td class="whitespace-nowrap px-2 py-2 text-gray-700">
                                                                <div class="flex gap-2">
                                                                    <a class="duration-200 hover:text-[#68b5fc]" title="Source" target="_blank" href={&org.source}>
                                                                        <Icon class="h-5 w-5" icon=i::BiLinkAltRegular />
                                                                    </a>
                                                                    <button on:click=move |_| open_description(&org.description) title="Description">
                                                                        <Icon class="h-5 w-5" icon=i::IoDocumentTextOutline />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    }
                                                />
                                            })}
                                        </tbody>
                                      </table>
                                    </div>
                                    // Soon
                                    <h1 id="community" class="text-xl text-gray-800">
                                        <a href="#community">Note to community</a>
                                    </h1>
                                    <p>
                                        Contribute to expanding the list submit a pull request at {Link::State.to_view()}.
                                    </p>
                                </Post>
                            },
                            None => view! {
                                <p>"Project not found"</p>
                            }.into_view(),
                        })
                }}
            </Suspense>
            <InfoModal show={show_description} text={description}></InfoModal>
        </Layout>
    }
}
