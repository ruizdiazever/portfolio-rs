use crate::components::common::post::Post;
use crate::components::common::values::Link;
use crate::layouts::layout::Layout;
use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Picu() -> impl IntoView {
    // Project
    let id = "b3678579-1593-4c8e-891c-7a933f7a3760".to_string();
    let title = "Picu IoT";
    let subtitle = "Cutting-edge IoT platform powered by Rust";
    let date = "Jun 18, 2024";
    let tags_key = "picu";
    let min = "0";

    // BERLi
    let intro_1 = "Picu was born out of my desire to master Rust and learn in parallel about embedded systems and IoT.";
    let intro_2 = "I've decided to leverage the most cutting-edge technology for designing interfaces, infrastructure, and backend systems!";

    // Links
    let link_axum = Link::Axum.to_view();
    let link_actix = Link::Actix.to_view();
    let link_tokio = Link::Tokio.to_view();
    let link_sqlx = Link::SQLx.to_view();
    let link_graphql = Link::GraphQL.to_view();
    let link_argon2 = Link::Argon2.to_view();

    view! {
        <Layout>
            <Post title=title subtitle=subtitle tags_key=tags_key date=date id=id min=min>
                <h1 id="motivation" class="text-2xl text-gray-800">
                    <a href="#motivation">Motivation</a>
                </h1>
                <article class="text-gray-800 space-y-3 ">
                    <p>{intro_1}</p>
                    <p>{intro_2}</p>
                </article>

                // Stack
                <h1 id="stack" class="text-2xl text-gray-800">
                    <a href="#stack">Stack</a>
                </h1>
                <p class="text-gray-800">
                    The <strong>backend</strong> side at the beginning was in doubt between
                    {link_actix} and {link_axum} and although the first
                    one showed better performance, the community supported Axum more.
                </p>
                <p class="text-gray-800">
                    Also the fact that it came from the people of {link_tokio}
                    was a guarantee in terms of support and evolution.
                </p>
                <p class="text-gray-800">
                    On the database side I chose PostgreSQL, it was an easy decision and as a crate to
                    use it in Rust I chose {link_sqlx}
                    because it was fast in terms of performance and above
                    all because it was not an ORM
                </p>
                <p class="text-gray-800">
                    For the API interface I used REST for those that are critical in terms of security and more
                    primitive like account creation and login, but for the other services I
                    used GraphQL using the crate
                    {link_graphql}
                    , fantastic crate!
                </p>
                <p class="text-gray-800">
                    There are many other technologies such as {link_argon2}
                    or the sending of JWT through credentials
                    (HttpOnly and Secure) that I have used and that I would like to talk about but
                    I will leave it in another post so as not to extend this one too much.
                </p>
                // Architecture
                <h1 id="architecture" class="text-2xl text-gray-800">
                    <a href="#architecture">Architecture</a>
                </h1>
                <p class="text-gray-800">A simple schematic of the main API and some of the components around it</p>

                <div class="inset-0 -z-10 w-full bg-slate-50
                border border-gray-300 rounded rounded-lg mx-auto shadow
                bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
                bg-[size:6rem_4rem]">
                        <img
                            class="w-full bg-transparent"
                            src="/images/picu_arch.svg"
                            alt="Picu basic architecture diagram"
                            href="/"
                        />
                </div>

                // Very soon
                <h1 class="text-3xl text-gray-800 text-center mt-3">Very soon</h1>

                // Store
                <h1 id="store" class="text-2xl text-gray-800">
                    <a href="#store">Store</a>
                </h1>
                <p class="text-gray-600 flex items-center gap-2">Work in progress <Icon width="1em" height="1em" icon=i::AiClockCircleOutlined /></p>

                // Mobile
                <h1 id="mobile" class="text-2xl text-gray-800">
                    <a href="#mobile">Mobile with Flutter</a>
                </h1>
                <p class="text-gray-600 flex items-center gap-2">Work in progress <Icon width="1em" height="1em" icon=i::AiClockCircleOutlined /></p>

                // Guarantee availability and reliability
                <h1 id="guarantee" class="text-2xl text-gray-800">
                    <a href="#guarantee">Guarantee availability and reliability</a>
                </h1>
                <p class="text-gray-600 flex items-center gap-2">Work in progress <Icon width="1em" height="1em" icon=i::AiClockCircleOutlined /></p>
            </Post>
        </Layout>
    }
}
