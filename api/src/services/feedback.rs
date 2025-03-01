use crate::common::extra_data::get_extra_data;
use crate::common::ip::{get_client_ip, MetadataSession};
use crate::common::send_feedback::send_feedback;
use crate::redis::feedback::{save_feedback_to_redis, Output};
use crate::redis::models::Payload;
use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use axum::http::HeaderMap;
use axum::{extract::State, routing::post, Json, Router};

async fn post_feedback(
    State(ctx): State<ApiContext>,
    headers: HeaderMap,
    Json(payload): Json<Payload>,
) -> Result<Json<Output>, Error> {
    // METADATA
    let user_agent = headers
        .get("User-Agent")
        .or_else(|| headers.get("user-agent"))
        .and_then(|value| value.to_str().ok())
        .unwrap_or("Unknown Agent")
        .to_string();
    let ip_address = get_client_ip(&headers).await;

    let meta = &MetadataSession {
        user_agent: user_agent.clone(),
        ip_address: ip_address.clone(),
    };

    let extra_data = get_extra_data(meta).await?;
    let result_redis = save_feedback_to_redis(&ctx, payload.clone(), extra_data.clone()).await?;
    let result_sender = send_feedback(&payload, &extra_data).await?;

    Ok(Json(Output {
        success: result_redis.success && result_sender.status,
        id: payload.id,
    }))
}

pub fn feedback_routes() -> Router<ApiContext> {
    Router::new().route("/feedback", post(post_feedback))
}
