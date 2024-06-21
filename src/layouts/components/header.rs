use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Header() -> impl IntoView {
    view! {
        <header class="flex items-center justify-between max-w-screen-md mx-auto
        mt-6 sticky top-0 backdrop-blur-lg z-50 antialiased
        px-6 sm:px-6 lg:px-8">
          <div class="flex flex-col items-start gap-1">
            <div class="text-2xl font-semibold">Ever Ruiz Diaz</div>
            <div class="text-muted-foreground text-md text-gray-600">Rust Developer</div>
          </div>
          <div class="flex items-center gap-2">
            <button
                class="text-gray-700 hover:text-[#68b5fc]
                rounded-md transition duration-200
                bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                size="icon"
            >
              <Icon class="h-5 w-5" icon=i::AiSearchOutlined />
              <span class="sr-only">Search</span>
            </button>
            <Icon class="h-5 w-5 transform rotate-90 text-gray-500" icon=i::AiMinusOutlined />
            <a
                href="https://www.linkedin.com/" rel="noopener" target="_blank"
                class="inline-flex items-center justify-center text-gray-700 hover:text-[#68b5fc]
                w-8 h-8 rounded-md text-sm font-medium transition hover:bg-gray-100
                bg-muted focus:outline-none focus:ring-1 focus:ring-ring duration-200"
            >
              <Icon class="h-5 w-5" icon=i::BsLinkedin />
              <span class="sr-only">LinkedIn</span>
            </a>
            <a
                href="https://www.linkedin.com/" rel="noopener" target="_blank"
                class="inline-flex items-center justify-center text-gray-700 hover:text-[#68b5fc]
                w-8 h-8 rounded-md text-sm font-medium transition hover:bg-gray-100
                bg-muted focus:outline-none focus:ring-1 focus:ring-ring duration-200"
            >
              <Icon class="h-5 w-5" icon=i::FaGithubBrands />
              <span class="sr-only">GitHub</span>
            </a>
            <a
                href="https://www.linkedin.com/" rel="noopener"  target="_blank"
                class="inline-flex items-center justify-center text-gray-700 hover:text-[#68b5fc]
                w-8 h-8 rounded-md text-sm font-medium transition hover:bg-gray-100
                bg-muted focus:outline-none focus:ring-1 focus:ring-ring duration-200"
            >
              <Icon class="h-5 w-5" icon=i::BsTwitterX />
              <span class="sr-only">Twitter</span>
            </a>
          </div>
        </header>
    }
}
