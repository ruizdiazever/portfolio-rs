use crate::components::common::modal::Feedback;
use icondata as i;
use leptos::*;
use leptos_icons::*;

#[component]
pub fn Helpful(id: ReadSignal<String>, title: ReadSignal<String>) -> impl IntoView {
    let (show_feedback, set_show_feedback) = create_signal(false);
    let (selected_reaction, set_selected_reaction) = create_signal(0);

    let open_feedback = move |reaction: u8| {
        set_selected_reaction(reaction);
        set_show_feedback(true);
    };

    view! {
        <div class="flex items-center mx-auto justify-center
            p-2 w-[22rem] text-sm mt-10 gap-x-4 bg-white
            shadow-sm rounded-full border border-gray-200 ">
          <p class="text-muted-foreground">Was this helpful?</p>
          <div class="flex items-center">
                // Loved
                <button on:click=move |_| open_feedback(4) class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#35c758] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::BsEmojiHeartEyes />
                </button>
                // Happy
                <button on:click=move |_| open_feedback(3) class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#32ade6] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::FaFaceGrinRegular />
                </button>
                // Neutral
                <button on:click=move |_| open_feedback(2) class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#ffcc01] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::FaFaceMehRegular />
                </button>
                // Sad
                <button on:click=move |_| open_feedback(1) class="flex h-10 w-10 items-center justify-center transition duration-500 ease-in-out
                rounded-full hover:bg-[#ff3c2f] hover:text-white">
                    <Icon class="h-5 w-5" icon=i::FaFaceSadCryRegular />
                </button>
          </div>
        </div>

        <Feedback show=show_feedback reaction=selected_reaction id=id title=title></Feedback>
    }
}
