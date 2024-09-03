use leptos::*;
use leptos_icons::*;
use icondata as i;

#[component]
pub fn Working() -> impl IntoView {
    view! {
        <h1 id="journey" class="text-2xl text-gray-800 text-center">
            <a href="#journey">Work in progress...</a>
        </h1>
        <div class="flex flex-col items-center justify-center pb-72">
            <img
                class="w-auto mx-auto"
                src="/illustration/working.svg"
                alt="Father programming with his daughter"
                title="Working with Sofia, my universe!"
            />
            <figcaption class="text-sm text-muted-foreground">
                Image by
                <a
                    href="https://scale.flexiple.com/illustrations/"
                    rel="noopener noreferrer"
                    target="_blank"
                    class="group inline-flex items-center hover:text-[#68b5fc] text-[#0074de] duration-200 hover:underline underline-offset-4 decoration-dashed decoration-[#57b1fc]">
                        Scale
                        <Icon width="0.7em" height="0.7em" class="hover:text-[#68b5fc] text-[#0074de] duration-200 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                </a>
            </figcaption>
        </div>
    }
}
