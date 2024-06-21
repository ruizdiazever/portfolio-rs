use icondata as i;
use leptos::*;
use leptos_icons::*;
use crate::components::common::link::Link;

#[component]
pub fn Entry(
    title: String,
    description: String,
    uri: String,
    time: u8,
    date: String,
    categories: Vec<String>
) -> impl IntoView {
    view! {
        <div class="flex flex-row items-center h-36 md:h-32 p-4 border border-gray-300
            hover:border-gray-400 transition duration-200 ease-out
            hover:ease-in rounded-md bg-white shadow-sm hover:shadow-md
            transition-shadow relative">

            <div class="flex-1 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <Link title={title} link={uri} blank={false}/>
                    <div class="flex items-center gap-2">
                        <Icon width="1em" height="1em" icon=i::AiClockCircleOutlined />
                        <span class="text-sm text-muted-foreground">{time} min read</span>
                    </div>
                </div>
                <p class="text-sm text-muted-foreground">
                    {description}
                </p>
                <div class="flex justify-between items-center mt-2">
                    <section class="flex gap-2 flex-wrap">
                        {categories.iter().map(|category| {
                            view! {
                                <span class="flex items-center justify-center whitespace-nowrap
                                rounded-lg bg-gray-100 border border-gray-300 h-6 px-2.5 py-1 text-sm text-gray-700">
                                    {category}
                                </span>
                            }
                        }).collect::<Vec<_>>()}
                    </section>
                    <span class="text-sm text-muted-foreground">{date}</span>
                </div>
            </div>
        </div>
    }
}
