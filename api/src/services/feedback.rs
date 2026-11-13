use crate::common::extra_data::get_extra_data;
use crate::common::ip::{get_client_ip, MetadataSession};
use crate::common::send_feedback::send_feedback;
use crate::redis::feedback::{save_feedback_to_redis, Output};
use crate::redis::models::Payload;
use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use axum::extract::{ConnectInfo, State};
use axum::http::HeaderMap;
use axum::{routing::post, Json, Router};
use std::{net::SocketAddr, time::Duration};

async fn post_feedback(
    State(ctx): State<ApiContext>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(payload): Json<Payload>,
) -> Result<Json<Output>, Error> {
    payload.validate()?;

    let user_agent = headers
        .get("User-Agent")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("Unknown Agent")
        .to_string();
    let ip_address = get_client_ip(&headers, peer.ip());

    if !ctx
        .rate_limiter
        .check(&ip_address, "feedback", 5, Duration::from_secs(60 * 60))
    {
        return Err(Error::TooManyRequests);
    }

    let meta = &MetadataSession {
        user_agent,
        ip_address,
    };

    let extra_data = get_extra_data(&ctx.ctx, &ctx.env.ipinfo_token, meta).await?;
    let result_redis = save_feedback_to_redis(&ctx, payload.clone(), extra_data.clone()).await?;

    if let Err(error) = send_feedback(&ctx.env, &payload, &extra_data).await {
        tracing::error!("Feedback saved but email delivery failed: {error:?}");
    }

    Ok(Json(Output {
        success: result_redis.success,
        id: result_redis.id,
    }))
}

pub fn feedback_routes() -> Router<ApiContext> {
    Router::new().route("/feedback", post(post_feedback))
}
