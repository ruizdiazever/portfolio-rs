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
            <div class="text-gray-600">
                <h1 class="text-3xl text-gray-800 mb-2">{title}</h1>
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
            </div>
    }
}
