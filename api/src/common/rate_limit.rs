use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Hash, PartialEq, Eq)]
struct Key {
    ip: String,
    scope: &'static str,
}

#[derive(Debug, Clone, Copy)]
struct Entry {
    window_started: Instant,
    count: u32,
}

/// A small in-process rate limiter. The API runs as a single instance, so a
/// process-local window is enough and avoids a Redis round trip on the hot
/// path. Values reset on restart, which is acceptable for abuse protection.
#[derive(Debug, Clone, Default)]
pub struct RateLimiter {
    entries: Arc<Mutex<HashMap<Key, Entry>>>,
}

impl RateLimiter {
    /// Returns true when the request is allowed. A limit of zero always denies.
    pub fn check(&self, ip: &str, scope: &'static str, limit: u32, window: Duration) -> bool {
        if limit == 0 || window.is_zero() {
            return false;
        }

        let now = Instant::now();
        let mut entries = self
            .entries
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());

        let key = Key {
            ip: ip.to_string(),
            scope,
        };

        if entries.len() > 10_000 {
            entries.retain(|_, entry| now.duration_since(entry.window_started) < window);
        }

        if entries.len() >= 10_000 && !entries.contains_key(&key) {
            return false;
        }

        let entry = entries.entry(key).or_insert(Entry {
            window_started: now,
            count: 0,
        });

        if now.duration_since(entry.window_started) >= window {
            entry.window_started = now;
            entry.count = 0;
        }

        if entry.count >= limit {
            return false;
        }

        entry.count += 1;
        true
    }
}

#[cfg(test)]
mod tests {
    use super::RateLimiter;
    use std::time::Duration;

    #[test]
    fn limits_per_scope_and_ip() {
        let limiter = RateLimiter::default();
        let window = Duration::from_secs(60);

        assert!(limiter.check("203.0.113.7", "feedback", 2, window));
        assert!(limiter.check("203.0.113.7", "feedback", 2, window));
        assert!(!limiter.check("203.0.113.7", "feedback", 2, window));
        assert!(limiter.check("203.0.113.8", "feedback", 2, window));
        assert!(limiter.check("203.0.113.7", "visit", 1, window));
    }

    #[test]
    fn denies_when_window_is_zero() {
        assert!(!RateLimiter::default().check("203.0.113.7", "feedback", 1, Duration::ZERO));
    }
}
