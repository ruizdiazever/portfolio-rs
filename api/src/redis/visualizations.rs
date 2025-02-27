use crate::common::ip::MetadataSession;
use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use redis::AsyncCommands;
use sha2::{Digest, Sha256};
use uuid::Uuid;

const VISITS_HASH: &str = "visits";
const VISITS_FIELD_PREFIX: &str = "post:";
const UNIQUE_VISITOR_EXPIRE: usize = 86400; // 24 hs in seconds
const VISITOR_SCRIPT: &str = r#"
    local visitor_key = KEYS[1]
    local hash_key = KEYS[2]
    local field = KEYS[3]
    local expiration = ARGV[1]

    local set_result = redis.call('SET', visitor_key, 1, 'NX', 'EX', expiration)
    if set_result then
        return redis.call('HINCRBY', hash_key, field, 1)
    else
        return redis.call('HGET', hash_key, field) or 0
    end
"#;

fn generate_visitor_id(ip: &str, user_agent: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(ip.as_bytes());
    hasher.update(user_agent.as_bytes());
    format!("{:x}", hasher.finalize())
}

pub async fn sum_visit(
    ctx: &ApiContext,
    project_id: Uuid,
    meta: &MetadataSession,
) -> Result<i64, Error> {
    let mut redis_client = ctx
        .redis_client
        .get_multiplexed_async_connection()
        .await
        .map_err(|e| {
            tracing::error!("RedisDB error: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("RedisDB error"))
        })?;

    let visitor_id = generate_visitor_id(&meta.ip_address, &meta.user_agent);
    let visitor_key = format!("visitor:{}:{}", project_id, visitor_id);
    let field = format!("{}:{}", VISITS_FIELD_PREFIX, project_id);

    let script = redis::Script::new(VISITOR_SCRIPT);
    let count: i64 = script
        .key(visitor_key)
        .key(VISITS_HASH)
        .key(field)
        .arg(UNIQUE_VISITOR_EXPIRE)
        .invoke_async(&mut redis_client)
        .await
        .map_err(|e| {
            tracing::error!("Error executing Lua script: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("RedisDB error"))
        })?;

    Ok(count)
}

pub async fn get_visit(ctx: &ApiContext, project_id: Uuid) -> Result<i64, Error> {
    let mut redis_client = ctx
        .redis_client
        .get_multiplexed_async_connection()
        .await
        .map_err(|e| {
            tracing::error!("RedisDB error: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("RedisDB error"))
        })?;

    let field = format!("{}:{}", VISITS_FIELD_PREFIX, project_id);
    let visits: Option<i64> = redis_client.hget(VISITS_HASH, field).await.map_err(|e| {
        tracing::error!("Error getting hits from Redis: {:?}", e);
        Error::Anyhow(anyhow::anyhow!("RedisDB error"))
    })?;

    Ok(visits.unwrap_or(0))
}
