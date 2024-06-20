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
                <div class="text-gray-500 text-md mb-1">
                    <a class="group flex items-center hover:text-[#68b5fc] duration-200" href={url} target="_blank">
                        {company}
                        <Icon width="1em" height="1em" class="duration-200 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                    </a>
                </div>
                <div class="text-gray-700 text-sm">
                    {description}
                </div>
            </div>

    }
}
