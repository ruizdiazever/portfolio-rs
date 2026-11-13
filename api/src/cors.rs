use crate::cfg::ConfigPortfolio;
use crate::routes::Result;
use crate::security::error::Error;
use axum::http::{header, HeaderValue, Method};
use tower_http::cors::CorsLayer;

pub fn cors_config(config: &ConfigPortfolio) -> Result<CorsLayer, Error> {
    let origins = if config.production {
        vec![
            HeaderValue::from_str("https://www.everdev.it")?,
            HeaderValue::from_str("https://everdev.it")?,
        ]
    } else {
        vec![
            HeaderValue::from_str("http://localhost:4321")?,
            HeaderValue::from_str("http://127.0.0.1:4321")?,
            HeaderValue::from_str("http://localhost:4322")?,
            HeaderValue::from_str("http://127.0.0.1:4322")?,
        ]
    };

    Ok(CorsLayer::new()
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_origin(origins)
        .allow_headers(vec![header::CONTENT_TYPE]))
}
