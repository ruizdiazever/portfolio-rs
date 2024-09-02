use crate::common::json::get_vector_from_json_file;
use crate::common::req::post_visit_request;
use crate::components::common::helpful::Helpful;
use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Post(
    id: String,
    title: &'static str,
    subtitle: &'static str,
    tags_key: &'static str,
    date: &'static str,
    children: Children,
    min: &'static str
) -> impl IntoView {
    let tags_post = get_vector_from_json_file(tags_key);

    let views = create_resource(
        move || id.clone(),
        |id| async { post_visit_request(id).await },
    );

    view! {
            <div class="relative">
                <div class="fixed bottom-4 left-1/2 -translate-x-1/2
                    lg:top-8 lg:left-8 lg:ml-10">
                    <a
                        href="/"
                        rel="external"
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
                    <div class="flex items-center justify-between mb-2 md:mb-3">
                        <div>
                            <div class="flex visible md:invisible items-center gap-2 text-gray-600">
                                <Icon width="1em" height="1em" icon=i::RiTimerSystemLine />
                                <code class="flex md:gap-1 text-muted-foreground">
                                    {min} mins read
                                </code>
                            </div>
                            <h1 class="text-3xl md:text-4xl text-gray-800">{title}</h1>
                        </div>
                        <div class="flex invisible md:visible items-center gap-2 text-gray-600">
                            <Icon width="1em" height="1em" icon=i::RiTimerSystemLine />
                            <code class="flex md:gap-1 text-muted-foreground">
                                {min} mins read
                            </code>
                        </div>
                    </div>
                    <div class="space-y-2 not-prose">
                        <p class="text-md lg:text-lg">{subtitle}</p>
                        <div class="flex justify-left items-center text-sm text-gray-600 space-x-4">
                            <section class="flex items-center justify-center gap-1 flex-wrap font-medium">
                                <Icon icon=i::AiClockCircleOutlined />
                                <code>{date}</code>
                            </section>
                            <section class="flex items-center justify-center gap-1 flex-wrap font-medium">
                                <Icon icon=i::BsTag />
                                <code>{tags_post.len()} Tags</code>
                            </section>
                            <section class="flex w-28 items-left">
                                <code class="flex items-center justify-center gap-1 flex-wrap font-medium">
                                    <Icon icon=i::OcEyeSm />
                                    <Suspense fallback=move || view! {0}>
                                        <ErrorBoundary fallback=|_| {view! {0}}>
                                            <span class="backdrop-filter backdrop-blur-md animate-backdrop transition duration-700 ease-in-out">
                                                { move || { views.get()} }
                                            </span>
                                        </ErrorBoundary>
                                    </Suspense>
                                    views
                                </code>
                            </section>
                        </div>
                    </div>
                    <hr class="my-8 h-px border-0 bg-gray-300" />
                    <div class="mt-6 space-y-4">{children()}</div>
                    // <Helpful/>
                </article>
            </div>
    }
}
