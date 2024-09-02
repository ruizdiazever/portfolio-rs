use crate::routes::Result;
use crate::security::error::Error;
use axum::http::{header, HeaderValue, Method};
use tower_http::cors::CorsLayer;

fn get_env_var(name: &str) -> String {
    std::env::var(name).unwrap_or_else(|_| panic!("{} must be set in .env", name))
}

#[derive(Debug, Clone)]
pub struct Config {
    pub server_url: String,
    pub redis_url: String,
}

impl Config {
    pub fn init() -> Config {
        let redis_url = get_env_var("REDIS_URL");
        let server_url = get_env_var("API_SERVER_URL");
        Config {
            redis_url,
            server_url,
        }
    }
}

pub fn cors_config() -> Result<CorsLayer, Error> {
    let origins = vec![
        HeaderValue::from_str("http://localhost:3003")?,
        HeaderValue::from_str("http://127.0.0.1:3003/")?,
    ];

    let cors_layer = CorsLayer::new()
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_origin(origins)
        .allow_headers(vec![header::CONTENT_TYPE]);

    Ok(cors_layer)
}
