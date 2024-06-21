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
    tags: Vec<String>
) -> impl IntoView {
    view! {
        <div class="relative flex flex-wrap flex-row items-center h-auto md:h-36 lg:h-32  p-4 border border-gray-300
            hover:border-gray-400 transition duration-200 hover:ease-in
            rounded-md bg-white shadow-sm hover:shadow-md
            transition-shadow">

            <div class="flex-1 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <Link title={title} link={uri} blank={false}/>
                    <div class="flex items-center gap-2 text-gray-600">
                        <Icon width="1em" height="1em" icon=i::RiTimerSystemLine />
                        <span class="flex md:gap-1 text-sm font-medium text-muted-foreground">{time} min <span class="hidden md:block">read</span></span>
                    </div>
                </div>
                <p class="text-sm text-muted-foreground">
                    {description}
                </p>
                <div class="flex justify-left items-center mt-2 text-sm text-gray-600 space-x-4">
                    <section class="flex items-center justify-center gap-1 flex-wrap font-medium">
                        <Icon icon=i::OcEyeSm />
                        157.k views
                    </section>
                    <section class="flex items-center justify-center gap-1 flex-wrap font-medium">
                        <Icon icon=i::BsTag />
                        {tags.len()} Tags
                    </section>
                    <section class="flex items-center justify-center gap-1 flex-wrap font-medium">
                        <Icon icon=i::AiClockCircleOutlined />
                        {date}
                    </section>
                </div>
            </div>
        </div>
    }
}
