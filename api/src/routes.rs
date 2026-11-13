use axum::{
    error_handling::HandleErrorLayer,
    http::{StatusCode, Uri},
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use reqwest::Client;
use serde_json::json;
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tower::{timeout::TimeoutLayer, ServiceBuilder};
use tower_http::trace::TraceLayer;

use crate::cfg::ConfigPortfolio;
use crate::common::rate_limit::RateLimiter;
use crate::common::ui::homepage;
use crate::cors::cors_config;
use crate::security::error::Error;
use crate::services::{feedback, visualizations};

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(Clone)]
pub struct ApiContext {
    pub env: Arc<ConfigPortfolio>,
    pub ctx: Client,
    pub redis_client: redis::Client,
    pub rate_limiter: RateLimiter,
}

pub async fn serve(config: ConfigPortfolio, redis_client: redis::Client) -> Result<(), Error> {
    let server = config.api_server_url.clone();

    let cors_layer = cors_config(&config)?;
    let ctx = Client::builder()
        .timeout(Duration::from_secs(5))
        .connect_timeout(Duration::from_secs(3))
        .user_agent(concat!("portfolio-api/", env!("CARGO_PKG_VERSION")))
        .build()?;

    let api_context = ApiContext {
        env: Arc::new(config),
        ctx,
        redis_client,
        rate_limiter: RateLimiter::default(),
    };

    let app = api_router(api_context).layer(cors_layer);

    tracing::info!("Launching server: {}", server);
    let listener = tokio::net::TcpListener::bind(&server)
        .await
        .map_err(|error| Error::Anyhow(anyhow::anyhow!("failed to bind {server}: {error}")))?;

    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(shutdown_signal())
    .await
    .map_err(|error| Error::Anyhow(anyhow::anyhow!("server failed: {error}")))?;

    Ok(())
}

fn api_router(api_context: ApiContext) -> Router {
    Router::new()
        .route("/", get(homepage))
        .merge(visualizations::visit_routes())
        .merge(feedback::feedback_routes())
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(HandleErrorLayer::new(|_| async {
                    (
                        StatusCode::REQUEST_TIMEOUT,
                        Json(json!({ "error": "Request timed out" })),
                    )
                }))
                .layer(TimeoutLayer::new(Duration::from_secs(5))),
        )
        .with_state(api_context)
        .fallback(fallback_handler)
}

async fn fallback_handler(uri: Uri) -> impl IntoResponse {
    tracing::warn!("No route for {uri}");
    (StatusCode::NOT_FOUND, Json(json!({ "error": "Not found" })))
}

async fn shutdown_signal() {
    let ctrl_c = async {
        if let Err(error) = tokio::signal::ctrl_c().await {
            tracing::error!("Failed to listen for Ctrl+C: {error}");
            std::future::pending::<()>().await;
        }
    };

    #[cfg(unix)]
    let terminate = async {
        match tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate()) {
            Ok(mut signal) => {
                signal.recv().await;
            }
            Err(error) => {
                tracing::error!("Failed to listen for SIGTERM: {error}");
                std::future::pending::<()>().await;
            }
        }
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    tracing::info!("Shutdown signal received");
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    fn context() -> ApiContext {
        ApiContext {
            env: Arc::new(ConfigPortfolio {
                production: false,
                api_version: "test".into(),
                api_server_url: "127.0.0.1:0".into(),
                email: "test@example.com".into(),
                logo: "https://example.com/logo.png".into(),
                redis_url: "redis://127.0.0.1/".into(),
                redis_password: String::new(),
                smtp_host: "smtp.example.com".into(),
                smtp_port: 587,
                smtp_username: "test@example.com".into(),
                smtp_password: String::new(),
                ipinfo_token: String::new(),
            }),
            ctx: Client::new(),
            redis_client: redis::Client::open("redis://127.0.0.1/").expect("test redis URL"),
            rate_limiter: RateLimiter::default(),
        }
    }

    #[tokio::test]
    async fn health_route_serves_the_api_page() {
        let response = api_router(context())
            .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn unknown_route_returns_json_404() {
        let response = api_router(context())
            .oneshot(
                Request::builder()
                    .uri("/does-not-exist")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NOT_FOUND);
        let content_type = response
            .headers()
            .get("content-type")
            .and_then(|value| value.to_str().ok())
            .unwrap_or_default();
        assert!(content_type.starts_with("application/json"));
    }
}
