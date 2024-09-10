use icondata as i;
use leptos::{html::Dialog, *};
use leptos_icons::*;
use leptos_router::*;

#[server]
pub async fn server_thing(
    id: String,
    reaction: u8,
    msg: String,
    title: String,
) -> Result<(), ServerFnError> {
    use crate::utils::api::post_feedback_request;
    use tracing::info;

    info!(
        "Sending feedback with id: {}, reaction: {} and msg: {}",
        id, reaction, msg
    );

    post_feedback_request(id, reaction, msg, title).await;
    Ok(())
}

#[component]
pub fn Feedback(
    show: ReadSignal<bool>,
    id: ReadSignal<String>,
    reaction: ReadSignal<u8>,
    title: ReadSignal<String>,
) -> impl IntoView {
    let action = create_server_action::<ServerThing>();
    let dialog_ref = create_node_ref::<Dialog>();
    let (msg, set_msg) = create_signal(String::new());
    let (error, set_error) = create_signal(None::<String>);

    create_effect(move |_| {
        if let Some(dialog) = dialog_ref.get() {
            dialog.set_open(show.get());
        }
    });

    let validate_message = move || {
        if msg().len() < 1 {
            set_error.set(Some("Please enter your feedback".to_string()));
            return false;
        } else {
            set_error.set(None);
            return true;
        }
    };

    let submit_form = move |_| {
        if validate_message() {
            action.dispatch(ServerThing {
                id: id.get(),
                reaction: reaction.get(),
                msg: msg.get(),
                title: title.get(),
            });
            if let Some(dialog) = dialog_ref.get() {
                dialog.set_open(false);
            }
        }
    };

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
                                    set_msg.set(event_target_value(&ev));
                                    validate_message();
                                }
                                prop:value=msg
                                class="resize-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your feedback"
                            />
                            {move || error().map(|err| view! { <div class="mt-2 text-sm text-red-500">{err}</div> })}
                        </div>
                    </div>

                    <ActionForm action>
                        <div class="flex justify-end">
                            <button
                                on:click=submit_form
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
