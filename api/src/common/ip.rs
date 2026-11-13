use axum::http::HeaderMap;
use std::net::{IpAddr, SocketAddr};

pub struct MetadataSession {
    pub user_agent: String,
    pub ip_address: String,
}

/// Returns the client address. Forwarding headers are only honored when the
/// direct peer is a local/private proxy, so a public caller cannot spoof them.
pub fn get_client_ip(headers: &HeaderMap, peer: IpAddr) -> String {
    if !is_trusted_proxy(peer) {
        return peer.to_string();
    }

    if let Some(forwarded) = headers.get("Forwarded") {
        if let Ok(forwarded) = forwarded.to_str() {
            for part in forwarded.split(',') {
                for parameter in part.split(';') {
                    if let Some(value) = parameter.trim().strip_prefix("for=") {
                        if let Some(ip) = parse_ip(value) {
                            return ip.to_string();
                        }
                    }
                }
            }
        }
    }

    if let Some(forwarded_for) = headers.get("X-Forwarded-For") {
        if let Ok(forwarded_for) = forwarded_for.to_str() {
            if let Some(ip) = forwarded_for.split(',').find_map(parse_ip) {
                return ip.to_string();
            }
        }
    }

    peer.to_string()
}

fn is_trusted_proxy(peer: IpAddr) -> bool {
    match peer {
        IpAddr::V4(ip) => ip.is_loopback() || ip.is_private(),
        IpAddr::V6(ip) => ip.is_loopback(),
    }
}

fn parse_ip(value: &str) -> Option<IpAddr> {
    let value = value.trim().trim_matches('"');

    if let Ok(ip) = value.parse::<IpAddr>() {
        return Some(ip);
    }
    if let Ok(address) = value.parse::<SocketAddr>() {
        return Some(address.ip());
    }

    value
        .strip_prefix('[')
        .and_then(|value| value.strip_suffix(']'))
        .and_then(|value| value.parse::<IpAddr>().ok())
}

#[cfg(test)]
mod tests {
    use super::get_client_ip;
    use axum::http::{HeaderMap, HeaderValue};
    use std::net::{IpAddr, Ipv4Addr, Ipv6Addr};

    fn headers(pairs: &[(&'static str, &'static str)]) -> HeaderMap {
        let mut headers = HeaderMap::new();
        for (name, value) in pairs {
            headers.insert(*name, HeaderValue::from_static(value));
        }
        headers
    }

    fn proxy() -> IpAddr {
        IpAddr::V4(Ipv4Addr::new(172, 18, 0, 1))
    }

    #[test]
    fn forwarded_header_wins_for_a_trusted_proxy() {
        let headers = headers(&[
            ("Forwarded", "for=203.0.113.7;proto=https"),
            ("X-Forwarded-For", "198.51.100.9"),
        ]);

        assert_eq!(get_client_ip(&headers, proxy()), "203.0.113.7");
    }

    #[test]
    fn x_forwarded_for_is_the_fallback() {
        let headers = headers(&[("X-Forwarded-For", "198.51.100.9, 10.0.0.1")]);

        assert_eq!(get_client_ip(&headers, proxy()), "198.51.100.9");
    }

    #[test]
    fn forwarding_headers_are_ignored_from_a_public_peer() {
        let headers = headers(&[("X-Forwarded-For", "198.51.100.9")]);
        let peer = IpAddr::V4(Ipv4Addr::new(203, 0, 113, 7));

        assert_eq!(get_client_ip(&headers, peer), "203.0.113.7");
    }

    #[test]
    fn parses_ipv6_forwarded_values() {
        let headers = headers(&[("X-Forwarded-For", "[2001:db8::1]:443")]);

        assert_eq!(
            get_client_ip(&headers, proxy()),
            IpAddr::V6(Ipv6Addr::new(0x2001, 0xdb8, 0, 0, 0, 0, 0, 1)).to_string()
        );
    }

    #[test]
    fn falls_back_to_the_peer() {
        assert_eq!(get_client_ip(&HeaderMap::new(), proxy()), "172.18.0.1");
    }
}
