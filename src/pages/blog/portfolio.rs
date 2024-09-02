use crate::components::common::post::Post;
use crate::components::common::values::Link;
use crate::layouts::layout::Layout;
use leptos::*;
use leptos_icons::*;
use icondata as i;

#[component]
pub fn Portfolio() -> impl IntoView {
    // Project
    let id = "9a5f3584-5a8a-4c22-8460-2d775d54d89b".to_string();
    let title = "Portfolio WASM";
    let subtitle = "Portfolio WASM powered by Rust with Leptos";
    let date = "Aug 31, 2024";
    let tags_key = "portfolio";
    let min = "2";

    // Links
    let link_rust = Link::Rust.to_view();
    let link_leptos = Link::Leptos.to_view();
    let link_vercel = Link::Vercel.to_view();
    let link_nothing = Link::Nothing.to_view();
    let link_apple = Link::Apple.to_view();
    let link_spacex = Link::SpaceX.to_view();
    let link_guille = Link::Guille.to_view();
    let link_nio = Link::Nio.to_view();
    let link_redis = Link::RedisDB.to_view();
    let link_axum = Link::Axum.to_view();
    let link_influx = Link::InfluxDB.to_view();
    let link_grafana = Link::Grafana.to_view();

    view! {
        <Layout>
            <Post title=title subtitle=subtitle tags_key=tags_key date=date id=id min=min>
                // Journey
                <h1 id="journey" class="text-2xl text-gray-800">
                    <a href="#journey">The Journey to Excellence</a>
                </h1>
                <p class="text-gray-700">
                    Welcome to my WASM portfolio, a cutting-edge showcase of my work with {link_rust} and WebAssembly, powered by the {link_leptos} framework.
                </p>
                <p class="text-gray-700">
                    This portfolio is more than just a collection of projects; it reflects my commitment to excellence and innovation in the tech industry.
                </p>
                // Design
                <h1 id="design" class="text-2xl text-gray-800">
                    <a href="#design">Design</a>
                </h1>
                <p class="text-gray-700">
                    Inspired by the achievements of {link_vercel}, {link_nio}, {link_spacex}, {link_apple}, and {link_nothing},
                    with {link_guille} as a role model for Latin Americans in software development, I strive for top-tier standards.
                </p>
                <p class="text-gray-700">
                    Explore sections currently under development, exemplifying quality and precision.
                    Every element is thoughtfully curated to create a functional and aesthetically pleasing digital space.
                    Though some parts are still in progress, I am excited to share this journey with you.
                </p>
                // Stack
                <h1 id="stack" class="text-2xl text-gray-800">
                    <a href="#stack">Stack and Architecture</a>
                </h1>
                <p>In addition to Leptos I have used {link_axum} to create a microservice which uses
                {link_redis} for persistence. I use the API for some web features like visits or feedback.</p>
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
                    As I show in the graph above, I have used {link_grafana} and {link_influx}
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
                        src="/images/grafana.png"
                        alt="Grafana"
                        title="Working with Sofia, my universe!"
                    />
                </div>
                // Soon
                <h1 id="soon" class="text-2xl text-gray-800">
                    <a href="#soon">See you soon</a>
                </h1>
                <p>Making this portfolio has been a beautiful adventure, to get to know the WASM world and to reinforce my knowledge
                in Rust, I dedicate it to my beautiful daughter Sofia, source of my strength and eternal inspiration!</p>
            </Post>
        </Layout>
    }
}
