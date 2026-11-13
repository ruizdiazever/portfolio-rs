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

pub async fn get_ip_info(client: &reqwest::Client, ip: &str, token: &str) -> Result<IpInfo, Error> {
    if !is_valid_ip(ip) {
        tracing::warn!("Invalid IP address format");
        return Err(Error::NotFound);
    }

    let url = reqwest::Url::parse_with_params(
        &format!("https://ipinfo.io/{ip}/json"),
        &[("token", token)],
    )
    .map_err(|error| Error::Anyhow(anyhow::anyhow!("invalid IP info URL: {error}")))?;
    tracing::debug!("Fetching IP info for {ip}");
    let response = client.get(url).send().await?;

    if !response.status().is_success() {
        tracing::warn!("IP info request failed with status {}", response.status());
        return Err(Error::NotFound);
    }

    Ok(response.json::<IpInfo>().await?)
}

fn is_valid_ip(ip: &str) -> bool {
    ip.parse::<Ipv4Addr>().is_ok() || ip.parse::<Ipv6Addr>().is_ok()
}

#[cfg(test)]
mod tests {
    use super::is_valid_ip;

    #[test]
    fn validates_ipv4_and_ipv6() {
        assert!(is_valid_ip("203.0.113.7"));
        assert!(is_valid_ip("2001:db8::1"));
        assert!(!is_valid_ip("Unknown"));
        assert!(!is_valid_ip("203.0.113.7:443"));
    }
}
