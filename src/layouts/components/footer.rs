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
          <div class="mx-auto max-w-screen-md px-4 py-8 sm:px-6 lg:px-8 mt-10">
            <div class="sm:flex sm:items-center sm:justify-between">
              <div class="flex justify-center text-gray-600 sm:justify-start text-sm antialiased gap-2">
                <Icon width="1.3em" height="1.3em" icon=i::AiHeartFilled />
                Rust Evangelist Strike Force
              </div>

              <p class="flex mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right antialiased">
                Ever Ruiz Diaz - {year}
              </p>
            </div>
          </div>
        </footer>
        </header>
    }
}
