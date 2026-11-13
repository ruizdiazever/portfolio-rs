use crate::cfg::ConfigPortfolio;
use crate::security::error::Error;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{
    message::{header, MultiPart, SinglePart},
    Message, SmtpTransport, Transport,
};
use tracing::{error, info};

pub async fn send_email(
    config: ConfigPortfolio,
    to: String,
    reply_to: String,
    subject: String,
    html: String,
) -> Result<(), Error> {
    tokio::task::spawn_blocking(move || {
        send_email_blocking(&config, &to, &reply_to, &subject, &html)
    })
    .await
    .map_err(|error| Error::Anyhow(anyhow::anyhow!("email task failed: {error}")))??;

    Ok(())
}

fn send_email_blocking(
    config: &ConfigPortfolio,
    to: &str,
    reply_to: &str,
    subject: &str,
    html: &str,
) -> Result<(), Error> {
    let payload_from = format!("Portfolio <{}>", config.email);

    let email = Message::builder()
        .from(payload_from.parse()?)
        .reply_to(reply_to.parse()?)
        .to(to.parse()?)
        .subject(subject.to_string())
        .multipart(
            MultiPart::alternative()
                .singlepart(
                    SinglePart::builder()
                        .header(header::ContentType::TEXT_PLAIN)
                        .body(String::from("New feedback from the portfolio.")),
                )
                .singlepart(
                    SinglePart::builder()
                        .header(header::ContentType::TEXT_HTML)
                        .body(html.to_string()),
                ),
        )?;

    let credentials = Credentials::new(config.smtp_username.clone(), config.smtp_password.clone());

    let mailer = SmtpTransport::relay(&config.smtp_host)?
        .port(config.smtp_port)
        .credentials(credentials)
        .build();

    match mailer.send(&email) {
        Ok(_) => {
            info!("Feedback email sent");
            Ok(())
        }
        Err(error) => {
            error!("Could not send feedback email: {error:?}");
            Err(Error::LettreTransError(error))
        }
    }
}
