use api::{cfg, routes};
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Config
    let config = cfg::ConfigPortfolio::try_from_env()?;

    // Init Tracing
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // RedisDB
    let redis_url = config.redis_url.to_owned();
    let redis_client = match redis::Client::open(&*redis_url) {
        Ok(client) => {
            tracing::info!("RedisDB connection was successful!");
            client
        }
        Err(e) => {
            tracing::info!("Error connecting to RedisDB: {}", e);
            std::process::exit(1);
        }
    };

    // Server
    let config = config.clone();
    routes::serve(config, redis_client).await?;

    Ok(())
}
