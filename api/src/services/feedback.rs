use crate::redis::feedback::{send_feedback, Feedback, Output};
use crate::common::send_feedback::send_feedback_email;
use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use axum::{extract::State, routing::post, Json, Router};

async fn post_feedback(
    State(ctx): State<ApiContext>,
    Json(payload): Json<Feedback>,
) -> Result<Json<Output>, Error> {
    let data = Feedback {
        id: payload.id,
        title: payload.title,
        msg: payload.msg,
        reaction: payload.reaction,
    };

    let result = send_feedback(&ctx, data.clone()).await?;
    let result_email_sender = send_feedback_email(&data.title, &data.reaction.to_string(), &data.msg).await?;

    Ok(Json(Output {
        success: result.success && result_email_sender.status,
        id: result.id,
    }))
}

pub fn feedback_routes() -> Router<ApiContext> {
    Router::new().route("/feedback", post(post_feedback))
}
