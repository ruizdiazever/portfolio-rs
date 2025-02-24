use chrono::prelude::*;
use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Footer() -> impl IntoView {
    let year = Local::now().year().to_string();
    view! {
        <header>
        <footer>
          <div class="mx-auto max-w-screen-md px-4 py-8 sm:px-6 lg:px-8 mt-10 antialiased">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="flex justify-center text-gray-600 sm:justify-start text-sm gap-2">
                <Icon width="1.3em" height="1.3em" icon=i::AiHeartFilled />
                Rust Evangelist Strike Force
              </div>

              <p class="flex mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
                Ever Ruiz Diaz<span class="mx-1">-</span>{year}
              </p>
            </div>
          </div>
        </footer>
        </header>
    }
}
