use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Header() -> impl IntoView {
    view! {
        <header class="mt-6 sticky top-0 backdrop-blur-lg z-50">
          <div class="mx-auto max-w-screen-md px-6 sm:px-6 lg:px-8 mb-6 antialiased">
            <div class="flex h-16 items-center justify-between">
                <div class="md:flex md:items-center md:gap-12">
                    <a href="/" class="flex items-center justify-center text-gray-900 hover:text-gray-950 duration-200">
                        <div class="block items-center justify-center">
                            <p class="text-xl font-semibold">Ever Ruiz Diaz</p>
                            <p class="text-md">Rust Developer</p>
                        </div>
                    </a>
                </div>
                <div class="flex gap-2 h-100">
                    <a rel="noopener" href="https://x.com/EverToujours" target="_blank" class="block text-gray-600 rounded-md p-2 text-sm font-medium text-black transition hover:bg-gray-100">
                        <Icon width="1.3em" height="1.3em" icon=i::BsTwitterX />
                    </a>
                    <a rel="noopener" href="https://github.com/ruizdiazever" target="_blank" class="block text-gray-600 rounded-md p-2 text-sm font-medium text-black transition hover:bg-gray-100">
                        <Icon width="1.3em" height="1.3em" icon=i::FaGithubBrands />
                    </a>
                    <a rel="noopener" href="https://www.linkedin.com/" target="_blank" class="block text-gray-600 rounded-md p-2 text-sm font-medium text-black transition hover:bg-gray-100">
                        <Icon width="1.3em" height="1.3em" icon=i::BsLinkedin />
                    </a>
                </div>
            </div>
          </div>
        </header>
    }
}
