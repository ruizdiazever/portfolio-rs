use crate::common::ip::MetadataSession;
use crate::common::req::get_ip_info;
use crate::common::user_agent::get_user_agent_info;
use crate::redis::models::ExtraData;
use crate::security::error::Error;

pub async fn get_extra_data(meta: &MetadataSession) -> Result<ExtraData, Error> {
    let ip_info = get_ip_info(&meta.ip_address).await;

    tracing::info!("IP Info: {:?}", ip_info);
    let mut location: String = "Unknown".to_string();
    if let Ok(i) = ip_info {
        location = format!("{}, {}, {}", i.city, i.region, i.country);
    };
    tracing::info!("Location: {}", location);

    let user_agent_info = get_user_agent_info(meta.user_agent.as_str()).await?;

    Ok(ExtraData {
        ip: meta.ip_address.clone(),
        user_agent: meta.user_agent.clone(),
        os: user_agent_info.os,
        device: user_agent_info.device,
        browser: user_agent_info.browser,
        location,
    })
}
