use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Project(
    children: Children,
    title: String,
    description: String,
    github: bool,
    url: String,
    repository: String,
) -> impl IntoView {
    view! {
        <div class="group relative block h-32 w-full">
            <div class="relative p-2 flex h-full transform items-start border border-gray-300 hover:border-gray-400 transition duration-200 ease-out hover:ease-in rounded-md bg-white">
                <div class="flex flex-col px-2 my-2 gap-2 !pt-0">
                    <div class="flex justify-between">
                        <a class="group flex items-center gap-1 hover:underline hover:decoration-dashed hover:underline-offset-8 hover:decoration-gray-400" href={url} target="_blank">
                            <h2 class="text-xl font-medium text-gray-600 hover:text-gray-700">{title.clone()}</h2>
                            <Icon width="1em" height="1em" class="text-gray-500 duration-150 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                        </a>
                        {if github {
                            view! {
                                <span>
                                    <a href={repository} target="_blank" class="absolute top-3 right-3 text-gray-700">
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
                        {children()}
                    </div>
                </div>
          </div>
        </div>
    }
}
