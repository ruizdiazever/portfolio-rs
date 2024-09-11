use crate::components::blog::post::Post;
use crate::components::common::feature::Feature;
use crate::components::common::values::Link;
use crate::layouts::layout::Layout;
use crate::utils::config::get_post_by_id;
use icondata as i;
use leptos::*;
use leptos_icons::*;
use uuid::{uuid, Uuid};

#[component]
pub fn Portfolio() -> impl IntoView {
    const ID: Uuid = uuid!("9a5f3584-5a8a-4c22-8460-2d775d54d89b");

    let post_resource = create_resource(|| (), move |_| async move { get_post_by_id(ID) });

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
                                    <h1 id="journey" class="text-2xl text-gray-800">
                                        <a href="#journey">The journey to excellence</a>
                                    </h1>
                                    <p class="text-gray-700">
                                        Welcome to my WASM portfolio, a cutting-edge showcase of my work
                                        with {Link::Rust.to_view()} and WebAssembly,
                                        powered by the {Link::Leptos.to_view()} framework.
                                    </p>
                                    <p class="text-gray-700">
                                        This portfolio is more than just a collection of projects;
                                        it reflects my commitment to excellence and innovation in the tech industry.
                                    </p>
                                    // Stack
                                    <h1 id="stack" class="text-2xl text-gray-800">
                                        <a href="#stack">Stack</a>
                                    </h1>
                                    <p>In addition to Leptos I have used {Link::Axum.to_view()} to create a microservice which uses
                                    {Link::RedisDB.to_view()} for persistence. I use the API for some web features like visits or feedback.</p>
                                    // Design
                                    <h1 id="design" class="text-2xl text-gray-800">
                                        <a href="#design">Design</a>
                                    </h1>
                                    <p class="text-gray-700">
                                        Inspired by the achievements of {Link::Vercel.to_view()}, {Link::Nio.to_view()},
                                        {Link::SpaceX.to_view()}, {Link::Apple.to_view()}, and {Link::Nothing.to_view()},
                                        with {Link::Guille.to_view()} as a role model for Latin Americans in
                                        software development, I strive for top-tier standards.
                                    </p>
                                    <p class="text-gray-700">
                                        Explore sections currently under development, exemplifying quality and precision.
                                        Every element is thoughtfully curated to create a functional and aesthetically pleasing digital space.
                                        Though some parts are still in progress, I am excited to share this journey with you.
                                    </p>
                                    // Features
                                    <h1 id="features" class="text-2xl text-gray-800">
                                        <a href="#features">Features</a>
                                    </h1>

                                    <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
                                        <Feature
                                            title="SSR with Hydration"
                                            description="Server-side rendering for faster initial load times,
                                            combined with client-side hydration for dynamic interactivity.">
                                            <Icon class="w-6 h-6 text-indigo-600" icon=i::BiServerRegular />
                                        </Feature>
                                        <Feature
                                            title="Feedback"
                                            description="Feedback mechanism leverages RedisDB and SMPT to efficiently deliver email notifications of readers.">
                                            <Icon class="w-6 h-6 text-indigo-600" icon=i::VsReactions />
                                        </Feature>
                                        <Feature title="Insights"
                                            description="Each post has a counter that registers the visit and adds it to a unique counter in RedisDB.">
                                            <Icon class="w-6 h-6 text-indigo-600" icon=i::CgInsights />
                                        </Feature>
                                        // <Feature title="Search"
                                        //     description="Powered by Meilisearch, a powerful, open-source search engine coded in Rust.">
                                        //     <Icon class="w-6 h-6 text-indigo-600" icon=i::AiSearchOutlined />
                                        // </Feature>
                                    </div>
                                    // Architecture
                                    <h1 id="architecture" class="text-2xl text-gray-800">
                                        <a href="#architecture">Architecture</a>
                                    </h1>
                                    <div class="inset-0 -z-10 w-full bg-slate-50 my-30
                                    border border-gray-300 rounded rounded-lg mx-auto shadow
                                    bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
                                    bg-[size:6rem_4rem]">
                                            <img
                                                class="w-full bg-transparent"
                                                src="/images/portfolio_arch.svg"
                                                alt="Picu basic architecture diagram"
                                                href="/"
                                            />
                                    </div>
                                    <div class="flex flex-col items-center justify-center">
                                        <figcaption class="text-sm text-muted-foreground">
                                            Image created using
                                            <a
                                                href="https://app.diagrams.net/"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                class="group inline-flex items-center hover:text-[#68b5fc] text-[#0074de]
                                                duration-200 hover:underline underline-offset-4 decoration-dashed decoration-[#57b1fc]">
                                                    Drawio
                                                    <Icon width="0.7em" height="0.7em" class="hover:text-[#68b5fc] text-[#0074de]
                                                    duration-200 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                                            </a>
                                        </figcaption>
                                    </div>
                                    // Monitoring
                                    <h1 id="monitoring" class="text-2xl text-gray-800">
                                        <a href="#monitoring">Monitoring</a>
                                    </h1>
                                    <p>
                                        As I show in the graph above, I have used {Link::Grafana.to_view()} and {Link::InfluxDB.to_view()}
                                        (another wonderful project powered by Rust) for monitoring.
                                        For those who do not know these technologies, InfluxDB is a
                                        timeseries database that has its own system for data collection
                                        and Grafana serves as a client for this data. In addition, InfluxDB
                                        has an alert system that I have connected to a Telegram bot to keep
                                        up to date with any incidents.
                                    </p>
                                    <div class="flex flex-col items-center justify-center">
                                        <img
                                            class="w-auto mx-auto"
                                            src="/images/grafana.webp"
                                            alt="Grafana"
                                            title="Grafana, observability… at your service"
                                        />
                                    </div>
                                    // Deployment
                                    <h1 id="deployment" class="text-2xl text-gray-800">
                                        <a href="#deployment">Deployment</a>
                                    </h1>
                                    <p>I have deployed the entire portfolio and the various technologies around it on my own beloved mini server.</p>
                                    <p>The thrill of technological success is palpable. After working tirelessly, I have launched my portfolio and the entire technological environment surrounding it on my own server, a true palace of innovation:</p>
                                    <div class="overflow-x-auto rounded-lg border border-gray-200">
                                      <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                        <thead class="ltr:text-left rtl:text-right">
                                          <tr>
                                            <th class="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-900">Component</th>
                                            <th class="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                                            <th class="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-900 md:block hidden">Description</th>
                                          </tr>
                                        </thead>

                                        <tbody class="divide-y divide-gray-200">
                                          <tr>
                                            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">OS</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">Fedora Server 40</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700 md:block hidden">GNU/Linux</td>
                                          </tr>
                                          <tr>
                                            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">HTTPS Server</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">Caddy</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700 md:block hidden">Reverse Proxy and SSL</td>
                                          </tr>
                                          <tr>
                                            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Domain</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">SquareSpace</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700 md:block hidden">Provider</td>
                                          </tr>
                                          <tr>
                                            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Administration</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">Cockpit and SSH</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700 md:block hidden">Cockpit is a open web-based UI to servers</td>
                                          </tr>
                                          <tr>
                                            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Monitoring</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">Grafana with InfluxDB</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700 md:block hidden">Best stack to availability and reliability</td>
                                          </tr>
                                          <tr>
                                            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Alerts</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">InfluxDB with Telegram</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700 md:block hidden">Using Email SMTP and Telegram bot</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    // Soon
                                    <h1 id="soon" class="text-2xl text-gray-800">
                                        <a href="#soon">See you soon</a>
                                    </h1>
                                    <p>Making this portfolio has been a beautiful adventure, to get to know the WASM world and to reinforce my knowledge
                                    in Rust, I dedicate it to my beautiful daughter Sofia, source of my strength and eternal inspiration!</p>
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
