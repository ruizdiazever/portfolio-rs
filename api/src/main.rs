use api::{cfg, routes};
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Local development convenience; production gets real env vars.
    let _ = dotenvy::dotenv();

    let config = cfg::ConfigPortfolio::try_from_env()?;

    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("api=info,tower_http=info"));
    tracing_subscriber::fmt().with_env_filter(filter).init();

    let redis_client = redis::Client::open(config.redis_url.as_str())?;
    tracing::info!("Redis client configured");

    routes::serve(config, redis_client).await?;
    Ok(())
}
