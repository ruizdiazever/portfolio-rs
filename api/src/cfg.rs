use config::{Config, Environment};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct ConfigPortfolio {
    pub production: bool,
    pub rust_log: String,
    pub api_version: String,
    pub api_server_url: String,
    pub email: String,
    pub logo: String,
    pub redis_url: String,
    pub redis_password: String,
    pub smtp_username: String,
    pub smtp_password: String,
    pub ipinfo_token: String,
}

impl ConfigPortfolio {
    pub fn try_from_env() -> Result<Self, config::ConfigError> {
        Config::builder()
            .add_source(Environment::default())
            .build()?
            .try_deserialize()
    }
}
