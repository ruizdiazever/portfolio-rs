use icondata as i;
use leptos::{html::Dialog, *};
use leptos_icons::*;
use leptos_router::*;
use tracing::info;

#[server]
pub async fn server_thing(option: u8, feedback: String) -> Result<(), ServerFnError> {
    info!(
        "Running on server with option: {} and feedback: {}",
        option, feedback
    );
    Ok(())
}

#[component]
pub fn Feedback(show: ReadSignal<bool>, option: ReadSignal<u8>) -> impl IntoView {
    let action = create_server_action::<ServerThing>();
    let dialog_ref = create_node_ref::<Dialog>();
    let (feedback, set_feedback) = create_signal(String::new());

    create_effect(move |_| {
        if let Some(dialog) = dialog_ref.get() {
            dialog.set_open(show.get());
        }
    });

    view! {
        <dialog node_ref=dialog_ref>
            <div class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex items-center justify-center">
            <div role="dialog" aria-modal="true" aria-labelledby="modal-title" class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full max-h-full text-left">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Feedback</h2>
                    <ActionForm action>
                        <button formmethod="dialog" class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded">
                            <Icon class="h-5 w-5" icon=i::AiCloseOutlined />
                            <span class="sr-only">Close</span>
                        </button>
                    </ActionForm>
                </div>

                <div class="space-y-4 mb-4">
                    <div>
                        <textarea
                            type="text"
                            on:input=move |ev| {
                                set_feedback.set(event_target_value(&ev));
                            }
                            prop:value=feedback
                            class="resize-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your feedback"
                        />
                    </div>
                </div>

                <ActionForm action>
                    <div class="flex justify-end">
                        <button
                            on:click=move |_| {
                            action.dispatch(ServerThing { option: option.get(), feedback: feedback.get() });
                            if let Some(dialog) = dialog_ref.get() {
                                dialog.set_open(false);
                            }
                        }
                        class="px-4 py-2 bg-black text-white rounded-lg
                            hover:bg-[#5e626f] focus:outline-none focus:ring-2
                            focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </div>
                </ActionForm>
            </div>
            </div>
        </dialog>
    }
}
