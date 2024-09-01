use axum::{
    error_handling::HandleErrorLayer,
    http::{StatusCode, Uri},
    response::IntoResponse,
    routing::get,
    Router,
};
use reqwest::Client;
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tower::{timeout::TimeoutLayer, ServiceBuilder};
use tower_http::trace::TraceLayer;
use tracing::{error, info};

use crate::common::ui::homepage;
use crate::config::{cors_config, Config};
use crate::security::error::Error;
use crate::services::visits;

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(Clone)]
pub struct ApiContext {
    pub env: Arc<Config>,
    pub ctx: Client,
    pub redis_client: redis::Client,
}

pub async fn serve(config: Config, redis_client: redis::Client) -> Result<(), Error> {
    // Envs
    let server = config.server_url.clone();

    let ctx = Client::new();
    let api_context = ApiContext {
        env: Arc::new(config),
        ctx,
        redis_client,
    };

    let cors_layer = cors_config()?;
    let app = api_router(api_context)?.layer(cors_layer);

    let addr = tokio::net::TcpListener::bind(&server)
        .await
        .expect("Check SERVER in your .env");
    info!("Launching server: http://{}/", server);

    axum::serve(
        addr,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(signal_shutdown())
    .await
    .expect("Something went wrong running server");

    Ok(())
}

fn api_router(api_context: ApiContext) -> Result<Router, Error> {
    let router = Router::new()
        .route("/", get(homepage))
        .merge(visits::visit_routes())
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(HandleErrorLayer::new(|_| async {
                    StatusCode::REQUEST_TIMEOUT
                }))
                .layer(TimeoutLayer::new(Duration::from_secs(5))),
        )
        .with_state(api_context)
        .fallback(fallback_handler);

    Ok(router)
}

async fn fallback_handler(uri: Uri) -> impl IntoResponse {
    error!("No route for {}", uri);
    (StatusCode::NOT_FOUND, format!("No route for {}", uri))
}

async fn signal_shutdown() {
    tokio::signal::ctrl_c()
        .await
        .expect("Expect tokio signal Ctrl-c");
}
