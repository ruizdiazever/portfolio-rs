use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Experience(
    date: String,
    title: String,
    company: String,
    description: String,
    url: String,
) -> impl IntoView {
    view! {
            <div class="grid gap-1 relative">
                <div class="aspect-square w-3 bg-gray-600 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1" />
                <div class="text-gray-500 text-sm">{date}</div>
                <div class="text-gray-800 text-xl">{title}</div>
                <div class="text-gray-600 text-md mb-1">
                    <a class="flex items-center" href={url} target="_blank">{company}<Icon width="1em" height="1em" icon=i::ChArrowUpRight /></a>
                </div>
                <div class="text-gray-700 text-sm">
                    {description}
                </div>
            </div>

    }
}
