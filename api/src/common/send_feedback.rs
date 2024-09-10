use crate::security::error::Error;
use crate::security::smtp;
use tracing::info;
use crate::common::html::html_render_template;
use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct Output {
    pub status: bool,
}

pub async fn send_feedback_email(title: &String, reaction: &String, msg: &String) -> Result<Output, Error> {
    let email = "ruizdiaz.oe@gmail.com".to_string();
    let result_sender = email_payload(email, msg, reaction, title).await?;

    Ok(Output{status: result_sender})
}

async fn email_payload(email: String, msg: &String, reaction: &String, title: &String) -> Result<bool, Error> {
    info!("Sending email to {}", &email);

    let template_path = "src/files/html/feedback.html".to_string();
    let html_code = html_render_template(msg, reaction, template_path).await?;

    // Send email with SMTP by Gmail
    let to: &str = &format!(r#"Hei <{}>"#, email);
    let reply_to = "Portfolio WASM <ruizdiaz.oe@gmail.com>".to_string();
    let subject = format!("Portfolio WASM feedback: {}", title);
    smtp::send_email(to.to_string(), reply_to, subject, html_code.clone()).await?;

    Ok(true)
}
