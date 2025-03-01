use crate::redis::models::{ExtraData, Payload};
use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use redis::AsyncCommands;
use serde::{Deserialize, Serialize};
use tracing::{error, info};
use uuid::Uuid;

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
        .map_err(|e| {
            error!("RedisDB error: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("RedisDB error"))
        })?;

    let feedback_key = format!("feedback:{}", feedback.id);
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

    // Use HSET to save the new feedback as a field within the post's hash
    let _: () = redis_client
        .hset(&feedback_key, &feedback_id, feedback_data.to_string())
        .await
        .map_err(|e| {
            error!("Error saving feedback to Redis: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("Error saving feedback"))
        })?;

    // Optionally, maintain a list of feedback IDs for this post
    let _: () = redis_client
        .rpush(format!("{}:ids", feedback_key), &feedback_id)
        .await
        .map_err(|e| {
            error!("Error adding feedback ID to list: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("Error updating feedback list"))
        })?;

    info!(
        "Feedback saved successfully for post ID: {}, feedback ID: {}",
        feedback.id, feedback_id
    );

    Ok(Output {
        success: true,
        id: feedback_id,
    })
}
