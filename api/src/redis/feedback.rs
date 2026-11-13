use crate::redis::models::{ExtraData, Payload};
use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use serde::{Deserialize, Serialize};
use tracing::{error, info};
use uuid::Uuid;

const FEEDBACK_TTL_SECONDS: i64 = 90 * 24 * 60 * 60;

#[derive(Debug, Serialize, Deserialize)]
pub struct Output {
    pub success: bool,
    pub id: String,
}

pub async fn save_feedback_to_redis(
    ctx: &ApiContext,
    feedback: Payload,
    extra_data: ExtraData,
) -> Result<Output, Error> {
    let reaction_type: &'static str = match feedback.reaction {
        4 => "love",
        3 => "happy",
        2 => "neutral",
        1 => "sad",
        _ => return Err(Error::Forbidden),
    };

    let mut redis_client = ctx
        .redis_client
        .get_multiplexed_async_connection()
        .await
        .map_err(|error| {
            error!("RedisDB connection failed: {error:?}");
            Error::Anyhow(anyhow::anyhow!("RedisDB error"))
        })?;

    let feedback_key = format!("feedback:{}", feedback.id);
    let ids_key = format!("{feedback_key}:ids");
    let feedback_id = Uuid::new_v4().to_string();
    let feedback_data = serde_json::json!({
        "id": feedback_id,
        "title": feedback.title,
        "reaction": reaction_type,
        "message": feedback.msg,
        "language": feedback.language,
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "extra_data": extra_data,
    });

    let mut pipe = redis::pipe();
    pipe.atomic()
        .hset(&feedback_key, &feedback_id, feedback_data.to_string())
        .ignore()
        .rpush(&ids_key, &feedback_id)
        .ignore()
        .expire(&feedback_key, FEEDBACK_TTL_SECONDS)
        .ignore()
        .expire(&ids_key, FEEDBACK_TTL_SECONDS)
        .ignore();

    let _: () = pipe.query_async(&mut redis_client).await.map_err(|error| {
        error!("Error saving feedback to Redis: {error:?}");
        Error::Anyhow(anyhow::anyhow!("Error saving feedback"))
    })?;

    info!(
        "Feedback saved for post {}, feedback {}",
        feedback.id, feedback_id
    );

    Ok(Output {
        success: true,
        id: feedback_id,
    })
}
