use crate::components::common::values::Link;
use leptos::*;

#[component]
pub fn Working() -> impl IntoView {
    // Links
    let link_rust = Link::Rust.to_view();
    let link_leptos = Link::Leptos.to_view();
    let link_vercel = Link::Vercel.to_view();
    let link_nothing = Link::Nothing.to_view();
    let link_apple = Link::Apple.to_view();
    let link_spacex = Link::Spacex.to_view();
    let link_guille = Link::Guille.to_view();

    view! {
        // Very soon
        <h1 class="text-2xl text-gray-800">The Journey to Excellence: building my web portfolio</h1>
        <p class="text-gray-700">
            Welcome to my WASM portfolio, a cutting-edge showcase of my work with {link_rust} and WebAssembly, powered by the {link_leptos} framework.
        </p>
        <p class="text-gray-700">
            This portfolio is more than just a collection of projects; it reflects my commitment to excellence and innovation in the tech industry.
        </p>
        <p class="text-gray-700">
            Inspired by the achievements of {link_spacex}, {link_apple}, {link_nothing}, and {link_vercel}, with {link_guille} as a role model for Latinos in software development, I strive for top-tier standards.
        </p>
        <p class="text-gray-700">
            Explore sections currently under development, exemplifying quality and precision.
            Every element is thoughtfully curated to create a functional and aesthetically pleasing digital space. Though some parts are still in progress, I am excited to share this journey with you.        </p>
        <img
            class="w-auto mx-auto"
            src="/illustration/working.svg"
            alt="Working"
            href="/"
        />
    }
}
