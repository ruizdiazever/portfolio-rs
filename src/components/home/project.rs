use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Project(
    children: Children,
    title: String,
    description: String,
    github: bool,
) -> impl IntoView {
    view! {
        <a href="#" class="group relative block h-32 w-full">
            <span class="absolute inset-0 border border-dashed border-gray-400 rounded-md"></span>

            <div class="relative p-2 flex h-full transform items-start border border-gray-300 rounded-md bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                <div class="flex flex-col px-2 my-2 gap-2 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0">
                    <div class="flex justify-between">
                        <div class="flex items-center">
                            <h2 class="text-xl font-medium text-gray-700">{title.clone()}</h2>
                        </div>
                        {if github {
                            view! {
                                <span class="absolute top-3 right-3 text-gray-700">
                                    <Icon width="1.2em" height="1.2em" icon=i::FaGithubBrands />
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
                        {children()}
                    </div>
                </div>
                <div class="absolute p-2 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100">
                    <h3 class="mt-3 text-2xl font-medium text-gray-800">{title.clone()}</h3>
                    <p class="mt-2 text-md text-gray-600 gap-2 mt-3">
                        {if github {
                            view! {
                                <span class="flex items-center">
                                    Read more in GitHub
                                    <Icon width="1em" height="1em" icon=i::ChArrowUpRight />
                                </span>
                            }
                        } else {
                            view! {
                                <span>Read more</span>
                            }
                        }}
                    </p>
                </div>
          </div>
        </a>
    }
}
