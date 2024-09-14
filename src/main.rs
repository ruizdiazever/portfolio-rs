#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
    use axum::Router;
    use dotenvy::dotenv;
    use leptos::*;
    use leptos_axum::{generate_route_list, LeptosRoutes};
    use portfolio::app::*;
    use portfolio::fileserv::file_and_error_handler;
    use tower_http::compression::{
        predicate::{NotForContentType, SizeAbove},
        CompressionLayer, CompressionLevel, Predicate,
    };
    use tracing::info;
    use tracing_subscriber::EnvFilter;

    // Load environment configuration from .env
    dotenv().expect("Set your configuration in a .env file");

    // Init Tracing
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Setting get_configuration(None) means we'll be using cargo-leptos's env values
    // For deployment these variables are:
    // <https://github.com/leptos-rs/start-axum#executing-a-server-on-a-remote-machine-without-the-toolchain>
    // Alternately a file can be specified such as Some("Cargo.toml")
    // The file would need to be included with the executable when moved to deployment
    let conf = get_configuration(Some("Cargo.toml")).await.unwrap();
    let leptos_options = conf.leptos_options;
    let routes = generate_route_list(App);

    // Files smaller than 1501 bytes are not compressed, since the MTU (Maximum Transmission Unit) of a TCP packet is 1500 bytes
    let predicate = SizeAbove::new(1500)
        .and(NotForContentType::GRPC)
        .and(NotForContentType::IMAGES)
        // Prevent compressing assets that are already statically compressed
        //.and(NotForContentType::const_new("application/javascript"))
        //.and(NotForContentType::const_new("text/css"))
        .and(NotForContentType::const_new("application/wasm"));

    // build our application with a route
    let app = Router::new()
        .leptos_routes(&leptos_options, routes, App)
        .layer(
            CompressionLayer::new()
                .quality(CompressionLevel::Best)
                .compress_when(predicate),
        )
        .fallback(file_and_error_handler)
        .with_state(leptos_options);

    let addr = std::env::var("LEPTOS_SITE_ADDR").unwrap();
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();

    info!("Listening on http://{}", &addr);

    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

#[cfg(not(feature = "ssr"))]
pub fn main() {
    // no client-side main function
    // unless we want this to work with e.g., Trunk for a purely client-side app
    // see lib.rs for hydration function instead
}
