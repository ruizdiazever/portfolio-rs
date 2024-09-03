use http::status::StatusCode;
use icondata as i;
use leptos::*;
use leptos_icons::*;
use thiserror::Error;

#[derive(Clone, Debug, Error)]
pub enum AppError {
    #[error("Not Found")]
    NotFound,
}

impl AppError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            AppError::NotFound => StatusCode::NOT_FOUND,
        }
    }
}

// A basic function to display errors served by the error boundaries.
// Feel free to do more complicated things here than just displaying the error.
#[component]
pub fn ErrorTemplate(
    #[prop(optional)] outside_errors: Option<Errors>,
    #[prop(optional)] errors: Option<RwSignal<Errors>>,
) -> impl IntoView {
    let errors = match outside_errors {
        Some(e) => create_rw_signal(e),
        None => match errors {
            Some(e) => e,
            None => panic!("No Errors found and we expected errors!"),
        },
    };
    // Get Errors from Signal
    let errors = errors.get_untracked();

    // Downcast lets us take a type that implements `std::error::Error`
    let errors: Vec<AppError> = errors
        .into_iter()
        .filter_map(|(_k, v)| v.downcast_ref::<AppError>().cloned())
        .collect();
    println!("Errors: {errors:#?}");

    // Only the response code for the first error is actually sent from the server
    // this may be customized by the specific application
    #[cfg(feature = "ssr")]
    {
        use leptos_axum::ResponseOptions;
        let response = use_context::<ResponseOptions>();
        if let Some(response) = response {
            response.set_status(errors[0].status_code());
        }
    }

    view! {
        <div class="grid h-screen place-content-center bg-white px-4 antialiased">
            <h1 class="text-center mb-6">{if errors.len() > 1 {"Errors"} else {"Error"}}</h1>
            <For
                // a function that returns the items we're iterating over; a signal is fine
                each= move || {errors.clone().into_iter().enumerate()}
                // a unique key for each item as a reference
                key=|(index, _error)| *index
                // renders each item to a view
                children=move |error| {
                    let error_string = error.1.to_string();
                    let error_code= error.1.status_code();
                    view! {

                        <h1 class="uppercase tracking-widest text-gray-500 text-xl">{error_code.to_string()} | {error_string}</h1>
                        <a href="/" class="flex items-center justify-center text-center gap-1 mt-6 duration-200 hover:text-[#68b5fc]">
                            <Icon width="1.1em" height="1.1em" icon=i::BiArrowBackRegular />
                            Go back home
                        </a>
                    }
                }
            />
        </div>
    }
}
