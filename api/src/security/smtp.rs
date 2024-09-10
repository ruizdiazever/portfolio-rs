use crate::security::error::Error;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{
    message::{header, MultiPart, SinglePart},
    Message, SmtpTransport, Transport,
};
use std::env;
use tracing::{error, info};

pub async fn send_email(
    to: String,
    reply_to: String,
    subject: String,
    html: String,
) -> Result<bool, Error> {
    /*
    to: "Hei <ruizdiaz.oe@gmail.com>"
    reply_to: "Portfolio WASM <ruizdiaz.oe@gmail.com>"
    subject: "Happy first email"
    */
    let email_from = env::var("EMAIL").expect("Define EMAIL in your .env");
    let payload_from = format!("Portfolio WASM <{}>", email_from);

    let email = Message::builder()
        .from(payload_from.parse()?)
        .reply_to(reply_to.parse()?)
        .to(to.parse()?)
        .subject(subject)
        .multipart(
            MultiPart::alternative()
                .singlepart(
                    // Every message should have a plain text fallback
                    SinglePart::builder()
                        .header(header::ContentType::TEXT_PLAIN)
                        .body(String::from(
                            "Hello from BERLi System! Some wrong happening",
                        )),
                )
                .singlepart(
                    SinglePart::builder()
                        .header(header::ContentType::TEXT_HTML)
                        .body(String::from(html)),
                ),
        )
        .expect("failed to build email");

    let smtp_username: String =
        env::var("SMTP_USERNAME").expect("Define SMTP_USERNAME in your .env");
    let smtp_password: String =
        env::var("SMTP_PASSWORD").expect("Define SMTP_USERNAME in your .env");

    let creds = Credentials::new(smtp_username.to_owned(), smtp_password.to_owned());

    // Open a remote connection to gmail
    let mailer = SmtpTransport::relay("smtp.gmail.com")?
        .credentials(creds)
        .build();

    // Send the email
    match mailer.send(&email) {
        Ok(_) => info!("Email sent successfully!"),
        Err(e) => error!("Could not send email: {e:?}"),
    }

    Ok(true)
}
