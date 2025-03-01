use crate::security::error::Error;
use user_agent_parser::UserAgentParser;

pub struct UserAgentInfo {
    pub browser: String,
    pub os: String,
    pub device: String,
    pub engine: String,
    pub cpu: String,
}

// https://github.com/ua-parser/uap-core
pub async fn get_user_agent_info(user_agent: &str) -> Result<UserAgentInfo, Error> {
    let ua_parser = UserAgentParser::from_path("src/assets/regexes.yaml")?;

    let product = ua_parser.parse_product(user_agent);
    let os = ua_parser.parse_os(user_agent);
    let device = ua_parser.parse_device(user_agent);
    let cpu = ua_parser.parse_cpu(user_agent);
    let engine = ua_parser.parse_engine(user_agent);

    let info = UserAgentInfo {
        browser: format!(
            "{} {}.{}",
            product.name.unwrap_or_default(),
            product.major.unwrap_or_default(),
            product.minor.unwrap_or_default()
        ),
        os: os.name.unwrap_or_default().to_string(),
        device: format!(
            "{} {}",
            device.brand.unwrap_or_default(),
            device.name.unwrap_or_default(),
        ),
        engine: engine.name.unwrap_or_default().to_string(),
        cpu: cpu.architecture.unwrap_or_default().to_string(),
    };

    Ok(info)
}
