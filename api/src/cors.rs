use crate::routes::Result;
use crate::security::error::Error;
use anyhow::Context;
use axum::http::{header, HeaderValue, Method};
use tower_http::cors::CorsLayer;

pub fn cors_config() -> Result<CorsLayer, Error> {
    let prod = std::env::var("PRODUCTION")
        .context("PRODUCTION must be set in .env")?
        .parse::<bool>()
        .context("PRODUCTION must be a boolean value")?;

    let origins = if prod {
        vec![HeaderValue::from_str("https://www.everdev.it")?]
    } else {
        vec![
            HeaderValue::from_str("http://localhost:4321")?,
            HeaderValue::from_str("http://localhost:4322")?,
        ]
    };

    let cors_layer = CorsLayer::new()
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_origin(origins)
        .allow_headers(vec![header::CONTENT_TYPE]);

    Ok(cors_layer)
}
