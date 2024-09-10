use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use redis::AsyncCommands;
use serde::{Deserialize, Serialize};
use tracing::{error, info};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Feedback {
    pub id: String,
    pub title: String,
    pub msg: String,
    pub reaction: u8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Output {
    pub success: bool,
    pub id: String,
}

pub async fn send_feedback(ctx: &ApiContext, feedback: Feedback) -> Result<Output, Error> {
    let reaction_type: &'static str = match feedback.reaction {
        4 => "love",
        3 => "happy",
        2 => "neutral",
        1 => "sad",
        _ => return Err(Error::Forbidden),
    };

    let mut redis_client = ctx.redis_client.get_async_connection().await.map_err(|e| {
        error!("RedisDB error: {:?}", e);
        Error::Anyhow(anyhow::anyhow!("RedisDB error"))
    })?;

    let feedback_key = format!("feedback:{}", feedback.id);
    let feedback_id = Uuid::new_v4().to_string();
    let feedback_data = serde_json::json!({
        "id": feedback_id,
        "feedback": feedback.msg,
        "reaction": reaction_type,
        "timestamp": chrono::Utc::now().to_rfc3339(),
    });

    // Usar HSET para guardar el nuevo feedback como un campo dentro del hash del post
    let _: () = redis_client
        .hset(&feedback_key, &feedback_id, feedback_data.to_string())
        .await
        .map_err(|e| {
            error!("Error saving feedback to Redis: {:?}", e);
            Error::Anyhow(anyhow::anyhow!("Error saving feedback"))
        })?;

    // Opcionalmente, mantener una lista de IDs de feedback para este post
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
