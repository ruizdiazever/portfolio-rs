use leptos::*;

#[component]
pub fn Feature(
    children: Children,
    title: &'static str,
    description: &'static str,
) -> impl IntoView {
    view! {
        <div class="bg-white p-6 rounded-lg shadow-md flex items-start h-full w-full">
            <div class="flex-shrink-0 mr-4">
                <div class="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
                    {children()}
                </div>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-2">{title}</h3>
                <p class="text-gray-600">{description}</p>
            </div>
        </div>
    }
}
