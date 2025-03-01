use crate::common::html::render_feedback_template;
use crate::redis::models::{ExtraData, Payload};
use crate::security::error::Error;
use crate::security::smtp;
use serde::{Deserialize, Serialize};
use tracing::info;

#[derive(Serialize, Deserialize)]
pub struct Output {
    pub status: bool,
}

pub async fn send_feedback(feedback: &Payload, extra_data: &ExtraData) -> Result<Output, Error> {
    let result_sender = email_notification(feedback, extra_data).await?;

    Ok(Output {
        status: result_sender,
    })
}

async fn email_notification(feedback: &Payload, extra_data: &ExtraData) -> Result<bool, Error> {
    let email = "ruizdiaz.oe@gmail.com";
    let html_code = render_feedback_template(feedback, extra_data).await?;

    // Send email with SMTP by Gmail
    info!("Sending email to {}", email);

    let to: &str = &format!(r#"Hei <{}>"#, email);
    let reply_to = "Portfolio WASM <ruizdiaz.oe@gmail.com>".to_string();
    let subject = format!("Portfolio feedback: {}", feedback.title);

    smtp::send_email(to.to_string(), reply_to, subject, html_code.clone()).await?;

    Ok(true)
}
