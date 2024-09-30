use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use redis::AsyncCommands;
use tracing::{error, info};
use uuid::Uuid;

const VISITS_HASH: &str = "visits";
const VISITS_FIELD_PREFIX: &str = "post:";

pub async fn sum_visit(ctx: &ApiContext, project_id: Uuid) -> Result<i64, Error> {
    let mut redis_client = ctx.redis_client.get_async_connection().await.map_err(|e| {
        error!("RedisDB error: {:?}", e);
        Error::Anyhow(anyhow::anyhow!("RedisDB error"))
    })?;

    let field = format!("{}{}", VISITS_FIELD_PREFIX, project_id);

    // Verificar si el campo existe
    let exists: bool = redis_client
        .hexists(VISITS_HASH, &field)
        .await
        .map_err(|e| {
            error!(
                "Error verifying the existence of the field in Redis: {:?}",
                e
            );
            Error::Anyhow(anyhow::anyhow!("RedisDB error"))
        })?;

    if !exists {
        info!("Creating a new counter for the project: {}", project_id);
    }

    let new_count: i64 = redis_client
        .hincr::<_, _, _, i64>(VISITS_HASH, field, 1)
        .await
        .map_err(|e| {
            error!("Error increasing visits in Redis: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("RedisDB error"))
        })?;

    info!(
        "Up-to-date accountant for the project {}: {}",
        project_id, new_count
    );

    Ok(new_count)
}

pub async fn get_visit(ctx: &ApiContext, project_id: Uuid) -> Result<i64, Error> {
    let mut redis_client = ctx.redis_client.get_async_connection().await.map_err(|e| {
        error!("RedisDB error: {:?}", e);
        Error::Anyhow(anyhow::anyhow!("RedisDB error"))
    })?;

    let field = format!("{}{}", VISITS_FIELD_PREFIX, project_id);
    let visits: Option<i64> = redis_client.hget(VISITS_HASH, field).await.map_err(|e| {
        error!("Error getting hits from Redis: {:?}", e);
        Error::Anyhow(anyhow::anyhow!("RedisDB error"))
    })?;

    Ok(visits.unwrap_or(0))
}
