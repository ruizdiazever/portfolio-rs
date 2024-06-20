use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Link(title: String, link: String, blank: bool) -> impl IntoView {
    let mut linked = "_self".to_string();
    let mut icon = view! {
        <Icon width="1em" height="1em" class="group-hover:translate-x-[1.5px]" icon=i::ChArrowRight />
    };

    if blank {
        linked = "_blank".to_string();
        icon = view! {
            <Icon width="1em" height="1em" class="group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
        };
    }

    view! {
        <a
            href={link}
            rel="noopener"
            target={linked}
            class="text-gray-600 duration-200 hover:text-[#68b5fc] group flex items-center gap-1 hover:underline hover:decoration-dashed hover:underline-offset-8 hover:decoration-[#68b5fc]"
        >
            <h2 class="text-xl font-medium">{title}</h2>
            {icon}
        </a>
    }
}

#[component]
pub fn LinkSimple(title: String, link: String, blank: bool) -> impl IntoView {
    let linked = if blank { "_blank" } else { "_self" };

    let value = if blank {
        view! {
            <a
                href={link}
                rel="noopener"
                target={linked}
                class="group inline-flex items-center hover:text-[#68b5fc] text-[#0074de] duration-200 hover:underline underline-offset-4 decoration-dashed decoration-[#57b1fc]">
                    {title}
                    <Icon width="0.7em" height="0.7em" class="hover:text-[#68b5fc] text-[#0074de] duration-200 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
            </a>
        }
    } else {
        view! {
            <a
                href={link}
                rel="noopener"
                target={linked}
                class="hover:text-[#68b5fc] text-[#0074de] duration-200 hover:underline underline-offset-4 decoration-dashed decoration-[#57b1fc]">
                {title}
            </a>
        }
    };

    value
}
