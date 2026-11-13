use config::{Config, ConfigError, Environment};
use serde::Deserialize;
use std::fmt;

fn default_smtp_host() -> String {
    "smtp.gmail.com".to_string()
}

fn default_smtp_port() -> u16 {
    587
}

#[derive(Deserialize, Clone)]
pub struct ConfigPortfolio {
    pub production: bool,
    pub api_version: String,
    pub api_server_url: String,
    pub email: String,
    pub logo: String,
    pub redis_url: String,
    pub redis_password: String,
    #[serde(default = "default_smtp_host")]
    pub smtp_host: String,
    #[serde(default = "default_smtp_port")]
    pub smtp_port: u16,
    pub smtp_username: String,
    pub smtp_password: String,
    pub ipinfo_token: String,
}

impl fmt::Debug for ConfigPortfolio {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("ConfigPortfolio")
            .field("production", &self.production)
            .field("api_version", &self.api_version)
            .field("api_server_url", &self.api_server_url)
            .field("email", &self.email)
            .field("logo", &self.logo)
            .field("redis_url", &"<redacted>")
            .field("redis_password", &"<redacted>")
            .field("smtp_host", &self.smtp_host)
            .field("smtp_port", &self.smtp_port)
            .field("smtp_username", &self.smtp_username)
            .field("smtp_password", &"<redacted>")
            .field("ipinfo_token", &"<redacted>")
            .finish()
    }
}

impl ConfigPortfolio {
    pub fn try_from_env() -> Result<Self, ConfigError> {
        let config = Config::builder()
            .add_source(Environment::default().try_parsing(true))
            .build()?
            .try_deserialize::<Self>()?;

        config.validate()?;
        Ok(config)
    }

    fn validate(&self) -> Result<(), ConfigError> {
        if self.api_server_url.parse::<std::net::SocketAddr>().is_err() {
            return Err(ConfigError::Message(
                "API_SERVER_URL must be a valid host:port socket address".into(),
            ));
        }
        if !self.redis_url.starts_with("redis://") && !self.redis_url.starts_with("rediss://") {
            return Err(ConfigError::Message(
                "REDIS_URL must start with redis:// or rediss://".into(),
            ));
        }
        if self.email.trim().is_empty() || !self.email.contains('@') {
            return Err(ConfigError::Message(
                "EMAIL must be a valid email address".into(),
            ));
        }
        if self.smtp_host.trim().is_empty() {
            return Err(ConfigError::Message("SMTP_HOST must not be empty".into()));
        }
        if self.smtp_port == 0 {
            return Err(ConfigError::Message("SMTP_PORT must be non-zero".into()));
        }
        if self.api_version.trim().is_empty() {
            return Err(ConfigError::Message("API_VERSION must not be empty".into()));
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn base_config() -> ConfigPortfolio {
        ConfigPortfolio {
            production: false,
            api_version: "0.0.1".into(),
            api_server_url: "127.0.0.1:3002".into(),
            email: "test@example.com".into(),
            logo: "https://example.com/logo.png".into(),
            redis_url: "redis://default:change-me@127.0.0.1:6379/".into(),
            redis_password: "change-me".into(),
            smtp_host: "smtp.example.com".into(),
            smtp_port: 587,
            smtp_username: "test@example.com".into(),
            smtp_password: "secret".into(),
            ipinfo_token: "token".into(),
        }
    }

    #[test]
    fn validates_a_complete_config() {
        assert!(base_config().validate().is_ok());
    }

    #[test]
    fn rejects_an_invalid_redis_url() {
        let mut config = base_config();
        config.redis_url = "http://localhost:6379".into();
        assert!(config.validate().is_err());
    }

    #[test]
    fn debug_never_prints_secrets() {
        let config = base_config();
        let rendered = format!("{config:?}");
        assert!(!rendered.contains("secret"));
        assert!(!rendered.contains("change-me"));
        assert!(!rendered.contains("\"token\""));
        assert!(rendered.contains("<redacted>"));
    }
}
