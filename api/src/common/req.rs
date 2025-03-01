use crate::security::error::Error;
use serde::Deserialize;
use std::net::{Ipv4Addr, Ipv6Addr};

#[derive(Debug, Deserialize)]
pub struct IpInfo {
    pub ip: String,
    pub hostname: String,
    pub city: String,
    pub region: String,
    pub country: String,
    pub loc: String,
    pub org: String,
    pub postal: String,
    pub timezone: String,
}

pub async fn get_ip_info(ip: &str) -> Result<IpInfo, Error> {
    if !is_valid_ip(ip) {
        tracing::error!("Invalid IP address format: {}", ip);
        return Err(Error::NotFound);
    }

    let token = std::env::var("IPINFO_TOKEN").expect("Define IPINFO_TOKEN in your .env");
    let url = format!("https://ipinfo.io/{}/json?token={}", ip, token);
    tracing::info!("Fetching IP info from {}", url);
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await?;

    if response.status().is_success() {
        let ip_info = response.json::<IpInfo>().await?;
        Ok(ip_info)
    } else {
        tracing::error!("Error getting IP info: {}", response.status());
        Err(Error::NotFound)
    }
}

fn is_valid_ip(ip: &str) -> bool {
    ip.parse::<Ipv4Addr>().is_ok() || ip.parse::<Ipv6Addr>().is_ok()
}
