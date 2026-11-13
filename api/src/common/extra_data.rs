use crate::common::ip::MetadataSession;
use crate::common::req::get_ip_info;
use crate::common::user_agent::get_user_agent_info;
use crate::redis::models::ExtraData;
use crate::security::error::Error;

pub async fn get_extra_data(
    client: &reqwest::Client,
    ipinfo_token: &str,
    meta: &MetadataSession,
) -> Result<ExtraData, Error> {
    let location = match get_ip_info(client, &meta.ip_address, ipinfo_token).await {
        Ok(info) => {
            let parts: Vec<&str> = [
                info.city.as_str(),
                info.region.as_str(),
                info.country.as_str(),
            ]
            .into_iter()
            .filter(|part| !part.trim().is_empty())
            .collect();
            if parts.is_empty() {
                "Unknown".to_string()
            } else {
                parts.join(", ")
            }
        }
        Err(_) => {
            tracing::warn!("IP info unavailable");
            "Unknown".to_string()
        }
    };

    let user_agent_info = get_user_agent_info(meta.user_agent.as_str())?;

    Ok(ExtraData {
        ip: meta.ip_address.clone(),
        user_agent: meta.user_agent.clone(),
        os: user_agent_info.os,
        device: user_agent_info.device,
        browser: user_agent_info.browser,
        location,
    })
}
