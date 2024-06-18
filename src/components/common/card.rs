use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Tech(title: String, description: String, uri: String) -> impl IntoView {
    view! {
        <div class="bg-white rounded-lg hover:bg-gray-50 shadow-md md:w-40 w-full" title={description}>
            <a href={uri} target="_blank">
                <div class="group p-3">
                    <h3 class="flex items-center text-lg font-semibold gap-1 hover:underline hover:decoration-dashed hover:underline-offset-8 hover:decoration-gray-400">
                        {title}
                        <Icon width="1em" height="1em" class="text-gray-500 duration-150 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                    </h3>
                </div>
            </a>
        </div>
    }
}

#[component]
pub fn TechList() -> impl IntoView {
    let techs = vec![
        ("Rust".to_string(), "A modern marvel in systems programming, ensuring unparalleled safety and blazing performance.".to_string(), "https://www.rust-lang.org".to_string()),
        ("Axum".to_string(), "A cutting-edge web framework for Rust, delivering elegance and power in web development.".to_string(), "https://github.com/tokio-rs/axum".to_string()),
        ("SQLx".to_string(), "Revolutionizing database interaction with async, type-safe SQL queries in pure Rust.".to_string(), "https://github.com/launchbadge/sqlx".to_string()),
        ("Argon2".to_string(), "The gold standard in cryptographic hashing, fortifying your passwords with unmatched security.".to_string(), "https://docs.rs/argon2".to_string()),
        ("PostgreSQL".to_string(), "The sophisticated open-source database, offering robustness and advanced features.".to_string(), "https://www.postgresql.org".to_string()),
        ("Flutter".to_string(), "Transforming app development with a versatile toolkit for natively compiled applications.".to_string(), "https://flutter.dev".to_string()),
        ("Svelte".to_string(), "A groundbreaking approach to building user interfaces, minimizing overhead and maximizing performance.".to_string(), "https://svelte.dev".to_string()),
        ("Astro".to_string(), "The modern web framework designed for speed, crafting content-focused websites effortlessly.".to_string(), "https://astro.build".to_string()),
        ("GraphQL".to_string(), "Redefining API interactions with a powerful, flexible query language for your data.".to_string(), "https://graphql.org".to_string()),
        ("Nginx".to_string(), "The high-performance web server and reverse proxy, engineered for efficiency and scalability.".to_string(), "https://www.nginx.com".to_string()),
        ("Linux".to_string(), "The pioneering open-source operating system, powering innovation and versatility.".to_string(), "https://www.linux.org".to_string()),
        ("Certbot".to_string(), "Automating HTTPS with ease, Certbot secures your websites with Let’s Encrypt certificates.".to_string(), "https://certbot.eff.org".to_string()),
        ("InfluxDB".to_string(), "The premier open-source time series database, optimized for high-write and query performance.".to_string(), "https://www.influxdata.com".to_string()),
        ("Grafana".to_string(), "The ultimate platform for visualization and observability, making data beautifully actionable.".to_string(), "https://grafana.com".to_string()),
    ];

    view! {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {techs.iter().map(|(title, description, uri)| {
                view! {
                    <Tech title={title.clone()} description={description.clone()} uri={uri.clone()} />
                }
            }).collect::<Vec<_>>()}
        </div>
    }
}
