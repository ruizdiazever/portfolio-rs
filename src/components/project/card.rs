use crate::components::common::link::Link;
use std::collections::HashMap;
use icondata as i;
use leptos::*;
use leptos_icons::*;
use lazy_static::lazy_static;
use crate::components::common::values::Icon;

lazy_static! {
    static ref ICONS_MAP: HashMap<&'static str, Vec<Icon>> = {
        let mut map = HashMap::new();
        map.insert("picu-iot", vec![
            Icon::Rust,
            Icon::PostgreSQL,
            Icon::Svelte,
            Icon::Astro,
            Icon::Flutter,
            Icon::TailwindCSS,
            Icon::InfluxDB,
            Icon::Grafana,
        ]);
        map.insert("aura-design", vec![
            Icon::Rust,
            Icon::PostgreSQL,
            Icon::Astro,
            Icon::Svelte,
            Icon::TailwindCSS,
            Icon::InfluxDB,
            Icon::Grafana,
            Icon::Docker,
        ]);
        map.insert("berli-system", vec![
            Icon::Rust,
            Icon::PostgreSQL,
            Icon::Svelte,
            Icon::Astro,
            Icon::TailwindCSS,
            Icon::InfluxDB,
            Icon::Grafana,
            Icon::Docker,
        ]);
        map
    };
}

#[component]
pub fn ProjectCard(
    human_id: String,
    title: String,
    description: String,
    github: bool,
    url: String,
    blank: bool,
    repository: String,
) -> impl IntoView {
    let binding = vec![];
    let icons = ICONS_MAP.get(&*human_id).unwrap_or(&binding);

    view! {
        <div class="group relative block h-32 w-full">
            <div class="relative p-2 flex h-full
                border border-gray-300
                hover:border-gray-400 transition duration-200 hover:ease-in
                rounded-md bg-white shadow-sm hover:shadow-md
                transition-shadow
                ">
                <div class="flex flex-col px-2 my-2 gap-2 !pt-0">
                    <div class="flex justify-between">
                        <Link title=title link=url blank=blank/>
                        {if github {
                            view! {
                                <span>
                                    <a href={repository} rel="noopener" target="_blank" aria-label="GitHub" class="absolute top-3 right-3 text-gray-700 hover:text-[#68b5fc]">
                                        <Icon width="1.2em" height="1.2em" icon=i::FaGithubBrands />
                                    </a>
                                </span>
                            }
                        } else {
                            view! {
                                <span/>
                            }
                        }}
                    </div>
                    <p class="text-sm text-gray-600 truncate ...">{description.clone()}</p>
                    <div class="flex gap-4 mt-1">
                        {icons.iter().map(|icon| icon.to_view()).collect::<Vec<_>>()}
                    </div>
                </div>
          </div>
        </div>
    }
}
