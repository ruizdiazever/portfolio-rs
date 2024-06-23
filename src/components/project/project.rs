use crate::components::common::helpful::Helpful;
use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Project(
    title: String,
    subtitle: String,
    categories: Vec<String>,
    date: String,
    children: Children,
) -> impl IntoView {
    view! {
            <div class="relative">
                <div class="fixed bottom-4 left-1/2 -translate-x-1/2
                    md:top-8 md:left-8 md:ml-10">
                    <a
                        href="/"
                        class="group inline-flex h-10 items-center justify-center
                        rounded-full bg-white px-4 text-sm text-primary-foreground
                        shadow transition-colors hover:bg-primary/90 focus-visible:outline-none
                        focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none
                        disabled:opacity-50 gap-1 hover:shadow-lg hover:font-semibold"
                    >
                        <Icon class="duration-150 group-hover:translate-x-[-2.5px]" icon=i::IoChevronBack />
                        <p class="text-sm">Back</p>
                    </a>
                </div>
                <article class="text-gray-600">
                    <h1 class="text-4xl text-gray-800 mb-2">{title}</h1>
                    <p>{subtitle}</p>
                    <div class="flex justify-between my-6">
                        <div class="flex gap-1">
                            {categories.iter().map(|category| {
                                view! {
                                    <span class="flex items-center justify-center whitespace-nowrap
                                    rounded-lg bg-gray-100 border border-gray-300 h-6 px-2.5 py-1 text-sm text-gray-700">
                                        {category}
                                    </span>
                                }
                            }).collect::<Vec<_>>()}
                        </div>

                        <div class="flex items-center gap-2">
                            <Icon width="1em" height="1em" icon=i::AiClockCircleOutlined />
                            {date}
                        </div>
                    </div>
                    <hr/>
                    <div class="mt-6 space-y-4">{children()}</div>

                    <Helpful/>
                </article>
            </div>
    }
}
