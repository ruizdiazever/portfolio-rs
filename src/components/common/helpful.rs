use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Helpful() -> impl IntoView {
    view! {
        <div class="flex items-center mx-auto justify-center
            p-2 w-[22rem] text-sm mt-10 gap-x-4
            shadow-sm rounded-full border border-gray-200 ">
          <p class="text-muted-foreground">Was this helpful?</p>
          <div class="flex items-center">
                <button class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#35c758] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::BsEmojiHeartEyes />
                </button>
                <button class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#32ade6] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::FaFaceGrinRegular />
                </button>
                <button class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#ffcc01] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::FaFaceMehRegular />
                </button>
                <button class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#ff3c2f] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::FaFaceSadCryRegular />
                </button>
          </div>
        </div>
    }
}
