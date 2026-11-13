use crate::security::error::Error;
use std::sync::OnceLock;
use user_agent_parser::UserAgentParser;

pub struct UserAgentInfo {
    pub browser: String,
    pub os: String,
    pub device: String,
}

static PARSER: OnceLock<Result<UserAgentParser, String>> = OnceLock::new();

fn parser() -> Result<&'static UserAgentParser, Error> {
    match PARSER.get_or_init(|| {
        UserAgentParser::from_path("src/assets/regexes.yaml")
            .map_err(|error| format!("failed to load user agent patterns: {error}"))
    }) {
        Ok(parser) => Ok(parser),
        Err(error) => Err(Error::Anyhow(anyhow::anyhow!(error.clone()))),
    }
}

pub fn get_user_agent_info(user_agent: &str) -> Result<UserAgentInfo, Error> {
    let parser = parser()?;

    let product = parser.parse_product(user_agent);
    let os = parser.parse_os(user_agent);
    let device = parser.parse_device(user_agent);

    Ok(UserAgentInfo {
        browser: format!(
            "{} {}.{}",
            product.name.unwrap_or_default(),
            product.major.unwrap_or_default(),
            product.minor.unwrap_or_default()
        )
        .trim()
        .to_string(),
        os: os.name.unwrap_or_default().to_string(),
        device: format!(
            "{} {}",
            device.brand.unwrap_or_default(),
            device.name.unwrap_or_default(),
        )
        .trim()
        .to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::get_user_agent_info;

    #[test]
    fn parses_a_known_browser() {
        let info = get_user_agent_info(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 \
             (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        )
        .expect("parser should exist");

        assert_eq!(info.os, "Linux");
        assert!(info.browser.starts_with("Chrome"));
    }
}
