use crate::cfg::ConfigPortfolio;
use crate::common::html::render_feedback_template;
use crate::redis::models::{ExtraData, Payload};
use crate::security::error::Error;
use crate::security::smtp;
use tracing::info;

pub async fn send_feedback(
    config: &ConfigPortfolio,
    feedback: &Payload,
    extra_data: &ExtraData,
) -> Result<(), Error> {
    let html = render_feedback_template(config, feedback, extra_data)?;
    let subject = format!("Portfolio feedback: {}", feedback.title).replace(['\r', '\n'], " ");

    info!("Sending feedback notification");

    smtp::send_email(
        config.clone(),
        config.email.clone(),
        config.email.clone(),
        subject,
        html,
    )
    .await
}
