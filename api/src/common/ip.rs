use axum::http::HeaderMap;
use std::net::IpAddr;

pub struct MetadataSession {
    pub user_agent: String,
    pub ip_address: String,
}

pub async fn get_client_ip(headers: &HeaderMap) -> String {
    fn validate_ip(ip: &str) -> Option<String> {
        if let Ok(ip_addr) = ip.parse::<IpAddr>() {
            return Some(ip_addr.to_string());
        }
        None
    }

    // "Forwarded"
    if let Some(forwarded) = headers.get("Forwarded") {
        if let Ok(forwarded_str) = forwarded.to_str() {
            for part in forwarded_str.split(',') {
                let cleaned_part = part.trim();
                if let Some(ip_part) = cleaned_part.split_once("for=") {
                    let ip_with_metadata = ip_part.1.split(';').next().unwrap_or("");
                    let ip = ip_with_metadata
                        .trim_matches(|c| c == '"' || c == '[' || c == ']')
                        .split(':')
                        .next()
                        .unwrap_or("");
                    if let Some(valid_ip) = validate_ip(ip) {
                        return valid_ip;
                    }
                }
            }
        }
    }

    // Fallback a "X-Forwarded-For"
    if let Some(forwarded_for) = headers.get("X-Forwarded-For") {
        if let Ok(forwarded_for_str) = forwarded_for.to_str() {
            if let Some(first_ip) = forwarded_for_str
                .split(',')
                .find_map(|s| validate_ip(s.trim()))
            {
                return first_ip;
            }
        }
    }

    tracing::warn!("No valid IP address found in headers");
    "Unknown".to_string()
}

#[cfg(test)]
mod tests {
    use super::get_client_ip;
    use axum::http::{HeaderMap, HeaderValue};

    fn headers(pairs: &[(&'static str, &'static str)]) -> HeaderMap {
        let mut headers = HeaderMap::new();
        for (name, value) in pairs {
            headers.insert(*name, HeaderValue::from_static(value));
        }
        headers
    }

    #[tokio::test]
    async fn forwarded_header_wins() {
        let headers = headers(&[
            ("Forwarded", "for=203.0.113.7;proto=https"),
            ("X-Forwarded-For", "198.51.100.9"),
        ]);

        assert_eq!(get_client_ip(&headers).await, "203.0.113.7");
    }

    #[tokio::test]
    async fn x_forwarded_for_is_the_fallback() {
        let headers = headers(&[("X-Forwarded-For", "198.51.100.9, 10.0.0.1")]);

        assert_eq!(get_client_ip(&headers).await, "198.51.100.9");
    }

    #[tokio::test]
    async fn unknown_without_forwarding_headers() {
        assert_eq!(get_client_ip(&HeaderMap::new()).await, "Unknown");
    }
}
